import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CorrectionItemProps {
  original: string;
  improved: string;
  reason: string;
}

export const CorrectionItem = ({ original, improved, reason }: CorrectionItemProps) => {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left rounded-lg bg-muted p-3 transition-colors hover:bg-muted/80"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm">
          <span className="line-through text-destructive/70">{original}</span>
          {" → "}
          <span className="font-medium text-success">{improved}</span>
        </p>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 mt-0.5 ${open ? "rotate-180" : ""}`}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-xs text-muted-foreground italic mt-2 pt-2 border-t border-border">
              💡 {reason}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};
