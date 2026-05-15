const { useState, useRef, useEffect } = React;

const MathEngine = {
    generate: (topic, level, subTopic) => {
        let q, a, draw = null;
        // Scale complexity based on difficulty
        const scalar = level === 'Easy' ? 10 : level === 'Medium' ? 30 : 75;
        const v1 = Math.floor(Math.random() * scalar) + 5;
        const v2 = Math.floor(Math.random() * (scalar / 2)) + 4;

        if (topic === 'Algebra') {
            const mode = level === 'Easy' ? 'basic' : level === 'Medium' ? 'linear' : 'fraction';
            if (mode === 'basic') {
                q = `Solve for x: x + ${v1} = ${v1 + v2}`;
                a = v2.toString();
            } else if (mode === 'linear') {
                // Form: ax + b = c
                q = `Solve for x: 2x + ${v1} = ${2 * v2 + v1}`;
                a = v2.toString();
            } else {
                // Form: (x/a) - b = c
                q = `Solve for x: (x / 4) - ${v1} = ${v2}`;
                a = ((v2 + v1) * 4).toString();
            }
        }
        else if (topic === 'Geometry') {
            switch (subTopic) {
                case 'Cylinder':
                    q = `Cylinder: Radius = 3, Height = ${v1}. Find Volume (π=3.14, round).`;
                    a = Math.round(3.14 * 9 * v1).toString();
                    draw = { type: 'cylinder', r: 3, h: v1 };
                    break;
                case 'Pyramid':
                    q = `Square Pyramid: Base Side = ${v1}, Vertical Height = ${v2}. Find Volume.`;
                    a = Math.round((1 / 3) * (v1 ** 2) * v2).toString();
                    draw = { type: 'pyramid', s: v1, h: v2 };
                    break;
                case 'Rhombus':
                    q = `Rhombus: Diagonal 1 = ${v1}, Diagonal 2 = ${v2}. Find the Area.`;
                    a = ((v1 * v2) / 2).toString();
                    draw = { type: 'rhombus', d1: v1, d2: v2 };
                    break;
                case 'Kite':
                    q = `Kite: Diagonal 1 = ${v1}, Diagonal 2 = ${v2}. Find the Area.`;
                    a = ((v1 * v2) / 2).toString();
                    draw = { type: 'kite', d1: v1, d2: v2 };
                    break;
                case 'Parallelogram':
                    q = `Parallelogram: Base = ${v1}, Height = ${v2}. Find the Area.`;
                    a = (v1 * v2).toString();
                    draw = { type: 'para', b: v1, h: v2 };
                    break;
                case 'Iso-Trapezoid':
                    q = `Isosceles Trapezoid: Base1=${v1}, Base2=${v1+10}, Leg=${v2}. Find Perimeter.`;
                    a = (v1 + (v1 + 10) + (v2 * 2)).toString();
                    draw = { type: 'isoTrap', b1: v1, b2: v1+10, leg: v2 };
                    break;
                case 'Congruence':
                    const rules = ['SSS', 'SAS', 'ASA'];
                    const pick = rules[Math.floor(Math.random() * 3)];
                    q = `Two triangles match by ${pick}. What is the congruence postulate?`;
                    a = pick;
                    draw = { type: 'congruent' };
                    break;
                default:
                    q = `Rectangle: Length = ${v1}, Width = ${v2}. Find Area.`;
                    a = (v1 * v2).toString();
                    draw = { type: 'rect', l: v1, w: v2 };
            }
        } else if (topic === 'Trigo') {
            const ang = level === 'Easy' ? 30 : 45;
            const hyp = v1 * 2;
            const rad = ang * (Math.PI / 180);
            q = `Find Opposite side where Hypotenuse = ${hyp} and Angle = ${ang}°. (Round nearest)`;
            a = Math.round(hyp * Math.sin(rad)).toString();
            draw = { type: 'tri', ang, hyp };
        } else {
            q = `${v1} + ${v2} = ?`;
            a = (v1 + v2).toString();
        }
        return { q, a, draw };
    }
};

