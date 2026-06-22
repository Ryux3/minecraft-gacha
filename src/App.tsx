import { useMemo, useState } from "react";
import { ItemCard } from "./components/ItemCard";
import { defaultPresets } from "./data/defaultPresets";
import type { GachaHistoryEntry, GachaItem } from "./types";

const HISTORY_KEY = "minecraft_gacha_history";
const UNPINNED_HISTORY_LIMIT = 5;
const baseUrl = import.meta.env.BASE_URL;

function pickRandom(items: GachaItem[], count: number, allowDuplicates: boolean) {
  if (!allowDuplicates && items.length < count) {
    throw new Error(`重複なしで${count}個引くには、ガチャ項目が${count}個以上必要です。`);
  }

  const pool = [...items];
  const results: GachaItem[] = [];

  for (let index = 0; index < count; index += 1) {
    const source = allowDuplicates ? items : pool;
    const pickedIndex = Math.floor(Math.random() * source.length);
    const picked = source[pickedIndex];
    results.push(picked);

    if (!allowDuplicates) {
      pool.splice(pickedIndex, 1);
    }
  }

  return results;
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isHistoryEntry);
  } catch {
    return [];
  }
}

function saveHistory(history: GachaHistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function trimHistory(history: GachaHistoryEntry[]) {
  const pinned = history
    .filter((entry) => entry.pinned)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const unpinned = history
    .filter((entry) => !entry.pinned)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, UNPINNED_HISTORY_LIMIT);

  return [...pinned, ...unpinned];
}

function isHistoryEntry(value: unknown): value is GachaHistoryEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<GachaHistoryEntry>;
  return (
    typeof entry.id === "string" &&
    typeof entry.presetId === "string" &&
    typeof entry.presetName === "string" &&
    Array.isArray(entry.items) &&
    typeof entry.createdAt === "string"
  );
}

