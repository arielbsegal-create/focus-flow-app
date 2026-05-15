const { useState, useEffect, useRef } = React;

function App() {
    const [view, setView] = useState('dashboard');
    const [xp, setXp] = useState(1450);
    // Settings for the generator
    const [config, setConfig] = useState({ topic: 'Algebra', level: 'Easy' });
    const [isConfigured, setIsConfigured] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between fixed h-full">
                <div>
                    <h1 className="text-2xl font-black text-indigo-600 mb-10 tracking-tighter italic">FOCUSFLOW AI</h1>
                    <nav className="space-y-2">
                        <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition ${view === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>
                            📊 Dashboard
                        </button>
                        <button onClick={() => {setView('math'); setIsConfigured(false);}} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition ${view === 'math' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>
                            🧠 AI Tutor
                        </button>
                        <button onClick={() => setView('timer')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition ${view === 'timer' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>
                            ⏱️ Timer
                        </button>
                    </nav>
                </div>
                <div className="bg-slate-900 p-5 rounded-[24px] text-white shadow-xl">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Scholar Rank</p>
                    <p className="text-2xl font-black">{xp} <span className="text-sm font-normal text-slate-400">XP</span></p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-12">
                {view === 'dashboard' && <DashboardView xp={xp} />}
                {view === 'math' && (
                    !isConfigured ? (
                        <MathSetup config={config} setConfig={setConfig} onStart={() => setIsConfigured(true)} />
                    ) : (
                        <MathTutorView config={config} onCorrect={() => setXp(prev => prev + 50)} />
                    )
                )}
                {view === 'timer' && <TimerView onComplete={() => setXp(prev => prev + 100)} />}
            </main>
        </div>
    );
}

// --- NEW COMPONENT: SETUP SCREEN ---
function MathSetup({ config, setConfig, onStart }) {
    return (
        <div className="max-w-xl mx-auto bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100">
            <h2 className="text-3xl font-black mb-8 tracking-tight">Configure AI Tutor</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-black text-slate-400 uppercase mb-3">Topic</label>
                    <div className="grid grid-cols-2 gap-3">
                        {['Addition', 'Multiplication', 'Algebra'].map(t => (
                            <button key={t} onClick={() => setConfig({...config, topic: t})} className={`p-4 rounded-2xl font-bold border-2 transition ${config.topic === t ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-500'}`}>{t}</button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-black text-slate-400 uppercase mb-3">Difficulty</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['Easy', 'Medium', 'Hard'].map(l => (
                            <button key={l} onClick={() => setConfig({...config, level: l})} className={`p-4 rounded-2xl font-bold border-2 transition ${config.level === l ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-500'}`}>{l}</button>
                        ))}
                    </div>
                </div>

                <button onClick={onStart} className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all mt-4">GENERATE PROBLEMS</button>
            </div>
        </div>
    );
}

// --- UPDATED TUTOR: PROBLEM GENERATOR ---
function MathTutorView({ config, onCorrect }) {
    const generateProblem = () => {
        let q, a, h;
        const range = config.level === 'Easy' ? 10 : config.level === 'Medium' ? 50 : 100;

        if (config.topic === 'Addition') {
            const n1 = Math.floor(Math.random() * range) + 1;
            const n2 = Math.floor(Math.random() * range) + 1;
            q = `${n1} + ${n2} = ?`;
            a = (n1 + n2).toString();
            h = ["Try adding the ones first.", "Use your fingers if you need to!"];
        } else if (config.topic === 'Multiplication') {
            const n1 = Math.floor(Math.random() * (config.level === 'Easy' ? 10 : 20)) + 1;
            const n2 = Math.floor(Math.random() * 10) + 1;
            q = `${n1} × ${n2} = ?`;
            a = (n1 * n2).toString();
            h = [`Think of it as ${n2} groups of ${n1}.`, "Check your times tables."];
        } else {
            const x = Math.floor(Math.random() * 10) + 1;
            const coeff = Math.floor(Math.random() * 5) + 2;
            const constant = Math.floor(Math.random() * 10) + 1;
            const result = (coeff * x) + constant;
            q = `${coeff}x + ${constant} = ${result}`;
            a = x.toString();
            h = [`Subtract ${constant} from ${result} first.`, `Then divide by ${coeff}.`];
        }
        return { q, a, h };
    };

    const [current, setCurrent] = useState(generateProblem());
    const [input, setInput] = useState("");
    const [hints, setHints] = useState(0);
    const [status, setStatus] = useState('idle');

    const check = (e) => {
        e.preventDefault();
        if (input.trim() === current.a) {
            setStatus('correct');
            onCorrect();
            setTimeout(() => {
                setCurrent(generateProblem());
                setInput("");
                setHints(0);
                setStatus('idle');
            }, 1000);
        } else {
            setStatus('wrong');
            setTimeout(() => setStatus('idle'), 800);
        }
    };

    return (
        <div className="max-w-2xl bg-white p-12 rounded-[40px] shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <p className="text-indigo-600 font-black uppercase text-xs tracking-widest">{config.topic} • {config.level}</p>
                    <h3 className="text-6xl font-black text-slate-900 tracking-tighter mt-2">{current.q}</h3>
                </div>
            </div>

            <div className="min-h-[100px] mb-8">
                {hints >= 1 && <div className="p-4 bg-amber-50 text-amber-800 rounded-2xl border border-amber-200 mb-2 font-medium italic">💡 {current.h[0]}</div>}
                {hints >= 2 && <div className="p-4 bg-indigo-50 text-indigo-800 rounded-2xl border border-indigo-200 font-medium italic">🤔 {current.h[1]}</div>}
            </div>

            <form onSubmit={check} className="space-y-4">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Answer..." className={`w-full p-6 bg-slate-50 border-4 rounded-[24px] text-4xl font-black outline-none transition-all ${status === 'correct' ? 'border-emerald-500 bg-emerald-50' : status === 'wrong' ? 'border-rose-500 bg-rose-50' : 'border-slate-100 focus:border-indigo-600'}`} />
                <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-slate-900 text-white py-6 rounded-2xl font-black text-xl hover:bg-black transition-all shadow-xl">CHECK ANSWER</button>
                    <button type="button" onClick={() => setHints(h => Math.min(h+1, 2))} className="px-10 bg-slate-100 text-slate-600 py-6 rounded-2xl font-black">HINT</button>
                </div>
            </form>
        </div>
    );
}

// --- KEEP DASHBOARD AND TIMER FROM PREVIOUS CODE ---
function DashboardView({ xp }) {
    return (
        <div className="max-w-4xl">
            <h2 className="text-5xl font-black mb-10 tracking-tight text-slate-900">Your Progress</h2>
            <div className="grid grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm">
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Global Rank</p>
                    <p className="text-4xl font-black mt-2 text-indigo-600 italic">SCHOLAR</p>
                </div>
                <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm">
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Total Energy</p>
                    <p className="text-4xl font-black mt-2 text-indigo-600 tracking-tighter">{xp} XP</p>
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
        else if (time === 0) { setActive(false); onComplete(); alert("Focus complete! +100 XP"); }
        return () => clearInterval(t);
    }, [active, time]);
    const format = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    return (
        <div className="flex flex-col items-center justify-center pt-10">
            <div className="text-[14rem] font-black text-slate-900 tracking-tighter leading-none mb-12">{format(time)}</div>
            <div className="flex gap-6">
                <button onClick={() => setActive(!active)} className={`px-20 py-8 rounded-[32px] font-black text-3xl shadow-2xl transition-all ${active ? 'bg-white text-slate-600 border-2 border-slate-200' : 'bg-indigo-600 text-white hover:scale-105'}`}>{active ? 'PAUSE' : 'START FOCUS'}</button>
                <button onClick={() => {setTime(1500); setActive(false);}} className="p-8 bg-white border border-slate-200 rounded-[32px] text-3xl">🔄</button>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);