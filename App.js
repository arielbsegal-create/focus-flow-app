const { useState, useEffect, useRef } = React;

function App() {
    const [view, setView] = useState('dashboard');
    const [xp, setXp] = useState(1450);

    // Config holds the user's choices
    const [config, setConfig] = useState({ topic: 'Algebra', level: 'Easy' });
    const [isConfigured, setIsConfigured] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between fixed h-full shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-indigo-600 mb-10 tracking-tighter italic">FOCUSFLOW AI</h1>
                    <nav className="space-y-2">
                        <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${view === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>📊 Dashboard</button>
                        <button onClick={() => {setView('math'); setIsConfigured(false);}} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${view === 'math' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>🧠 AI Tutor</button>
                        <button onClick={() => setView('timer')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${view === 'timer' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>⏱️ Timer</button>
                    </nav>
                </div>
                <div className="bg-slate-900 p-6 rounded-[32px] text-white">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest text-center mb-1">Scholar Energy</p>
                    <p className="text-3xl font-black text-center tracking-tight">{xp} <span className="text-xs font-normal text-slate-500">XP</span></p>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-12">
                {view === 'dashboard' && <DashboardView xp={xp} />}

                {view === 'math' && (
                    !isConfigured ? (
                        /* STEP 1: CONFIGURATION SCREEN WITH NEW BUTTONS */
                        <div className="max-w-2xl mx-auto bg-white p-12 rounded-[48px] shadow-2xl border-4 border-indigo-50">
                            <h2 className="text-4xl font-black mb-10 text-slate-800 tracking-tight">Setup AI Session</h2>

                            <div className="space-y-10">
                                <div>
                                    <label className="block text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">1. Select Subject</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {['Addition', 'Multiplication', 'Algebra', 'Geometry', 'Trigo'].map(t => (
                                            <button key={t} onClick={() => setConfig({...config, topic: t})} className={`p-4 rounded-2xl font-bold border-4 transition-all ${config.topic === t ? 'border-indigo-600 bg-indigo-50 text-indigo-600 scale-105' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}>{t}</button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">2. Select Difficulty</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Easy', 'Medium', 'Hard'].map(l => (
                                            <button key={l} onClick={() => setConfig({...config, level: l})} className={`p-4 rounded-2xl font-bold border-4 transition-all ${config.level === l ? 'border-indigo-600 bg-indigo-50 text-indigo-600 scale-105' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}>{l}</button>
                                        ))}
                                    </div>
                                </div>

                                <button onClick={() => setIsConfigured(true)} className="w-full bg-indigo-600 text-white py-7 rounded-[32px] font-black text-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all uppercase tracking-tighter">Generate Problems</button>
                            </div>
                        </div>
                    ) : (
                        /* STEP 2: MATH PROBLEM DISPLAY */
                        <MathTutorView config={config} onCorrect={() => setXp(prev => prev + 50)} onBack={() => setIsConfigured(false)} />
                    )
                )}

                {view === 'timer' && <TimerView onComplete={() => setXp(prev => prev + 100)} />}
            </main>
        </div>
    );
}

function MathTutorView({ config, onCorrect, onBack }) {
    const generateProblem = (c) => {
        let q, a, h;
        const level = c.level;

        if (c.topic === 'Addition') {
            const range = level === 'Easy' ? 12 : level === 'Medium' ? 60 : 300;
            const n1 = Math.floor(Math.random() * range) + 1;
            const n2 = Math.floor(Math.random() * range) + 1;
            q = `${n1} + ${n2} = ?`; a = (n1 + n2).toString();
            h = ["Add digits from right to left.", "Don't forget to carry if needed!"];
        }
        else if (c.topic === 'Multiplication') {
            const max = level === 'Easy' ? 10 : level === 'Medium' ? 15 : 40;
            const n1 = Math.floor(Math.random() * max) + 2;
            const n2 = Math.floor(Math.random() * 12) + 2;
            q = `${n1} × ${n2} = ?`; a = (n1 * n2).toString();
            h = ["Try breaking the first number into 10 + x.", "Check your times tables."];
        }
        else if (c.topic === 'Algebra') {
            const x = Math.floor(Math.random() * (level === 'Easy' ? 10 : 25)) + 1;
            const coeff = Math.floor(Math.random() * (level === 'Easy' ? 5 : 12)) + 2;
            const res = coeff * x;
            q = `${coeff}x = ${res}`; a = x.toString();
            h = [`Divide ${res} by ${coeff}.`, "Isolation of X is key."];
        }
        else if (c.topic === 'Geometry') {
            // Rectangles and Squares
            const w = Math.floor(Math.random() * (level === 'Easy' ? 10 : 20)) + 2;
            const l = Math.floor(Math.random() * (level === 'Easy' ? 5 : 15)) + 2;
            const mode = Math.random() > 0.5 ? 'Area' : 'Perimeter';
            q = `Rectangle: W=${w}, L=${l}. Find ${mode}.`;
            a = mode === 'Area' ? (w * l).toString() : (2 * (w + l)).toString();
            h = [mode === 'Area' ? "Area = Width × Length" : "Perimeter = Sum of all 4 sides"];
        }
        else {
            // Trigonometry: Basic Sine problems
            const angles = [30, 45, 60];
            const ang = angles[Math.floor(Math.random() * angles.length)];
            const hyp = level === 'Easy' ? 10 : 40;
            const rad = ang * (Math.PI / 180);
            const res = Math.round(hyp * Math.sin(rad));
            q = `Angle=${ang}°, Hypotenuse=${hyp}. Find Opposite side (round).`;
            a = res.toString();
            h = ["Use SOH: Sine = Opposite / Hypotenuse", `sin(${ang}°) ≈ ${(Math.sin(rad)).toFixed(2)}`];
        }
        return { q, a, h };
    };

    const [current, setCurrent] = useState(() => generateProblem(config));
    const [input, setInput] = useState("");
    const [status, setStatus] = useState('idle');
    const [showHint, setShowHint] = useState(false);

    const check = (e) => {
        e.preventDefault();
        if (input.trim() === current.a) {
            setStatus('correct'); onCorrect();
            setTimeout(() => { setCurrent(generateProblem(config)); setInput(""); setShowHint(false); setStatus('idle'); }, 1000);
        } else {
            setStatus('wrong'); setTimeout(() => setStatus('idle'), 800);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-12 rounded-[48px] shadow-2xl border-4 border-indigo-50">
            <button onClick={onBack} className="mb-8 text-slate-400 font-bold hover:text-indigo-600 transition flex items-center gap-2">← Change Topic</button>
            <div className="mb-10">
                <div className="flex gap-2 mb-3">
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{config.topic}</span>
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{config.level}</span>
                </div>
                <h3 className="text-7xl font-black text-slate-900 tracking-tighter leading-tight">{current.q}</h3>
            </div>

            <div className="min-h-[60px] mb-8">
                {showHint && <div className="p-4 bg-amber-50 text-amber-800 rounded-2xl border border-amber-100 font-medium italic">💡 {current.h[0]}</div>}
            </div>

            <form onSubmit={check} className="space-y-4">
                <input autoFocus type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type answer..." className={`w-full p-8 bg-slate-50 border-4 rounded-[32px] text-5xl font-black outline-none transition-all ${status === 'correct' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : status === 'wrong' ? 'border-rose-500 bg-rose-50' : 'border-slate-100 focus:border-indigo-600 focus:bg-white'}`} />
                <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-slate-900 text-white py-7 rounded-[28px] font-black text-2xl hover:bg-black shadow-xl transition-all uppercase tracking-tighter">Check Answer</button>
                    <button type="button" onClick={() => setShowHint(true)} className="px-10 bg-slate-100 text-slate-500 py-7 rounded-[28px] font-black text-xl hover:bg-slate-200 transition-all">Hint</button>
                </div>
            </form>
        </div>
    );
}

function DashboardView({ xp }) {
    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-black mb-12 tracking-tight text-slate-900 italic uppercase">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
                    <p className="text-slate-400 font-black uppercase text-xs tracking-widest mb-2">Academic Rank</p>
                    <p className="text-5xl font-black text-indigo-600 tracking-tighter">SCHOLAR</p>
                </div>
                <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
                    <p className="text-slate-400 font-black uppercase text-xs tracking-widest mb-2">Total Energy</p>
                    <p className="text-5xl font-black text-indigo-600 tracking-tighter">{xp} <span className="text-xl">XP</span></p>
                </div>
            </div>
        </div>
    );
}

function TimerView({ onComplete }) {
    const [time, setTime] = useState(1500);
    const [active, setActive] = useState(false);
    useEffect(() => {
        let t;
        if (active && time > 0) t = setInterval(() => setTime(prev => prev - 1), 1000);
        else if (time === 0) { setActive(false); onComplete(); alert("Session Finished! +100 XP."); }
        return () => clearInterval(t);
    }, [active, time]);
    const format = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    return (
        <div className="flex flex-col items-center justify-center pt-10">
            <div className="text-[14rem] font-black text-slate-900 tracking-tighter mb-12 tabular-nums">{format(time)}</div>
            <div className="flex gap-6">
                <button onClick={() => setActive(!active)} className={`px-24 py-8 rounded-[40px] font-black text-3xl shadow-2xl transition-all ${active ? 'bg-white text-slate-600 border-4 border-slate-100' : 'bg-indigo-600 text-white hover:scale-105'}`}>{active ? 'PAUSE' : 'START FOCUS'}</button>
                <button onClick={() => {setTime(1500); setActive(false);}} className="p-8 bg-white border-4 border-slate-100 rounded-[40px] text-3xl font-bold">🔄</button>
            </div>
        </div>
    );
}

// RENDER
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
}