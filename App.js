const { useState, useRef, useEffect } = React;

const MathEngine = {
    generate: (topic, level, subTopic) => {
        let q, a, draw = null;
        // Difficulty Scaling Logic
        const range = level === 'Easy' ? 10 : level === 'Medium' ? 25 : 60;
        const v1 = Math.floor(Math.random() * range) + 5;
        const v2 = Math.floor(Math.random() * (range/2)) + 3;

        if (topic === 'Geometry') {
            switch (subTopic) {
                case 'Cylinder':
                    const r = level === 'Hard' ? v1 : 4;
                    const h = v2;
                    q = `Cylinder: Radius = ${r}, Height = ${h}. Find Volume (π=3.14, round to nearest).`;
                    a = Math.round(3.14 * (r**2) * h).toString();
                    draw = { type: 'cylinder', r, h };
                    break;
                case 'Pyramid':
                    q = `Square Pyramid: Base edge = ${v1}, Height = ${v2}. Find Volume (round to nearest).`;
                    a = Math.round((1/3) * (v1**2) * v2).toString();
                    draw = { type: 'pyramid', s: v1, h: v2 };
                    break;
                case 'Rhombus':
                    q = `Rhombus: Diagonal 1 = ${v1}, Diagonal 2 = ${v2}. Find Area.`;
                    a = ((v1 * v2) / 2).toString();
                    draw = { type: 'rhombus', d1: v1, d2: v2 };
                    break;
                case 'Kite':
                    q = `Kite: Diagonal 1 = ${v1}, Diagonal 2 = ${v2}. Find Area.`;
                    a = ((v1 * v2) / 2).toString();
                    draw = { type: 'kite', d1: v1, d2: v2 };
                    break;
                case 'Congruence':
                    const rules = ['SSS', 'SAS', 'ASA'];
                    const rule = rules[Math.floor(Math.random() * 3)];
                    q = `Two triangles match via the ${rule} rule. Name the congruence postulate.`;
                    a = rule;
                    draw = { type: 'congruent' };
                    break;
                default: // Rectangle
                    q = `Rectangle: Length = ${v1}, Width = ${v2}. Find Perimeter.`;
                    a = (2 * (v1 + v2)).toString();
                    draw = { type: 'rect', l: v1, w: v2 };
            }
        } else if (topic === 'Trigo') {
            const angle = level === 'Easy' ? 30 : Math.floor(Math.random() * 45) + 15;
            const hyp = level === 'Hard' ? v1 * 4 : 20;
            const rad = angle * (Math.PI / 180);
            q = `Find the Opposite side where Hypotenuse = ${hyp} and θ = ${angle}°. (Round nearest)`;
            a = Math.round(hyp * Math.sin(rad)).toString();
            draw = { type: 'tri', ang: angle, h: hyp };
        } else {
            q = `${v1} + ${v2} = ?`;
            a = (v1 + v2).toString();
        }
        return { q, a, draw };
    }
};

