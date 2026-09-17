import type { IconName } from "@/components/Icon/Icon";

export const ROOM_ICONS: Record<string, IconName> = {
  kuchnia: "kitchen",
  salon: "sofa",
  wiatrolap: "door",
  "wc-dol": "toilet",
  "lazienka-gora": "bath",
  schody: "stairs",
  korytarz: "hallway",
  sypialnia: "bed",
  "pokoj-chlopca-1": "child",
  "pokoj-chlopca-2": "child",
  garderoba: "hanger",
  garaz: "car",
  podlogi: "floor",
  malowanie: "brush",
  elektryka: "bulb",
  inne: "box",
};

export const ROOM_TONES: Record<string, "clay" | "moss" | "brass" | "ink"> = {
  kuchnia: "clay",
  salon: "moss",
  wiatrolap: "ink",
  "wc-dol": "brass",
  "lazienka-gora": "brass",
  schody: "ink",
  korytarz: "moss",
  sypialnia: "clay",
  "pokoj-chlopca-1": "brass",
  "pokoj-chlopca-2": "moss",
  garderoba: "ink",
  garaz: "ink",
  podlogi: "clay",
  malowanie: "moss",
  elektryka: "brass",
  inne: "ink",
};
