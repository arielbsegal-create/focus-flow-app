const { useState, useEffect, useRef } = React;

// --- MAIN APP COMPONENT ---
function App() {
    const [view, setView] = useState('dashboard');
    const [xp, setXp] = useState(1450);
    const [config, setConfig] = useState({ topic: 'Trigo', level: 'Easy' });
    const [isConfigured, setIsConfigured] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-100 text-slate-900 font-sans">
            {/* Navigation */}
            <aside className="w-64 bg-white border-r p-6 fixed h-full z-10 shadow-sm">
                <h1 className="text-xl font-black text-indigo-600 mb-10 italic">FOCUSFLOW AI</h1>
                <nav className="space-y-2">
                    <button onClick={() => setView('dashboard')} className={`w-full text-left p-4 rounded-xl font-bold ${view === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>📊 Dashboard</button>
                    <button onClick={() => {setView('math'); setIsConfigured(false);}} className={`w-full text-left p-4 rounded-xl font-bold ${view === 'math' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>🧠 AI Tutor</button>
                </nav>
                <div className="mt-20 p-4 bg-slate-900 rounded-2xl text-white text-center">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase">Energy</p>
                    <p className="text-2xl font-black">{xp} XP</p>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 ml-64 p-8">
                {view === 'dashboard' && <div className="text-4xl font-black italic">Welcome Back, Scholar.</div>}

                {view === 'math' && (
                    !isConfigured ? (
                        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl mt-10">
                            <h2 className="text-2xl font-bold mb-6">Start Learning</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                    {['Addition', 'Algebra', 'Geometry', 'Trigo'].map(t => (
                                        <button key={t} onClick={() => setConfig({...config, topic: t})} className={`p-3 rounded-xl font-bold border-2 ${config.topic === t ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'}`}>{t}</button>
                                    ))}
                                </div>
                                <button onClick={() => setIsConfigured(true)} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black shadow-lg">GENERATE PROBLEM</button>
                            </div>
                        </div>
                    ) : (
                        <MathTutor config={config} onCorrect={() => setXp(prev => prev + 50)} onBack={() => setIsConfigured(false)} />
                    )
                )}
            </main>
        </div>
    );
}

// --- DRAWING PAD COMPONENT ---
function DrawingPad() {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);

    const start = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setDrawing(true);
    };

    const move = (e) => {
        if (!drawing) return;
        const { offsetX, offsetY } = e.nativeEvent;
        const ctx = canvasRef.current.getContext('2d');
        ctx.strokeStyle = '#4f46e5';
        ctx.lineWidth = 3;
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    return (
        <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase text-slate-400">Scratchpad</span>
                <button onClick={() => {
                    const canvas = canvasRef.current;
                    canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
                }} className="text-[10px] text-rose-500 font-bold">Clear</button>
            </div>
            <canvas ref={canvasRef} width="300" height="300" onMouseDown={start} onMouseMove={move} onMouseUp={() => setDrawing(false)} className="bg-slate-50 rounded-xl cursor-crosshair touch-none" />
        </div>
    );
}

// --- MATH TUTOR COMPONENT ---
function MathTutor({ config, onCorrect, onBack }) {
    const [problem, setProblem] = useState(null);
    const [answer, setAnswer] = useState("");
    const [status, setStatus] = useState("idle");

    const generate = () => {
        if (config.topic === 'Geometry') {
            const w = Math.floor(Math.random() * 10) + 5;
            const l = Math.floor(Math.random() * 10) + 5;
            return { q: "Find the Area.", a: (w * l).toString(), type: 'rect', w, l };
        } else if (config.topic === 'Trigo') {
            const h = 10;
            const ang = 30;
            return { q: "Find X (Opposite).", a: "5", type: 'tri', h, ang };
        }
        return { q: "10 + 5 = ?", a: "15", type: 'none' };
    };

    useEffect(() => { setProblem(generate()); }, []);

    const submit = (e) => {
        e.preventDefault();
        if (answer === problem.a) {
            setStatus("correct"); onCorrect();
            setTimeout(() => { setProblem(generate()); setAnswer(""); setStatus("idle"); }, 1000);
        } else {
            setStatus("wrong"); setTimeout(() => setStatus("idle"), 500);
        }
    };

    if (!problem) return null;

    return (
        <div className="flex gap-8 max-w-5xl mx-auto">
            <div className="flex-1 bg-white p-10 rounded-[40px] shadow-2xl">
                <button onClick={onBack} className="text-slate-400 font-bold mb-4">← Back</button>
                <h2 className="text-4xl font-black mb-8">{problem.q}</h2>

                {/* DRAWING LOGIC */}
                <div className="bg-slate-50 p-10 rounded-3xl mb-8 flex justify-center border">
                    {problem.type === 'rect' ? (
                        <svg width="200" height="150">
                            <rect x="40" y="30" width="120" height="90" fill="none" stroke="#4f46e5" strokeWidth="4" />
                            <text x="100" y="20" textAnchor="middle" className="font-bold fill-slate-400">L: {problem.l}</text>
                            <text x="15" y="80" textAnchor="middle" className="font-bold fill-slate-400" transform="rotate(-90 15,80)">W: {problem.w}</text>
                        </svg>
                    ) : problem.type === 'tri' ? (
                        <svg width="200" height="150">
                            <path d="M40,120 L160,120 L160,30 Z" fill="none" stroke="#4f46e5" strokeWidth="4" />
                            <text x="100" y="140" textAnchor="middle" className="font-bold fill-indigo-600 italic text-xl">x = ?</text>
                            <text x="75" y="70" textAnchor="middle" className="font-bold fill-slate-400" transform="rotate(-35 75,70)">Hyp: {problem.h}</text>
                            <text x="50" y="115" className="text-xs font-bold fill-slate-400">{problem.ang}°</text>
                        </svg>
                    ) : null}
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <input autoFocus type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type answer..." className={`w-full p-6 bg-slate-50 border-4 rounded-2xl text-4xl font-black ${status === 'correct' ? 'border-emerald-500' : 'border-slate-100'}`} />
                    <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black">CHECK</button>
                </form>
            </div>

            <div className="w-80 space-y-4">
                <DrawingPad />
                {config.topic === 'Trigo' && (
                    <div className="bg-slate-900 p-6 rounded-3xl text-white">
                        <p className="text-xs font-black text-indigo-400 mb-4">TRIG CALCULATOR</p>
                        <p className="text-sm text-slate-400">sin(30°) = 0.500</p>
                        <p className="text-sm text-slate-400">sin(45°) = 0.707</p>
                        <p className="text-sm text-slate-400">sin(60°) = 0.866</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- INITIALIZE ---
const rootEl = document.getElementById('root');
if (rootEl) {
    const root = ReactDOM.createRoot(rootEl);
    root.render(<App />);
}