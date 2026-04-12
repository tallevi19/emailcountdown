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

    // Accent block background
    const blockPad = Math.max(2, Math.floor(segWidth * 0.06));
    const blockX = segX + blockPad;
    const blockW = segWidth - blockPad * 2;
    const blockY = pt + Math.floor(innerHeight * 0.05);
    const blockH = Math.floor(innerHeight * (hideLabels ? 0.9 : 0.65));
    const accentRgb = hexToRgb(accentColor);
    ctx.fillStyle = `rgba(${accentRgb[0]},${accentRgb[1]},${accentRgb[2]},0.15)`;
    ctx.beginPath();
    ctx.roundRect(blockX, blockY, blockW, blockH, 3);
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

  // Determine frames (seconds values, counting down)
  const frames: number[] = [];
  const total = Math.max(0, Math.floor(secondsRemaining));

  if (total <= 0) {
    frames.push(0);
  } else if (total <= 60) {
    for (let s = total; s >= 0; s--) {
      frames.push(s);
    }
  } else {
    const frameCount = 10;
    for (let i = 0; i < frameCount; i++) {
      frames.push(Math.floor(total * (1 - i / (frameCount - 1))));
    }
    frames.push(0);
  }

  const encoder = new GIFEncoder(width, height, "neuquant", true);
  encoder.setDelay(1000);
  encoder.setRepeat(0); // loop forever
  encoder.setQuality(10);
  encoder.start();

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  for (let i = 0; i < frames.length; i++) {
    const secs = frames[i];
    // For > 60s, set delay proportional to interval between frames
    if (total > 60 && frames.length > 1) {
      const interval = Math.floor((total / (frames.length - 2)) * 1000);
      encoder.setDelay(Math.min(interval, 60000));
    }

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
