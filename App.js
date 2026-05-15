const { useState, useEffect, useRef } = React;

// --- DYNAMIC DATA ---
const INITIAL_XP = 1450;
const MATH_PROBLEMS = [
    { id: 1, q: "2x + 5 = 15", a: "5", hints: ["Subtract 5 from both sides.", "2x = 10, so what is x?"], topic: "Algebra" },
    { id: 2, q: "x / 3 = 12", a: "36", hints: ["Multiply both sides by 3.", "x = 12 * 3"], topic: "Equations" },
    { id: 3, q: "5x - 10 = 0", a: "2", hints: ["Add 10 to both sides.", "5x = 10, so what is x?"], topic: "Algebra" }
];

function App() {
    const [view, setView] = useState('dashboard');
    const [xp, setXp] = useState(INITIAL_XP);
    const [stats, setStats] = useState({ sessions: 12, accuracy: 88, streak: 7 });

    const addXp = (amount) => setXp(prev => prev + amount);

    return (
        <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
            {/* Sidebar with Gradient Accent */}
            <aside className="w-72 bg-white border-r border-slate-200 p-8 flex flex-col justify-between sticky top-0 h-screen">
                <div>
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center text-white font-black text-xl">F</div>
                        <h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">FocusFlow</h1>
                    </div>

                    <nav className="space-y-3">
                        <NavBtn active={view === 'dashboard'} onClick={() => setView('dashboard')} label="Overview" icon="📊" />
                        <NavBtn active={view === 'math'} onClick={() => setView('math')} label="AI Tutor" icon="🧠" />
                        <NavBtn active={view === 'timer'} onClick={() => setView('timer')} label="Focus Lab" icon="⏱️" />
                    </nav>
                </div>

                <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <p className="text-[10px] font-black tracking-widest text-indigo-400 uppercase mb-2">Rank: Scholar</p>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-2xl font-bold">{xp}</span>
                        <span className="text-xs text-slate-400">Next: 2000 XP</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-400 to-violet-400 h-full transition-all duration-1000" style={{ width: `${(xp/2000)*100}%` }}></div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-12 max-w-6xl mx-auto w-full">
                {view === 'dashboard' && <Dashboard userStats={stats} xp={xp} />}
                {view === 'math' && <MathAgent onSolve={() => addXp(50)} />}
                {view === 'timer' && <Timer onFinish={() => addXp(100)} />}
            </main>
        </div>
    );
}

// --- UI COMPONENTS ---

function NavBtn({ active, onClick, label, icon }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
            active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-[1.02]' : 'text-slate-500 hover:bg-slate-100 hover:translate-x-1'
        }`}>
            <span className={`text-xl ${active ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>{icon}</span>
            <span className="font-bold tracking-tight">{label}</span>
        </button>
    );
}

function Dashboard({ userStats, xp }) {
    return (
        <div className="animate-in fade-in duration-700">
            <header className="mb-12">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Dashboard</h2>
                <p className="text-slate-500 font-medium">Your learning momentum is looking strong today.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <Card title="Focus Power" value={userStats.sessions + "h"} detail="Top 10% worldwide" icon="⚡" color="indigo" />
                <Card title="Solve Rate" value={userStats.accuracy + "%"} detail="+4% from last week" icon="🎯" color="emerald" />
                <Card title="Current Streak" value={userStats.streak} detail="Days active" icon="🔥" color="orange" />
            </div>

            <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm">
                <h3 className="font-bold text-xl mb-6">Weekly Activity</h3>
                <div className="flex items-end justify-between h-40 gap-4">
                    {[30, 50, 85, 40, 95, 60, 75].map((h, i) => (
                        <div key={i} className="group relative flex-1">
                            <div className="bg-slate-100 w-full rounded-full h-40 absolute bottom-0"></div>
                            <div className="bg-gradient-to-t from-indigo-500 to-violet-400 w-full rounded-full absolute bottom-0 transition-all duration-700 group-hover:brightness-110" style={{ height: `${h}%` }}></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}



function Card({ title, value, detail, icon, color }) {
    const colors = {
        indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
        emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        orange: 'text-orange-600 bg-orange-50 border-orange-100'
    };
    return (
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-6 border ${colors[color]}`}>{icon}</div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">{title}</p>
            <h4 className="text-4xl font-black mb-2 tracking-tight text-slate-900">{value}</h4>
            <p className="text-sm font-medium text-slate-500">{detail}</p>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);