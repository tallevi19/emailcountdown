import { createCanvas, registerFont } from "canvas";
import GIFEncoder from "gif-encoder-2";
import path from "path";
import { TimerConfigType, SIZE_PRESETS, SizePreset } from "./timer-config";

// ─── Font registration ────────────────────────────────────────────────────────
let fontsRegistered = false;

function ensureFontsRegistered() {
  if (fontsRegistered) return;
  const fontDir = path.join(process.cwd(), "public", "fonts");
  const fonts = [
    { file: "DejaVuSans-Regular.ttf", family: "DejaVu Sans", weight: "400" },
    { file: "DejaVuSans-Bold.ttf", family: "DejaVu Sans", weight: "700" },
    {
      file: "LiberationSans-Regular.ttf",
      family: "Liberation Sans",
      weight: "400",
    },
    {
      file: "LiberationSans-Bold.ttf",
      family: "Liberation Sans",
      weight: "700",
    },
  ];
  for (const font of fonts) {
    try {
      registerFont(path.join(fontDir, font.file), {
        family: font.family,
        weight: font.weight,
      });
    } catch (e) {
      console.warn(`Font registration failed for ${font.file}:`, e);
    }
  }
  fontsRegistered = true;
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface TimeComponents {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getTimeComponents(secondsRemaining: number): TimeComponents {
  const total = Math.max(0, Math.floor(secondsRemaining));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

/** Shift each RGB channel by `amount` (positive = lighter, negative = darker). */
function shiftColor(
  [r, g, b]: [number, number, number],
  amount: number
): string {
  const c = (v: number) => Math.max(0, Math.min(255, v + amount));
  return `rgb(${c(r)},${c(g)},${c(b)})`;
}

// ─── Frame drawing ────────────────────────────────────────────────────────────
function drawFrame(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx: any,
  width: number,
  height: number,
  time: TimeComponents,
  config: TimerConfigType
) {
  const {
    backgroundColor,
    digitColor,
    labelColor,
    accentColor,
    hideLabels,
    displayUnits,
    watermark,
    customLabels,
    labelDays,
    labelHours,
    labelMinutes,
    labelSeconds,
    transparentBackground,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  } = config;

  const pt = paddingTop ?? 0;
  const pr = paddingRight ?? 0;
  const pb = paddingBottom ?? 0;
  const pl = paddingLeft ?? 0;

  // Background
  if (!transparentBackground) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.clearRect(0, 0, width, height);
  }

  // Segments to display
  const unitMap: Record<string, { value: number; defaultLabel: string; customLabel?: string }> = {
    days: { value: time.days, defaultLabel: "DAYS", customLabel: labelDays },
    hours: { value: time.hours, defaultLabel: "HRS", customLabel: labelHours },
    minutes: { value: time.minutes, defaultLabel: "MIN", customLabel: labelMinutes },
    seconds: { value: time.seconds, defaultLabel: "SEC", customLabel: labelSeconds },
  };

  const units = displayUnits.filter((u) => u in unitMap);
  if (units.length === 0) return;

  const innerWidth = width - pl - pr;
  const innerHeight = height - pt - pb;
  const segCount = units.length;
  const segWidth = innerWidth / segCount;

  // Font sizes proportional to segment size
  const digitFontSize = Math.max(8, Math.floor(innerHeight * 0.52));
  const labelFontSize = Math.max(6, Math.floor(innerHeight * 0.18));
  const separatorFontSize = Math.floor(digitFontSize * 0.8);

  const fontFamily = '"DejaVu Sans"';
  const digitY = hideLabels
    ? pt + innerHeight / 2
    : pt + innerHeight * 0.42;
  const labelY = pt + innerHeight * 0.82;

  units.forEach((unit, i) => {
    const { value, defaultLabel, customLabel } = unitMap[unit];
    const segX = pl + i * segWidth;
    const centerX = segX + segWidth / 2;

    // Digit card — solid block slightly lighter/darker than the background
    // so it reads as a raised "flip-card" without a semi-transparent tint.
    const bgRgb = hexToRgb(backgroundColor);
    const bgLuminance = (0.299 * bgRgb[0] + 0.587 * bgRgb[1] + 0.114 * bgRgb[2]) / 255;
    const cardShift = bgLuminance < 0.5 ? 28 : -22; // lighter on dark, darker on light
    const blockPad = Math.max(2, Math.floor(segWidth * 0.06));
    const blockX = segX + blockPad;
    const blockW = segWidth - blockPad * 2;
    const blockY = pt + Math.floor(innerHeight * 0.05);
    const blockH = Math.floor(innerHeight * (hideLabels ? 0.9 : 0.65));
    ctx.fillStyle = shiftColor(bgRgb, cardShift);
    ctx.beginPath();
    ctx.roundRect(blockX, blockY, blockW, blockH, 4);
    ctx.fill();

    // Digit
    ctx.fillStyle = digitColor;
    ctx.font = `bold ${digitFontSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(value).padStart(2, "0"), centerX, digitY);

    // Separator colon (not after last segment)
    if (i < segCount - 1) {
      ctx.fillStyle = digitColor;
      ctx.globalAlpha = 0.6;
      ctx.font = `bold ${separatorFontSize}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(":", segX + segWidth, digitY);
      ctx.globalAlpha = 1;
    }

    // Label
    if (!hideLabels) {
      const labelText = customLabels && customLabel ? customLabel : defaultLabel;
      ctx.fillStyle = labelColor;
      ctx.font = `${labelFontSize}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(labelText, centerX, labelY);
    }
  });

  // Watermark
  if (watermark) {
    const wmFontSize = Math.max(7, Math.floor(height * 0.1));
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(0, height - wmFontSize * 1.8, width, wmFontSize * 1.8);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = `${wmFontSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("emailcountdown.net", width / 2, height - wmFontSize * 0.9);
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────
export async function generateCountdownGif(
  secondsRemaining: number,
  config: TimerConfigType
): Promise<Buffer> {
  ensureFontsRegistered();

  const sizeKey = (config.size ?? "M") as SizePreset;
  const { width, height } = SIZE_PRESETS[sizeKey] ?? SIZE_PRESETS.M;

  const total = Math.max(0, Math.floor(secondsRemaining));

  // Always animate 1 frame per second for the next 60 seconds (or until zero).
  // This gives smooth digit transitions regardless of total duration.
  // Email clients re-fetch on each open so the minutes/hours stay accurate.
  const frameCount = total === 0 ? 1 : Math.min(total, 60);
  const frames: number[] = [];
  for (let i = 0; i < frameCount; i++) {
    frames.push(total - i);
  }

  const encoder = new GIFEncoder(width, height, "neuquant", true);
  encoder.setDelay(1000); // 1 frame per second
  encoder.setRepeat(0);   // loop forever
  encoder.setQuality(10);
  encoder.start();

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  for (const secs of frames) {
    const time = getTimeComponents(secs);
    drawFrame(ctx, width, height, time, config);
    encoder.addFrame(ctx as unknown as CanvasRenderingContext2D);
  }

  encoder.finish();

  const buffer = encoder.out.getData();
  return Buffer.from(buffer);
}

export async function generateLimitExceededGif(
  config: TimerConfigType
): Promise<Buffer> {
  ensureFontsRegistered();

  const sizeKey = (config.size ?? "M") as SizePreset;
  const { width, height } = SIZE_PRESETS[sizeKey] ?? SIZE_PRESETS.M;

  const encoder = new GIFEncoder(width, height);
  encoder.setDelay(1000);
  encoder.setRepeat(0);
  encoder.start();

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Draw a simple "00:00:00" frame
  ctx.fillStyle = config.backgroundColor ?? "#1a1a1a";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = config.digitColor ?? "#ffffff";
  ctx.font = `bold ${Math.floor(height * 0.45)}px "DejaVu Sans"`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("00:00:00", width / 2, height / 2);

  encoder.addFrame(ctx as unknown as CanvasRenderingContext2D);
  encoder.finish();

  return Buffer.from(encoder.out.getData());
}
