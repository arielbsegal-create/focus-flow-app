const { useState, useEffect, useRef } = React;

// --- MAIN APP COMPONENT ---
function App() {
    const [view, setView] = useState('dashboard');
    const [xp, setXp] = useState(1450);
    const [config, setConfig] = useState({ topic: 'Trigo', level: 'Easy' });
    const [isConfigured, setIsConfigured] = useState(false);

    const rank = xp < 2000 ? "Scholar" : xp < 5000 ? "Sage" : "Grandmaster";

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Navigation Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between fixed h-full z-20 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-indigo-600 mb-10 tracking-tighter italic">FOCUSFLOW AI</h1>
                    <nav className="space-y-2">
                        <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition ${view === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}>📊 Dashboard</button>
                        <button onClick={() => {setView('math'); setIsConfigured(false);}} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition ${view === 'math' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}>🧠 AI Tutor</button>
                        <button onClick={() => setView('timer')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition ${view === 'timer' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}>⏱️ Timer</button>
                    </nav>
                </div>
                <div className="bg-slate-900 p-5 rounded-[24px] text-white shadow-xl">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest text-center mb-1">{rank} Progress</p>
                    <p className="text-2xl font-black text-center tabular-nums">{xp} <span className="text-xs font-normal text-slate-500">XP</span></p>
                </div>
            </aside>

            {/* Content Rendering */}
            <main className="flex-1 ml-64 p-12">
                {view === 'dashboard' && <DashboardView xp={xp} rank={rank} />}

                {view === 'math' && (
                    !isConfigured ? (
                        <div className="max-w-xl mx-auto bg-white p-10 rounded-[40px] shadow-2xl border-4 border-indigo-50 mt-10 animate-in fade-in zoom-in duration-300">
                            <h2 className="text-3xl font-black mb-8 uppercase italic tracking-tight">Select Subject</h2>
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-3">
                                    {['Addition', 'Algebra', 'Geometry', 'Trigo'].map(t => (
                                        <button key={t} onClick={() => setConfig({...config, topic: t})} className={`p-4 rounded-2xl font-bold border-4 transition ${config.topic === t ? 'border-indigo-600 bg-indigo-50 text-indigo-600 scale-105' : 'border-slate-100 text-slate-400'}`}>{t}</button>
                                    ))}
                                </div>
                                <button onClick={() => setIsConfigured(true)} className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">START TRAINING</button>
                            </div>
                        </div>
                    ) : (
                        <MathTutorView config={config} onCorrect={() => setXp(prev => prev + 50)} onBack={() => setIsConfigured(false)} />
                    )
                )}

                {view === 'timer' && <TimerView onComplete={() => setXp(prev => prev + 100)} />}
            </main>
        </div>
    );
}

// --- DASHBOARD (ACHIEVEMENTS) ---
function DashboardView({ xp, rank }) {
    return (
        <div className="max-w-4xl animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-5xl font-black mb-10 tracking-tighter italic uppercase">Your Achievements</h2>
            <div className="grid grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm">
                    <p className="text-slate-400 font-black uppercase text-xs tracking-widest mb-2">Academic Rank</p>
                    <p className="text-5xl font-black text-indigo-600 tracking-tighter uppercase italic">{rank}</p>
                </div>
                <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm">
                    <p className="text-slate-400 font-black uppercase text-xs tracking-widest mb-2">Total Energy Earned</p>
                    <p className="text-5xl font-black text-indigo-600 tracking-tighter">{xp} XP</p>
                </div>
            </div>
            <div className="mt-8 bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm">
                <p className="text-slate-400 font-black uppercase text-xs mb-4">Milestone Progress</p>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full transition-all duration-1000" style={{ width: `${Math.min((xp / 5000) * 100, 100)}%` }}></div>
                </div>
                <p className="mt-4 text-sm font-bold text-slate-500 uppercase">Goal: 5,000 XP for Grandmaster Status</p>
            </div>
        </div>
    );
}