function App() {
    const [view, setView] = useState('math');
    const [xp, setXp] = useState(1500);
    const [isStarted, setIsStarted] = useState(false);
    const [config, setConfig] = useState({ topic: 'Geometry', level: 'Medium', subTopic: 'Cylinder' });

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-900 p-8 flex flex-col fixed h-full shadow-2xl z-20">
                <h1 className="text-3xl font-black text-white italic tracking-tighter mb-12 uppercase">Focus<span className="text-indigo-500">Flow</span></h1>
                <nav className="space-y-3 flex-1">
                    <button onClick={() => {setView('dashboard'); setIsStarted(false);}} className={`w-full p-4 rounded-2xl font-bold text-left transition-all ${view === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>📊 Stats</button>
                    <button onClick={() => {setView('math'); setIsStarted(false);}} className={`w-full p-4 rounded-2xl font-bold text-left transition-all ${view === 'math' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>🧠 AI Tutor</button>
                </nav>
                <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 text-center">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Scholar Rank</p>
                    <p className="text-3xl font-black text-white">{xp} XP</p>
                </div>
            </aside>

            {/* Main Workspace */}
            <main className="flex-1 ml-72 p-16">
                {!isStarted ? (
                    <div className="max-w-3xl mx-auto bg-white rounded-[60px] p-16 shadow-xl border border-slate-200">
                        <h2 className="text-4xl font-black mb-10 italic uppercase tracking-tight text-slate-800">Session Config</h2>

                        <div className="space-y-10">
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase mb-4 ml-1">Difficulty</p>
                                <div className="grid grid-cols-3 gap-4">
                                    {['Easy', 'Medium', 'Hard'].map(l => (
                                        <button key={l} onClick={() => setConfig({...config, level: l})} className={`py-4 rounded-2xl font-bold border-2 transition-all ${config.level === l ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}>{l}</button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase mb-4 ml-1">Core Subject</p>
                                <div className="grid grid-cols-3 gap-4">
                                    {['Algebra', 'Trigo', 'Geometry'].map(t => (
                                        <button key={t} onClick={() => setConfig({...config, topic: t})} className={`py-4 rounded-2xl font-bold border-2 transition-all ${config.topic === t ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}>{t}</button>
                                    ))}
                                </div>
                            </div>

                            {config.topic === 'Geometry' && (
                                <div className="p-8 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                                    <p className="text-xs font-black text-indigo-600 uppercase mb-4 tracking-widest">Geometry Expansion Modules</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Rectangle', 'Rhombus', 'Kite', 'Parallelogram', 'Iso-Trapezoid', 'Cylinder', 'Pyramid', 'Congruence'].map(s => (
                                            <button key={s} onClick={() => setConfig({...config, subTopic: s})} className={`py-3 rounded-xl text-[11px] font-bold border-2 transition-all ${config.subTopic === s ? 'border-indigo-600 bg-white text-indigo-600 shadow-md scale-105' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>{s}</button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button onClick={() => setIsStarted(true)} className="w-full bg-indigo-600 text-white py-10 rounded-[40px] font-black text-2xl uppercase tracking-tighter shadow-2xl hover:bg-indigo-700 transition-all active:scale-95">Launch Engine</button>
                        </div>
                    </div>
                ) : (
                    <TutorInterface config={config} onCorrect={() => setXp(p => p + 50)} onBack={() => setIsStarted(false)} />
                )}
            </main>
        </div>
    );
}

function TutorInterface({ config, onCorrect, onBack }) {
    const [prob, setProb] = useState(() => MathEngine.generate(config.topic, config.level, config.subTopic));
    const [input, setInput] = useState("");
    const [status, setStatus] = useState("idle");

    const submit = (e) => {
        e.preventDefault();
        if (input.trim().toLowerCase() === prob.a.toLowerCase()) {
            setStatus("correct"); onCorrect();
            setTimeout(() => { setProb(MathEngine.generate(config.topic, config.level, config.subTopic)); setInput(""); setStatus("idle"); }, 600);
        } else {
            setStatus("wrong"); setTimeout(() => setStatus("idle"), 800);
        }
    };

    return (
        <div className="flex gap-12 max-w-7xl mx-auto">
            <div className="flex-1 bg-white rounded-[60px] p-16 shadow-2xl border-4 border-indigo-50 relative">
                <button onClick={onBack} className="text-slate-300 font-black text-xs uppercase tracking-[0.2em] hover:text-indigo-600 transition-colors mb-10 block">← Reset Parameters</button>

                <div className="mb-12">
                    <h3 className="text-5xl font-black text-slate-900 leading-tight italic tracking-tighter">{prob.q}</h3>
                </div>

                {/* 3D Isometric SVG Engine */}
                <div className="bg-slate-50 rounded-[40px] border-2 border-slate-100 flex justify-center items-center h-[350px] mb-12 shadow-inner">
                    <svg width="400" height="280" viewBox="0 0 400 280">
                        <defs>
                            <linearGradient id="shading" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#94a3b8" />
                                <stop offset="50%" stopColor="#f8fafc" />
                                <stop offset="100%" stopColor="#94a3b8" />
                            </linearGradient>
                        </defs>

                        {prob.draw?.type === 'cylinder' && (
                            <g>
                                <ellipse cx="200" cy="200" rx="70" ry="25" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
                                <rect x="130" y="70" width="140" height="130" fill="url(#shading)" />
                                <line x1="130" y1="70" x2="130" y2="200" stroke="#475569" strokeWidth="2" />
                                <line x1="270" y1="70" x2="270" y2="200" stroke="#475569" strokeWidth="2" />
                                <ellipse cx="200" cy="70" rx="70" ry="25" fill="#f8fafc" stroke="#6366f1" strokeWidth="4" />
                            </g>
                        )}

                        {prob.draw?.type === 'pyramid' && (
                            <g>
                                <path d="M200,40 L110,210 L290,210 Z" fill="#f8fafc" stroke="#6366f1" strokeWidth="4" />
                                <path d="M200,40 L290,210 L350,150 L200,40" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
                                <line x1="290" y1="210" x2="350" y2="150" stroke="#475569" strokeWidth="2" strokeDasharray="6" />
                            </g>
                        )}

                        {prob.draw?.type === 'para' && (
                            <path d="M100,180 L250,180 L300,80 L150,80 Z" fill="rgba(99,102,241,0.05)" stroke="#6366f1" strokeWidth="6" />
                        )}

                        {prob.draw?.type === 'isoTrap' && (
                            <path d="M100,180 L300,180 L260,80 L140,80 Z" fill="rgba(99,102,241,0.05)" stroke="#6366f1" strokeWidth="6" />
                        )}

                        {prob.draw?.type === 'rhombus' && (
                            <g>
                                <path d="M200,50 L300,140 L200,230 L100,140 Z" fill="rgba(99,102,241,0.05)" stroke="#6366f1" strokeWidth="5" />
                                <line x1="200" y1="50" x2="200" y2="230" stroke="#6366f1" strokeWidth="2" strokeDasharray="5" />
                                <line x1="100" y1="140" x2="300" y2="140" stroke="#6366f1" strokeWidth="2" strokeDasharray="5" />
                            </g>
                        )}

                        {prob.draw?.type === 'rect' && (
                            <rect x="100" y="80" width="200" height="120" fill="rgba(99,102,241,0.05)" stroke="#6366f1" strokeWidth="6" />
                        )}

                        {prob.draw?.type === 'tri' && (
                            <g>
                                <path d="M100,200 L300,200 L300,50 Z" fill="none" stroke="#6366f1" strokeWidth="6" />
                                <text x="130" y="190" className="text-2xl font-black fill-indigo-600">{prob.draw.ang}°</text>
                            </g>
                        )}

                        {prob.draw?.type === 'congruent' && (
                            <g>
                                <path d="M50,180 L120,180 L120,80 Z" fill="none" stroke="#6366f1" strokeWidth="4" />
                                <path d="M220,180 L290,180 L290,80 Z" fill="none" stroke="#6366f1" strokeWidth="4" />
                                <text x="170" y="140" className="text-6xl font-black fill-indigo-600" textAnchor="middle">≅</text>
                            </g>
                        )}
                    </svg>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <input autoFocus type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type result..." className={`w-full p-10 bg-slate-50 border-4 rounded-[40px] text-6xl font-black outline-none transition-all ${status === 'correct' ? 'border-emerald-500 bg-emerald-50 text-emerald-600 shadow-[0_0_40px_rgba(16,185,129,0.2)]' : status === 'wrong' ? 'border-rose-500 bg-rose-50 animate-shake' : 'border-slate-100 focus:border-indigo-600'}`} />
                    <button type="submit" className="w-full bg-slate-900 text-white py-10 rounded-[40px] font-black text-3xl uppercase tracking-tighter hover:bg-black transition-all shadow-xl">Process Answer</button>
                </form>
            </div>

            {/* Precision Scratchpad (2px Pencil) */}
            <div className="w-96 space-y-8">
                <div className="bg-white p-8 rounded-[48px] shadow-lg border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scratchpad</p>
                        <button onClick={() => { const canvas = document.getElementById('pad'); canvas.getContext('2d').clearRect(0,0,500,500); }} className="text-rose-500 text-[10px] font-black uppercase">Clear</button>
                    </div>
                    <ScratchpadCanvas />
                </div>
            </div>
        </div>
    );
}

function ScratchpadCanvas() {
    const canvasRef = useRef(null);
    const [active, setActive] = useState(false);

    const getPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const start = (e) => {
        const ctx = canvasRef.current.getContext('2d');
        const {x, y} = getPos(e);
        ctx.beginPath(); ctx.moveTo(x, y); setActive(true);
    };

    const draw = (e) => {
        if (!active) return;
        const ctx = canvasRef.current.getContext('2d');
        const {x, y} = getPos(e);
        ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 2; // Precise 2px line
        ctx.lineCap = 'round'; ctx.lineTo(x, y); ctx.stroke();
    };

    return (
        <canvas id="pad" ref={canvasRef} width="320" height="320" onMouseDown={start} onMouseMove={draw} onMouseUp={() => setActive(false)} onMouseLeave={() => setActive(false)} className="bg-slate-50 rounded-[32px] cursor-crosshair border border-slate-100 touch-none" />
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);