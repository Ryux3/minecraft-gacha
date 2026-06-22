import type { GachaItem } from "../types";

type Props = {
  item: GachaItem;
  compact?: boolean;
};

export function ItemCard({ item, compact = false }: Props) {
  return (
    <article className={`item-card rarity-${item.rarity} ${compact ? "compact" : ""}`}>
      <div className="item-icon">
        <img src={item.iconPath} alt="" aria-hidden="true" />
      </div>
      <div className="item-card-body">
        <div className="item-card-topline">
          <strong>{item.name}</strong>
          <span>{item.quantityLabel}</span>
        </div>
        <div className="category-pill">{item.category}</div>
        {!compact && <p>{item.description}</p>}
      </div>
    </article>
  );
}
