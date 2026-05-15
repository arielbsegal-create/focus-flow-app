const { useState, useEffect, useRef } = React;

/**
 * PROCEDURAL MATH ENGINE v3.0
 * Handles logic for all topics across 3 difficulty tiers.
 */
const MathEngine = {
    generate: (topic, level) => {
        let q, a, draw = null, hint = "";
        const scalar = level === 'Easy' ? 10 : level === 'Medium' ? 50 : 200;

        switch (topic) {
            case 'Trigo':
                const funcs = ['sin', 'cos', 'tan'];
                const fn = funcs[Math.floor(Math.random() * funcs.length)];
                // Easy uses standard angles; Hard uses any integer angle
                const ang = level === 'Easy' ? [30, 45, 60][Math.floor(Math.random() * 3)] : Math.floor(Math.random() * 70) + 10;
                const hyp = (Math.floor(Math.random() * 5) + 1) * 10;
                const rad = ang * (Math.PI / 180);

                if (fn === 'sin') {
                    q = `Using sin(${ang}°), find the Opposite side (x) if Hypotenuse = ${hyp}. (Round to nearest whole number)`;
                    a = Math.round(hyp * Math.sin(rad)).toString();
                    draw = { type: 'tri', hyp, ang, label: 'Opp (x) = ?' };
                } else if (fn === 'cos') {
                    q = `Using cos(${ang}°), find the Adjacent side (x) if Hypotenuse = ${hyp}. (Round to nearest whole number)`;
                    a = Math.round(hyp * Math.cos(rad)).toString();
                    draw = { type: 'tri', hyp, ang, label: 'Adj (x) = ?' };
                } else {
                    const adj = 10;
                    q = `Using tan(${ang}°), find the Opposite side (x) if Adjacent = ${adj}. (Round to nearest whole number)`;
                    a = Math.round(adj * Math.tan(rad)).toString();
                    draw = { type: 'tri', hyp: '?', ang, label: `Adj: ${adj}` };
                }
                break;

            case 'Algebra':
                const x = Math.floor(Math.random() * (scalar / 2)) + 2;
                const c = level === 'Easy' ? 1 : Math.floor(Math.random() * 10) + 2;
                const b = Math.floor(Math.random() * scalar);
                const total = (c * x) + b;
                q = level === 'Easy' ? `x + ${b} = ${total}. Find x.` : `${c}x + ${b} = ${total}. Find x.`;
                a = x.toString();
                break;

            case 'Geometry':
                const l = Math.floor(Math.random() * (scalar / 5)) + 5;
                const w = Math.floor(Math.random() * (scalar / 5)) + 3;
                if (level === 'Hard') {
                    q = `Rectangle: Area = ${l * w}, Width = ${w}. Find the Perimeter.`;
                    a = (2 * (l + w)).toString();
                } else {
                    q = `Find the Area of a rectangle with Length ${l} and Width ${w}.`;
                    a = (l * w).toString();
                }
                draw = { type: 'rect', l, w };
                break;

            default: // Addition
                const n1 = Math.floor(Math.random() * scalar);
                const n2 = Math.floor(Math.random() * scalar);
                q = `${n1} + ${n2} = ?`;
                a = (n1 + n2).toString();
        }
        return { q, a, draw };
    }
};

// --- COMPONENTS ---

function TrigTool() {
    const [deg, setDeg] = useState(30);
    const r = deg * (Math.PI / 180);
    return (
        <div className="bg-slate-900 p-6 rounded-[32px] text-white shadow-2xl border-t-4 border-indigo-500">
            <p className="text-[10px] font-black text-indigo-400 uppercase mb-4 tracking-tighter text-center">Trig Calculator</p>
            <div className="flex items-center gap-2 mb-4 bg-slate-800 p-2 rounded-xl">
                <input type="number" value={deg} onChange={(e) => setDeg(e.target.value)} className="w-full bg-transparent text-center text-2xl font-black outline-none" />
                <span className="text-slate-500 font-bold pr-2">°</span>
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs font-bold italic">
                <div className="flex justify-between p-2 bg-white/5 rounded-lg"><span>sin</span><span className="text-indigo-400">{Math.sin(r).toFixed(3)}</span></div>
                <div className="flex justify-between p-2 bg-white/5 rounded-lg"><span>cos</span><span className="text-indigo-300">{Math.cos(r).toFixed(3)}</span></div>
                <div className="flex justify-between p-2 bg-white/5 rounded-lg"><span>tan</span><span className="text-indigo-200">{Math.tan(r).toFixed(3)}</span></div>
            </div>
        </div>
    );
}

