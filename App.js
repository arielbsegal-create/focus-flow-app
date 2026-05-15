const { useState, useEffect, useRef } = React;

const MathEngine = {
    generate: (topic, level, subTopic) => {
        let q, a, draw = null;
        // Scale numbers based on Difficulty
        const multiplier = level === 'Easy' ? 5 : level === 'Medium' ? 12 : 25;
        const v1 = Math.floor(Math.random() * multiplier) + 5;
        const v2 = Math.floor(Math.random() * multiplier) + 3;

        if (topic === 'Geometry') {
            switch (subTopic) {
                case 'Rhombus':
                    q = `Rhombus: Diagonal 1 = ${v1}, Diagonal 2 = ${v2}. Find the Area.`;
                    a = ((v1 * v2) / 2).toString();
                    draw = { type: 'rhombus', d1: v1, d2: v2 };
                    break;
                case 'Cylinder':
                    const radius = level === 'Hard' ? v1 : 3;
                    q = `Cylinder: Radius = ${radius}, Height = ${v2}. Find Volume (π=3.14, round).`;
                    a = Math.round(3.14 * (radius**2) * v2).toString();
                    draw = { type: 'cylinder', r: radius, h: v2 };
                    break;
                case 'Pyramid':
                    q = `Square Pyramid: Base Side = ${v1}, Height = ${v2}. Find Volume.`;
                    a = Math.round((1/3) * (v1**2) * v2).toString();
                    draw = { type: 'pyramid', s: v1, h: v2 };
                    break;
                case 'Kite':
                    q = `Kite: Diagonal 1 = ${v1}, Diagonal 2 = ${v2}. Find the Area.`;
                    a = ((v1 * v2) / 2).toString();
                    draw = { type: 'kite', d1: v1, d2: v2 };
                    break;
                case 'Congruence':
                    const postulates = ['SSS', 'SAS', 'ASA'];
                    const chosen = postulates[Math.floor(Math.random() * 3)];
                    q = `If two triangles match via ${chosen}, what is the congruence postulate?`;
                    a = chosen;
                    draw = { type: 'congruent' };
                    break;
                default: // Square / Rectangle
                    q = `Rectangle: Side A = ${v1}, Side B = ${v2}. Find the Area.`;
                    a = (v1 * v2).toString();
                    draw = { type: 'rect', l: v1, w: v2 };
            }
        } else if (topic === 'Trigo') {
            const angle = level === 'Easy' ? 30 : Math.floor(Math.random() * 50) + 15;
            const hyp = level === 'Hard' ? v1 * 5 : 20;
            const rad = angle * (Math.PI / 180);
            q = `Find the Opposite side where Hypotenuse = ${hyp} and θ = ${angle}°. (Round to nearest)`;
            a = Math.round(hyp * Math.sin(rad)).toString();
            draw = { type: 'tri', ang: angle, hyp: hyp };
        } else {
            // Simple Algebra/Addition fallback
            q = `Solve: ${v1}x = ${v1 * v2}. What is x?`;
            a = v2.toString();
        }
        return { q, a, draw };
    }
};

