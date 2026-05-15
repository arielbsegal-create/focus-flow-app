const { useState, useEffect, useRef } = React;

const MathEngine = {
    generate: (topic, level, subTopic) => {
        let q, a, draw = null;
        const scalar = level === 'Easy' ? 5 : level === 'Medium' ? 15 : 40;

        // Geometry Logic
        if (topic === 'Geometry') {
            const v1 = Math.floor(Math.random() * scalar) + 5;
            const v2 = Math.floor(Math.random() * scalar) + 3;

            switch (subTopic) {
                case 'Rhombus':
                    q = `Rhombus: Diagonal 1 = ${v1}, Diagonal 2 = ${v2}. Find Area.`;
                    a = ((v1 * v2) / 2).toString();
                    draw = { type: 'rhombus', d1: v1, d2: v2 };
                    break;
                case 'Cylinder':
                    q = `Cylinder: Radius = 3, Height = ${v1}. Find Volume (π=3.14, round).`;
                    a = Math.round(3.14 * 9 * v1).toString();
                    draw = { type: 'cylinder', r: 3, h: v1 };
                    break;
                case 'Pyramid':
                    q = `Square Pyramid: Base Side = ${v1}, Height = ${v2}. Find Volume.`;
                    a = Math.round((1/3) * (v1**2) * v2).toString();
                    draw = { type: 'pyramid', s: v1, h: v2 };
                    break;
                case 'Congruence':
                    const rules = ['SSS', 'SAS', 'ASA'];
                    const rule = rules[Math.floor(Math.random()*3)];
                    q = `Triangles share parameters matching ${rule}. What is the congruence postulate?`;
                    a = rule;
                    draw = { type: 'congruent', mode: rule };
                    break;
                case 'Kite':
                    q = `Kite: Diagonal 1 = ${v1}, Diagonal 2 = ${v2}. Find Area.`;
                    a = ((v1 * v2) / 2).toString();
                    draw = { type: 'kite', d1: v1, d2: v2 };
                    break;
                default:
                    q = `Rectangle: Side A = ${v1}, Side B = ${v2}. Find Area.`;
                    a = (v1 * v2).toString();
                    draw = { type: 'rect', l: v1, w: v2 };
            }
        } else if (topic === 'Trigo') {
            const ang = level === 'Easy' ? 30 : Math.floor(Math.random() * 60) + 10;
            const rad = ang * (Math.PI / 180);
            q = `Find Opposite side where Hypotenuse = 20 and θ = ${ang}°. (Round to nearest)`;
            a = Math.round(20 * Math.sin(rad)).toString();
            draw = { type: 'tri', ang: ang, hyp: 20 };
        } else {
            q = `${scalar} + ${scalar*2} = ?`;
            a = (scalar * 3).toString();
        }
        return { q, a, draw };
    }
};

// --- Components ---

