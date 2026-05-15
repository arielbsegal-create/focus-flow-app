const { useState, useEffect, useRef } = React;

// 1. Move data inside or ensure it's accessible
const PROBLEMS = [
    { q: "2x + 5 = 15", a: "5", hints: ["Subtract 5 from both sides.", "2x = 10, so what is x?"], topic: "Algebra" },
    { q: "x / 3 = 12", a: "36", hints: ["Multiply both sides by 3.", "x = 12 * 3"], topic: "Equations" },
    { q: "10 - x = 4", a: "6", hints: ["What number taken from 10 leaves 4?", "Subtract 10 from both sides."], topic: "Basic Math" }
];

function App() {
    const [view, setView] = useState('dashboard');
    const [xp, setXp] = useState(1450);

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between fixed h-full">
                <div>
                    <h1 className="text-2xl font-black text-indigo-600 mb-10 tracking-tighter">FOCUSFLOW</h1>
                    <nav className="space-y-2">
                        <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition ${view === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>
                            <span>📊</span> Dashboard
                        </button>
                        <button onClick={() => setView('math')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition ${view === 'math' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>
                            <span>🧠</span> AI Tutor
                        </button>
                        <button onClick={() => setView('timer')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition ${view === 'timer' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>
                            <span>⏱️</span> Focus Timer
                        </button>
                    </nav>
                </div>
                <div className="bg-slate-900 p-4 rounded-2xl text-white">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase">XP Progress</p>
                    <p className="text-xl font-black">{xp} XP</p>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-indigo-400 h-full transition-all duration-500" style={{ width: `${(xp % 1000) / 10}%` }}></div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-12">
                {view === 'dashboard' && <DashboardView xp={xp} />}
                {view === 'math' && <MathTutorView onCorrect={() => setXp(prev => prev + 50)} />}
                {view === 'timer' && <TimerView onComplete={() => setXp(prev => prev + 100)} />}
            </main>
        </div>
    );
}

function DashboardView({ xp }) {
    return (
        <div className="max-w-4xl">
            <h2 className="text-4xl font-black mb-8">Welcome Back!</h2>
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <p className="text-slate-400 font-bold uppercase text-xs">Current Ranking</p>
                    <p className="text-3xl font-black mt-2 text-indigo-600">Scholar Level 12</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <p className="text-slate-400 font-bold uppercase text-xs">Total XP</p>
                    <p className="text-3xl font-black mt-2 text-indigo-600">{xp}</p>
                </div>
            </div>
        </div>
    );
}

function MathTutorView({ onCorrect }) {
    const [probIdx, setProbIdx] = useState(0);
    const [input, setInput] = useState("");
    const [hints, setHints] = useState(0);
    const [status, setStatus] = useState('idle'); // idle, correct, wrong

    const current = PROBLEMS[probIdx];

    const handleSubmit = (e) => {
        if(e) e.preventDefault();
        if (input.trim() === current.a) {
            setStatus('correct');
            onCorrect();
            setTimeout(() => {
                setProbIdx((prev) => (prev + 1) % PROBLEMS.length);
                setInput("");
                setHints(0);
                setStatus('idle');
            }, 1500);
        } else {
            setStatus('wrong');
            setTimeout(() => setStatus('idle'), 1000);
        }
    };

    return (
        <div className="max-w-2xl bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100">
            <div className="mb-10">
                <p className="text-indigo-600 font-black uppercase text-xs tracking-widest mb-2">{current.topic}</p>
                <h3 className="text-6xl font-black text-slate-900 tracking-tighter">{current.q}</h3>
            </div>

            <div className="space-y-3 mb-10 min-h-[120px]">
                {hints >= 1 && <div className="p-4 bg-amber-50 text-amber-800 rounded-2xl border border-amber-200 font-medium">💡 {current.hints[0]}</div>}
                {hints >= 2 && <div className="p-4 bg-indigo-50 text-indigo-800 rounded-2xl border border-indigo-200 font-medium">🤔 {current.hints[1]}</div>}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your answer..."
                    className={`w-full p-6 bg-slate-50 border-4 rounded-3xl text-3xl font-black transition-all outline-none ${
                        status === 'correct' ? 'border-emerald-500 bg-emerald-50' :
                        status === 'wrong' ? 'border-rose-500 bg-rose-50' : 'border-slate-100 focus:border-indigo-600'
                    }`}
                />
                <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-black transition-all">SUBMIT ANSWER</button>
                    <button type="button" onClick={() => setHints(prev => Math.min(prev + 1, 2))} className="px-8 bg-slate-100 text-slate-600 py-5 rounded-2xl font-black hover:bg-slate-200 transition-all">HINT</button>
                </div>
            </form>
            {status === 'correct' && <p className="text-center mt-6 text-emerald-600 font-black text-xl animate-bounce">✨ NICE! +50 XP</p>}
        </div>
    );
}

function TimerView({ onComplete }) {
    const [time, setTime] = useState(1500);
    const [active, setActive] = useState(false);

    useEffect(() => {
        let t;
        if (active && time > 0) t = setInterval(() => setTime(prev => prev - 1), 1000);
        else if (time === 0) {
            setActive(false);
            onComplete();
            alert("Session complete! +100 XP");
        }
        return () => clearInterval(t);
    }, [active, time]);

    const format = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    return (
        <div className="flex flex-col items-center justify-center py-10">
            <div className="text-[12rem] font-black text-slate-900 tracking-tighter leading-none mb-10 tabular-nums">
                {format(time)}
            </div>
            <div className="flex gap-4">
                <button onClick={() => setActive(!active)} className={`px-16 py-6 rounded-3xl font-black text-2xl shadow-2xl transition-all ${active ? 'bg-white text-slate-600 border border-slate-200' : 'bg-indigo-600 text-white'}`}>
                    {active ? 'PAUSE' : 'START FOCUS'}
                </button>
                <button onClick={() => {setTime(1500); setActive(false);}} className="p-6 bg-white border border-slate-200 rounded-3xl text-2xl font-bold">🔄</button>
            </div>
        </div>
    );
}

// 4. Connect to the HTML root
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
}