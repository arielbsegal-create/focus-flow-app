const { useState, useRef, useEffect } = React;

/**
 * 🧠 CORE MATH ENGINE
 * Procedurally generates questions across Algebra and the complete Geometry Expansion.
 * Integrates Bilingual (English/Hebrew) terminology.
 */
const MathEngine = {
    generate: (topic, level, subTopic) => {
        let q, a, draw = null;
        // Difficulty scalars dictate the number ranges
        const scalar = level === 'Easy' ? 12 : level === 'Medium' ? 35 : 85;
        const v1 = Math.floor(Math.random() * scalar) + 5;
        const v2 = Math.floor(Math.random() * (scalar / 2)) + 3;

        if (topic === 'Algebra') {
            if (level === 'Easy') {
                q = `Solve for x: x + ${v1} = ${v1 + v2}`;
                a = v2.toString();
            } else if (level === 'Medium') {
                q = `Solve for x: 2x - ${v1} = ${(2 * v2) - v1}`;
                a = v2.toString();
            } else {
                q = `Solve for x: (x / 2) + ${v1} = ${(v2 / 2) + v1}`;
                a = v2.toString();
            }
            draw = { type: 'algebra' };
        }
        else if (topic === 'Geometry') {
            switch (subTopic) {
                case 'Parallelogram':
                    q = `Parallelogram (מקבילית): Base = ${v1}, Height = ${v2}. Find Area.`;
                    a = (v1 * v2).toString();
                    draw = { type: 'para' };
                    break;
                case 'Rhombus':
                    q = `Rhombus (מעוין): Diagonal 1 = ${v1}, Diagonal 2 = ${v2}. Find Area.`;
                    a = ((v1 * v2) / 2).toString();
                    draw = { type: 'rhombus' };
                    break;
                case 'Iso-Trapezoid':
                    q = `Isosceles Trapezoid (טרפז שווה שוקיים): Base1=${v1}, Base2=${v1+10}, Leg=${v2}. Find Perimeter.`;
                    a = (v1 + (v1 + 10) + (v2 * 2)).toString();
                    draw = { type: 'trap' };
                    break;
                case 'Kite':
                    q = `Kite (דלתון): Diagonal 1 = ${v1}, Diagonal 2 = ${v2}. Find Area.`;
                    a = ((v1 * v2) / 2).toString();
                    draw = { type: 'kite' };
                    break;
                case 'Rectangle':
                    q = `Rectangle (מלבן): Length = ${v1}, Width = ${v2}. Find Area.`;
                    a = (v1 * v2).toString();
                    draw = { type: 'rect' };
                    break;
                case 'Square':
                    q = `Square (ריבוע): Side = ${v1}. Find Area.`;
                    a = (v1 * v1).toString();
                    draw = { type: 'square' };
                    break;
                default:
                    q = `Geometry Problem: ${v1} + ${v2}`;
                    a = (v1 + v2).toString();
            }
        }
        return { q, a, draw };
    }
};

/**
 * 🚀 MAIN APPLICATION COMPONENT
 * Handles routing, global state (XP, Timer, Progress), and configuration.
 */
