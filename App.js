const { useState, useEffect, useRef } = React;

const MathEngine = {
    generate: (topic, level) => {
        let q, a, draw = null;
        const scalar = level === 'Easy' ? 10 : level === 'Medium' ? 50 : 200;

        switch (topic) {
            case 'Trigo':
                const funcs = ['sin', 'cos', 'tan'];
                const fn = funcs[Math.floor(Math.random() * funcs.length)];
                const ang = level === 'Easy' ? [30, 45, 60][Math.floor(Math.random() * 3)] : Math.floor(Math.random() * 70) + 10;
                const hyp = (Math.floor(Math.random() * 5) + 1) * 10;
                const rad = ang * (Math.PI / 180);

                if (fn === 'sin') {
                    q = `Find x (Opposite) where Hypotenuse = ${hyp} and θ = ${ang}°.`;
                    a = Math.round(hyp * Math.sin(rad)).toString();
                    draw = { type: 'tri', hyp: hyp, opp: 'x', adj: '', ang: ang };
                } else if (fn === 'cos') {
                    q = `Find x (Adjacent) where Hypotenuse = ${hyp} and θ = ${ang}°.`;
                    a = Math.round(hyp * Math.cos(rad)).toString();
                    draw = { type: 'tri', hyp: hyp, opp: '', adj: 'x', ang: ang };
                } else {
                    const adjVal = 10;
                    q = `Find x (Opposite) where Adjacent = ${adjVal} and θ = ${ang}°.`;
                    a = Math.round(adjVal * Math.tan(rad)).toString();
                    draw = { type: 'tri', hyp: '', opp: 'x', adj: adjVal, ang: ang };
                }
                break;

            case 'Algebra':
                const xVal = Math.floor(Math.random() * (scalar / 2)) + 2;
                const coeff = level === 'Easy' ? 1 : Math.floor(Math.random() * 10) + 2;
                const b = Math.floor(Math.random() * scalar);
                const total = (coeff * xVal) + b;
                q = level === 'Easy' ? `x + ${b} = ${total}` : `${coeff}x + ${b} = ${total}`;
                a = xVal.toString();
                break;

            case 'Geometry':
                const l = Math.floor(Math.random() * (scalar / 5)) + 5;
                const w = Math.floor(Math.random() * (scalar / 5)) + 3;
                q = level === 'Hard' ? `Area: ${l*w}, Width: ${w}. Perimeter?` : `Area of ${l}x${w} rectangle?`;
                a = level === 'Hard' ? (2 * (l + w)).toString() : (l * w).toString();
                draw = { type: 'rect', l, w };
                break;

            default:
                const n1 = Math.floor(Math.random() * scalar);
                const n2 = Math.floor(Math.random() * scalar);
                q = `${n1} + ${n2} = ?`;
                a = (n1 + n2).toString();
        }
        return { q, a, draw };
    }
};

function TrigTool() {
    const [deg, setDeg] = useState(30);
    const r = deg * (Math.PI / 180);
    return (
        <div className="bg-slate-900 p-6 rounded-[32px] text-white shadow-2xl border-t-4 border-indigo-500 animate-in">
            <p className="text-[10px] font-black text-indigo-400 uppercase mb-4 tracking-[0.2em] text-center">Live Trig Calc</p>
            <input type="number" value={deg} onChange={(e) => setDeg(e.target.value)} className="w-full bg-slate-800 p-3 rounded-xl text-center text-2xl font-black outline-none mb-4" />
            <div className="space-y-2 text-xs font-bold italic">
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
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2; // Precise Thinner Pencil
        ctx.lineCap = 'round';
        ctx.lineTo(x, y); ctx.stroke();
    };
    return (
        <div className="bg-white p-4 rounded-[32px] shadow-lg border border-slate-100">
            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-2 px-2">
                <span>Scratchpad</span>
                <button onClick={() => canvasRef.current.getContext('2d').clearRect(0,0,400,400)} className="text-rose-500">Clear</button>
            </div>
            <canvas ref={canvasRef} width="300" height="250" onMouseDown={start} onMouseMove={draw} onMouseUp={() => setActive(false)} onMouseLeave={() => setActive(false)} className="bg-slate-50 rounded-2xl cursor-crosshair touch-none" />
        </div>
    );
}

