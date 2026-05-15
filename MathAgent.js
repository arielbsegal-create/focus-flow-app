function MathAgent({ onSolve }) {
    const [index, setIndex] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [hintLevel, setHintLevel] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const current = MATH_PROBLEMS[index];

    const checkAnswer = () => {
        if (userInput.trim() === current.a) {
            setFeedback('correct');
            onSolve();
            setTimeout(() => {
                setIndex((index + 1) % MATH_PROBLEMS.length);
                setUserInput("");
                setHintLevel(0);
                setFeedback(null);
            }, 1500);
        } else {
            setFeedback('wrong');
            setTimeout(() => setFeedback(null), 1000);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-10 rounded-[32px] shadow-xl border-2 border-slate-100">
                <div className="mb-8">
                    <span className="text-indigo-600 font-bold text-sm uppercase tracking-widest">Question {index + 1}</span>
                    <h3 className="text-5xl font-black text-slate-900 mt-2">{current.q}</h3>
                </div>

                {/* Hints Area */}
                <div className="min-h-[100px] mb-8">
                    {hintLevel >= 1 && <div className="p-4 bg-amber-50 rounded-xl mb-2 text-amber-800 border border-amber-200">💡 {current.hints[0]}</div>}
                    {hintLevel >= 2 && <div className="p-4 bg-indigo-50 rounded-xl text-indigo-800 border border-indigo-200">🤔 {current.hints[1]}</div>}
                </div>

                {/* THE INPUT BOX - MADE VERY OBVIOUS */}
                <div className="flex flex-col gap-4">
                    <label className="text-slate-500 font-bold text-sm">TYPE YOUR ANSWER HERE:</label>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            autoFocus
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="e.g. 5"
                            className={`flex-1 px-8 py-6 rounded-2xl text-3xl font-black transition-all border-4 outline-none ${
                                feedback === 'correct' ? 'border-emerald-500 bg-emerald-50' :
                                feedback === 'wrong' ? 'border-rose-500 bg-rose-50 animate-shake' :
                                'border-slate-900 bg-white focus:ring-8 focus:ring-indigo-100'
                            }`}
                        />
                        <button
                            onClick={checkAnswer}
                            className="bg-indigo-600 text-white px-10 rounded-2xl font-black text-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200"
                        >
                            SUBMIT
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex justify-between items-center">
                    <button
                        onClick={() => setHintLevel(h => Math.min(h + 1, 2))}
                        className="text-slate-400 font-bold hover:text-indigo-600 transition-colors"
                    >
                        {hintLevel < 2 ? "+ Need a hint?" : "No more hints!"}
                    </button>
                    {feedback === 'correct' && <span className="text-emerald-600 font-black tracking-tighter text-xl">✨ CORRECT!</span>}
                </div>
            </div>
        </div>
    );
}