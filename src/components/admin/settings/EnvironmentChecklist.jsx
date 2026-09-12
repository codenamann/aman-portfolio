import { Server, CheckCircle2, XCircle } from "lucide-react";

/**
 * Environment & Credentials Health Check Card Component
 */
export default function EnvironmentChecklist({ envChecklist = [] }) {
  return (
    <div className="p-4 sm:p-6 rounded-xl bg-[#151517] border border-[#262628] shadow-[0_1px_3px_rgba(0,0,0,0.5)] space-y-4">
      <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#a1a1a6] font-mono flex items-center gap-2">
        <Server size={16} className="text-[#e90c47] shrink-0" />
        <span>Environment & Credentials Health Check</span>
      </h3>
      <p className="text-xs text-[#a1a1a6]">
        Status of required environment variables defined in{" "}
        <code className="text-[#f2f2f2] font-mono bg-[#18181a] border border-[#262628] px-1.5 py-0.5 rounded">
          .env.local
        </code>
        .
      </p>

      <div className="divide-y divide-[#262628] pt-2">
        {envChecklist.map((item) => (
          <div
            key={item.name}
            className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-xs font-semibold text-[#f2f2f2]">
                  {item.name}
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#18181a] border border-[#262628] text-[#a1a1a6]">
                  {item.category}
                </span>
              </div>
              <p className="text-[11px] text-[#6f6f76] mt-1 leading-normal break-words font-mono">
                {item.description}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-1.5 text-xs font-medium self-start sm:self-center font-mono">
              {item.status ? (
                <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  <CheckCircle2 size={14} />
                  <span>Configured</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                  <XCircle size={14} />
                  <span>Unset</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