function App() {
    const [view, setView] = useState('dashboard');
    const [xp, setXp] = useState(1000);
    const [isStarted, setIsStarted] = useState(false);
    const [config, setConfig] = useState({
        topic: 'Geometry',
        level: 'Medium',
        subTopic: 'Rectangle'
    });

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col fixed h-full z-10">
                <h1 className="text-2xl font-black text-indigo-600 mb-10 italic uppercase tracking-tighter">FocusFlow</h1>
                <nav className="space-y-2 flex-1">
                    <button onClick={() => {setView('dashboard'); setIsStarted(false);}} className={`w-full p-4 rounded-2xl font-bold text-left flex items-center gap-3 transition-all ${view === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>📊 Dashboard</button>
                    <button onClick={() => {setView('math'); setIsStarted(false);}} className={`w-full p-4 rounded-2xl font-bold text-left flex items-center gap-3 transition-all ${view === 'math' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>🧠 AI Tutor</button>
                </nav>
                <div className="bg-slate-900 p-6 rounded-[32px] text-white">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest text-center mb-1">Energy Level</p>
                    <p className="text-2xl font-black text-center">{xp} XP</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-12">
                {view === 'dashboard' ? (
                    <div className="animate-in">
                        <h2 className="text-6xl font-black mb-12 italic text-slate-900">Stats</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white p-10 rounded-[48px] border-4 border-indigo-50 shadow-xl">
                                <p className="text-slate-400 font-black uppercase text-xs mb-2">Total Progress</p>
                                <p className="text-6xl font-black text-indigo-600">{xp}</p>
                            </div>
                        </div>
                    </div>
                ) : !isStarted ? (
                    /* Config Menu */
                    <div className="max-w-2xl mx-auto bg-white p-12 rounded-[56px] shadow-2xl animate-in border-4 border-indigo-50">
                        <h2 className="text-3xl font-black mb-10 italic uppercase tracking-tight">Session Setup</h2>

                        <div className="space-y-8">
                            {/* Difficulty Selector */}
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase mb-4 ml-1">Select Difficulty</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Easy', 'Medium', 'Hard'].map(l => (
                                        <button key={l} onClick={() => setConfig({...config, level: l})} className={`p-4 rounded-2xl font-bold border-2 transition-all ${config.level === l ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'}`}>{l}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Main Topic Selector */}
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase mb-4 ml-1">Select Subject</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Addition', 'Algebra', 'Trigo', 'Geometry'].map(t => (
                                        <button key={t} onClick={() => setConfig({...config, topic: t})} className={`p-4 rounded-2xl font-bold border-2 transition-all ${config.topic === t ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'}`}>{t}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Geometry Sub-Menu (Only visible if Geometry is selected) */}
                            {config.topic === 'Geometry' && (
                                <div className="animate-in">
                                    <p className="text-xs font-black text-slate-400 uppercase mb-4 ml-1 text-indigo-600">Geometry Module</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Rectangle', 'Rhombus', 'Kite', 'Cylinder', 'Pyramid', 'Congruence'].map(s => (
                                            <button key={s} onClick={() => setConfig({...config, subTopic: s})} className={`p-3 rounded-xl font-bold border-2 transition-all ${config.subTopic === s ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'}`}>{s}</button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button onClick={() => setIsStarted(true)} className="w-full bg-indigo-600 text-white py-8 rounded-[40px] font-black text-2xl uppercase shadow-2xl hover:bg-indigo-700 transition-all">Launch Tutor</button>
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
            setTimeout(() => {
                setProb(MathEngine.generate(config.topic, config.level, config.subTopic));
                setInput(""); setStatus("idle");
            }, 800);
        } else {
            setStatus("wrong"); setTimeout(() => setStatus("idle"), 800);
        }
    };

    return (
        <div className="flex gap-10 max-w-6xl mx-auto">
            <div className="flex-1 bg-white p-12 rounded-[56px] shadow-2xl border-4 border-indigo-50 animate-in">
                <button onClick={onBack} className="mb-8 text-slate-300 font-black text-xs uppercase tracking-widest hover:text-indigo-600">← Back to Settings</button>
                <div className="mb-10">
                    <span className="bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block">{config.level} {config.subTopic || config.topic}</span>
                    <h3 className="text-4xl font-black text-slate-900 leading-tight italic">{prob.q}</h3>
                </div>

                {/* 3D SVG RENDERER */}
                <div className="bg-slate-50 p-10 rounded-[40px] border-2 border-slate-100 flex justify-center mb-10 h-72 items-center">
                    <svg width="300" height="220" viewBox="0 0 300 220">
                        <defs>
                            <linearGradient id="sideGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#cbd5e1" />
                                <stop offset="50%" stopColor="#f8fafc" />
                                <stop offset="100%" stopColor="#cbd5e1" />
                            </linearGradient>
                        </defs>

                        {/* CYLINDER 3D */}
                        {prob.draw.type === 'cylinder' && (
                            <g>
                                <ellipse cx="150" cy="160" rx="60" ry="25" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
                                <rect x="90" y="60" width="120" height="100" fill="url(#sideGrad)" />
                                <line x1="90" y1="60" x2="90" y2="160" stroke="#64748b" strokeWidth="2" />
                                <line x1="210" y1="60" x2="210" y2="160" stroke="#64748b" strokeWidth="2" />
                                <ellipse cx="150" cy="60" rx="60" ry="25" fill="#f1f5f9" stroke="#6366f1" strokeWidth="4" />
                            </g>
                        )}

                        {/* PYRAMID 3D */}
                        {prob.draw.type === 'pyramid' && (
                            <g>
                                <path d="M150,30 L80,160 L220,160 Z" fill="#f1f5f9" stroke="#6366f1" strokeWidth="4" />
                                <path d="M150,30 L220,160 L270,120 L150,30" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
                                <line x1="220" y1="160" x2="270" y2="120" stroke="#64748b" strokeWidth="2" strokeDasharray="4" />
                            </g>
                        )}

                        {/* RHOMBUS */}
                        {prob.draw.type === 'rhombus' && (
                            <g>
                                <path d="M150,40 L220,110 L150,180 L80,110 Z" fill="rgba(99,102,241,0.05)" stroke="#6366f1" strokeWidth="5" />
                                <line x1="150" y1="40" x2="150" y2="180" stroke="#6366f1" strokeWidth="2" strokeDasharray="4" />
                                <line x1="80" y1="110" x2="220" y2="110" stroke="#6366f1" strokeWidth="2" strokeDasharray="4" />
                            </g>
                        )}

                        {/* RECTANGLE */}
                        {prob.draw.type === 'rect' && (
                            <rect x="70" y="60" width="160" height="100" fill="rgba(99,102,241,0.05)" stroke="#6366f1" strokeWidth="6" />
                        )}

                        {/* CONGRUENCE */}
                        {prob.draw.type === 'congruent' && (
                            <g>
                                <path d="M40,140 L100,140 L100,60 Z" fill="none" stroke="#6366f1" strokeWidth="4" />
                                <path d="M160,140 L220,140 L220,60 Z" fill="none" stroke="#6366f1" strokeWidth="4" />
                                <text x="130" y="110" className="text-4xl fill-indigo-600 font-black">≅</text>
                            </g>
                        )}
                    </svg>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <input autoFocus type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type solution..." className={`w-full p-8 bg-slate-50 border-4 rounded-[32px] text-5xl font-black outline-none transition-all ${status === 'correct' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : status === 'wrong' ? 'border-rose-500 bg-rose-50' : 'border-slate-100 focus:border-indigo-600'}`} />
                    <button type="submit" className="w-full bg-slate-900 text-white py-8 rounded-[32px] font-black text-2xl uppercase tracking-tight italic hover:bg-black transition-all">Submit Entry</button>
                </form>
            </div>

            <div className="w-80 space-y-8">
                {/* Scratchpad with 2px Pencil */}
                <div className="bg-white p-5 rounded-[40px] shadow-lg border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-3 ml-2">Quick Draft</p>
                    <canvas width="280" height="280" className="bg-slate-50 rounded-3xl border border-slate-100 cursor-crosshair touch-none" />
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);