const { useState, useEffect, useRef } = React;

function App() {
    const [view, setView] = useState('dashboard');
    const [xp, setXp] = useState(1450);
    const [config, setConfig] = useState({ topic: 'Algebra', level: 'Easy' });
    const [isConfigured, setIsConfigured] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between fixed h-full">
                <div>
                    <h1 className="text-2xl font-black text-indigo-600 mb-10 tracking-tighter italic">FOCUSFLOW AI</h1>
                    <nav className="space-y-2">
                        <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition ${view === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>📊 Dashboard</button>
                        <button onClick={() => {setView('math'); setIsConfigured(false);}} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition ${view === 'math' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>🧠 AI Tutor</button>
                        <button onClick={() => setView('timer')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition ${view === 'timer' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>⏱️ Timer</button>
                    </nav>
                </div>
                <div className="bg-slate-900 p-5 rounded-[24px] text-white">
                    <p className="text-[10px] font-black text-indigo-400 uppercase text-center mb-1">Scholar XP</p>
                    <p className="text-2xl font-black text-center">{xp}</p>
                </div>
            </aside>

            <main className="flex-1 ml-64 p-12">
                {view === 'dashboard' && <DashboardView xp={xp} />}
                {view === 'math' && (
                    !isConfigured ? (
                        <div className="max-w-xl mx-auto bg-white p-10 rounded-[40px] shadow-2xl border-4 border-indigo-50">
                            <h2 className="text-3xl font-black mb-8">Setup Session</h2>
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-xs font-black text-indigo-400 uppercase mb-4">Subject</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Addition', 'Multiplication', 'Algebra', 'Geometry', 'Trigo'].map(t => (
                                            <button key={t} onClick={() => setConfig({...config, topic: t})} className={`p-4 rounded-2xl font-bold border-4 transition ${config.topic === t ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'}`}>{t}</button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-indigo-400 uppercase mb-4">Difficulty</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Easy', 'Medium', 'Hard'].map(l => (
                                            <button key={l} onClick={() => setConfig({...config, level: l})} className={`p-4 rounded-2xl font-bold border-4 transition ${config.level === l ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'}`}>{l}</button>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => setIsConfigured(true)} className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-indigo-700 shadow-xl transition-all">START TRAINING</button>
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

function MathTutorView({ config, onCorrect, onBack }) {
    const generateProblem = (c) => {
        let q, a, h, draw = null;
        const level = c.level;

        if (c.topic === 'Geometry') {
            const w = Math.floor(Math.random() * (level === 'Easy' ? 8 : 15)) + 3;
            const l = Math.floor(Math.random() * (level === 'Easy' ? 8 : 15)) + 3;
            const mode = Math.random() > 0.5 ? 'Area' : 'Perimeter';
            q = `Find the ${mode} of this rectangle.`;
            a = mode === 'Area' ? (w * l).toString() : (2 * (w + l)).toString();
            h = [mode === 'Area' ? "A = L × W" : "P = 2L + 2W"];
            draw = { type: 'rect', w, l };
        } else if (c.topic === 'Trigo') {
            const angles = [30, 45, 60];
            const ang = angles[Math.floor(Math.random() * angles.length)];
            const hyp = level === 'Easy' ? 10 : 20;
            const rad = ang * (Math.PI / 180);
            const opp = Math.round(hyp * Math.sin(rad));
            q = `Find the side length 'x' (Opposite).`;
            a = opp.toString();
            h = ["SOH: Sin(θ) = Opp / Hyp", `sin(${ang}°) ≈ ${(Math.sin(rad)).toFixed(2)}`];
            draw = { type: 'tri', ang, hyp };
        } else {
            // Standard Algebra/Math logic (simplified for code space)
            const n1 = Math.floor(Math.random() * 20);
            const n2 = Math.floor(Math.random() * 20);
            q = `${n1} + ${n2} = ?`; a = (n1+n2).toString(); h=["Add them!"];
        }
        return { q, a, h, draw };
    };

    const [current, setCurrent] = useState(() => generateProblem(config));
    const [input, setInput] = useState("");
    const [status, setStatus] = useState('idle');

    const check = (e) => {
        if(e) e.preventDefault();
        if (input.trim() === current.a) {
            setStatus('correct'); onCorrect();
            setTimeout(() => { setCurrent(generateProblem(config)); setInput(""); setStatus('idle'); }, 1000);
        } else {
            setStatus('wrong'); setTimeout(() => setStatus('idle'), 800);
        }
    };

    return (
        <div className="max-w-4xl mx-auto flex gap-8 items-start">
            <div className="flex-1 bg-white p-10 rounded-[48px] shadow-2xl border-4 border-indigo-50">
                <button onClick={onBack} className="mb-6 text-slate-400 font-bold hover:text-indigo-600 transition">← Change Level</button>

                <div className="mb-8">
                    <h3 className="text-4xl font-black text-slate-900 mb-6">{current.q}</h3>

                    {/* DRAWING AREA */}
                    {current.draw && (
                        <div className="bg-slate-50 rounded-3xl p-8 mb-8 flex justify-center border-2 border-slate-100">
                            {current.draw.type === 'rect' ? (
                                <svg width="200" height="150" viewBox="0 0 200 150">
                                    <rect x="40" y="30" width="120" height="90" fill="none" stroke="#4f46e5" strokeWidth="4" />
                                    <text x="100" y="20" textAnchor="middle" className="font-bold fill-slate-400">{current.draw.l} (L)</text>
                                    <text x="10" y="80" textAnchor="middle" className="font-bold fill-slate-400" transform="rotate(-90 10,80)">{current.draw.w} (W)</text>
                                </svg>
                            ) : (
                                <svg width="200" height="150" viewBox="0 0 200 150">
                                    <path d="M40,120 L160,120 L160,30 Z" fill="none" stroke="#4f46e5" strokeWidth="4" strokeLinejoin="round" />
                                    <text x="100" y="140" textAnchor="middle" className="font-bold fill-slate-400 italic">x (Opp)</text>
                                    <text x="80" y="65" textAnchor="middle" className="font-bold fill-indigo-600" transform="rotate(-35 80,65)">Hyp: {current.draw.hyp}</text>
                                    <text x="50" y="115" className="text-[10px] font-black fill-slate-400">{current.draw.ang}°</text>
                                </svg>
                            )}
                        </div>
                    )}
                </div>

                <form onSubmit={check} className="space-y-4">
                    <input autoFocus type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type answer..." className={`w-full p-6 bg-slate-50 border-4 rounded-[24px] text-4xl font-black transition-all ${status === 'correct' ? 'border-emerald-500' : status === 'wrong' ? 'border-rose-500' : 'border-slate-100'}`} />
                    <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[24px] font-black text-2xl">CHECK ANSWER</button>
                </form>
            </div>

            {/* TRIG CALCULATOR */}
            {config.topic === 'Trigo' && (
                <div className="w-72 bg-slate-900 p-6 rounded-[32px] shadow-2xl text-white">
                    <p className="text-[10px] font-black text-indigo-400 uppercase mb-4 tracking-widest">Trig Helper</p>
                    <div className="grid grid-cols-1 gap-2">
                        {[30, 45, 60].map(deg => (
                            <div key={deg} className="bg-slate-800 p-3 rounded-xl flex justify-between items-center border border-slate-700">
                                <span className="font-bold text-slate-400">sin({deg}°)</span>
                                <span className="font-black text-indigo-400">{Math.sin(deg * Math.PI / 180).toFixed(3)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 text-[10px] text-slate-500 font-medium">
                        Remember: Opp = Hyp × sin(θ)
                    </div>
                </div>
            )}
        </div>
    );
}

function DashboardView({ xp }) { return <div className="text-5xl font-black italic">DASHBOARD: {xp} XP</div>; }
function TimerView({ onComplete }) { return <div className="text-5xl font-black">TIMER: 25:00</div>; }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);