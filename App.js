const { useState, useEffect, useRef } = React;

/**
 * THE MASTER MATH ENGINE
 * Procedural generation for Algebra, Geometry, and Trigonometry.
 */
const MathEngine = {
    generate: (topic, level) => {
        let q, a, draw = null, hint = "";
        // Scalar defines the 'size' of the numbers based on difficulty
        const scalar = level === 'Easy' ? 10 : level === 'Medium' ? 50 : 150;

        switch (topic) {
            case 'Trigo':
                const trigTypes = ['sin', 'cos', 'tan'];
                const type = trigTypes[Math.floor(Math.random() * trigTypes.length)];
                // Using common angles for 'Easy', random for 'Hard'
                const ang = level === 'Easy' ? [30, 45, 60][Math.floor(Math.random() * 3)] : Math.floor(Math.random() * 80) + 1;
                const hyp = (Math.floor(Math.random() * 5) + 1) * 10;
                const rad = ang * (Math.PI / 180);

                if (type === 'sin') {
                    q = `Using sin(${ang}°), find the Opposite side (x) if Hypotenuse = ${hyp}.`;
                    a = Math.round(hyp * Math.sin(rad)).toString();
                    draw = { type: 'tri', hyp, ang, label: 'Opp (x) = ?' };
                    hint = "$\sin(\\theta) = \\frac{\\text{Opp}}{\\text{Hyp}}$";
                } else if (type === 'cos') {
                    q = `Using cos(${ang}°), find the Adjacent side (x) if Hypotenuse = ${hyp}.`;
                    a = Math.round(hyp * Math.cos(rad)).toString();
                    draw = { type: 'tri', hyp, ang, label: 'Adj (x) = ?' };
                    hint = "$\cos(\\theta) = \\frac{\\text{Adj}}{\\text{Hyp}}$";
                } else {
                    const adj = 10;
                    q = `Using tan(${ang}°), find the Opposite side (x) if Adjacent = ${adj}.`;
                    a = Math.round(adj * Math.tan(rad)).toString();
                    draw = { type: 'tri', hyp: '?', ang, label: `Adj: ${adj}` };
                    hint = "$\\tan(\\theta) = \\frac{\\text{Opp}}{\\text{Adj}}$";
                }
                break;

            case 'Algebra':
                const xVal = Math.floor(Math.random() * (scalar / 2)) + 2;
                const coeff = level === 'Easy' ? 1 : Math.floor(Math.random() * 8) + 2;
                const constant = Math.floor(Math.random() * scalar);
                const total = (coeff * xVal) + constant;
                q = level === 'Easy' ? `x + ${constant} = ${total}. Find x.` : `${coeff}x + ${constant} = ${total}. Find x.`;
                a = xVal.toString();
                hint = `Isolate x by subtracting ${constant}.`;
                break;

            case 'Geometry':
                const l = Math.floor(Math.random() * (scalar / 10)) + 5;
                const w = Math.floor(Math.random() * (scalar / 10)) + 3;
                if (level === 'Hard') {
                    q = `A rectangle has Area ${l * w} and Width ${w}. Find its Perimeter.`;
                    a = (2 * (l + w)).toString();
                } else {
                    q = `Find the Area of a rectangle with Length ${l} and Width ${w}.`;
                    a = (l * w).toString();
                }
                draw = { type: 'rect', l, w };
                hint = level === 'Hard' ? "$P = 2L + 2W$" : "$A = L \\times W$";
                break;

            default: // Addition
                const n1 = Math.floor(Math.random() * scalar);
                const n2 = Math.floor(Math.random() * scalar);
                q = `${n1} + ${n2} = ?`;
                a = (n1 + n2).toString();
        }
        return { q, a, draw, hint };
    }
};

