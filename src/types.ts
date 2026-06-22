export type Rarity = "common" | "uncommon" | "rare" | "special";

export type GachaPreset = {
  id: string;
  name: string;
  description: string;
  defaultDrawCount: number;
  allowDuplicates: boolean;
  showTeamSummary: boolean;
  useWeights: boolean;
  items: GachaItem[];
  createdAt: string;
  updatedAt: string;
};

export type GachaItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  quantityLabel: string;
  isLimited: boolean;
  rarity: Rarity;
  weight: number;
  iconPath: string;
  enabled: boolean;
  teacherNote: string;
};

export type GachaHistoryEntry = {
  id: string;
  presetId: string;
  presetName: string;
  items: GachaItem[];
  drawCount: number;
  allowDuplicates: boolean;
  pinned: boolean;
  createdAt: string;
};
