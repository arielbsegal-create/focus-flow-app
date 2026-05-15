const { useState, useEffect, useRef } = React;

// --- MOCK DATA ---
const MOCK_USER = { name: "Alex", totalHours: 12.4, accuracy: 88, streak: 7, xp: 1450, level: 12 };
const MATH_PROBLEM = {
    question: "Solve for x: 3x - 7 = 11",
    hints: ["Add 7 to both sides.", "Divide 18 by 3."],
    solution: "x = 6"
};

function App() {
    const [view, setView] = useState('dashboard');

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between">
                <div>
                    <h1 className="text-xl font-bold text-indigo-600 mb-10">FocusFlow AI</h1>
                    <nav className="space-y-2">
                        <button onClick={() => setView('dashboard')} className={`w-full text-left p-3 rounded-xl ${view === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>📊 Dashboard</button>
                        <button onClick={() => setView('math')} className={`w-full text-left p-3 rounded-xl ${view === 'math' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>🤖 AI Tutor</button>
                        <button onClick={() => setView('timer')} className={`w-full text-left p-3 rounded-xl ${view === 'timer' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>⏱️ Timer</button>
                    </nav>
                </div>
                <div className="bg-indigo-50 p-4 rounded-xl text-xs">
                    <p className="font-bold text-indigo-600">LEVEL {MOCK_USER.level}</p>
                    <div className="w-full bg-slate-200 h-2 rounded-full mt-1"><div className="bg-indigo-600 h-full w-2/3"></div></div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10">
                {view === 'dashboard' && <Dashboard />}
                {view === 'math' && <MathAgent />}
                {view === 'timer' && <Timer />}
            </main>
        </div>
    );
}

function Dashboard() {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Welcome back, {MOCK_USER.name}</h2>
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-slate-400 text-sm">Study Time</p>
                    <p className="text-2xl font-bold">{MOCK_USER.totalHours}h</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-slate-400 text-sm">Accuracy</p>
                    <p className="text-2xl font-bold">{MOCK_USER.accuracy}%</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-slate-400 text-sm">Streak</p>
                    <p className="text-2xl font-bold">{MOCK_USER.streak} Days</p>
                </div>
            </div>
        </div>
    );
}

function MathAgent() {
    const [hintLevel, setHintLevel] = useState(0);
    return (
        <div className="max-w-xl bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold mb-4">{MATH_PROBLEM.question}</h3>
            <div className="space-y-3 mb-6">
                {hintLevel >= 1 && <div className="p-3 bg-amber-50 border-l-4 border-amber-400 text-sm">Hint 1: {MATH_PROBLEM.hints[0]}</div>}
                {hintLevel >= 2 && <div className="p-3 bg-amber-50 border-l-4 border-amber-400 text-sm">Hint 2: {MATH_PROBLEM.hints[1]}</div>}
                {hintLevel >= 3 && <div className="p-3 bg-emerald-50 border-l-4 border-emerald-400 text-sm font-bold text-emerald-700">Solution: {MATH_PROBLEM.solution}</div>}
            </div>
            <button onClick={() => setHintLevel(h => Math.min(h + 1, 3))} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold">
                {hintLevel === 0 ? "Get Hint" : hintLevel === 3 ? "Solved!" : "Next Hint"}
            </button>
        </div>
    );
}

function Timer() {
    const [seconds, setSeconds] = useState(1500);
    const [active, setActive] = useState(false);

    useEffect(() => {
        let timer;
        if (active && seconds > 0) timer = setInterval(() => setSeconds(s => s - 1), 1000);
        return () => clearInterval(timer);
    }, [active, seconds]);

    const format = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    return (
        <div className="text-center pt-10">
            <div className="text-9xl font-mono font-bold text-slate-800 mb-10">{format(seconds)}</div>
            <button onClick={() => setActive(!active)} className="bg-indigo-600 text-white px-12 py-4 rounded-full text-xl font-bold">
                {active ? 'Pause' : 'Start Focus'}
            </button>
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);