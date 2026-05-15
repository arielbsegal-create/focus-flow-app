const { useState, useEffect, useRef } = React;

/**
 * CORE MATH ENGINE
 * Generates randomized, solvable problems procedurally.
 */
const MathEngine = {
    generate: (topic, level) => {
        let q, a, draw = null, hint = "";

        switch (topic) {
            case 'Geometry':
                const isPythag = Math.random() > 0.5;
                if (isPythag) {
                    // Use Pythagorean triples for clean integer answers
                    const triples = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]];
                    const [sideA, sideB, sideC] = triples[Math.floor(Math.random() * triples.length)];
                    q = `Find the Hypotenuse (c) where a=${sideA} and b=${sideB}.`;
                    a = sideC.toString();
                    draw = { type: 'tri', a: sideA, b: sideB, label: 'c = ?' };
                    hint = "Formula: $a^2 + b^2 = c^2$";
                } else {
                    const l = Math.floor(Math.random() * 10) + 5;
                    const w = Math.floor(Math.random() * 8) + 3;
                    q = `Find the Area of a rectangle with Length ${l} and Width ${w}.`;
                    a = (l * w).toString();
                    draw = { type: 'rect', l, w };
                    hint = "Area = Length × Width";
                }
                break;

            case 'Trigo':
                const angles = [30, 60]; // Keeping it to angles with clean sin/cos values
                const angle = angles[Math.floor(Math.random() * angles.length)];
                const hypotenuse = (Math.floor(Math.random() * 5) + 1) * 10; // 10, 20, 30...
                // Sin(30) = 0.5, Sin(60) = 0.866
                const result = angle === 30 ? hypotenuse * 0.5 : Math.round(hypotenuse * 0.866);

                q = `With θ = ${angle}° and Hypotenuse = ${hypotenuse}, find the Opposite side (x).`;
                a = result.toString();
                draw = { type: 'tri_trig', hyp: hypotenuse, ang: angle };
                hint = `$\sin(\theta) = \frac{Opposite}{Hypotenuse}$ | $\sin(${angle}°) \approx ${angle === 30 ? 0.5 : 0.87}$`;
                break;

            case 'Algebra':
                const x = Math.floor(Math.random() * 12) + 2;
                const coeff = Math.floor(Math.random() * 8) + 2;
                const constant = Math.floor(Math.random() * 10) + 1;
                const total = (coeff * x) + constant;
                q = `Solve for x: ${coeff}x + ${constant} = ${total}`;
                a = x.toString();
                hint = `Subtract ${constant}, then divide by ${coeff}.`;
                break;

            default: // Addition/Basic
                const n1 = Math.floor(Math.random() * 100);
                const n2 = Math.floor(Math.random() * 100);
                q = `${n1} + ${n2} = ?`;
                a = (n1 + n2).toString();
        }
        return { q, a, draw, hint };
    }
};

