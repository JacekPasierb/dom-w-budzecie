import styles from "./Icon.module.css";

export type IconName =
  | "home"
  | "list"
  | "rooms"
  | "piggy"
  | "settings"
  | "plus"
  | "search"
  | "check"
  | "arrowLeft"
  | "close"
  | "budget"
  | "spent"
  | "planned"
  | "remaining"
  | "reserve"
  | "safe"
  | "kitchen"
  | "sofa"
  | "door"
  | "bath"
  | "toilet"
  | "stairs"
  | "hallway"
  | "bed"
  | "child"
  | "hanger"
  | "car"
  | "floor"
  | "brush"
  | "bulb"
  | "box"
  | "download"
  | "upload"
  | "reset"
  | "edit"
  | "trash"
  | "undo"
  | "cart"
  | "paid"
  | "spark";

const PATHS: Record<IconName, string> = {
  home: "M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z",
  list: "M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01",
  rooms: "M4 6h7v5H4zM13 6h7v12h-7zM4 13h7v5H4z",
  piggy: "M16 8.5c2.2.6 3.5 2.2 3.5 4.2 0 3-3.1 5.3-7.5 5.3S4.5 15.7 4.5 12.7c0-2.4 1.8-4.4 4.6-5.1M9 8.2c.7-1.6 2-2.7 3.6-2.7 1.2 0 2.2.5 2.9 1.4M7.2 16.8 6 20M17 16.8 18.2 20M18.8 11.2h1.7M10.2 12.2h.01",
  settings: "M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM12 3.5v2.2M12 18.3v2.2M4.8 7.2l1.6 1.6M17.6 15.2l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.8 16.8l1.6-1.6M17.6 8.8l1.6-1.6",
  plus: "M12 5v14M5 12h14",
  search: "M10.8 18.2a7.4 7.4 0 1 1 0-14.8 7.4 7.4 0 0 1 0 14.8zM16.2 16.2 21 21",
  check: "M5 12.5 9.5 17 19 7.5",
  arrowLeft: "M15 5 8 12l7 7M8 12h11",
  close: "M6 6l12 12M18 6 6 18",
  budget: "M4 8h16v11H4zM8 8V6.5A4 4 0 0 1 16 6.5V8M12 12.5v3",
  spent: "M7 12h10M12 7v10M4.8 8.2 3 7M19.2 8.2 21 7M4.8 15.8 3 17M19.2 15.8 21 17",
  planned: "M7 4h10v16H7zM10 8h4M10 12h4M10 16h3",
  remaining: "M12 4v8l5 3M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  reserve: "M8 20V9.5L12 5l4 4.5V20zM8 14h8",
  safe: "M12 4 4.8 7.2v6.4C4.8 17.8 8 20.4 12 21.4c4-1 7.2-3.6 7.2-7.8V7.2zM9.2 12.2 11.2 14.3 15.2 9.8",
  kitchen: "M5 9h14v11H5zM8 9V5.5M16 9V5.5M8 14h3M14 14h2",
  sofa: "M4 13.5V18h16v-4.5M4 13.5A2 2 0 0 1 6 11.5h12a2 2 0 0 1 2 2M8 11.5V9.2A2.2 2.2 0 0 1 10.2 7h3.6A2.2 2.2 0 0 1 16 9.2v2.3",
  door: "M7 21V5.5A1.5 1.5 0 0 1 8.5 4h7A1.5 1.5 0 0 1 17 5.5V21M7 21h10M14.2 12.4h.01",
  bath: "M4 13h16v3.5A3.5 3.5 0 0 1 16.5 20h-9A3.5 3.5 0 0 1 4 16.5zM6 13V8.5A2.5 2.5 0 0 1 8.5 6H11M16 6.2c.8-.8 2-.8 2.6 0",
  toilet: "M8 4h5.5A2.5 2.5 0 0 1 16 6.5V10H8zM8 10c-2.2 0-3.6 1.6-3.6 3.6S6.4 18 9.2 18h5.6c2.8 0 4.8-1.8 4.8-4.4 0-2-1.4-3.6-3.6-3.6M10 20h4",
  stairs: "M4 20h5v-4h5v-4h6M4 20V10M9 16H4M14 12H4",
  hallway: "M4 20V6.5L12 4l8 2.5V20M12 4v16M8 12h.01M16 12h.01",
  bed: "M4 18v-5.5A2.5 2.5 0 0 1 6.5 10H20v8M4 14h16M7 10V8.2A1.7 1.7 0 0 1 8.7 6.5h3.1A1.7 1.7 0 0 1 13.5 8.2V10",
  child: "M12 8.2a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 0 4.2zM6.5 20v-2.2A5.5 5.5 0 0 1 12 12.3a5.5 5.5 0 0 1 5.5 5.5V20",
  hanger: "M12 8.2a2 2 0 1 0-2-2M4.8 16.5 12 10.8l7.2 5.7H4.8z",
  car: "M5 16.5h14l-1.2-5.2A2 2 0 0 0 15.9 10H8.1a2 2 0 0 0-1.9 1.3zM7 16.5v2.2M17 16.5v2.2M8.2 13.2h.01M15.8 13.2h.01",
  floor: "M4 8l8-3 8 3-8 3zM4 12l8 3 8-3M4 16l8 3 8-3",
  brush: "M14.5 4.8 19.2 9.5 10 18.7H5.3V14zM8.2 16.8l-3 3",
  bulb: "M9 14.2c0-2.4-2-3.4-2-6.1a5 5 0 0 1 10 0c0 2.7-2 3.7-2 6.1zM10 17h4M10.8 20h2.4",
  box: "M4 8l8-3 8 3v10l-8 3-8-3zM4 8l8 3 8-3M12 11v10",
  download: "M12 4v11M8 11l4 4 4-4M5 20h14",
  upload: "M12 20V9M8 13l4-4 4 4M5 4h14",
  reset: "M5 12a7 7 0 1 0 2-4.9M5 5v5h5",
  edit: "M5 16.4V19h2.6L18.2 8.4 15.6 5.8 5 16.4zM14.2 7.2l2.6 2.6",
  trash: "M6 8h12M9.2 8V6.4A1.4 1.4 0 0 1 10.6 5h2.8A1.4 1.4 0 0 1 14.8 6.4V8M8 8l.8 11h6.4L16 8",
  undo: "M8 8H4v4M4.4 12A8 8 0 1 0 6 7.2",
  cart: "M5 6h2l1.4 9h9.2L20 8.5H8.2M9 20.2a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM17 20.2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  paid: "M4 8h16v9H4zM4 11h16M8 15h4",
  spark: "M12 3.5 13.4 9 19 10.4 13.4 11.8 12 17.3 10.6 11.8 5 10.4 10.6 9z",
};

type IconProps = {
  name: IconName;
  size?: number;
  title?: string;
  className?: string;
};

export function Icon({ name, size = 20, title, className }: IconProps) {
  return (
    <svg
      className={className ? `${styles.icon} ${className}` : styles.icon}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path d={PATHS[name]} />
    </svg>
  );
}