// --- TIMER COMPONENT ---
function TimerView({ onComplete }) {
    const [seconds, setSeconds] = useState(1500);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && seconds > 0) {
            interval = setInterval(() => setSeconds(s => s - 1), 1000);
        } else if (seconds === 0) {
            setIsActive(false);
            onComplete();
            alert("Deep Focus complete! +100 XP");
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const format = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    return (
        <div className="flex flex-col items-center justify-center pt-10 animate-in fade-in duration-700">
            <h2 className="text-2xl font-black text-slate-400 uppercase tracking-[0.3em] mb-10 italic">Concentration Mode</h2>
            <div className="text-[14rem] font-black text-slate-900 tracking-tighter leading-none mb-12 tabular-nums drop-shadow-sm">{format(seconds)}</div>
            <div className="flex gap-6">
                <button onClick={() => setIsActive(!isActive)} className={`px-24 py-8 rounded-[40px] font-black text-3xl shadow-2xl transition-all hover:scale-105 active:scale-95 ${isActive ? 'bg-white text-slate-600 border-4 border-slate-100' : 'bg-indigo-600 text-white shadow-indigo-200'}`}>{isActive ? 'PAUSE' : 'FOCUS NOW'}</button>
                <button onClick={() => {setSeconds(1500); setIsActive(false);}} className="p-8 bg-white border-4 border-slate-100 rounded-[40px] text-3xl hover:bg-slate-50 transition-all">🔄</button>
            </div>
        </div>
    );
}

// --- DRAWING PAD COMPONENT ---
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
        ctx.strokeStyle = '#4f46e5';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };

    const clear = () => {
        const canvas = canvasRef.current;
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <div className="bg-white p-4 rounded-[32px] shadow-xl border-4 border-slate-100">
            <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Scratchpad</span>
                <button onClick={clear} className="text-xs text-rose-500 font-bold hover:underline">Clear</button>
            </div>
            <canvas ref={canvasRef} width="320" height="300" onMouseDown={start} onMouseMove={move} onMouseUp={() => setDrawing(false)} onMouseLeave={() => setDrawing(false)} className="bg-slate-50 rounded-2xl cursor-crosshair touch-none" />
        </div>
    );
}

