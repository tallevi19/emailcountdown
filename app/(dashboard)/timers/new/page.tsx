"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { TIMER_TEMPLATES } from "@/lib/timer-templates";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type TimerType = "STANDARD" | "RECURRING" | "PERPETUAL" | "DYNAMIC";

export default function NewTimerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("flash-sale");
  const [timerType, setTimerType] = useState<TimerType>("STANDARD");
  const [endDate, setEndDate] = useState("");
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  async function handleCreate() {
    if (!name.trim()) {
      toast.error("Please enter a timer name");
      return;
    }
    if (timerType === "STANDARD" && !endDate) {
      toast.error("Please select an end date");
      return;
    }

    setLoading(true);
    try {
      const template = TIMER_TEMPLATES.find((t) => t.id === selectedTemplate);
      const config = template?.config ?? {};

      const res = await fetch("/api/timers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          timerType,
          endDate: endDate ? new Date(endDate).toISOString() : undefined,
          timezone,
          config,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error ?? "Failed to create timer");
        return;
      }

      const timer = await res.json();
      toast.success("Timer created!");
      router.push(`/timers/${timer.id}`);
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const selectedTemplateConfig = TIMER_TEMPLATES.find(
    (t) => t.id === selectedTemplate
  )?.config ?? {};
  const bgColor = selectedTemplateConfig.backgroundColor ?? "#1a1a1a";
  const digitColor = selectedTemplateConfig.digitColor ?? "#ffffff";
  const labelColor = selectedTemplateConfig.labelColor ?? "#cccccc";
  const accentColor = selectedTemplateConfig.accentColor ?? "#e63946";
  const units = selectedTemplateConfig.displayUnits ?? ["hours", "minutes", "seconds"];

  return (
    <div className="flex flex-col xl:flex-row gap-8 items-start">
      <div className="flex-1 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create New Timer</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Set up your countdown timer in a few steps.
        </p>
      </div>

      {/* Step 1: Name */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timer Name</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="e.g. Black Friday Sale"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      {/* Step 2: Template */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Choose a Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TIMER_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={cn(
                  "relative p-3 rounded-lg border-2 text-left transition-colors",
                  selectedTemplate === template.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/40"
                )}
              >
                {selectedTemplate === template.id && (
                  <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-primary" />
                )}
                <p className="text-sm font-medium">{template.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Timer Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timer Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={timerType}
            onValueChange={(v) => setTimerType(v as TimerType)}
          >
            <TabsList className="flex-wrap h-auto gap-1">
              <TabsTrigger value="STANDARD">Standard</TabsTrigger>
              <TabsTrigger value="PERPETUAL">Perpetual</TabsTrigger>
              <TabsTrigger value="RECURRING" disabled>
                Recurring
                <Badge
                  variant="outline"
                  className="ml-1.5 text-[10px] border-amber-500 text-amber-600"
                >
                  POWER+
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="DYNAMIC" disabled>
                Dynamic
                <Badge
                  variant="outline"
                  className="ml-1.5 text-[10px] border-amber-500 text-amber-600"
                >
                  POWER+
                </Badge>
              </TabsTrigger>
            </TabsList>
            <p className="text-xs text-muted-foreground mt-3">
              {timerType === "STANDARD" &&
                "Counts down to a fixed end date and time."}
              {timerType === "PERPETUAL" &&
                "Counts down from a set duration from the moment each recipient opens the email."}
              {timerType === "RECURRING" &&
                "Resets automatically on a schedule (e.g. every Monday)."}
              {timerType === "DYNAMIC" &&
                "Personalized per recipient — starts from when each email was sent."}
            </p>
          </Tabs>
        </CardContent>
      </Card>

      {/* Step 4: End Date (for STANDARD) */}
      {timerType === "STANDARD" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">End Date & Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Timezone</Label>
              <Input
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="UTC"
                className="max-w-sm"
              />
              <p className="text-xs text-muted-foreground">
                Detected: {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label>End date & time</Label>
              <Input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="max-w-sm"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {timerType === "PERPETUAL" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Perpetual timers count down from a duration you embed in the URL.
              You&apos;ll configure the duration when setting up the embed code
              (e.g. <code>?duration=86400</code> for 24 hours).
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => router.push("/timers")}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button onClick={handleCreate} disabled={loading}>
          {loading ? "Creating..." : "Create Timer"}
        </Button>
      </div>
      </div>

      {/* Live template preview */}
      <div className="xl:sticky xl:top-6 xl:w-72 shrink-0 space-y-3">
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Preview</p>
      <div
        className="rounded-2xl p-6 flex flex-col items-center justify-center gap-3 min-h-[180px]"
        style={{ backgroundColor: bgColor }}
      >
        <div className="flex items-end gap-3">
          {units.map((unit) => (
            <div key={unit} className="flex flex-col items-center gap-1">
              <div
                className="rounded-lg flex items-center justify-center w-14 h-14 text-2xl font-bold tabular-nums"
                style={{ backgroundColor: accentColor, color: digitColor }}
              >
                {unit === "days" ? "02" : unit === "hours" ? "14" : unit === "minutes" ? "33" : "07"}
              </div>
              <span className="text-[10px] uppercase tracking-widest" style={{ color: labelColor }}>
                {unit}
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Template preview · actual GIF shown after creation
      </p>
      </div>
    </div>
  );
}
