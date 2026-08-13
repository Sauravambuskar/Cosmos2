import { X } from "lucide-react";

export interface BulkAction {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  destructive?: boolean;
}

/**
 * Floating action bar shown while rows are selected.
 *
 * Shared by the properties, projects and leads tables so a multi-row edit works
 * the same way everywhere.
 */
export default function AdminBulkBar({
  count, actions, onAction, onClear, busy,
}: {
  count: number;
  actions: BulkAction[];
  onAction: (key: string) => void;
  onClear: () => void;
  busy?: boolean;
}) {
  if (count === 0) return null;

  return (
    <div className="sticky bottom-4 z-30 mx-auto w-fit max-w-full">
      <div className="flex items-center gap-2 bg-gray-900 text-white rounded-xl shadow-2xl px-3 py-2.5 overflow-x-auto">
        <span className="text-sm font-medium whitespace-nowrap pl-1 pr-1">
          {count} selected
        </span>
        <span className="w-px h-5 bg-white/20 flex-shrink-0" />
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.key}
              onClick={() => onAction(a.key)}
              disabled={busy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors disabled:opacity-50 ${
                a.destructive ? "text-red-300 hover:bg-red-500/20" : "text-gray-200 hover:bg-white/10"
              }`}
              data-testid={`button-bulk-${a.key}`}
            >
              <Icon size={13} /> {a.label}
            </button>
          );
        })}
        <button
          onClick={onClear}
          className="p-1.5 text-gray-400 hover:text-white flex-shrink-0"
          aria-label="Clear selection"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