// --- MAIN APPLICATION ---
function App() {
    const [view, setView] = useState('dashboard'); // dashboard, math, timer
    const [xp, setXp] = useState(1450);
    const [config, setConfig] = useState({ topic: 'Geometry', level: 'Medium' });
    const [isConfigured, setIsConfigured] = useState(false);

    const rank = xp < 2000 ? "Novice" : xp < 4000 ? "Scholar" : "Grandmaster";

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Navigation Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between fixed h-full z-20">
                <div>
                    <h1 className="text-2xl font-black text-indigo-600 mb-10 italic tracking-tighter">FOCUSFLOW AI</h1>
                    <nav className="space-y-3">
                        <NavItem active={view === 'dashboard'} onClick={() => setView('dashboard')} label="Dashboard" icon="📊" />
                        <NavItem active={view === 'math'} onClick={() => {setView('math'); setIsConfigured(false);}} label="AI Tutor" icon="🧠" />
                        <NavItem active={view === 'timer'} onClick={() => setView('timer')} label="Timer" icon="⏱️" />
                    </nav>
                </div>
                <div className="bg-slate-900 p-5 rounded-3xl text-white shadow-xl">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest text-center mb-1">{rank}</p>
                    <p className="text-2xl font-black text-center">{xp} <span className="text-sm font-normal text-slate-500">XP</span></p>
                </div>
            </aside>

            {/* Main Stage */}
            <main className="flex-1 ml-64 p-12">
                {view === 'dashboard' && <Dashboard xp={xp} rank={rank} />}
                {view === 'timer' && <Timer onComplete={() => setXp(p => p + 100)} />}
                {view === 'math' && (
                    !isConfigured ? (
                        <div className="max-w-xl mx-auto bg-white p-10 rounded-[40px] shadow-2xl border-4 border-indigo-50 mt-10">
                            <h2 className="text-3xl font-black mb-8 italic">Choose Your Challenge</h2>
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {['Algebra', 'Geometry', 'Trigo', 'Addition'].map(t => (
                                    <button key={t} onClick={() => setConfig({...config, topic: t})} className={`p-5 rounded-2xl font-bold border-4 transition-all ${config.topic === t ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'}`}>{t}</button>
                                ))}
                            </div>
                            <button onClick={() => setIsConfigured(true)} className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all">START ENGINE</button>
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

function NavItem({ active, onClick, label, icon }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}>
            <span className="text-xl">{icon}</span> {label}
        </button>
    );
}

function Dashboard({ xp, rank }) {
    return (
        <div className="max-w-4xl animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-5xl font-black mb-10 tracking-tight italic uppercase">Achievements</h2>
            <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm">
                    <p className="text-slate-400 font-bold uppercase text-xs mb-2">Current Rank</p>
                    <p className="text-5xl font-black text-indigo-600 tracking-tighter uppercase italic">{rank}</p>
                </div>
                <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm">
                    <p className="text-slate-400 font-bold uppercase text-xs mb-2">Total XP</p>
                    <p className="text-5xl font-black text-indigo-600 tracking-tighter">{xp}</p>
                </div>
            </div>
            <div className="bg-white p-8 rounded-[32px] border border-slate-200">
                <p className="text-slate-400 font-bold text-xs uppercase mb-4">Progress to Next Tier</p>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${(xp % 2000) / 20}%` }}></div>
                </div>
            </div>
        </div>
    );
}

function Timer({ onComplete }) {
    const [timeLeft, setTimeLeft] = useState(1500);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        let timer = null;
        if (running && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0) {
            setRunning(false);
            onComplete();
            alert("Focus Session Complete! +100 XP");
        }
        return () => clearInterval(timer);
    }, [running, timeLeft]);

    const format = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    return (
        <div className="flex flex-col items-center justify-center pt-10">
            <div className="text-[14rem] font-black text-slate-900 tracking-tighter leading-none mb-12 tabular-nums">{format(timeLeft)}</div>
            <div className="flex gap-4">
                <button onClick={() => setRunning(!running)} className={`px-20 py-8 rounded-[40px] font-black text-3xl shadow-2xl transition-all ${running ? 'bg-white text-slate-600 border-4 border-slate-100' : 'bg-indigo-600 text-white shadow-indigo-200'}`}>
                    {running ? 'PAUSE' : 'START FOCUS'}
                </button>
                <button onClick={() => {setTimeLeft(1500); setRunning(false);}} className="p-8 bg-white border-4 border-slate-100 rounded-[40px] text-3xl">🔄</button>
            </div>
        </div>
    );
}

function DrawingPad() {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const start = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const ctx = canvasRef.current.getContext('2d');
        ctx.strokeStyle = '#4f46e5';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };

    return (
        <div className="bg-white p-4 rounded-[32px] shadow-xl border-4 border-slate-100">
            <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Scratchpad</span>
                <button onClick={() => canvasRef.current.getContext('2d').clearRect(0,0,320,300)} className="text-xs text-rose-500 font-bold">Clear</button>
            </div>
            <canvas ref={canvasRef} width="320" height="300" onMouseDown={start} onMouseMove={draw} onMouseUp={() => setIsDrawing(false)} onMouseLeave={() => setIsDrawing(false)} className="bg-slate-50 rounded-2xl cursor-crosshair touch-none" />
        </div>
    );
}

function TutorView({ config, onCorrect, onBack }) {
    const [problem, setProblem] = useState(() => MathEngine.generate(config.topic, config.level));
    const [input, setInput] = useState("");
    const [status, setStatus] = useState("idle");

    const submit = (e) => {
        e.preventDefault();
        if (input.trim() === problem.a) {
            setStatus("correct");
            onCorrect();
            setTimeout(() => {
                setProblem(MathEngine.generate(config.topic, config.level));
                setInput("");
                setStatus("idle");
            }, 1000);
        } else {
            setStatus("wrong");
            setTimeout(() => setStatus("idle"), 800);
        }
    };

    return (
        <div className="max-w-6xl mx-auto flex gap-8 items-start animate-in zoom-in-95 duration-300">
            <div className="flex-1 bg-white p-10 rounded-[48px] shadow-2xl border-4 border-indigo-50">
                <button onClick={onBack} className="mb-6 text-slate-400 font-bold hover:text-indigo-600 transition">← Change Topic</button>
                <div className="mb-10">
                    <h3 className="text-4xl font-black text-slate-900 mb-8 tracking-tight leading-tight">{problem.q}</h3>

                    {problem.draw && (
                        <div className="bg-slate-50 p-10 rounded-[32px] border-2 border-slate-100 flex justify-center mb-6">
                            {problem.draw.type === 'rect' ? (
                                <svg width="200" height="150">
                                    <rect x="40" y="30" width="120" height="90" fill="rgba(79, 70, 229, 0.05)" stroke="#4f46e5" strokeWidth="6" />
                                    <text x="100" y="20" textAnchor="middle" className="font-black fill-slate-400 italic">{problem.draw.l}</text>
                                    <text x="20" y="80" textAnchor="middle" className="font-black fill-slate-400 italic" transform="rotate(-90 20,80)">{problem.draw.w}</text>
                                </svg>
                            ) : (
                                <svg width="200" height="150">
                                    <path d="M50,120 L160,120 L160,40 Z" fill="rgba(79, 70, 229, 0.05)" stroke="#4f46e5" strokeWidth="6" strokeLinejoin="round" />
                                    <text x="110" y="140" textAnchor="middle" className="font-black fill-indigo-600 text-xl italic">{problem.draw.label || 'x = ?'}</text>
                                    <text x="90" y="70" textAnchor="middle" className="font-black fill-slate-400" transform="rotate(-35 90,70)">{problem.draw.hyp || problem.draw.b}</text>
                                    <text x="65" y="115" className="text-xs font-black fill-slate-400 italic">{problem.draw.ang || '90'}°</text>
                                </svg>
                            )}
                        </div>
                    )}
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <input autoFocus type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type answer..." className={`w-full p-8 bg-slate-50 border-4 rounded-[32px] text-5xl font-black outline-none transition-all ${status === 'correct' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : status === 'wrong' ? 'border-rose-500 bg-rose-50' : 'border-slate-100 focus:border-indigo-600 focus:bg-white'}`} />
                    <button type="submit" className="w-full bg-slate-900 text-white py-8 rounded-[32px] font-black text-2xl shadow-xl hover:bg-black transition-all">CHECK SOLUTION</button>
                </form>

                <p className="mt-8 text-slate-400 text-sm font-medium bg-slate-50 p-4 rounded-2xl italic">💡 Hint: {problem.hint}</p>
            </div>

            <div className="w-[350px] space-y-6">
                <DrawingPad />
                {config.topic === 'Trigo' && (
                    <div className="bg-slate-900 p-8 rounded-[40px] text-white border-t-4 border-indigo-500">
                        <p className="text-[10px] font-black text-indigo-400 uppercase mb-4 tracking-widest text-center">Trig Data</p>
                        <div className="space-y-2 opacity-80">
                            <p className="text-xs font-bold italic">sin(30°) = 0.5</p>
                            <p className="text-xs font-bold italic">sin(60°) ≈ 0.866</p>
                            <p className="text-xs font-bold italic">sin(45°) ≈ 0.707</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- INITIALIZE ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);