"use client";
import { useState } from "react";

export default function Home() {
  const [Agency, setAgency] = useState("");
  const [RecordsType, setRecordsType] = useState("");
  const [Purpose, setPurpose] = useState("");
  const [PreviousRequests, setPreviousRequests] = useState("");

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const accentColor = "hsl(200,60%,50%)";

  const handleGenerate = async () => {
    const body = {
        Agency: Agency,
        RecordsType: RecordsType,
        Purpose: Purpose,
        PreviousRequests: PreviousRequests
      };
    if (!Object.values(body).some(v => v?.trim())) return;


    setLoading(true);
    setError("");
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setOutput(data.result || data.error || "No response");
      if (data.error) setError(data.error);
    } catch (e: any) {
      setError("Error: " + e.message);
      setOutput("Error: " + e.message);
    }
    setLoading(false);
  };

  const allFilled = Boolean(Agency.trim() && RecordsType.trim() && Purpose.trim() && PreviousRequests.trim());

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col">
      <header className="border-b border-white/10 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: accentColor }}>AI FOIA Request Strategy Builder</h1>
          <p className="text-gray-400 text-sm mt-0.5">Federal Agency, Records Being Requested, Purpose of Request, Previous FOIA Requests (if any)</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
          DeepSeek-powered
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="p-6 lg:p-8 flex flex-col gap-5 border-r border-white/5">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Input</div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Federal Agency</label>
          <textarea
            id="agency"
            value={Agency}
            onChange={e => setAgency(e.target.value)}
            placeholder="e.g. FBI, DEA, EPA, Department of Defense, Department of Homeland Security"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(200,60%,50%)] resize-none"
            rows={3}
          />
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Records Being Requested</label>
          <textarea
            id="recordstype"
            value={RecordsType}
            onChange={e => setRecordsType(e.target.value)}
            placeholder="e.g. All communications regarding Project Alpha, Personnel files for Jane Doe, Environmental impact reports"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(200,60%,50%)] resize-none"
            rows={3}
          />
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Purpose of Request</label>
          <textarea
            id="purpose"
            value={Purpose}
            onChange={e => setPurpose(e.target.value)}
            placeholder="e.g. Journalism, Academic research, Legal discovery, FOIA litigation"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(200,60%,50%)] resize-none"
            rows={3}
          />
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Previous FOIA Requests (if any)</label>
          <textarea
            id="previousrequests"
            value={PreviousRequests}
            onChange={e => setPreviousRequests(e.target.value)}
            placeholder="e.g. Request #1234 was partially denied; seeking broader scope this time"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(200,60%,50%)] resize-none"
            rows={3}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !allFilled}
            className="rounded-lg py-3 text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95"
            style={{ backgroundColor: accentColor }}
          >
            {loading ? "Analyzing..." : "Generate Analysis"}
          </button>
        </div>

        <div className="p-6 lg:p-8 flex flex-col gap-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Output</div>
          <div className="flex-1 bg-gray-900/60 border border-white/10 rounded-lg p-5 text-sm text-gray-300 whitespace-pre-wrap overflow-auto prose prose-invert prose-sm max-w-none">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                Analyzing your legal question...
              </span>
            ) : output ? (
              output
            ) : (
              <span className="text-gray-600">Response will appear here.</span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