function Scratchpad() {
    const canvasRef = useRef(null);
    const [active, setActive] = useState(false);
    const getPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const start = (e) => {
        const {x, y} = getPos(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath(); ctx.moveTo(x, y); setActive(true);
    };
    const draw = (e) => {
        if (!active) return;
        const {x, y} = getPos(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 3; ctx.lineCap = 'round';
        ctx.lineTo(x, y); ctx.stroke();
    };
    return (
        <div className="bg-white p-4 rounded-[32px] shadow-lg border border-slate-100">
            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-2 px-2">
                <span>Scratchpad</span>
                <button onClick={() => canvasRef.current.getContext('2d').clearRect(0,0,400,400)} className="text-rose-500">Clear</button>
            </div>
            <canvas ref={canvasRef} width="300" height="250" onMouseDown={start} onMouseMove={draw} onMouseUp={() => setActive(false)} className="bg-slate-50 rounded-2xl cursor-crosshair touch-none" />
        </div>
    );
}

function App() {
    const [view, setView] = useState('dashboard');
    const [xp, setXp] = useState(1450);
    const [config, setConfig] = useState({ topic: 'Trigo', level: 'Easy' });
    const [isStarted, setIsStarted] = useState(false);

    const rank = xp < 2000 ? "Novice" : xp < 4000 ? "Scholar" : "Sage";

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between fixed h-full z-10">
                <div>
                    <h1 className="text-2xl font-black text-indigo-600 mb-10 italic tracking-tighter">FOCUSFLOW</h1>
                    <nav className="space-y-2">
                        {['dashboard', 'math', 'timer'].map(v => (
                            <button key={v} onClick={() => {setView(v); setIsStarted(false);}} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${view === v ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}>
                                {v === 'dashboard' ? '📊 Dashboard' : v === 'math' ? '🧠 AI Tutor' : '⏱️ Timer'}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="bg-slate-900 p-6 rounded-[32px] text-white">
                    <p className="text-[10px] font-black text-indigo-400 uppercase mb-1 tracking-widest">{rank}</p>
                    <p className="text-2xl font-black">{xp} XP</p>
                </div>
            </aside>

            {/* Stage */}
            <main className="flex-1 ml-64 p-12">
                {view === 'dashboard' && <Dashboard xp={xp} rank={rank} />}
                {view === 'timer' && <Timer onComplete={() => setXp(p => p + 100)} />}
                {view === 'math' && (
                    !isStarted ? (
                        <div className="max-w-xl mx-auto bg-white p-10 rounded-[48px] shadow-2xl border-4 border-indigo-50 mt-10 animate-in">
                            <h2 className="text-3xl font-black mb-8 italic uppercase tracking-tighter">Engine Config</h2>
                            <div className="space-y-8">
                                <section>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Topic</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Addition', 'Algebra', 'Geometry', 'Trigo'].map(t => (
                                            <button key={t} onClick={() => setConfig({...config, topic: t})} className={`p-4 rounded-2xl font-black border-4 transition-all ${config.topic === t ? 'border-indigo-600 bg-indigo-50 text-indigo-600 scale-105' : 'border-slate-100 text-slate-400'}`}>{t}</button>
                                        ))}
                                    </div>
                                </section>
                                <section>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Difficulty</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Easy', 'Medium', 'Hard'].map(l => (
                                            <button key={l} onClick={() => setConfig({...config, level: l})} className={`p-4 rounded-2xl font-black border-4 transition-all ${config.level === l ? 'border-indigo-600 bg-indigo-50 text-indigo-600 scale-105' : 'border-slate-100 text-slate-400'}`}>{l}</button>
                                        ))}
                                    </div>
                                </section>
                                <button onClick={() => setIsStarted(true)} className="w-full bg-indigo-600 text-white py-6 rounded-[32px] font-black text-xl shadow-xl hover:bg-indigo-700 transition-all uppercase tracking-tighter">Initialize Engine</button>
                            </div>
                        </div>
                    ) : (
                        <Tutor config={config} onCorrect={() => setXp(p => p + 50)} onBack={() => setIsStarted(false)} />
                    )
                )}
            </main>
        </div>
    );
}

