import type { GachaItem, GachaPreset, Rarity } from "../types";

const now = new Date().toISOString();
const baseUrl = import.meta.env.BASE_URL;

function item(
  id: string,
  name: string,
  category: string,
  quantityLabel: string,
  description: string,
  iconFile: string,
  isLimited = quantityLabel !== "無制限",
  rarity: Rarity = "common",
  weight = 10,
): GachaItem {
  return {
    id,
    name,
    category,
    description,
    quantityLabel,
    isLimited,
    rarity,
    weight,
    iconPath: `${baseUrl}minecraft-icons/${iconFile}`,
    enabled: true,
    teacherNote: "",
  };
}

export const defaultPresets: GachaPreset[] = [
  {
    id: "minecraft-build",
    name: "Minecraft 建築用ガチャ",
    description:
      "要塞づくりに使う建材をランダムに引くガチャです。",
    defaultDrawCount: 5,
    allowDuplicates: false,
    showTeamSummary: true,
    useWeights: false,
    createdAt: now,
    updatedAt: now,
    items: [
      item("build-1", "石レンガ", "基本ブロック", "無制限", "かたい壁や要塞づくりに使う", "stone_bricks.png"),
      item("build-2", "木材", "基本ブロック", "無制限", "床、通路、やぐらに使いやすい", "oak_planks.png"),
      item("build-3", "丸石", "基本ブロック", "無制限", "壁や通路づくりに使う", "cobblestone.png"),
      item("build-4", "深層岩レンガ", "基本ブロック", "無制限", "重厚な要塞づくりに使う", "deepslate_bricks.png"),
      item("build-5", "砂岩", "基本ブロック", "無制限", "明るい色の建築に使う", "sandstone.png"),
      item("build-6", "コンクリート", "基本ブロック", "無制限", "見やすい壁や目印に使う", "white_concrete.png"),
      item("build-7", "ガラス", "視界", "無制限", "相手を見ながら守れる窓を作る", "glass.png"),
      item("build-8", "フェンス", "防御", "無制限", "通り道を制限したり、落下を防いだりする", "fence.png"),
      item("build-9", "丸石の壁", "防御", "無制限", "低い防壁や通路の仕切りに使う", "cobblestone_wall.png"),
      item("build-10", "鉄格子", "防御", "64個まで", "見える防御壁として使う", "iron_bars.png"),
      item("build-11", "はしご", "移動", "32個まで", "高い場所への移動や逃げ道に使う", "ladder.png"),
      item("build-12", "足場ブロック", "移動", "32個まで", "高台や一時的な足場に使う", "scaffolding.png"),
      item("build-13", "階段", "移動", "無制限", "登りやすい通路を作る", "stone_brick_stairs.png"),
      item("build-14", "ハーフブロック", "移動", "無制限", "段差や細かい通路づくりに使う", "stone_slab.png"),
      item("build-15", "クモの巣", "妨害", "10個まで", "相手の動きを遅くする", "cobweb.png", true, "rare", 4),
      item("build-16", "葉っぱ", "目隠し", "無制限", "隠れ場所や見えにくい通路を作る", "oak_leaves.png"),
      item("build-17", "トラップドア", "しかけ", "20個まで", "入口やしかけ風の通路に使う", "oak_trapdoor.png", true, "uncommon", 6),
      item("build-18", "水入りバケツ", "特殊", "2か所まで", "落下対策や足止めに使う", "water_bucket.png", true, "special", 2),
    ],
  },
  {
    id: "minecraft-battle",
    name: "Minecraft バトル用ガチャ",
    description:
      "バトルで使う武器・防具・道具をランダムに引くガチャです。",
    defaultDrawCount: 5,
    allowDuplicates: false,
    showTeamSummary: true,
    useWeights: false,
    createdAt: now,
    updatedAt: now,
    items: [
      item("battle-1", "石の剣", "近接攻撃", "1本", "近くで戦う基本武器", "stone_sword.png"),
      item("battle-2", "盾", "防御", "1個", "前に出る人を守る", "shield.png"),
      item("battle-3", "弓＋矢10本", "遠距離攻撃", "1セット", "遠くからけん制する", "bow.png"),
      item("battle-4", "クロスボウ＋矢5本", "遠距離攻撃", "1セット", "強めの遠距離攻撃", "crossbow.png"),
      item("battle-5", "雪玉16個", "妨害", "16個", "相手の動きをじゃまする", "snowball.png"),
      item("battle-6", "釣り竿", "妨害", "1本", "相手との距離を調整する", "fishing_rod.png"),
      item("battle-7", "金のリンゴ", "回復", "1個", "ピンチのときに使う", "golden_apple.png", true, "rare", 4),
      item("battle-8", "回復のポーション", "回復", "2個", "体力を回復する", "healing_potion.png"),
      item("battle-9", "革の防具一式", "防御", "1セット", "前に出る人に向いている", "leather_chestplate.png"),
      item("battle-10", "鉄のヘルメット", "防御", "1個", "防御力を上げる", "iron_helmet.png"),
      item("battle-11", "鉄のブーツ", "防御", "1個", "足元の防具", "iron_boots.png"),
      item("battle-12", "水入りバケツ", "移動・防御", "1個", "落下対策や足止めに使う", "water_bucket.png"),
      item("battle-13", "はしご8個", "移動", "8個", "高い場所へ登る", "ladder.png"),
      item("battle-14", "足場ブロック16個", "移動", "16個", "一時的な足場として使う", "scaffolding.png"),
      item("battle-15", "エンダーパール", "移動", "1個", "一気に移動できる", "ender_pearl.png", true, "special", 2),
      item("battle-16", "俊敏のポーション", "補助", "1個", "移動速度を上げる", "swiftness_potion.png"),
      item("battle-17", "低速落下のポーション", "補助", "1個", "高い場所から安全に降りる", "slow_falling_potion.png"),
    ],
  },
];
