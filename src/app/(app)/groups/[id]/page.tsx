"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  BookOpen,
  Tag,
  Trash2,
} from "lucide-react";
import { apiDelete, apiGet } from "@/lib/api-client";
import type { GroupVocabularyResponse, VocabularyEntry } from "@/lib/contracts";

function VocabRow({
  entry,
}: {
  entry: VocabularyEntry;
}) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-surface border border-border hover:border-accent/30 transition-colors">
      <div className="min-w-0">
        <h3 className="font-display text-base font-semibold text-ink truncate">
          {entry.term}
        </h3>
        <p className="text-sm text-ink-secondary mt-0.5 line-clamp-2">
          {entry.definition}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {entry.partOfSpeech && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-border-subtle text-xs font-medium text-ink-secondary">
              {entry.partOfSpeech}
            </span>
          )}
          {entry.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent-subtle text-xs font-medium text-accent"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [data, setData] = useState<GroupVocabularyResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ id }) => {
      apiGet<GroupVocabularyResponse>(`/api/groups/${id}/vocabulary`)
        .then(setData)
        .catch(() => router.replace("/groups"))
        .finally(() => setLoading(false));
    });
  }, [params, router]);

  async function handleDeleteGroup() {
    if (!data) return;
    if (!confirm("Delete this group?")) return;
    try {
      await apiDelete(`/api/groups/${data.group.id}`);
      router.push("/groups");
    } catch {
      alert("Failed to delete group");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-accent" size={24} />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-ink-secondary hover:text-ink transition-colors"
      >
        <ArrowLeft size={16} />
        Back to groups
      </button>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            {data.group.name}
          </h1>
          {data.group.description && (
            <p className="text-ink-secondary mt-1">{data.group.description}</p>
          )}
          <div className="mt-2 flex items-center gap-1.5 text-sm text-ink-secondary">
            <BookOpen size={14} />
            {data.total} word{data.total !== 1 ? "s" : ""}
          </div>
        </div>
        <button
          onClick={handleDeleteGroup}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-error-subtle text-error text-sm font-medium hover:bg-error/10 transition-colors"
        >
          <Trash2 size={14} />
          Delete group
        </button>
      </div>

      {data.items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-ink-secondary">No words in this group yet.</p>
          <button
            onClick={() => router.push("/vocabulary")}
            className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-accent hover:underline"
          >
            Browse vocabulary
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {data.items.map((entry) => (
            <VocabRow key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