// --- MAIN APP ---
function App() {
    const [view, setView] = useState('dashboard');
    const [xp, setXp] = useState(1450);
    const [config, setConfig] = useState({ topic: 'Trigo', level: 'Easy' });
    const [isConfigured, setIsConfigured] = useState(false);

    const rank = xp < 2500 ? "Novice" : xp < 5000 ? "Scholar" : "Grandmaster";

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between fixed h-full z-20 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-indigo-600 mb-10 italic tracking-tighter">FOCUSFLOW AI</h1>
                    <nav className="space-y-3">
                        <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${view === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>📊 Dashboard</button>
                        <button onClick={() => {setView('math'); setIsConfigured(false);}} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${view === 'math' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>🧠 AI Tutor</button>
                        <button onClick={() => setView('timer')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${view === 'timer' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>⏱️ Timer</button>
                    </nav>
                </div>
                <div className="bg-slate-900 p-6 rounded-[32px] text-white shadow-2xl">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest text-center mb-1">{rank}</p>
                    <p className="text-2xl font-black text-center">{xp} XP</p>
                </div>
            </aside>

            {/* Content Rendering */}
            <main className="flex-1 ml-64 p-12">
                {view === 'dashboard' && <DashboardView xp={xp} rank={rank} />}
                {view === 'timer' && <TimerView onComplete={() => setXp(p => p + 100)} />}
                {view === 'math' && (
                    !isConfigured ? (
                        <div className="max-w-2xl mx-auto bg-white p-12 rounded-[48px] shadow-2xl border-4 border-indigo-50 mt-10 animate-in slide-in-from-bottom-4">
                            <h2 className="text-4xl font-black mb-10 italic tracking-tight uppercase">Training Settings</h2>
                            <div className="space-y-10">
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest italic">1. Select Discipline</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {['Addition', 'Algebra', 'Geometry', 'Trigo'].map(t => (
                                            <button key={t} onClick={() => setConfig({...config, topic: t})} className={`p-5 rounded-3xl font-black border-4 transition-all ${config.topic === t ? 'border-indigo-600 bg-indigo-50 text-indigo-600 scale-105' : 'border-slate-100 text-slate-400'}`}>{t}</button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest italic">2. Set Intensity</p>
                                    <div className="grid grid-cols-3 gap-4">
                                        {['Easy', 'Medium', 'Hard'].map(l => (
                                            <button key={l} onClick={() => setConfig({...config, level: l})} className={`p-5 rounded-3xl font-black border-4 transition-all ${config.level === l ? 'border-indigo-600 bg-indigo-50 text-indigo-600 scale-105' : 'border-slate-100 text-slate-400'}`}>{l}</button>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => setIsConfigured(true)} className="w-full bg-indigo-600 text-white py-8 rounded-[36px] font-black text-2xl hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all uppercase tracking-tighter">Initialize Engine</button>
                            </div>
                        </div>
                    ) : (
                        <TutorView config={config} onCorrect={() => setXp(p => p + 50)} onBack={() => setIsConfigured(false)} />
                    )
                )}
            </main>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function TrigCalc() {
    const [val, setVal] = useState(30);
    const r = val * (Math.PI / 180);
    return (
        <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl border-t-8 border-indigo-500">
            <p className="text-[10px] font-black text-indigo-400 uppercase mb-6 tracking-widest text-center italic">Live Trig Solver</p>
            <div className="relative mb-6">
                <input type="number" value={val} onChange={(e) => setVal(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl font-black text-center text-3xl outline-none border-2 border-slate-700 focus:border-indigo-500 transition-all" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">°</span>
            </div>
            <div className="space-y-3 font-bold italic">
                <div className="flex justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                    <span className="text-slate-400">sin</span><span className="text-indigo-300 text-xl font-black">{Math.sin(r).toFixed(3)}</span>
                </div>
                <div className="flex justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                    <span className="text-slate-400">cos</span><span className="text-indigo-300 text-xl font-black">{Math.cos(r).toFixed(3)}</span>
                </div>
                <div className="flex justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                    <span className="text-slate-400">tan</span><span className="text-indigo-300 text-xl font-black">{Math.tan(r).toFixed(3)}</span>
                </div>
            </div>
        </div>
    );
}

function DrawingPad() {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);

    const start = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        setDrawing(true);
    };

    const move = (e) => {
        if (!drawing) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const ctx = canvasRef.current.getContext('2d');
        ctx.strokeStyle = '#4f46e5'; ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };

    return (
        <div className="bg-white p-5 rounded-[40px] shadow-xl border-4 border-slate-100">
            <div className="flex justify-between items-center mb-3 px-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Scratchpad</span>
                <button onClick={() => canvasRef.current.getContext('2d').clearRect(0,0,320,300)} className="text-xs text-rose-500 font-bold hover:underline">Clear</button>
            </div>
            <canvas ref={canvasRef} width="320" height="300" onMouseDown={start} onMouseMove={move} onMouseUp={() => setDrawing(false)} onMouseLeave={() => setDrawing(false)} className="bg-slate-50 rounded-3xl cursor-crosshair touch-none border border-slate-100" />
        </div>
    );
}

function TutorView({ config, onCorrect, onBack }) {
    const [problem, setProblem] = useState(() => MathEngine.generate(config.topic, config.level));
    const [input, setInput] = useState("");
    const [status, setStatus] = useState("idle");

    const checkAnswer = (e) => {
        e.preventDefault();
        if (input.trim() === problem.a) {
            setStatus("correct"); onCorrect();
            setTimeout(() => {
                setProblem(MathEngine.generate(config.topic, config.level));
                setInput(""); setStatus("idle");
            }, 1000);
        } else {
            setStatus("wrong"); setTimeout(() => setStatus("idle"), 800);
        }
    };

    return (
        <div className="max-w-6xl mx-auto flex gap-10 items-start animate-in zoom-in-95">
            <div className="flex-1 bg-white p-12 rounded-[56px] shadow-2xl border-4 border-indigo-50 relative overflow-hidden">
                <button onClick={onBack} className="mb-8 text-slate-400 font-black hover:text-indigo-600 transition flex items-center gap-2 italic tracking-tighter uppercase text-sm">← Abandon Session</button>

                <div className="mb-12">
                    <h3 className="text-5xl font-black text-slate-900 mb-10 tracking-tighter leading-[1.1]">{problem.q}</h3>
                    {problem.draw && (
                        <div className="bg-slate-50 p-12 rounded-[40px] border-2 border-slate-100 flex justify-center shadow-inner">
                            <svg width="240" height="180" viewBox="0 0 240 180">
                                {problem.draw.type === 'rect' ? (
                                    <rect x="50" y="40" width="140" height="100" fill="rgba(79, 70, 229, 0.05)" stroke="#4f46e5" strokeWidth="8" />
                                ) : (
                                    <path d="M60,140 L180,140 L180,40 Z" fill="rgba(79, 70, 229, 0.05)" stroke="#4f46e5" strokeWidth="8" strokeLinejoin="round" />
                                )}
                                <text x="120" y="175" textAnchor="middle" className="font-black fill-indigo-600 italic text-lg">{problem.draw.label || 'x = ?'}</text>
                                <text x="100" y="80" textAnchor="middle" className="font-black fill-slate-400 text-lg" transform="rotate(-35 100,80)">{problem.draw.hyp || problem.draw.l || ''}</text>
                                <text x="80" y="135" className="text-sm font-black fill-slate-400 italic">{problem.draw.ang ? `${problem.draw.ang}°` : ''}</text>
                            </svg>
                        </div>
                    )}
                </div>

                <form onSubmit={checkAnswer} className="space-y-6">
                    <input autoFocus type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type Solution..." className={`w-full p-10 bg-slate-50 border-4 rounded-[40px] text-6xl font-black outline-none transition-all ${status === 'correct' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : status === 'wrong' ? 'border-rose-500 bg-rose-50 animate-pulse' : 'border-slate-100 focus:border-indigo-600 focus:bg-white focus:shadow-2xl'}`} />
                    <button type="submit" className="w-full bg-slate-900 text-white py-10 rounded-[40px] font-black text-3xl shadow-2xl hover:bg-black transition-all uppercase tracking-tighter">Validate Entry</button>
                </form>
                <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-slate-100 italic text-slate-500 font-medium">💡 Hint: {problem.hint}</div>
            </div>

            <div className="w-[380px] space-y-8">
                <DrawingPad />
                <TrigCalc />
            </div>
        </div>
    );
}

function TimerView({ onComplete }) {
    const [t, setT] = useState(1500); const [r, setR] = useState(false);
    useEffect(() => {
        let i = null; if (r && t > 0) i = setInterval(() => setT(p => p - 1), 1000);
        else if (t === 0) { setR(false); onComplete(); alert("Session Finished! +100 XP"); }
        return () => clearInterval(i);
    }, [r, t]);
    return (
        <div className="flex flex-col items-center pt-10 animate-in fade-in">
            <h2 className="text-2xl font-black text-slate-300 uppercase tracking-[0.4em] mb-12 italic">Deep Concentration</h2>
            <div className="text-[14rem] font-black tracking-tighter mb-16 tabular-nums leading-none text-slate-900 drop-shadow-2xl">{Math.floor(t/60)}:{String(t%60).padStart(2,'0')}</div>
            <div className="flex gap-6">
                <button onClick={() => setR(!r)} className={`px-24 py-10 rounded-[48px] font-black text-4xl shadow-2xl transition-all ${r ? 'bg-white text-slate-600 border-4' : 'bg-indigo-600 text-white shadow-indigo-200'}`}>{r ? 'PAUSE' : 'START'}</button>
                <button onClick={() => {setT(1500); setR(false);}} className="p-10 bg-white border-4 rounded-[48px] text-4xl hover:bg-slate-50 transition-all">🔄</button>
            </div>
        </div>
    );
}

function DashboardView({ xp, rank }) {
    return (
        <div className="max-w-4xl animate-in slide-in-from-bottom-4">
            <h2 className="text-6xl font-black mb-12 tracking-tighter italic uppercase text-slate-900">Scholar Profile</h2>
            <div className="grid grid-cols-2 gap-10 mb-10">
                <div className="bg-white p-12 rounded-[48px] border border-slate-200 shadow-xl"><p className="text-slate-400 font-black uppercase text-xs mb-3 tracking-widest">Global Rank</p><p className="text-6xl font-black text-indigo-600 uppercase italic tracking-tighter">{rank}</p></div>
                <div className="bg-white p-12 rounded-[48px] border border-slate-200 shadow-xl"><p className="text-slate-400 font-black uppercase text-xs mb-3 tracking-widest">Total Energy</p><p className="text-6xl font-black text-indigo-600 tracking-tighter">{xp} <span className="text-2xl font-normal text-slate-300">XP</span></p></div>
            </div>
            <div className="bg-white p-12 rounded-[48px] border border-slate-200 shadow-xl">
                <p className="text-slate-400 font-black text-xs uppercase mb-6 tracking-widest">Next Tier Progress</p>
                <div className="h-6 bg-slate-100 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${Math.min((xp % 2500) / 25, 100)}%` }}></div></div>
                <p className="mt-6 text-sm font-bold text-slate-400 italic">Target: 2,500 XP per rank increase</p>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);