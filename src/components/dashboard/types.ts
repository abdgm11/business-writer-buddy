export interface RewriteRow {
  id: string;
  original_text: string;
  context: string;
  tone: string;
  score: number | null;
  word_count: number;
  created_at: string;
}

export const CHART_COLORS = [
  "hsl(var(--gold))",
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--muted-foreground))",
  "#6366f1",
  "#ec4899",
];
