const { useState, useRef, useEffect } = React;

/** * CORE MATH ENGINE:
 * Includes Algebra (Easy/Medium/Hard) and
 * Massive Geometry Expansion (8 distinct modules)
 */
const MathEngine = {
    generate: (topic, level, subTopic) => {
        let q, a, draw = null;
        // Difficulty scalar for range and complexity
        const scalar = level === 'Easy' ? 10 : level === 'Medium' ? 40 : 120;
        const v1 = Math.floor(Math.random() * scalar) + 5;
        const v2 = Math.floor(Math.random() * (scalar / 2)) + 3;

        // --- ALGEBRA ENGINE ---
        if (topic === 'Algebra') {
            if (level === 'Easy') {
                q = `Solve for x: x + ${v1} = ${v1 + v2}`;
                a = v2.toString();
            } else if (level === 'Medium') {
                // Form: ax + b = c
                q = `Solve for x: 3x + ${v1} = ${(3 * v2) + v1}`;
                a = v2.toString();
            } else {
                // Form: (x/a) - b = c
                q = `Solve for x: (x / 2) - ${v1} = ${v2}`;
                a = ((v2 + v1) * 2).toString();
            }
        }
        // --- GEOMETRY EXPANSION ---
        else if (topic === 'Geometry') {
            switch (subTopic) {
                case 'Cylinder':
                    q = `Cylinder: r = 3, h = ${v1}. Find Volume (π=3.14, round).`;
                    a = Math.round(3.14 * 9 * v1).toString();
                    draw = { type: 'cylinder', r: 3, h: v1 };
                    break;
                case 'Pyramid':
                    q = `Square Pyramid: Base Side = ${v1}, Height = ${v2}. Find Volume.`;
                    a = Math.round((1/3) * (v1**2) * v2).toString();
                    draw = { type: 'pyramid', s: v1, h: v2 };
                    break;
                case 'Parallelogram':
                    q = `Parallelogram: Base = ${v1}, Height = ${v2}. Find Area.`;
                    a = (v1 * v2).toString();
                    draw = { type: 'para', b: v1, h: v2 };
                    break;
                case 'Iso-Trapezoid':
                    q = `Isosceles Trapezoid: Base1=${v1}, Base2=${v1+10}, Leg=${v2}. Find Perimeter.`;
                    a = (v1 + (v1 + 10) + (v2 * 2)).toString();
                    draw = { type: 'isoTrap' };
                    break;
                case 'Rhombus':
                    q = `Rhombus: Diagonal 1 = ${v1}, Diagonal 2 = ${v2}. Find Area.`;
                    a = ((v1 * v2) / 2).toString();
                    draw = { type: 'rhombus' };
                    break;
                case 'Kite':
                    q = `Kite: Diagonal 1 = ${v1}, Diagonal 2 = ${v2}. Find Area.`;
                    a = ((v1 * v2) / 2).toString();
                    draw = { type: 'kite' };
                    break;
                case 'Congruence':
                    const rule = ['SSS', 'SAS', 'ASA'][Math.floor(Math.random() * 3)];
                    q = `Triangles match via ${rule}. Name the congruence postulate.`;
                    a = rule;
                    draw = { type: 'congruent' };
                    break;
                default: // Rectangle
                    q = `Rectangle: Length = ${v1}, Width = ${v2}. Find Area.`;
                    a = (v1 * v2).toString();
                    draw = { type: 'rect' };
            }
        } else {
            q = `Calculate: ${v1} * ${v2}`;
            a = (v1 * v2).toString();
        }
        return { q, a, draw };
    }
};

