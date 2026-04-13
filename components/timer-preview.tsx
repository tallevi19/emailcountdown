"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

interface TimerPreviewProps {
  timerId: string;
  width: number;
  height: number;
}

const GIF_BASE_URL = process.env.NEXT_PUBLIC_GIF_BASE_URL ?? "";

export function TimerPreview({ timerId, width, height }: TimerPreviewProps) {
  const [src, setSrc] = useState("");
  const [copied, setCopied] = useState(false);
  const previewPath = `/api/countdown/${timerId}`;

  const embedBase =
    GIF_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  const gifUrl = `${embedBase}/api/countdown/${timerId}`;
  const embedCode = `<img src="${gifUrl}" width="${width}" height="${height}" border="0" alt="Countdown Timer" style="display:block;max-width:100%;border:0;outline:none;">`;

  useEffect(() => {
    // Load the first frame immediately
    setSrc(`${previewPath}?t=${Date.now()}`);

    // Every 2 s: fetch the next GIF into a hidden Image object.
    // Once fully downloaded (in browser cache), swap the visible src —
    // the browser serves it from cache instantly so there is no blank flash.
    const interval = setInterval(() => {
      const nextSrc = `${previewPath}?t=${Date.now()}`;
      const preloader = new Image();
      preloader.onload = () => setSrc(nextSrc);
      preloader.src = nextSrc;
    }, 2000);

    return () => clearInterval(interval);
  }, [previewPath]);

  function copyCode() {
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true);
      toast.success("Embed code copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="space-y-4">
      {/* Live preview */}
      <div className="rounded-xl border bg-muted/30 p-6 flex items-center justify-center min-h-[120px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src || undefined}
          width={width}
          height={height}
          alt="Timer preview"
          className="block max-w-full"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
      <p className="text-xs text-muted-foreground text-center">
        {width} × {height} px · Live preview
      </p>

      {/* Embed code */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">HTML Embed Code</p>
          <Button
            variant="outline"
            size="sm"
            onClick={copyCode}
            className="gap-2"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied!" : "Copy Code"}
          </Button>
        </div>
        <pre className="bg-muted rounded-lg p-3 text-xs overflow-x-auto whitespace-pre-wrap break-all">
          {embedCode}
        </pre>
      </div>

      {/* Outlook note */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-3">
        <p className="text-xs text-amber-700 dark:text-amber-400">
          <strong>Outlook note:</strong> Outlook 2007–2019 only shows the first
          GIF frame. Design your first frame to be meaningful — the timer is
          fully animated in all other clients (Gmail, Apple Mail, Yahoo, etc.)
        </p>
      </div>
    </div>
  );
}