function App() {
    const [xp, setXp] = useState(1250);
    const [view, setView] = useState('math');
    const [isStarted, setIsStarted] = useState(false);
    const [config, setConfig] = useState({ topic: 'Geometry', level: 'Easy', subTopic: 'Rectangle' });

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-900 p-8 flex flex-col fixed h-full shadow-2xl">
                <h1 className="text-3xl font-black text-white italic tracking-tighter mb-12">FOCUS<span className="text-indigo-500">FLOW</span></h1>
                <nav className="space-y-3 flex-1">
                    {['dashboard', 'math'].map(v => (
                        <button key={v} onClick={() => {setView(v); setIsStarted(false);}} className={`w-full p-4 rounded-2xl font-bold text-left transition-all ${view === v ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                            {v === 'dashboard' ? '📊 Your Progress' : '🧠 AI Math Tutor'}
                        </button>
                    ))}
                </nav>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Rank: Scholar</p>
                    <p className="text-3xl font-black text-white">{xp} XP</p>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 ml-72 p-16">
                {!isStarted ? (
                    <div className="max-w-3xl mx-auto bg-white rounded-[60px] p-16 shadow-xl border border-slate-200 animate-pop">
                        <h2 className="text-4xl font-black mb-10 italic uppercase tracking-tight">Session Settings</h2>

                        <div className="space-y-10">
                            {/* Difficulty Selector */}
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase mb-4 ml-1">Select Difficulty</p>
                                <div className="grid grid-cols-3 gap-4">
                                    {['Easy', 'Medium', 'Hard'].map(l => (
                                        <button key={l} onClick={() => setConfig({...config, level: l})} className={`py-4 rounded-2xl font-bold border-2 transition-all ${config.level === l ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}>{l}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Topic Selector */}
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase mb-4 ml-1">Select Subject</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {['Addition', 'Trigo', 'Geometry'].map(t => (
                                        <button key={t} onClick={() => setConfig({...config, topic: t})} className={`py-4 rounded-2xl font-bold border-2 transition-all ${config.topic === t ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}>{t}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Geometry Sub-Menu */}
                            {config.topic === 'Geometry' && (
                                <div className="animate-pop p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                    <p className="text-xs font-black text-indigo-600 uppercase mb-4">Geometry Modules</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Rectangle', 'Rhombus', 'Kite', 'Cylinder', 'Pyramid', 'Congruence'].map(s => (
                                            <button key={s} onClick={() => setConfig({...config, subTopic: s})} className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${config.subTopic === s ? 'border-indigo-600 bg-white text-indigo-600 shadow-md' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>{s}</button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button onClick={() => setIsStarted(true)} className="w-full bg-indigo-600 text-white py-8 rounded-[40px] font-black text-2xl uppercase tracking-tighter shadow-2xl hover:bg-indigo-700 transition-all hover:scale-[1.01] active:scale-95">Start Session</button>
                        </div>
                    </div>
                ) : (
                    <TutorSession config={config} onCorrect={() => setXp(p => p + 50)} onBack={() => setIsStarted(false)} />
                )}
            </main>
        </div>
    );
}

function TutorSession({ config, onCorrect, onBack }) {
    const [prob, setProb] = useState(() => MathEngine.generate(config.topic, config.level, config.subTopic));
    const [input, setInput] = useState("");
    const [status, setStatus] = useState("idle");

    const handleCheck = (e) => {
        e.preventDefault();
        if (input.trim().toLowerCase() === prob.a.toLowerCase()) {
            setStatus("correct"); onCorrect();
            setTimeout(() => {
                setProb(MathEngine.generate(config.topic, config.level, config.subTopic));
                setInput(""); setStatus("idle");
            }, 700);
        } else {
            setStatus("wrong"); setTimeout(() => setStatus("idle"), 800);
        }
    };

    return (
        <div className="flex gap-12 max-w-7xl mx-auto animate-pop">
            <div className="flex-1 bg-white rounded-[60px] p-16 shadow-2xl border-4 border-indigo-50 relative overflow-hidden">
                <button onClick={onBack} className="text-slate-300 font-black text-xs uppercase tracking-widest hover:text-indigo-600 transition-colors">← Back to Settings</button>

                <div className="mt-10 mb-12">
                    <span className="text-xs font-black text-indigo-500 uppercase tracking-[0.3em]">{config.level} Level</span>
                    <h3 className="text-5xl font-black text-slate-900 mt-2 leading-tight italic">{prob.q}</h3>
                </div>

                {/* 3D Visuals Area */}
                <div className="bg-slate-50 rounded-[40px] border-2 border-slate-100 flex justify-center items-center h-[320px] mb-12">
                    <svg width="350" height="250" viewBox="0 0 350 250">
                        <defs>
                            <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#94a3b8" />
                                <stop offset="50%" stopColor="#f1f5f9" />
                                <stop offset="100%" stopColor="#94a3b8" />
                            </linearGradient>
                        </defs>

                        {prob.draw.type === 'cylinder' && (
                            <g>
                                <ellipse cx="175" cy="180" rx="70" ry="25" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
                                <rect x="105" y="60" width="140" height="120" fill="url(#metal)" />
                                <line x1="105" y1="60" x2="105" y2="180" stroke="#475569" strokeWidth="2" />
                                <line x1="245" y1="60" x2="245" y2="180" stroke="#475569" strokeWidth="2" />
                                <ellipse cx="175" cy="60" rx="70" ry="25" fill="#f8fafc" stroke="#6366f1" strokeWidth="4" />
                            </g>
                        )}

                        {prob.draw.type === 'pyramid' && (
                            <g>
                                <path d="M175,40 L90,180 L260,180 Z" fill="#f8fafc" stroke="#6366f1" strokeWidth="4" />
                                <path d="M175,40 L260,180 L320,130 L175,40" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
                                <line x1="260" y1="180" x2="320" y2="130" stroke="#475569" strokeWidth="2" strokeDasharray="5" />
                            </g>
                        )}

                        {prob.draw.type === 'rhombus' && (
                            <g>
                                <path d="M175,40 L260,125 L175,210 L90,125 Z" fill="rgba(99,102,241,0.05)" stroke="#6366f1" strokeWidth="6" />
                                <line x1="175" y1="40" x2="175" y2="210" stroke="#6366f1" strokeWidth="2" strokeDasharray="6" />
                                <line x1="90" y1="125" x2="260" y2="125" stroke="#6366f1" strokeWidth="2" strokeDasharray="6" />
                            </g>
                        )}

                        {prob.draw.type === 'rect' && (
                            <rect x="75" y="75" width="200" height="100" fill="rgba(99,102,241,0.05)" stroke="#6366f1" strokeWidth="6" rx="4" />
                        )}

                        {prob.draw.type === 'tri' && (
                            <g>
                                <path d="M80,180 L240,180 L240,60 Z" fill="none" stroke="#6366f1" strokeWidth="6" strokeLinejoin="round" />
                                <text x="100" y="170" className="text-2xl font-bold fill-indigo-600">{prob.draw.ang}°</text>
                            </g>
                        )}

                        {prob.draw.type === 'congruent' && (
                            <g>
                                <path d="M60,160 L120,160 L120,80 Z" fill="none" stroke="#6366f1" strokeWidth="4" />
                                <path d="M200,160 L260,160 L260,80 Z" fill="none" stroke="#6366f1" strokeWidth="4" />
                                <text x="160" y="130" className="text-6xl font-black fill-indigo-600" textAnchor="middle">≅</text>
                            </g>
                        )}
                    </svg>
                </div>

                <form onSubmit={handleCheck} className="space-y-6">
                    <input autoFocus type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type the numeric result..." className={`w-full p-10 bg-slate-50 border-4 rounded-[40px] text-6xl font-black outline-none transition-all ${status === 'correct' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : status === 'wrong' ? 'border-rose-500 bg-rose-50' : 'border-slate-100 focus:border-indigo-600'}`} />
                    <button type="submit" className="w-full bg-slate-900 text-white py-10 rounded-[40px] font-black text-3xl uppercase tracking-tighter hover:bg-black transition-all">Check Solution</button>
                </form>
            </div>

            {/* Sidebar Tools */}
            <div className="w-96 space-y-8">
                <Scratchpad />
                {config.topic === 'Trigo' && <TrigTool />}
            </div>
        </div>
    );
}

function Scratchpad() {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);

    const getPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const start = (e) => {
        const ctx = canvasRef.current.getContext('2d');
        const {x, y} = getPos(e);
        ctx.beginPath(); ctx.moveTo(x, y); setDrawing(true);
    };

    const draw = (e) => {
        if (!drawing) return;
        const ctx = canvasRef.current.getContext('2d');
        const {x, y} = getPos(e);
        ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 2; // THIN PENCIL
        ctx.lineCap = 'round'; ctx.lineTo(x, y); ctx.stroke();
    };

    return (
        <div className="bg-white p-8 rounded-[48px] shadow-lg border border-slate-200">
            <div className="flex justify-between items-center mb-4 px-2">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Scratchpad</p>
                <button onClick={() => canvasRef.current.getContext('2d').clearRect(0,0,500,500)} className="text-rose-500 text-xs font-bold uppercase">Clear</button>
            </div>
            <canvas ref={canvasRef} width="320" height="320" onMouseDown={start} onMouseMove={draw} onMouseUp={() => setDrawing(false)} onMouseLeave={() => setDrawing(false)} className="bg-slate-50 rounded-3xl cursor-crosshair border border-slate-100" />
        </div>
    );
}

function TrigTool() {
    return (
        <div className="bg-slate-900 p-8 rounded-[48px] text-white shadow-xl">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 text-center italic">Advanced Trigonometry Engine</p>
            <div className="space-y-4">
                <div className="flex justify-between text-sm"><span className="text-slate-500 italic">sin 30°</span><span className="font-black">0.5</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500 italic">cos 45°</span><span className="font-black">0.707</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500 italic">tan 60°</span><span className="font-black">1.732</span></div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);