function createId() {
  return `history-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function App() {
  const [presetId, setPresetId] = useState(defaultPresets[0].id);
  const selectedPreset = useMemo(
    () => defaultPresets.find((preset) => preset.id === presetId) || defaultPresets[0],
    [presetId],
  );
  const [drawCount, setDrawCount] = useState(selectedPreset.defaultDrawCount);
  const [allowDuplicates, setAllowDuplicates] = useState(selectedPreset.allowDuplicates);
  const [results, setResults] = useState<GachaItem[]>([]);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<GachaHistoryEntry[]>(() => trimHistory(loadHistory()));

  const enabledItems = selectedPreset.items.filter((item) => item.enabled);
  const pinnedCount = history.filter((entry) => entry.pinned).length;
  const unpinnedCount = history.length - pinnedCount;

  const updateHistory = (updater: (current: GachaHistoryEntry[]) => GachaHistoryEntry[]) => {
    setHistory((current) => {
      const next = trimHistory(updater(current));
      saveHistory(next);
      return next;
    });
  };

  const changePreset = (id: string) => {
    const next = defaultPresets.find((preset) => preset.id === id) || defaultPresets[0];
    setPresetId(next.id);
    setDrawCount(next.defaultDrawCount);
    setAllowDuplicates(next.allowDuplicates);
    setResults([]);
    setError("");
  };

  const draw = () => {
    try {
      setError("");
      const picked = pickRandom(enabledItems, drawCount, allowDuplicates);
      setResults(picked);
      updateHistory((current) => [
        {
          id: createId(),
          presetId: selectedPreset.id,
          presetName: selectedPreset.name,
          items: picked,
          drawCount,
          allowDuplicates,
          pinned: false,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
    } catch (drawError) {
      setError(drawError instanceof Error ? drawError.message : "ガチャを引けませんでした。");
    }
  };

  const showHistory = (entry: GachaHistoryEntry) => {
    setPresetId(entry.presetId);
    setDrawCount(entry.drawCount);
    setAllowDuplicates(entry.allowDuplicates);
    setResults(entry.items);
    setError("");
  };

  const togglePin = (id: string) => {
    updateHistory((current) =>
      current.map((entry) => (entry.id === id ? { ...entry, pinned: !entry.pinned } : entry)),
    );
  };

  const deleteHistory = (id: string) => {
    updateHistory((current) => current.filter((entry) => entry.id !== id));
  };

  return (
    <main className="gacha-app">
      <header className="simple-header">
        <div className="cube-mark">
          <img
            src={`${baseUrl}minecraft-icons/grass_block_side.png`}
            alt=""
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </div>
        <div>
          <h1>マイクラガチャ</h1>
          <p>マイクラのアイテムをランダムに引くシンプルなガチャです。</p>
        </div>
      </header>

      <section className="gacha-board">
        <aside className="side-column">
          <div className="control-panel">
            <label>
              ガチャの種類
              <select value={selectedPreset.id} onChange={(event) => changePreset(event.target.value)}>
                {defaultPresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </label>

            <p className="preset-description">{selectedPreset.description}</p>

            <label>
              引く数
              <input
                type="number"
                min={1}
                max={30}
                value={drawCount}
                onChange={(event) => {
                  setDrawCount(Number(event.target.value) || 1);
                  setResults([]);
                }}
              />
            </label>

            <label className="check-label">
              <input
                type="checkbox"
                checked={allowDuplicates}
                onChange={(event) => {
                  setAllowDuplicates(event.target.checked);
                  setResults([]);
                }}
              />
              同じアイテムが複数回出てもよい
            </label>

            <div className="item-count">
              登録アイテム <strong>{enabledItems.length}</strong> 種類
            </div>

            {error && <p className="error-message">{error}</p>}

            <button className="draw-main-button" onClick={draw}>
              ガチャを引く
            </button>
          </div>

          <section className="history-panel">
            <div className="history-title-row">
              <h2>履歴</h2>
              <span>
                通常 {unpinnedCount}/{UNPINNED_HISTORY_LIMIT}
                {pinnedCount > 0 ? `・ピン ${pinnedCount}` : ""}
              </span>
            </div>

            {history.length === 0 ? (
              <p className="history-empty">まだ履歴はありません。</p>
            ) : (
              <div className="history-list">
                {history.map((entry) => (
                  <article key={entry.id} className={`history-entry ${entry.pinned ? "pinned" : ""}`}>
                    <button className="history-main" onClick={() => showHistory(entry)}>
                      <strong>{entry.presetName.replace("Minecraft ", "")}</strong>
                      <span>{new Date(entry.createdAt).toLocaleString("ja-JP", {
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}</span>
                      <div className="history-icons" aria-hidden="true">
                        {entry.items.slice(0, 5).map((item, index) => (
                          <img key={`${entry.id}-${item.id}-${index}`} src={item.iconPath} alt="" />
                        ))}
                      </div>
                    </button>
                    <div className="history-actions">
                      <button
                        className={entry.pinned ? "pin-button active" : "pin-button"}
                        onClick={() => togglePin(entry.id)}
                        aria-label={entry.pinned ? "ピン止めを外す" : "ピン止めする"}
                        title={entry.pinned ? "ピン止めを外す" : "ピン止めする"}
                      >
                        {entry.pinned ? "★" : "☆"}
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => deleteHistory(entry.id)}
                        aria-label="履歴を削除"
                        title="履歴を削除"
                      >
                        ×
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </aside>

        <section className="result-panel">
          <div className="result-title-row">
            <h2>結果</h2>
            {results.length > 0 && <button onClick={draw}>もう一度引く</button>}
          </div>

          {results.length === 0 ? (
            <div className="empty-result">
              <img src={`${baseUrl}minecraft-icons/stone_sword.png`} alt="" />
              <p>「ガチャを引く」を押すと、ここにアイテムが表示されます。</p>
            </div>
          ) : (
            <div className="item-grid large">
              {results.map((item, index) => (
                <ItemCard key={`${item.id}-${index}`} item={item} />
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