function Tutor({ config, onCorrect, onBack }) {
    const [prob, setProb] = useState(() => MathEngine.generate(config.topic, config.level));
    const [input, setInput] = useState("");
    const [status, setStatus] = useState("idle");

    const submit = (e) => {
        e.preventDefault();
        if (input.trim() === prob.a) {
            setStatus("correct"); onCorrect();
            setTimeout(() => { setProb(MathEngine.generate(config.topic, config.level)); setInput(""); setStatus("idle"); }, 1000);
        } else {
            setStatus("wrong"); setTimeout(() => setStatus("idle"), 800);
        }
    };

    return (
        <div className="max-w-6xl mx-auto flex gap-8 items-start animate-in">
            <div className="flex-1 bg-white p-12 rounded-[56px] shadow-2xl border-4 border-indigo-50">
                <button onClick={onBack} className="mb-6 text-slate-400 font-bold text-sm uppercase tracking-tighter hover:text-indigo-600">← Settings</button>
                <h3 className="text-4xl font-black text-slate-900 mb-10 leading-tight">{prob.q}</h3>
                {prob.draw && (
                    <div className="bg-slate-50 p-10 rounded-[40px] border-2 border-slate-100 flex justify-center mb-8">
                        <svg width="200" height="150">
                            {prob.draw.type === 'rect' ? (
                                <rect x="40" y="30" width="120" height="90" fill="rgba(99, 102, 241, 0.05)" stroke="#6366f1" strokeWidth="6" />
                            ) : (
                                <path d="M50,120 L160,120 L160,40 Z" fill="rgba(99, 102, 241, 0.05)" stroke="#6366f1" strokeWidth="6" strokeLinejoin="round" />
                            )}
                            <text x="100" y="145" textAnchor="middle" className="font-black fill-indigo-600 italic text-sm">{prob.draw.label || 'x = ?'}</text>
                        </svg>
                    </div>
                )}
                <form onSubmit={submit} className="space-y-4">
                    <input autoFocus type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Result..." className={`w-full p-8 bg-slate-50 border-4 rounded-[32px] text-5xl font-black outline-none transition-all ${status === 'correct' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : status === 'wrong' ? 'border-rose-500 bg-rose-50' : 'border-slate-100 focus:border-indigo-600 focus:bg-white'}`} />
                    <button type="submit" className="w-full bg-slate-900 text-white py-8 rounded-[32px] font-black text-2xl uppercase tracking-tighter shadow-lg">Validate</button>
                </form>
            </div>
            <div className="w-[340px] space-y-6">
                <Scratchpad />
                <TrigTool />
            </div>
        </div>
    );
}

function Timer({ onComplete }) {
    const [s, setS] = useState(1500); const [r, setR] = useState(false);
    useEffect(() => {
        let i = null; if (r && s > 0) i = setInterval(() => setS(p => p - 1), 1000);
        else if (s === 0) { setR(false); onComplete(); alert("Focus Complete! +100 XP"); }
        return () => clearInterval(i);
    }, [r, s]);
    return (
        <div className="flex flex-col items-center pt-10 animate-in">
            <div className="text-[12rem] font-black tracking-tighter leading-none mb-10 text-slate-900 tabular-nums">{Math.floor(s/60)}:{String(s%60).padStart(2,'0')}</div>
            <div className="flex gap-4">
                <button onClick={() => setR(!r)} className={`px-20 py-8 rounded-[40px] font-black text-3xl shadow-xl transition-all ${r ? 'bg-white text-slate-600 border-4 border-slate-100' : 'bg-indigo-600 text-white shadow-indigo-200'}`}>{r ? 'PAUSE' : 'FOCUS'}</button>
                <button onClick={() => {setS(1500); setR(false);}} className="p-8 bg-white border-4 border-slate-100 rounded-[40px] text-3xl">🔄</button>
            </div>
        </div>
    );
}

function Dashboard({ xp, rank }) {
    return (
        <div className="max-w-4xl animate-in">
            <h2 className="text-5xl font-black mb-10 tracking-tighter uppercase italic">Scholar Status</h2>
            <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm"><p className="text-slate-400 font-bold uppercase text-[10px] mb-2 tracking-widest">Active Rank</p><p className="text-5xl font-black text-indigo-600 uppercase italic tracking-tighter">{rank}</p></div>
                <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm"><p className="text-slate-400 font-bold uppercase text-[10px] mb-2 tracking-widest">Energy Gained</p><p className="text-5xl font-black text-indigo-600 tracking-tighter">{xp} <span className="text-xl font-normal opacity-40">XP</span></p></div>
            </div>
            <div className="bg-white p-10 rounded-[40px] border border-slate-200">
                <p className="text-slate-400 font-bold text-[10px] uppercase mb-4 tracking-widest">Milestone Progress</p>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${(xp % 2000) / 20}%` }}></div></div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);