function App() {
    const [xp, setXp] = useState(0);
    const [progress, setProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isStarted, setIsStarted] = useState(false);

    // Default Configuration
    const [config, setConfig] = useState({
        topic: 'Geometry',
        level: 'Medium',
        subTopic: 'Parallelogram'
    });

    // Precision Countdown Timer Logic
    useEffect(() => {
        let timer;
        if (isStarted && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && isStarted) {
            setIsStarted(false); // Auto-end session when time is up
        }
        return () => clearTimeout(timer); // Cleanup prevents memory leaks
    }, [isStarted, timeLeft]);

    const launchSession = () => {
        setIsStarted(true);
        setTimeLeft(60); // 60-second sprint
        setProgress(0);  // Reset mastery bar
    };

    return (
        <div className="flex min-h-screen bg-slate-50 selection:bg-indigo-200">
            {/* 📊 LEFT SIDEBAR: Telemetry & Stats */}
            <aside className="w-72 bg-slate-900 p-8 flex flex-col fixed h-full shadow-[20px_0_40px_rgba(0,0,0,0.1)] z-10">
                <h1 className="text-3xl font-black text-white italic mb-12 tracking-tighter uppercase drop-shadow-md">
                    Focus<span className="text-indigo-500">Flow</span>
                </h1>

                {/* Timer Module */}
                <div className="mb-8 bg-white/5 p-6 rounded-[24px] border border-white/10 shadow-inner">
                    <p className="text-[10px] font-black text-indigo-400 uppercase mb-2 tracking-widest">Sprint Timer</p>
                    <p className={`text-5xl font-mono font-black tracking-tighter transition-colors ${timeLeft <= 10 && isStarted ? 'text-rose-500 animate-pulse drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'text-white'}`}>
                        00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                    </p>
                </div>

                {/* Progress Module */}
                <div className="mb-8">
                    <div className="flex justify-between items-end mb-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mastery</span>
                        <span className="text-sm font-black text-white">{progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-700 ease-out relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute top-0 bottom-0 right-0 w-8 bg-white/20 blur-sm transform translate-x-1/2"></div>
                        </div>
                    </div>
                </div>

                {/* Global XP Tracker */}
                <div className="mt-auto bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-[24px] text-center shadow-2xl border border-indigo-500/30">
                    <p className="text-[10px] font-black text-indigo-200 uppercase mb-1 tracking-widest">Total XP Earned</p>
                    <p className="text-4xl font-black text-white drop-shadow-md">{xp}</p>
                </div>
            </aside>

            {/* 🖥️ MAIN WORKSPACE */}
            <main className="flex-1 ml-72 p-12 flex items-center justify-center min-h-screen">
                {!isStarted ? (
                    /* Setup Screen */
                    <div className="w-full max-w-4xl bg-white p-12 rounded-[48px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border-4 border-indigo-50/50 animate-in">
                        <h2 className="text-4xl font-black mb-10 italic uppercase tracking-tight text-slate-800">Configure Tutor</h2>

                        <div className="grid grid-cols-2 gap-10 mb-10">
                            {/* Subject & Difficulty Columns */}
                            <div className="space-y-4">
                                <p className="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-widest">1. Subject Focus</p>
                                {['Algebra', 'Geometry'].map(t => (
                                    <button key={t} onClick={() => setConfig({...config, topic: t})} className={`w-full p-5 rounded-[20px] font-bold border-2 transition-all duration-200 ${config.topic === t ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm scale-[1.02]' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}>{t}</button>
                                ))}
                            </div>
                            <div className="space-y-4">
                                <p className="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-widest">2. Intensity Level</p>
                                {['Easy', 'Medium', 'Hard'].map(l => (
                                    <button key={l} onClick={() => setConfig({...config, level: l})} className={`w-full p-5 rounded-[20px] font-bold border-2 transition-all duration-200 ${config.level === l ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm scale-[1.02]' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}>{l}</button>
                                ))}
                            </div>
                        </div>

                        {/* Expandable Geometry Sub-Menu */}
                        {config.topic === 'Geometry' && (
                            <div className="mb-10 p-8 bg-slate-50 rounded-[32px] border-2 border-dashed border-indigo-200/60 animate-in">
                                <p className="text-[11px] font-black text-indigo-600 uppercase mb-6 tracking-widest text-center">3. Target Shape (צורה)</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Rectangle', 'Square', 'Parallelogram', 'Rhombus', 'Iso-Trapezoid', 'Kite'].map(s => (
                                        <button key={s} onClick={() => setConfig({...config, subTopic: s})} className={`py-4 px-2 rounded-xl text-xs font-black border-2 transition-all duration-200 uppercase tracking-wide ${config.subTopic === s ? 'border-indigo-600 bg-white text-indigo-600 shadow-md transform -translate-y-1' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}>{s}</button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button onClick={launchSession} className="w-full bg-slate-900 text-white py-8 rounded-[32px] font-black text-2xl uppercase tracking-tighter shadow-xl hover:bg-indigo-600 transition-all duration-300 hover:shadow-indigo-500/30 hover:-translate-y-1 active:translate-y-0">
                            Initiate 60s Sprint
                        </button>
                    </div>
                ) : (
                    /* Active Session Screen */
                    <TutorInterface
                        config={config}
                        onCorrect={() => {
                            setXp(p => p + 75);
                            setProgress(p => Math.min(p + 12.5, 100)); // 8 questions to hit 100%
                        }}
                        onBack={() => setIsStarted(false)}
                    />
                )}
            </main>
        </div>
    );
}

/**
 * 🎓 ACTIVE TUTOR INTERFACE
 * Handles question display, SVG visualization, user input, and answer validation.
 */
function TutorInterface({ config, onCorrect, onBack }) {
    const [prob, setProb] = useState(() => MathEngine.generate(config.topic, config.level, config.subTopic));
    const [input, setInput] = useState("");
    const [status, setStatus] = useState("idle");
    const inputRef = useRef(null);

    // Keep focus on input for speed running
    useEffect(() => {
        if (status === 'idle' && inputRef.current) inputRef.current.focus();
    }, [status, prob]);

    const submit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        if (input.trim().toLowerCase() === prob.a.toLowerCase()) {
            setStatus("correct");
            onCorrect();
            // Fast reset for sprint mode
            setTimeout(() => {
                setProb(MathEngine.generate(config.topic, config.level, config.subTopic));
                setInput("");
                setStatus("idle");
            }, 500);
        } else {
            setStatus("wrong");
            setTimeout(() => setStatus("idle"), 600);
            setInput(""); // Clear wrong answer to let them try again instantly
        }
    };

    return (
        <div className="flex gap-8 w-full max-w-6xl animate-in">
            {/* Primary Question Panel */}
            <div className="flex-1 bg-white p-10 lg:p-14 rounded-[48px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border-4 border-indigo-50 relative flex flex-col justify-between">
                <div>
                    <button onClick={onBack} className="mb-6 px-4 py-2 bg-slate-100 text-slate-400 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 hover:text-slate-700 transition-colors">
                        ← Terminate Session
                    </button>
                    <h3 className="text-3xl lg:text-4xl xl:text-5xl font-black text-slate-800 leading-tight italic mb-8">{prob.q}</h3>
                </div>

                {/* 📐 Dynamic SVG Geometry Visualizer */}
                <div className="bg-slate-50/50 rounded-[32px] h-64 flex justify-center items-center mb-8 border-2 border-slate-100 shadow-inner overflow-hidden">
                    <svg width="320" height="200" viewBox="0 0 320 200" className="drop-shadow-sm">
                        {/* High-fidelity math shapes */}
                        {prob.draw?.type === 'para' && <path d="M70,160 L240,160 L270,40 L100,40 Z" fill="rgba(99,102,241,0.05)" stroke="#6366f1" strokeWidth="6" strokeLinejoin="round" />}
                        {prob.draw?.type === 'rhombus' && <path d="M160,30 L240,100 L160,170 L80,100 Z" fill="rgba(99,102,241,0.05)" stroke="#6366f1" strokeWidth="6" strokeLinejoin="round" />}
                        {prob.draw?.type === 'trap' && <path d="M70,160 L250,160 L200,40 L120,40 Z" fill="rgba(99,102,241,0.05)" stroke="#6366f1" strokeWidth="6" strokeLinejoin="round" />}
                        {prob.draw?.type === 'kite' && <path d="M160,20 L230,80 L160,180 L90,80 Z" fill="rgba(99,102,241,0.05)" stroke="#6366f1" strokeWidth="6" strokeLinejoin="round" />}
                        {prob.draw?.type === 'rect' && <rect x="60" y="50" width="200" height="100" fill="rgba(99,102,241,0.05)" stroke="#6366f1" strokeWidth="6" rx="4" />}
                        {prob.draw?.type === 'square' && <rect x="110" y="50" width="100" height="100" fill="rgba(99,102,241,0.05)" stroke="#6366f1" strokeWidth="6" rx="4" />}
                        {prob.draw?.type === 'algebra' && <text x="160" y="120" textAnchor="middle" className="text-6xl font-black fill-slate-200 italic font-mono">f(x)</text>}
                    </svg>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter value..."
                        autoComplete="off"
                        className={`w-full p-8 bg-slate-50 border-4 rounded-[32px] text-5xl font-black outline-none transition-all duration-200 placeholder:text-slate-300 ${
                            status === 'correct' ? 'border-emerald-500 bg-emerald-50 text-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.2)]' :
                            status === 'wrong' ? 'border-rose-500 bg-rose-50 text-rose-600 animate-shake shadow-[0_0_30px_rgba(244,63,94,0.2)]' :
                            'border-slate-100 focus:border-indigo-600 focus:bg-white focus:shadow-lg'
                        }`}
                    />
                    <button type="submit" className="w-full bg-slate-900 text-white py-8 rounded-[32px] font-black text-2xl uppercase tracking-tighter hover:bg-indigo-600 transition-all duration-300 shadow-lg active:scale-[0.98]">
                        Submit Answer
                    </button>
                </form>
            </div>

            {/* ✍️ Digital Scratchpad */}
            <div className="w-80 flex flex-col bg-white p-6 rounded-[48px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100">
                <div className="flex justify-between items-center mb-4 px-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Scratchpad
                    </p>
                    <button type="button" onClick={() => { const c = document.getElementById('pad'); c.getContext('2d').clearRect(0,0,c.width,c.height); }} className="text-slate-300 hover:text-rose-500 transition-colors text-[10px] font-black uppercase tracking-wider py-1 px-3 bg-slate-50 hover:bg-rose-50 rounded-full">
                        Clear
                    </button>
                </div>
                <ScratchCanvas />
            </div>
        </div>
    );
}

/**
 * 🖌️ PRECISION CANVAS COMPONENT
 * Handles mouse/touch drawing logic with a fixed 2px stroke for accurate math notation.
 */
function ScratchCanvas() {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);

    // Cross-browser coordinate extraction
    const getCoordinates = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
        }
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const start = (e) => {
        e.preventDefault(); // Prevent scrolling on touch
        const ctx = canvasRef.current.getContext('2d');
        const { x, y } = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        setDrawing(true);
    };

    const draw = (e) => {
        if (!drawing) return;
        e.preventDefault();
        const ctx = canvasRef.current.getContext('2d');
        const { x, y } = getCoordinates(e);
        ctx.strokeStyle = '#4f46e5'; // Indigo-600
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stop = () => setDrawing(false);

    return (
        <canvas
            id="pad"
            ref={canvasRef}
            width="280"
            height="500"
            onMouseDown={start}
            onMouseMove={draw}
            onMouseUp={stop}
            onMouseLeave={stop}
            onTouchStart={start}
            onTouchMove={draw}
            onTouchEnd={stop}
            className="flex-1 w-full bg-slate-50 rounded-[32px] cursor-crosshair touch-none border border-slate-100"
        />
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);