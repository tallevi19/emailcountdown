export type PlanName = "FREE" | "STARTER" | "STANDARD" | "POWER";

export interface PlanLimits {
  maxTimers: number; // -1 = unlimited
  monthlyViews: number;
  watermark: boolean;
  customColors: boolean;
  transparentBg: boolean;
  customFonts: boolean;
  backgroundImage: boolean;
  expirationImage: boolean;
  fallbackImage: boolean;
  allowRecurring: boolean;
  allowDynamic: boolean;
  verticalTimer: boolean;
  padding: boolean;
  labelCustomization: boolean;
  label: string;
  monthlyPriceCents: number;
  annualPriceCents: number; // per month equivalent
}

export const PLAN_LIMITS: Record<PlanName, PlanLimits> = {
  FREE: {
    maxTimers: 1,
    monthlyViews: 10_000,
    watermark: true,
    customColors: false,
    transparentBg: false,
    customFonts: false,
    backgroundImage: false,
    expirationImage: false,
    fallbackImage: false,
    allowRecurring: false,
    allowDynamic: false,
    verticalTimer: false,
    padding: false,
    labelCustomization: false,
    label: "Free",
    monthlyPriceCents: 0,
    annualPriceCents: 0,
  },
  STARTER: {
    maxTimers: 10,
    monthlyViews: 150_000,
    watermark: false,
    customColors: true,
    transparentBg: false,
    customFonts: false,
    backgroundImage: true,
    expirationImage: false,
    fallbackImage: false,
    allowRecurring: false,
    allowDynamic: false,
    verticalTimer: false,
    padding: true,
    labelCustomization: true,
    label: "Starter",
    monthlyPriceCents: 500,
    annualPriceCents: 400,
  },
  STANDARD: {
    maxTimers: 50,
    monthlyViews: 1_000_000,
    watermark: false,
    customColors: true,
    transparentBg: true,
    customFonts: false,
    backgroundImage: true,
    expirationImage: true,
    fallbackImage: false,
    allowRecurring: false,
    allowDynamic: false,
    verticalTimer: true,
    padding: true,
    labelCustomization: true,
    label: "Standard",
    monthlyPriceCents: 1900,
    annualPriceCents: 1600,
  },
  POWER: {
    maxTimers: -1,
    monthlyViews: 5_000_000,
    watermark: false,
    customColors: true,
    transparentBg: true,
    customFonts: false,
    backgroundImage: true,
    expirationImage: true,
    fallbackImage: true,
    allowRecurring: true,
    allowDynamic: true,
    verticalTimer: true,
    padding: true,
    labelCustomization: true,
    label: "Power",
    monthlyPriceCents: 4900,
    annualPriceCents: 4100,
  },
};

export function getPlanLimits(plan: PlanName): PlanLimits {
  return PLAN_LIMITS[plan];
}

export function canCreateTimer(
  plan: PlanName,
  currentActiveTimerCount: number
): boolean {
  const limits = PLAN_LIMITS[plan];
  if (limits.maxTimers === -1) return true;
  return currentActiveTimerCount < limits.maxTimers;
}

export function isOverViewLimit(
  plan: PlanName,
  billingCycleViews: number
): boolean {
  const limits = PLAN_LIMITS[plan];
  return billingCycleViews >= limits.monthlyViews;
}

export function getViewLimitPercentage(
  plan: PlanName,
  billingCycleViews: number
): number {
  const limits = PLAN_LIMITS[plan];
  return Math.min(100, Math.round((billingCycleViews / limits.monthlyViews) * 100));
}

const PLAN_ORDER: PlanName[] = ["FREE", "STARTER", "STANDARD", "POWER"];

export function hasSufficientPlan(
  currentPlan: PlanName,
  requiredPlan: PlanName
): boolean {
  return PLAN_ORDER.indexOf(currentPlan) >= PLAN_ORDER.indexOf(requiredPlan);
}
