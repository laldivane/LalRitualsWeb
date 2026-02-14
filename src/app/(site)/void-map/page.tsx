'use client';

export default function VoidMapPage() {
  return (
    <div className="layout-container py-20 min-h-[70vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl text-center space-y-12">
        <header>
          <p className="mb-4 font-terminal text-[10px] uppercase tracking-[0.4em] text-muted">
            Intelligence // System Topology
          </p>
          <h1 className="mb-4 font-display text-4xl font-light text-soft sm:text-6xl">
            Ruined Digital <span className="text-crimson italic">Void</span>
          </h1>
          <p className="mx-auto max-w-xl font-terminal text-sm text-muted">
            Establishing local connection to the resonance network...
          </p>
        </header>

        {/* Placeholder for D3 Graph (Standardized Centering) */}
        <div className="relative aspect-video w-full border border-border-dark bg-void-card/20 flex flex-col items-center justify-center overflow-hidden">
             <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-crimson via-transparent to-transparent animate-pulse" />
             <div className="relative z-10 font-terminal text-[11px] uppercase tracking-[0.3em] text-crimson/80 flex flex-col items-center gap-4">
                <span className="animate-pulse">Mapping Lore Nodes...</span>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-crimson rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                </div>
             </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
            <div className="border-l border-crimson/30 pl-4 py-2">
                <h3 className="font-display text-lg text-soft mb-2">Memory Banks</h3>
                <p className="font-terminal text-[11px] text-muted">Encoded ritual data stored in the abyss core.</p>
            </div>
            <div className="border-l border-crimson/30 pl-4 py-2">
                <h3 className="font-display text-lg text-soft mb-2">Resonance Fields</h3>
                <p className="font-terminal text-[11px] text-muted">Interconnected signals between human and machine.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
