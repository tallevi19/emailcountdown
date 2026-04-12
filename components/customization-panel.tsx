"use client";

import { useState, useCallback } from "react";
import { Timer } from "@prisma/client";
import { TimerConfigType, DEFAULT_TIMER_CONFIG } from "@/lib/timer-config";
import { PLAN_LIMITS, PlanName } from "@/lib/plan-limits";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Lock } from "lucide-react";
import { toast } from "sonner";

interface CustomizationPanelProps {
  timer: Timer;
  plan: PlanName;
  onConfigChange: () => void;
}

function PlanLockBadge({ plan }: { plan: PlanName }) {
  return (
    <Badge
      variant="outline"
      className="text-[10px] border-amber-500 text-amber-600 ml-1"
    >
      <Lock className="h-2.5 w-2.5 mr-1" />
      {plan}+
    </Badge>
  );
}

export function CustomizationPanel({
  timer,
  plan,
  onConfigChange,
}: CustomizationPanelProps) {
  const limits = PLAN_LIMITS[plan];
  const rawConfig = (timer.config ?? {}) as Partial<TimerConfigType>;
  const [config, setConfig] = useState<TimerConfigType>({
    ...DEFAULT_TIMER_CONFIG,
    ...rawConfig,
  });
  const [saving, setSaving] = useState(false);

  const updateConfig = useCallback(
    async (patch: Partial<TimerConfigType>) => {
      const updated = { ...config, ...patch };
      setConfig(updated);
      setSaving(true);
      try {
        await fetch(`/api/timers/${timer.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ config: updated }),
        });
        onConfigChange();
      } catch {
        toast.error("Failed to save");
      } finally {
        setSaving(false);
      }
    },
    [config, timer.id, onConfigChange]
  );

  return (
    <div className="space-y-2">
      {saving && (
        <p className="text-xs text-muted-foreground text-right">Saving…</p>
      )}

      {/* Visual Design */}
      <Section title="Visual Design">
        <div className="space-y-4">
          {/* Size */}
          <div className="space-y-1.5">
            <Label>Size</Label>
            <Select
              value={config.size}
              onValueChange={(v) =>
                updateConfig({ size: v as TimerConfigType["size"] })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="XS">X-Small (150 × 40 px)</SelectItem>
                <SelectItem value="S">Small (200 × 55 px)</SelectItem>
                <SelectItem value="M">Medium (300 × 80 px)</SelectItem>
                <SelectItem value="L">Large (400 × 110 px)</SelectItem>
                <SelectItem value="XL">X-Large (600 × 160 px)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Colors */}
          <div className="space-y-3">
            <Label className="text-xs uppercase text-muted-foreground tracking-wide">
              Colors
            </Label>
            <ColorField
              label="Digit color"
              value={config.digitColor}
              onChange={(v) => updateConfig({ digitColor: v })}
            />
            <ColorField
              label="Label color"
              value={config.labelColor}
              onChange={(v) => updateConfig({ labelColor: v })}
            />
            <ColorField
              label="Background color"
              value={config.backgroundColor}
              onChange={(v) => updateConfig({ backgroundColor: v })}
            />
            <ColorField
              label="Accent color"
              value={config.accentColor}
              onChange={(v) => updateConfig({ accentColor: v })}
            />
          </div>

          {/* Transparent background */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Label className="cursor-pointer">Transparent background</Label>
              {!limits.transparentBg && <PlanLockBadge plan="STANDARD" />}
            </div>
            <Switch
              checked={config.transparentBackground}
              onCheckedChange={(v) => updateConfig({ transparentBackground: v })}
              disabled={!limits.transparentBg}
            />
          </div>
        </div>
      </Section>

      {/* Text & Labels */}
      <Section title="Text & Labels">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="cursor-pointer">Hide labels</Label>
            <Switch
              checked={config.hideLabels}
              onCheckedChange={(v) => updateConfig({ hideLabels: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Label className="cursor-pointer">Custom labels</Label>
              {!limits.labelCustomization && <PlanLockBadge plan="STARTER" />}
            </div>
            <Switch
              checked={config.customLabels}
              onCheckedChange={(v) => updateConfig({ customLabels: v })}
              disabled={!limits.labelCustomization}
            />
          </div>

          {config.customLabels && limits.labelCustomization && (
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ["Days", "labelDays"],
                  ["Hours", "labelHours"],
                  ["Minutes", "labelMinutes"],
                  ["Seconds", "labelSeconds"],
                ] as const
              ).map(([label, key]) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs">{label}</Label>
                  <Input
                    className="h-7 text-xs"
                    placeholder={label.toUpperCase()}
                    value={config[key] ?? undefined}
                    onChange={(e) => updateConfig({ [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Display units */}
          <div className="space-y-1.5">
            <Label className="text-xs">Display units</Label>
            <div className="flex flex-wrap gap-1.5">
              {(
                ["days", "hours", "minutes", "seconds"] as const
              ).map((unit) => {
                const active = config.displayUnits.includes(unit);
                return (
                  <button
                    key={unit}
                    onClick={() => {
                      const units = active
                        ? config.displayUnits.filter((u) => u !== unit)
                        : [...config.displayUnits, unit];
                      if (units.length > 0) updateConfig({ displayUnits: units });
                    }}
                    className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-foreground"
                    }`}
                  >
                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font */}
          <div className="space-y-1.5">
            <Label>Font</Label>
            <Select
              value={config.digitFont}
              onValueChange={(v) =>
                v != null && updateConfig({ digitFont: v, labelFont: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DejaVu Sans">DejaVu Sans</SelectItem>
                <SelectItem value="Liberation Sans">Liberation Sans</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      {/* Expiration */}
      <Section title="Expiration">
        <p className="text-xs text-muted-foreground">
          When the timer reaches zero, it shows all zeros by default. Expiration
          images are available on STANDARD+ plans.
        </p>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        className="w-full flex items-center justify-between px-3 py-2 h-auto font-medium text-sm rounded-lg hover:bg-muted text-left"
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-3 pb-4 pt-2">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-7 rounded border cursor-pointer shrink-0"
      />
      <div className="flex-1">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <Input
          className="h-6 text-xs font-mono"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v);
          }}
        />
      </div>
    </div>
  );
}
