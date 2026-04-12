import { TimerConfigType, DEFAULT_TIMER_CONFIG } from "./timer-config";

export interface TimerTemplate {
  id: string;
  name: string;
  description: string;
  config: Partial<TimerConfigType>;
}

export const TIMER_TEMPLATES: TimerTemplate[] = [
  {
    id: "flash-sale",
    name: "Flash Sale",
    description: "Bold red countdown for limited-time offers",
    config: {
      backgroundColor: "#1a1a1a",
      digitColor: "#ffffff",
      labelColor: "#ff4444",
      accentColor: "#e63946",
      style: "dark",
      size: "M",
      displayUnits: ["hours", "minutes", "seconds"],
    },
  },
  {
    id: "holiday",
    name: "Holiday Countdown",
    description: "Festive green and gold styling",
    config: {
      backgroundColor: "#1a3a1a",
      digitColor: "#ffffff",
      labelColor: "#ffd700",
      accentColor: "#2d6a2d",
      style: "dark",
      size: "M",
      displayUnits: ["days", "hours", "minutes", "seconds"],
    },
  },
  {
    id: "product-launch",
    name: "Product Launch",
    description: "Clean minimal style for product announcements",
    config: {
      backgroundColor: "#0f0f23",
      digitColor: "#ffffff",
      labelColor: "#8888aa",
      accentColor: "#6366f1",
      style: "minimal",
      size: "M",
      displayUnits: ["days", "hours", "minutes", "seconds"],
    },
  },
  {
    id: "webinar",
    name: "Webinar Reminder",
    description: "Professional blue for event registrations",
    config: {
      backgroundColor: "#0d1b2a",
      digitColor: "#ffffff",
      labelColor: "#90afc5",
      accentColor: "#2563eb",
      style: "dark",
      size: "M",
      displayUnits: ["days", "hours", "minutes", "seconds"],
    },
  },
  {
    id: "event",
    name: "Live Event",
    description: "Large, high-contrast countdown for big events",
    config: {
      backgroundColor: "#ffffff",
      digitColor: "#111111",
      labelColor: "#555555",
      accentColor: "#f59e0b",
      style: "light",
      size: "L",
      displayUnits: ["days", "hours", "minutes", "seconds"],
    },
  },
  {
    id: "custom",
    name: "Custom",
    description: "Start from scratch with full customization",
    config: DEFAULT_TIMER_CONFIG,
  },
];