function App() {
    const [xp, setXp] = useState(1500);
    const [isStarted, setIsStarted] = useState(false);
    const [config, setConfig] = useState({ topic: 'Geometry', level: 'Easy', subTopic: 'Cylinder' });

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900">
            {/* Navigation Sidebar */}
            <aside className="w-64 bg-slate-900 p-6 flex flex-col fixed h-full shadow-2xl">
                <h1 className="text-2xl font-black text-white italic tracking-tighter mb-10 uppercase">Focus<span className="text-indigo-500">Flow</span></h1>
                <div className="flex-1 space-y-2">
                    <button className="w-full p-4 rounded-2xl font-bold text-left bg-indigo-600 text-white shadow-lg">🧠 AI Tutor</button>
                </div>
                <div className="bg-white/10 p-6 rounded-3xl text-center border border-white/10">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Current XP</p>
                    <p className="text-2xl font-black text-white">{xp}</p>
                </div>
            </aside>

            {/* Main Interface */}
            <main className="flex-1 ml-64 p-12">
                {!isStarted ? (
                    <div className="max-w-2xl mx-auto bg-white p-12 rounded-[56px] shadow-2xl border-4 border-indigo-50">
                        <h2 className="text-3xl font-black mb-10 italic uppercase tracking-tight">Session Settings</h2>

                        <div className="space-y-8">
                            {/* Difficulty Selector */}
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">1. Select Difficulty</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Easy', 'Medium', 'Hard'].map(l => (
                                        <button key={l} onClick={() => setConfig({...config, level: l})} className={`p-4 rounded-2xl font-bold border-2 transition-all ${config.level === l ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'}`}>{l}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Main Subject Menu */}
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">2. Select Subject</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Algebra', 'Trigo', 'Geometry'].map(t => (
                                        <button key={t} onClick={() => setConfig({...config, topic: t})} className={`p-4 rounded-2xl font-bold border-2 transition-all ${config.topic === t ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'}`}>{t}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Geometry Sub-Menu Expansion */}
                            {config.topic === 'Geometry' && (
                                <div className="p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-indigo-100">
                                    <p className="text-xs font-black text-indigo-600 uppercase mb-4 tracking-widest">3. Geometry Module</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Rectangle', 'Rhombus', 'Kite', 'Parallelogram', 'Iso-Trapezoid', 'Cylinder', 'Pyramid', 'Congruence'].map(s => (
                                            <button key={s} onClick={() => setConfig({...config, subTopic: s})} className={`py-2 px-4 rounded-xl text-xs font-bold border-2 transition-all ${config.subTopic === s ? 'border-indigo-600 bg-white text-indigo-600 shadow-sm' : 'border-transparent text-slate-400'}`}>{s}</button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button onClick={() => setIsStarted(true)} className="w-full bg-indigo-600 text-white py-8 rounded-[40px] font-black text-2xl uppercase shadow-2xl hover:bg-indigo-700 transition-all">Launch Engine</button>
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
            setTimeout(() => { setProb(MathEngine.generate(config.topic, config.level, config.subTopic)); setInput(""); setStatus("idle"); }, 800);
        } else {
            setStatus("wrong"); setTimeout(() => setStatus("idle"), 800);
        }
    };

    return (
        <div className="flex gap-10 max-w-6xl mx-auto">
            <div className="flex-1 bg-white p-12 rounded-[56px] shadow-2xl border-4 border-indigo-50">
                <button onClick={onBack} className="mb-6 text-slate-300 font-black text-xs uppercase tracking-widest hover:text-indigo-600">← Back</button>
                <h3 className="text-4xl font-black text-slate-900 mb-10 italic tracking-tight">{prob.q}</h3>

                {/* 3D Visuals Component */}
                <div className="bg-slate-50 rounded-[40px] border-2 border-slate-100 flex justify-center items-center h-80 mb-10 shadow-inner">
                    <svg width="300" height="200" viewBox="0 0 300 200">
                        <defs>
                            <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#94a3b8" />
                                <stop offset="50%" stopColor="#f8fafc" />
                                <stop offset="100%" stopColor="#94a3b8" />
                            </linearGradient>
                        </defs>
                        {prob.draw?.type === 'cylinder' && (
                            <g>
                                <ellipse cx="150" cy="160" rx="60" ry="20" fill="#cbd5e1" stroke="#475569" />
                                <rect x="90" y="50" width="120" height="110" fill="url(#metal)" />
                                <ellipse cx="150" cy="50" rx="60" ry="20" fill="#f8fafc" stroke="#6366f1" strokeWidth="4" />
                            </g>
                        )}
                        {prob.draw?.type === 'pyramid' && (
                            <g>
                                <path d="M150,30 L80,160 L220,160 Z" fill="#f8fafc" stroke="#6366f1" strokeWidth="4" />
                                <path d="M150,30 L220,160 L270,120 Z" fill="#cbd5e1" stroke="#475569" />
                            </g>
                        )}
                        {/* Fallback for 2D shapes */}
                        {!prob.draw?.type.includes('cylinder') && !prob.draw?.type.includes('pyramid') && (
                             <text x="150" y="110" textAnchor="middle" className="text-5xl font-black fill-slate-200 uppercase tracking-tighter italic">Preview</text>
                        )}
                    </svg>
                </div>

                <form onSubmit={handleCheck} className="space-y-6">
                    <input autoFocus type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Answer..." className={`w-full p-10 bg-slate-50 border-4 rounded-[40px] text-6xl font-black outline-none transition-all ${status === 'correct' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : status === 'wrong' ? 'border-rose-500 bg-rose-50' : 'border-slate-100 focus:border-indigo-600'}`} />
                    <button type="submit" className="w-full bg-slate-900 text-white py-10 rounded-[40px] font-black text-2xl uppercase tracking-tighter hover:bg-black transition-all shadow-xl">Check Solution</button>
                </form>
            </div>

            <Scratchpad />
        </div>
    );
}

function Scratchpad() {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);

    const start = (e) => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setDrawing(true);
    };

    const draw = (e) => {
        if (!drawing) return;
        const ctx = canvasRef.current.getContext('2d');
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2; // Precise 2px pencil
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
    };

    return (
        <div className="w-80 bg-white p-6 rounded-[48px] shadow-lg border border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Scratchpad</p>
            <canvas ref={canvasRef} width="280" height="380" onMouseDown={start} onMouseMove={draw} onMouseUp={() => setDrawing(false)} className="bg-slate-50 rounded-[32px] cursor-crosshair touch-none" />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);