// --- TUTOR VIEW WITH PROCEDURAL MATH ENGINE ---
function MathTutorView({ config, onCorrect, onBack }) {
    const generateProblem = (c) => {
        const level = c.level;
        let q, a, h, draw = null;

        if (c.topic === 'Geometry') {
            const mode = Math.random() > 0.5 ? 'Rect' : 'Pythag';
            if (mode === 'Rect') {
                const w = Math.floor(Math.random() * 10) + 4;
                const l = Math.floor(Math.random() * 10) + 4;
                q = "Find the Area."; a = (w * l).toString();
                draw = { type: 'rect', w, l };
                h = ["Area = Length × Width"];
            } else {
                q = "Find Hypotenuse (c)."; a = "5"; // Procedural simpler case
                draw = { type: 'tri', a: 3, b: 4, label: 'c = ?' };
                h = ["a² + b² = c²"];
            }
        }
        else if (c.topic === 'Trigo') {
            const hyp = (Math.floor(Math.random() * 3) + 1) * 10;
            const ang = 30; // Using 30 for clear whole-number results (sin 30 = 0.5)
            q = `Find side 'x' (Opposite).`;
            a = (hyp * 0.5).toString();
            draw = { type: 'tri_trig', hyp, ang };
            h = ["Opp = Hyp × sin(θ)", "sin(30°) = 0.5"];
        }
        else if (c.topic === 'Algebra') {
            const x = Math.floor(Math.random() * 12) + 2;
            const mult = Math.floor(Math.random() * 5) + 2;
            q = `${mult}x = ${mult * x}. Solve for x.`;
            a = x.toString();
            h = [`Divide ${mult * x} by ${mult}`];
        } else {
            const n1 = Math.floor(Math.random() * 50) + 10;
            const n2 = Math.floor(Math.random() * 50) + 10;
            q = `${n1} + ${n2} = ?`; a = (n1+n2).toString(); h=["Add carefully!"];
        }
        return { q, a, h, draw };
    };

    const [current, setCurrent] = useState(() => generateProblem(config));
    const [input, setInput] = useState("");
    const [status, setStatus] = useState('idle');

    const check = (e) => {
        e.preventDefault();
        if (input.trim() === current.a) {
            setStatus('correct'); onCorrect();
            setTimeout(() => { setCurrent(generateProblem(config)); setInput(""); setStatus('idle'); }, 1000);
        } else {
            setStatus('wrong'); setTimeout(() => setStatus('idle'), 800);
        }
    };

    return (
        <div className="max-w-6xl mx-auto flex gap-8 items-start animate-in zoom-in-95 duration-300">
            <div className="flex-1 bg-white p-10 rounded-[48px] shadow-2xl border-4 border-indigo-50 relative overflow-hidden">
                <button onClick={onBack} className="mb-6 text-slate-400 font-bold hover:text-indigo-600 transition flex items-center gap-2">← Change Topic</button>
                <div className="mb-10">
                    <h3 className="text-5xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">{current.q}</h3>
                    {current.draw && (
                        <div className="bg-slate-50 p-10 rounded-[32px] border-2 border-slate-100 flex justify-center shadow-inner">
                            {current.draw.type === 'rect' ? (
                                <svg width="200" height="150" viewBox="0 0 200 150">
                                    <rect x="40" y="30" width="120" height="90" fill="rgba(79, 70, 229, 0.05)" stroke="#4f46e5" strokeWidth="6" />
                                    <text x="100" y="20" textAnchor="middle" className="font-black fill-slate-400 italic">{current.draw.l}</text>
                                    <text x="25" y="80" textAnchor="middle" className="font-black fill-slate-400 italic" transform="rotate(-90 25,80)">{current.draw.w}</text>
                                </svg>
                            ) : (
                                <svg width="200" height="150" viewBox="0 0 200 150">
                                    <path d="M50,120 L160,120 L160,40 Z" fill="rgba(79, 70, 229, 0.05)" stroke="#4f46e5" strokeWidth="6" strokeLinejoin="round" />
                                    <text x="110" y="140" textAnchor="middle" className="font-black fill-indigo-600 text-xl italic">x = ?</text>
                                    <text x="90" y="70" textAnchor="middle" className="font-black fill-slate-400" transform="rotate(-35 90,70)">{current.draw.hyp || current.draw.label}</text>
                                    <text x="65" y="115" className="text-xs font-black fill-slate-400 italic">{current.draw.ang || '90'}°</text>
                                </svg>
                            )}
                        </div>
                    )}
                </div>
                <form onSubmit={check} className="space-y-4">
                    <input autoFocus type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type answer..." className={`w-full p-8 bg-slate-50 border-4 rounded-[32px] text-5xl font-black transition-all ${status === 'correct' ? 'border-emerald-500 bg-emerald-50 text-emerald-600 scale-105' : status === 'wrong' ? 'border-rose-500 bg-rose-50 animate-pulse' : 'border-slate-100 focus:border-indigo-600 focus:bg-white'}`} />
                    <button type="submit" className="w-full bg-slate-900 text-white py-8 rounded-[32px] font-black text-2xl shadow-xl hover:bg-black transition-all uppercase tracking-tighter">Check Solution</button>
                </form>
            </div>
            <div className="w-[350px] space-y-6">
                <DrawingPad />
                {config.topic === 'Trigo' && (
                    <div className="bg-slate-900 p-8 rounded-[40px] shadow-2xl text-white border-t-4 border-indigo-500">
                        <p className="text-[10px] font-black text-indigo-400 uppercase mb-6 tracking-widest text-center italic">Advanced Engine Tools</p>
                        <div className="space-y-4">
                            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex justify-between">
                                <span className="text-slate-400 italic">sin(30°)</span>
                                <span className="text-indigo-300 font-black">0.500</span>
                            </div>
                            <div className="p-4 bg-indigo-900/30 rounded-2xl border border-indigo-500/20 text-center">
                                <p className="text-xs font-bold text-indigo-300 mb-1">PRO-TIP</p>
                                <p className="text-sm font-medium leading-relaxed italic">Opposite Side = Hypotenuse × sin(Angle)</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- RENDER BOOTSTRAP ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);