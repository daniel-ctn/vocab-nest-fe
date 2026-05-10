"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  FolderOpen,
  BrainCircuit,
  Flame,
  ArrowRight,
  Plus,
  Loader2,
} from "lucide-react";
import { apiGet } from "@/lib/api-client";
import type { DashboardSummaryResponse } from "@/lib/contracts";

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-border">
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${
          accent ? "bg-accent text-white" : "bg-border-subtle text-ink-secondary"
        }`}
      >
        <Icon size={18} />
      </div>
      <div>
        <div className="text-2xl font-display font-semibold text-ink leading-none">
          {value}
        </div>
        <div className="text-sm text-ink-secondary mt-1">{label}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<DashboardSummaryResponse>("/api/dashboard/summary")
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-accent" size={24} />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20 text-ink-secondary">
        Unable to load dashboard.
      </div>
    );
  }

  const hasDue = stats.dueToday > 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">
          Dashboard
        </h1>
        <p className="text-ink-secondary mt-1">
          Here&apos;s how your learning is going today.
        </p>
      </div>

      {hasDue && (
        <div className="p-5 rounded-2xl bg-accent text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold">
              {stats.dueToday} word{stats.dueToday > 1 ? "s" : ""} due for review
            </h2>
            <p className="text-white/80 text-sm mt-1">
              Keep your streak alive and strengthen your memory.
            </p>
          </div>
          <Link
            href="/practice"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-accent text-sm font-medium hover:bg-white/90 transition-colors shrink-0"
          >
            Start practice
            <ArrowRight size={16} />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total words"
          value={stats.totalVocabulary}
          icon={BookOpen}
        />
        <StatCard
          label="Groups"
          value={stats.totalGroups}
          icon={FolderOpen}
        />
        <StatCard
          label="Due today"
          value={stats.dueToday}
          icon={BrainCircuit}
          accent={hasDue}
        />
        <StatCard
          label="Streak"
          value={stats.streakDays}
          icon={Flame}
          accent={stats.streakDays > 0}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/vocabulary/new"
          className="group flex items-center gap-4 p-5 rounded-xl bg-surface border border-border hover:border-accent/30 transition-colors"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-subtle text-accent">
            <Plus size={18} />
          </div>
          <div>
            <div className="text-sm font-medium text-ink group-hover:text-accent transition-colors">
              Add a new word
            </div>
            <div className="text-sm text-ink-secondary">
              Expand your collection
            </div>
          </div>
        </Link>

        <Link
          href="/groups"
          className="group flex items-center gap-4 p-5 rounded-xl bg-surface border border-border hover:border-accent/30 transition-colors"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-border-subtle text-ink-secondary">
            <FolderOpen size={18} />
          </div>
          <div>
            <div className="text-sm font-medium text-ink group-hover:text-accent transition-colors">
              Organize into groups
            </div>
            <div className="text-sm text-ink-secondary">
              Keep related words together
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