function App() {
    const [view, setView] = useState('dashboard');
    const [xp, setXp] = useState(1500);
    const [config, setConfig] = useState({ topic: 'Geometry', level: 'Easy', subTopic: 'Rectangle' });
    const [isStarted, setIsStarted] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col fixed h-full">
                <h1 className="text-2xl font-black text-indigo-600 mb-10 italic uppercase">FocusFlow</h1>
                <nav className="space-y-2 flex-1">
                    {['dashboard', 'math'].map(v => (
                        <button key={v} onClick={() => {setView(v); setIsStarted(false);}} className={`w-full p-4 rounded-2xl font-bold text-left transition-all ${view === v ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
                            {v === 'dashboard' ? '📊 Profile' : '🧠 AI Tutor'}
                        </button>
                    ))}
                </nav>
                <div className="bg-slate-900 p-6 rounded-[32px] text-white text-center">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Power</p>
                    <p className="text-2xl font-black">{xp} XP</p>
                </div>
            </aside>

            <main className="flex-1 ml-64 p-12">
                {view === 'dashboard' ? (
                    <div className="animate-in">
                        <h2 className="text-6xl font-black mb-8 italic text-slate-900">Dashboard</h2>
                        <div className="bg-white p-10 rounded-[48px] shadow-xl border-4 border-indigo-50">
                            <p className="text-slate-400 font-bold uppercase text-xs">Current Level</p>
                            <p className="text-6xl font-black text-indigo-600">{Math.floor(xp/1000)} <span className="text-xl text-slate-300">Scholar</span></p>
                        </div>
                    </div>
                ) : !isStarted ? (
                    <div className="max-w-2xl mx-auto bg-white p-12 rounded-[56px] shadow-2xl animate-in border-4 border-indigo-50">
                        <h2 className="text-3xl font-black mb-8 italic uppercase">Session Settings</h2>

                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase mb-3">1. Difficulty</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Easy', 'Medium', 'Hard'].map(l => (
                                        <button key={l} onClick={() => setConfig({...config, level: l})} className={`p-3 rounded-xl font-bold border-2 transition-all ${config.level === l ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'}`}>{l}</button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase mb-3">2. Subject</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Addition', 'Algebra', 'Trigo', 'Geometry'].map(t => (
                                        <button key={t} onClick={() => setConfig({...config, topic: t})} className={`p-3 rounded-xl font-bold border-2 transition-all ${config.topic === t ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'}`}>{t}</button>
                                    ))}
                                </div>
                            </div>

                            {config.topic === 'Geometry' && (
                                <div className="animate-in">
                                    <p className="text-xs font-black text-slate-400 uppercase mb-3">3. Geometry Module</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Rectangle', 'Rhombus', 'Cylinder', 'Pyramid', 'Kite', 'Congruence'].map(s => (
                                            <button key={s} onClick={() => setConfig({...config, subTopic: s})} className={`p-3 rounded-xl font-bold border-2 transition-all ${config.subTopic === s ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'}`}>{s}</button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button onClick={() => setIsStarted(true)} className="w-full bg-indigo-600 text-white py-6 rounded-[32px] font-black text-xl uppercase shadow-xl hover:scale-[1.02] transition-transform">Begin Training</button>
                        </div>
                    </div>
                ) : (
                    <TutorView config={config} onCorrect={() => setXp(p => p + 50)} onBack={() => setIsStarted(false)} />
                )}
            </main>
        </div>
    );
}

function TutorView({ config, onCorrect, onBack }) {
    const [prob, setProb] = useState(() => MathEngine.generate(config.topic, config.level, config.subTopic));
    const [input, setInput] = useState("");
    const [status, setStatus] = useState("idle");

    const submit = (e) => {
        e.preventDefault();
        if (input.trim().toLowerCase() === prob.a.toLowerCase()) {
            setStatus("correct"); onCorrect();
            setTimeout(() => { setProb(MathEngine.generate(config.topic, config.level, config.subTopic)); setInput(""); setStatus("idle"); }, 800);
        } else {
            setStatus("wrong"); setTimeout(() => setStatus("idle"), 800);
        }
    };

    return (
        <div className="flex gap-8 max-w-6xl mx-auto">
            <div className="flex-1 bg-white p-12 rounded-[56px] shadow-2xl border-4 border-indigo-50 animate-in">
                <button onClick={onBack} className="mb-6 text-slate-300 font-black text-xs uppercase tracking-widest">← Settings</button>
                <h3 className="text-3xl font-black text-slate-900 mb-8 italic">{prob.q}</h3>

                <div className="bg-slate-50 p-8 rounded-[40px] border-2 border-slate-100 flex justify-center mb-8 h-64 items-center">
                    <svg width="280" height="200" viewBox="0 0 280 200">
                        {/* 3D CYLINDER WITH SHADING */}
                        {prob.draw.type === 'cylinder' && (
                            <g>
                                <ellipse cx="140" cy="150" rx="50" ry="20" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
                                <rect x="90" y="50" width="100" height="100" fill="linear-gradient(to right, #cbd5e1, #f8fafc)" fill="url(#grad1)" stroke="#64748b" strokeWidth="0" />
                                <line x1="90" y1="50" x2="90" y2="150" stroke="#64748b" strokeWidth="2" />
                                <line x1="190" y1="50" x2="190" y2="150" stroke="#64748b" strokeWidth="2" />
                                <ellipse cx="140" cy="50" rx="50" ry="20" fill="#f1f5f9" stroke="#6366f1" strokeWidth="3" />
                                <defs>
                                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" style={{stopColor:'#cbd5e1', stopOpacity:1}} />
                                        <stop offset="50%" style={{stopColor:'#f8fafc', stopOpacity:1}} />
                                        <stop offset="100%" style={{stopColor:'#cbd5e1', stopOpacity:1}} />
                                    </linearGradient>
                                </defs>
                            </g>
                        )}
                        {/* 3D PYRAMID */}
                        {prob.draw.type === 'pyramid' && (
                            <g>
                                <path d="M140,40 L90,140 L190,140 Z" fill="#f1f5f9" stroke="#6366f1" strokeWidth="3" />
                                <path d="M140,40 L190,140 L230,110 L140,40" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
                                <path d="M190,140 L230,110" stroke="#64748b" strokeWidth="2" strokeDasharray="4" />
                            </g>
                        )}
                        {/* RHOMBUS */}
                        {prob.draw.type === 'rhombus' && (
                            <path d="M140,40 L200,100 L140,160 L80,100 Z" fill="rgba(99,102,241,0.05)" stroke="#6366f1" strokeWidth="4" />
                        )}
                        {/* RECTANGLE */}
                        {prob.draw.type === 'rect' && (
                            <rect x="70" y="50" width="140" height="90" fill="rgba(99,102,241,0.05)" stroke="#6366f1" strokeWidth="4" />
                        )}
                    </svg>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <input autoFocus type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Answer..." className={`w-full p-6 bg-slate-50 border-4 rounded-[24px] text-4xl font-black outline-none transition-all ${status === 'correct' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : status === 'wrong' ? 'border-rose-500 bg-rose-50' : 'border-slate-100 focus:border-indigo-600'}`} />
                    <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[24px] font-black text-xl uppercase italic hover:bg-black transition-all">Check Answer</button>
                </form>
            </div>

            <div className="w-80 space-y-6">
                <div className="bg-white p-4 rounded-[32px] shadow-lg border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-2">Scratchpad</p>
                    <canvas width="280" height="240" className="bg-slate-50 rounded-2xl border border-slate-100 cursor-crosshair" />
                </div>
                {config.topic === 'Trigo' && <TrigTool />}
            </div>
        </div>
    );
}

function TrigTool() {
    return (
        <div className="bg-slate-900 p-6 rounded-[32px] text-white shadow-2xl animate-in">
            <p className="text-[10px] font-black text-indigo-400 uppercase mb-4 text-center">Reference</p>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold italic">
                <div className="p-2 bg-white/5 rounded-lg">sin 30°: 0.5</div>
                <div className="p-2 bg-white/5 rounded-lg">cos 30°: 0.866</div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);