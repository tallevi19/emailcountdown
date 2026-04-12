"use client";

import { useState } from "react";
import { Timer } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Link2,
  Copy,
  Archive,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";

interface TimerTableProps {
  timers: Timer[];
  archived?: boolean;
}

const GIF_BASE_URL =
  process.env.NEXT_PUBLIC_GIF_BASE_URL ?? "https://emailcountdown.net";

function getEmbedCode(timerId: string): string {
  const url = `${GIF_BASE_URL}/api/countdown/${timerId}`;
  return `<img src="${url}" width="300" height="80" border="0" alt="Countdown Timer" style="display:block;max-width:100%;border:0;outline:none;">`;
}

export function TimerTable({ timers, archived = false }: TimerTableProps) {
  const router = useRouter();
  const [codeModalTimer, setCodeModalTimer] = useState<Timer | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this timer? This cannot be undone.")) return;
    const res = await fetch(`/api/timers/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Timer deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete timer");
    }
  }

  async function handleArchive(id: string, isArchived: boolean) {
    const res = await fetch(`/api/timers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isArchived: !isArchived }),
    });
    if (res.ok) {
      toast.success(isArchived ? "Timer restored" : "Timer archived");
      router.refresh();
    } else {
      toast.error("Failed to update timer");
    }
  }

  async function handleDuplicate(timer: Timer) {
    const config = timer.config as Record<string, unknown>;
    const res = await fetch("/api/timers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${timer.name} (copy)`,
        timerType: timer.timerType,
        endDate: timer.endDate?.toISOString(),
        timezone: timer.timezone,
        config,
      }),
    });
    if (res.ok) {
      const newTimer = await res.json();
      toast.success("Timer duplicated");
      router.push(`/timers/${newTimer.id}`);
    } else {
      const err = await res.json();
      toast.error(err.error ?? "Failed to duplicate timer");
    }
  }

  function copyEmbedCode(timerId: string) {
    navigator.clipboard.writeText(getEmbedCode(timerId)).then(() => {
      toast.success("Embed code copied to clipboard");
    });
  }

  if (timers.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-sm">
          {archived
            ? "No archived timers."
            : "No timers yet. Create your first one!"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">
                Type
              </th>
              <th className="text-left p-3 font-medium hidden lg:table-cell">
                End Date
              </th>
              <th className="text-right p-3 font-medium">Total Views</th>
              <th className="text-right p-3 font-medium hidden sm:table-cell">
                Cycle Views
              </th>
              <th className="w-10 p-3"></th>
            </tr>
          </thead>
          <tbody>
            {timers.map((timer) => (
              <tr
                key={timer.id}
                className="border-b last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="p-3">
                  <Link
                    href={`/timers/${timer.id}`}
                    className="font-medium hover:underline"
                  >
                    {timer.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    Created{" "}
                    {formatDistanceToNow(timer.createdAt, { addSuffix: true })}
                  </p>
                </td>
                <td className="p-3 hidden md:table-cell">
                  <Badge variant="outline" className="text-xs capitalize">
                    {timer.timerType.toLowerCase()}
                  </Badge>
                </td>
                <td className="p-3 hidden lg:table-cell text-muted-foreground text-xs">
                  {timer.endDate
                    ? format(timer.endDate, "MMM d, yyyy HH:mm")
                    : "—"}
                </td>
                <td className="p-3 text-right font-mono text-xs">
                  {timer.totalViews.toLocaleString()}
                </td>
                <td className="p-3 text-right font-mono text-xs hidden sm:table-cell">
                  {timer.billingCycleViews.toLocaleString()}
                </td>
                <td className="p-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center h-7 w-7 p-0 rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/timers/${timer.id}`)}>
                        <Pencil className="h-3.5 w-3.5 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setCodeModalTimer(timer)}
                      >
                        <Link2 className="h-3.5 w-3.5 mr-2" />
                        Get embed code
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => copyEmbedCode(timer.id)}
                      >
                        <Copy className="h-3.5 w-3.5 mr-2" />
                        Copy URL
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDuplicate(timer)}
                      >
                        <Copy className="h-3.5 w-3.5 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          handleArchive(timer.id, timer.isArchived)
                        }
                      >
                        <Archive className="h-3.5 w-3.5 mr-2" />
                        {timer.isArchived ? "Restore" : "Archive"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(timer.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Embed code modal */}
      <Dialog
        open={!!codeModalTimer}
        onOpenChange={() => setCodeModalTimer(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Embed Code — {codeModalTimer?.name}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Copy and paste this HTML into your email editor:
          </p>
          <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap break-all">
            {codeModalTimer ? getEmbedCode(codeModalTimer.id) : ""}
          </pre>
          <Button
            onClick={() => {
              if (codeModalTimer) copyEmbedCode(codeModalTimer.id);
            }}
          >
            Copy Code
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
