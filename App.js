const { useState, useEffect, useRef } = React;

function App() {
    const [view, setView] = useState('dashboard');
    const [xp, setXp] = useState(1450);
    const [config, setConfig] = useState({ topic: 'Trigo', level: 'Easy' });
    const [isConfigured, setIsConfigured] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between fixed h-full z-10">
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

            <main className="flex-1 ml-64 p-8">
                {view === 'dashboard' && <DashboardView xp={xp} />}
                {view === 'math' && (
                    !isConfigured ? (
                        <div className="max-w-xl mx-auto bg-white p-10 rounded-[40px] shadow-2xl border-4 border-indigo-50 mt-10">
                            <h2 className="text-3xl font-black mb-8 uppercase italic tracking-tight">Set Your Goal</h2>
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
                                <button onClick={() => setIsConfigured(true)} className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-indigo-700 transition-all shadow-xl">START TRAINING</button>
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

function DrawingPad() {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#4f46e5';
        ctx.lineWidth = 3;
    }, []);

    const startDrawing = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = e.nativeEvent;
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <div className="bg-white rounded-[32px] p-6 shadow-xl border-4 border-slate-100">
            <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Scratchpad</span>
                <button onClick={clear} className="text-xs font-bold text-rose-500 hover:underline">Clear</button>
            </div>
            <canvas ref={canvasRef} width="350" height="400" onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={() => setIsDrawing(false)} onMouseLeave={() => setIsDrawing(false)} className="bg-slate-50 rounded-2xl cursor-crosshair touch-none" />
        </div>
    );
}

function MathTutorView({ config, onCorrect, onBack }) {
    const generateProblem = (c) => {
        let q, a, h, draw = null;
        const level = c.level;

        if (c.topic === 'Geometry') {
            const w = Math.floor(Math.random() * (level === 'Easy' ? 10 : 20)) + 4;
            const l = Math.floor(Math.random() * (level === 'Easy' ? 10 : 20)) + 4;
            const mode = Math.random() > 0.5 ? 'Area' : 'Perimeter';
            q = `Find the ${mode}.`;
            a = mode === 'Area' ? (w * l).toString() : (2 * (w + l)).toString();
            h = [mode === 'Area' ? "A = L × W" : "P = 2L + 2W"];
            draw = { type: 'rect', w, l };
        } else if (c.topic === 'Trigo') {
            const angles = [30, 45, 60];
            const ang = angles[Math.floor(Math.random() * angles.length)];
            const hyp = level === 'Easy' ? 10 : 25;
            const rad = ang * (Math.PI / 180);
            const opp = Math.round(hyp * Math.sin(rad));
            q = `Find 'x' (Opposite side).`;
            a = opp.toString();
            h = ["SOH: Sin(θ) = Opp / Hyp", `sin(${ang}°) ≈ ${(Math.sin(rad)).toFixed(3)}`];
            draw = { type: 'tri', ang, hyp };
        } else {
            const n1 = Math.floor(Math.random() * 50);
            const n2 = Math.floor(Math.random() * 50);
            q = `${n1} + ${n2} = ?`; a = (n1+n2).toString(); h=["Simple addition!"];
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
        <div className="max-w-6xl mx-auto flex gap-8 items-start">
            {/* Left Column: Problem & Drawing */}
            <div className="flex-1 bg-white p-10 rounded-[48px] shadow-2xl border-4 border-indigo-50">
                <button onClick={onBack} className="mb-6 text-slate-400 font-bold hover:text-indigo-600 transition">← Change Level</button>
                <div className="mb-8">
                    <h3 className="text-5xl font-black text-slate-900 mb-6 leading-tight">{current.q}</h3>
                    {current.draw && (
                        <div className="bg-slate-50 rounded-[32px] p-10 mb-8 flex justify-center border-2 border-slate-100 shadow-inner">
                            {current.draw.type === 'rect' ? (
                                <svg width="240" height="180" viewBox="0 0 240 180">
                                    <rect x="50" y="40" width="140" height="100" fill="rgba(79, 70, 229, 0.1)" stroke="#4f46e5" strokeWidth="6" />
                                    <text x="120" y="30" textAnchor="middle" className="font-black fill-slate-500 text-xl">{current.draw.l}</text>
                                    <text x="25" y="95" textAnchor="middle" className="font-black fill-slate-500 text-xl" transform="rotate(-90 25,95)">{current.draw.w}</text>
                                </svg>
                            ) : (
                                <svg width="240" height="180" viewBox="0 0 240 180">
                                    <path d="M50,140 L190,140 L190,40 Z" fill="rgba(79, 70, 229, 0.1)" stroke="#4f46e5" strokeWidth="6" strokeLinejoin="round" />
                                    <text x="120" y="170" textAnchor="middle" className="font-black fill-indigo-600 text-xl">x = ?</text>
                                    <text x="100" y="80" textAnchor="middle" className="font-black fill-slate-500 text-lg" transform="rotate(-35 100,80)">Hyp: {current.draw.hyp}</text>
                                    <text x="65" y="135" className="text-sm font-black fill-slate-400">{current.draw.ang}°</text>
                                    <rect x="180" y="130" width="10" height="10" fill="none" stroke="#4f46e5" strokeWidth="2" />
                                </svg>
                            )}
                        </div>
                    )}
                </div>
                <form onSubmit={check} className="space-y-4">
                    <input autoFocus type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Answer..." className={`w-full p-8 bg-slate-50 border-4 rounded-[32px] text-5xl font-black outline-none transition-all ${status === 'correct' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : status === 'wrong' ? 'border-rose-500 bg-rose-50 animate-shake' : 'border-slate-100 focus:border-indigo-600 focus:bg-white'}`} />
                    <button type="submit" className="w-full bg-slate-900 text-white py-8 rounded-[32px] font-black text-2xl shadow-xl hover:bg-black transition-all">CHECK ANSWER</button>
                </form>
            </div>

            {/* Right Column: Calculator & Scratchpad */}
            <div className="w-[400px] space-y-6">
                <DrawingPad />
                {config.topic === 'Trigo' && (
                    <div className="bg-slate-900 p-8 rounded-[40px] shadow-2xl text-white">
                        <p className="text-[10px] font-black text-indigo-400 uppercase mb-6 tracking-widest">Trig Calculator</p>
                        <div className="space-y-3">
                            {[30, 45, 60].map(deg => (
                                <div key={deg} className="bg-slate-800 p-4 rounded-2xl flex justify-between items-center border border-slate-700">
                                    <span className="font-bold text-slate-400 italic">sin({deg}°)</span>
                                    <span className="font-black text-indigo-300 text-lg">{Math.sin(deg * Math.PI / 180).toFixed(3)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 p-4 bg-indigo-900/30 rounded-2xl border border-indigo-500/30">
                            <p className="text-xs font-bold text-indigo-200">Formula Hint:</p>
                            <p className="text-lg font-black text-white italic">Opp = Hyp × sin(θ)</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function DashboardView({ xp }) { return <div className="max-w-4xl mx-auto"><h2 className="text-6xl font-black italic tracking-tighter text-slate-900">LEVEL {(xp/100).toFixed(0)}</h2><p className="text-xl font-bold text-slate-400 mt-4 underline decoration-indigo-500">Total XP: {xp}</p></div>; }
function TimerView({ onComplete }) { return <div className="text-[10rem] font-black text-center mt-20 tracking-tighter">25:00</div>; }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);