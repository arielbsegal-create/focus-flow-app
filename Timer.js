function Timer() {
    const [seconds, setSeconds] = useState(1500);
    const [active, setActive] = useState(false);
    const intervalRef = useRef();

    useEffect(() => {
        if (active && seconds > 0) {
            intervalRef.current = setInterval(() => setSeconds(s => s - 1), 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [active, seconds]);

    const format = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    return (
        <div className="flex flex-col items-center justify-center py-10">
            <div className="w-80 h-80 bg-white rounded-full shadow-[0_0_80px_rgba(79,70,229,0.15)] flex flex-col items-center justify-center border-[12px] border-slate-50 relative">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="160" cy="160" r="154" fill="none" stroke="#6366f1" strokeWidth="12" strokeDasharray="967" strokeDashoffset={967 - (967 * (seconds / 1500))} className="transition-all duration-1000 ease-linear" />
                </svg>
                <span className="text-7xl font-black text-slate-800 tracking-tighter tabular-nums">{format(seconds)}</span>
                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Deep Work</span>
            </div>

            <div className="mt-16 flex gap-6">
                <button onClick={() => setActive(!active)} className={`px-12 py-5 rounded-[24px] font-black text-xl transition-all shadow-2xl ${
                    active ? 'bg-white text-slate-600 hover:bg-slate-50' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                }`}>
                    {active ? 'PAUSE' : 'START SESSION'}
                </button>
                <button onClick={() => {setSeconds(1500); setActive(false)}} className="w-20 h-20 flex items-center justify-center bg-white border border-slate-200 rounded-[24px] text-2xl hover:bg-slate-50 transition-all">🔄</button>
            </div>
        </div>
    );
}