function App() {
    const [view, setView] = useState('dashboard');
    const [xp, setXp] = useState(1450);
    const [config, setConfig] = useState({ topic: 'Trigo', level: 'Easy' });
    const [isStarted, setIsStarted] = useState(false);

    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between fixed h-full z-10">
                <div>
                    <h1 className="text-2xl font-black text-indigo-600 mb-10 italic tracking-tighter uppercase">FocusFlow</h1>
                    <nav className="space-y-2">
                        {['dashboard', 'math', 'timer'].map(v => (
                            <button key={v} onClick={() => {setView(v); setIsStarted(false);}} className={`w-full p-4 rounded-2xl font-bold transition-all text-left flex items-center gap-3 ${view === v ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
                                {v === 'dashboard' ? '📊 Profile' : v === 'math' ? '🧠 AI Tutor' : '⏱️ Timer'}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="bg-slate-900 p-6 rounded-[32px] text-white">
                    <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Energy Units</p>
                    <p className="text-2xl font-black">{xp} XP</p>
                </div>
            </aside>

            <main className="flex-1 ml-64 p-12">
                {view === 'dashboard' && <DashboardView xp={xp} />}
                {view === 'timer' && <TimerView onComplete={() => setXp(p => p + 100)} />}
                {view === 'math' && (
                    !isStarted ? (
                        <div className="max-w-xl mx-auto bg-white p-12 rounded-[56px] shadow-2xl mt-10 border-4 border-indigo-50 animate-in">
                            <h2 className="text-3xl font-black mb-8 italic uppercase tracking-tighter">Training Config</h2>
                            <div className="space-y-8">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Subject</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Addition', 'Algebra', 'Geometry', 'Trigo'].map(t => (
                                            <button key={t} onClick={() => setConfig({...config, topic: t})} className={`p-4 rounded-2xl font-black border-4 transition-all ${config.topic === t ? 'border-indigo-600 bg-indigo-50 text-indigo-600 scale-105' : 'border-slate-50 text-slate-400'}`}>{t}</button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Difficulty</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Easy', 'Medium', 'Hard'].map(l => (
                                            <button key={l} onClick={() => setConfig({...config, level: l})} className={`p-4 rounded-2xl font-black border-4 transition-all ${config.level === l ? 'border-indigo-600 bg-indigo-50 text-indigo-600 scale-105' : 'border-slate-50 text-slate-400'}`}>{l}</button>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => setIsStarted(true)} className="w-full bg-indigo-600 text-white py-8 rounded-[40px] font-black text-2xl uppercase shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Start Session</button>
                            </div>
                        </div>
                    ) : (
                        <TutorView config={config} onCorrect={() => setXp(p => p + 50)} onBack={() => setIsStarted(false)} />
                    )
                )}
            </main>
        </div>
    );
}

function TutorView({ config, onCorrect, onBack }) {
    const [prob, setProb] = useState(() => MathEngine.generate(config.topic, config.level));
    const [input, setInput] = useState("");
    const [status, setStatus] = useState("idle");

    const submit = (e) => {
        e.preventDefault();
        if (input.trim() === prob.a) {
            setStatus("correct"); onCorrect();
            setTimeout(() => { setProb(MathEngine.generate(config.topic, config.level)); setInput(""); setStatus("idle"); }, 800);
        } else {
            setStatus("wrong"); setTimeout(() => setStatus("idle"), 800);
        }
    };

    return (
        <div className="max-w-6xl mx-auto flex gap-10 items-start animate-in">
            <div className="flex-1 bg-white p-12 rounded-[56px] shadow-2xl border-4 border-indigo-50">
                <button onClick={onBack} className="mb-8 text-slate-300 font-black text-xs uppercase tracking-widest hover:text-indigo-600 transition-colors">← Abandon Mission</button>
                <h3 className="text-4xl font-black text-slate-900 mb-10 leading-tight italic tracking-tighter">{prob.q}</h3>

                {prob.draw && (
                    <div className="bg-slate-50 p-12 rounded-[40px] border-2 border-slate-100 flex justify-center mb-10">
                        <svg width="240" height="180" viewBox="0 0 240 180">
                            {prob.draw.type === 'tri' ? (
                                <g>
                                    <path d="M60,140 L180,140 L180,40 Z" fill="rgba(99, 102, 241, 0.05)" stroke="#6366f1" strokeWidth="6" strokeLinejoin="round" />
                                    <text x="82" y="135" className="fill-indigo-600 font-black text-[14px] italic">{prob.draw.ang}°</text>
                                    <text x="110" y="80" textAnchor="middle" transform="rotate(-40 110,80)" className="fill-slate-500 font-black text-[14px] italic">{prob.draw.hyp}</text>
                                    <text x="200" y="90" textAnchor="middle" className="fill-slate-500 font-black text-[14px] italic">{prob.draw.opp}</text>
                                    <text x="120" y="165" textAnchor="middle" className="fill-slate-500 font-black text-[14px] italic">{prob.draw.adj}</text>
                                </g>
                            ) : (
                                <g>
                                    <rect x="50" y="40" width="140" height="100" fill="rgba(99, 102, 241, 0.05)" stroke="#6366f1" strokeWidth="6" />
                                    <text x="120" y="30" textAnchor="middle" className="fill-slate-500 font-black text-sm italic">{prob.draw.l}</text>
                                    <text x="205" y="95" textAnchor="middle" className="fill-slate-500 font-black text-sm italic">{prob.draw.w}</text>
                                </g>
                            )}
                        </svg>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <input autoFocus type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type solution..." className={`w-full p-8 bg-slate-50 border-4 rounded-[32px] text-6xl font-black outline-none transition-all ${status === 'correct' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : status === 'wrong' ? 'border-rose-500 bg-rose-50' : 'border-slate-100 focus:border-indigo-600'}`} />
                    <button type="submit" className="w-full bg-slate-900 text-white py-8 rounded-[32px] font-black text-2xl uppercase tracking-tighter italic hover:bg-black transition-all">Submit Entry</button>
                </form>
            </div>

            <div className="w-[340px] space-y-8">
                <Scratchpad />
                {config.topic === 'Trigo' && <TrigTool />}
            </div>
        </div>
    );
}

function TimerView({ onComplete }) {
    const [s, setS] = useState(1500); const [r, setR] = useState(false);
    useEffect(() => {
        let i = null; if (r && s > 0) i = setInterval(() => setS(p => p - 1), 1000);
        else if (s === 0) { setR(false); onComplete(); alert("Focus Earned!"); }
        return () => clearInterval(i);
    }, [r, s]);
    return (
        <div className="flex flex-col items-center pt-10 animate-in">
            <h2 className="text-xl font-black text-slate-300 uppercase tracking-[0.5em] mb-10 italic">Deep Concentration</h2>
            <div className="text-[12rem] font-black text-slate-900 tabular-nums leading-none mb-14 drop-shadow-2xl">{Math.floor(s/60)}:{String(s%60).padStart(2,'0')}</div>
            <div className="flex gap-6">
                <button onClick={() => setR(!r)} className={`px-24 py-10 rounded-[48px] font-black text-3xl shadow-2xl transition-all ${r ? 'bg-white text-slate-600 border-4 border-slate-100' : 'bg-indigo-600 text-white shadow-indigo-100'}`}>{r ? 'PAUSE' : 'START'}</button>
                <button onClick={() => setS(1500)} className="p-10 bg-white border-4 border-slate-100 rounded-[48px] text-3xl hover:bg-slate-50 transition-all">🔄</button>
            </div>
        </div>
    );
}

function DashboardView({ xp }) {
    return (
        <div className="max-w-4xl animate-in">
            <h2 className="text-6xl font-black mb-12 italic uppercase tracking-tighter text-slate-900">Scholar Profile</h2>
            <div className="bg-white p-12 rounded-[56px] border-4 border-indigo-50 shadow-xl flex items-center justify-between">
                <div>
                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-2">Current Energy</p>
                    <p className="text-7xl font-black text-indigo-600">{xp} <span className="text-2xl font-normal text-slate-300">XP</span></p>
                </div>
                <div className="text-right">
                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-2">Rank</p>
                    <p className="text-5xl font-black text-slate-900 italic uppercase tracking-tighter">{xp < 3000 ? 'Scholar' : 'Grandmaster'}</p>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);