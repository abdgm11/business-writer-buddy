import { RewriteRow } from "./types";

interface RecentHistoryProps {
  rewrites: RewriteRow[];
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return "Today";
  if (diffHours < 48) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const RecentHistory = ({ rewrites }: RecentHistoryProps) => (
  <div className="rounded-xl border bg-card shadow-elegant">
    <div className="border-b p-5">
      <h2 className="text-lg font-semibold text-foreground font-sans">Recent Writing History</h2>
    </div>
    {rewrites.length === 0 ? (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No rewrites yet. Head to the Coach page to get started!</p>
      </div>
    ) : (
      <div className="divide-y">
        {rewrites.map((h) => (
          <div key={h.id} className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <p className="text-xs text-muted-foreground">{formatDate(h.created_at)}</p>
              </div>
              <div>
                <div className="flex gap-1.5 mb-1">
                  <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {h.context}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground capitalize">
                    {h.tone}
                  </span>
                </div>
                <p className="text-sm text-foreground">{h.original_text.substring(0, 80)}...</p>
              </div>
            </div>
            {h.score && (
              <div className="text-right">
                <p className="text-lg font-semibold text-foreground">{h.score}</p>
                <p className="text-xs text-muted-foreground">score</p>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default RecentHistory;
