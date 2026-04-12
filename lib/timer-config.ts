import { z } from "zod";

export const SIZE_PRESETS = {
  XS: { width: 150, height: 40 },
  S: { width: 200, height: 55 },
  M: { width: 300, height: 80 },
  L: { width: 400, height: 110 },
  XL: { width: 600, height: 160 },
} as const;

export type SizePreset = keyof typeof SIZE_PRESETS;

export const timerConfigSchema = z.object({
  // Layout
  size: z.enum(["XS", "S", "M", "L", "XL"]).default("M"),
  vertical: z.boolean().default(false),

  // Colors
  digitColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .default("#ffffff"),
  labelColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .default("#cccccc"),
  backgroundColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .default("#1a1a1a"),
  accentColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .default("#e63946"),
  transparentBackground: z.boolean().default(false),

  // Padding (px) — STARTER+ only
  paddingTop: z.number().min(0).max(50).default(8),
  paddingRight: z.number().min(0).max(50).default(15),
  paddingBottom: z.number().min(0).max(50).default(8),
  paddingLeft: z.number().min(0).max(50).default(15),

  // Display
  displayUnits: z
    .array(z.enum(["days", "hours", "minutes", "seconds"]))
    .default(["hours", "minutes", "seconds"]),
  hideLabels: z.boolean().default(false),
  customLabels: z.boolean().default(false),
  labelDays: z.string().max(20).optional(),
  labelHours: z.string().max(20).optional(),
  labelMinutes: z.string().max(20).optional(),
  labelSeconds: z.string().max(20).optional(),

  // Style
  style: z.enum(["dark", "light", "minimal", "retro", "neon"]).default("dark"),
  digitFont: z.string().default("Roboto"),
  labelFont: z.string().default("Roboto"),
  labelFontSize: z.enum(["small", "default", "large"]).default("default"),

  // Plan features
  watermark: z.boolean().default(true),
  backgroundImageUrl: z.string().url().optional(),
  expirationImageUrl: z.string().url().optional(),
  fallbackImageUrl: z.string().url().optional(),

  // Apple Mail handling
  appleMailHandling: z.enum(["show", "hide", "fallback"]).default("show"),
});

export type TimerConfigType = z.infer<typeof timerConfigSchema>;

export const DEFAULT_TIMER_CONFIG: TimerConfigType = timerConfigSchema.parse({});
