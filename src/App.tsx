import { useState, useCallback, useRef, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, History as HistoryIcon, Send, RotateCcw, X, Info } from 'lucide-react';

type Decision = 'YES' | 'NO';

interface HistoryItem {
  id: string;
  question: string;
  answer: Decision;
  timestamp: number;
}

export default function App() {
  const [question, setQuestion] = useState('');
  const [isConsulting, setIsConsulting] = useState(false);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const consultOracle = useCallback(() => {
    if (!question.trim()) return;
    
    setIsConsulting(true);
    setDecision(null);

    // Dramatic delay for "consultation"
    setTimeout(() => {
      const result: Decision = Math.random() > 0.5 ? 'YES' : 'NO';
      setDecision(result);
      setIsConsulting(false);
      
      const newEntry: HistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        question: question.trim(),
        answer: result,
        timestamp: Date.now(),
      };
      
      setHistory(prev => [newEntry, ...prev]);
    }, 2000);
  }, [question]);

  const resetDecision = () => {
    setDecision(null);
    setQuestion('');
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !isConsulting) {
      consultOracle();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#f8f7f4] text-[#1a1a1a]">
      {/* Header */}
      <header className="w-full h-20 px-8 md:px-12 flex items-center justify-between border-b border-[#e5e4e1] bg-white/50 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="font-bold tracking-tighter text-xl">VERDICT.</span>
        </div>
        <nav className="hidden md:flex gap-8 text-[10px] font-bold text-[#7a7875] uppercase tracking-[0.2em]">
          <button onClick={() => setDecision(null)} className="hover:text-[#1a1a1a] transition-colors">Oracle</button>
          <button onClick={() => setShowAbout(true)} className="hover:text-[#1a1a1a] transition-colors">Mission</button>
          <button onClick={() => setShowHistory(true)} className="hover:text-[#1a1a1a] transition-colors">Chronicles</button>
        </nav>
        <div className="md:hidden flex gap-4">
          <button onClick={() => setShowHistory(true)} className="text-[#7a7875]"><HistoryIcon className="w-5 h-5" /></button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center px-6 py-12">
        <AnimatePresence mode="wait">
          {!decision && !isConsulting ? (
            <motion.div
              key="input-stage"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-2xl text-center space-y-12"
            >
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#b0aeaa] block">Pendulum Query</span>
                <div className="relative group">
                  <input
                    ref={inputRef}
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Pose your binary dilemma..."
                    className="w-full bg-transparent border-b-2 border-[#e5e4e1] focus:border-[#1a1a1a] px-2 py-6 text-4xl md:text-5xl font-light italic text-[#2c2c2c] placeholder:text-[#e5e4e1] focus:outline-none transition-all text-center"
                    autoFocus
                  />
                </div>
              </div>
              <button
                onClick={consultOracle}
                disabled={!question.trim()}
                className="w-full max-w-[320px] bg-[#1a1a1a] hover:bg-black disabled:bg-[#e5e4e1] disabled:text-[#b0aeaa] text-white rounded-full py-5 text-xs font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 mx-auto transition-all transform active:scale-[0.98] shadow-lg shadow-black/5"
              >
                Determine Verdict
                <Send className="w-4 h-4" />
              </button>
            </motion.div>
          ) : isConsulting ? (
            <motion.div
              key="looking-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center space-y-8"
            >
              <div className="flex justify-center gap-4">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{ 
                      duration: 1, 
                      repeat: Infinity, 
                      delay: i * 0.2 
                    }}
                    className="w-2 h-2 rounded-full bg-[#1a1a1a]"
                  />
                ))}
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.5em] text-[#7a7875]">
                Processing logic streams...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="decision-stage"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl text-center space-y-16"
            >
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#b0aeaa] block">The Verdict</span>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter ${
                    decision === 'YES' ? 'text-[#1a1a1a]' : 'text-[#1a1a1a] opacity-90'
                  }`}
                >
                  {decision}
                </motion.h2>
                {decision === 'NO' && (
                  <div className="w-24 h-1.5 bg-[#1a1a1a] mx-auto -mt-6"></div>
                )}
              </div>

              <div className="flex flex-col items-center gap-8">
                <button
                  onClick={resetDecision}
                  className="inline-flex items-center gap-3 text-[#7a7875] hover:text-[#1a1a1a] transition-all uppercase text-[10px] tracking-[0.3em] font-bold"
                >
                  <RotateCcw className="w-4 h-4" />
                  New Inquiry
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Stats Grid */}
      <footer className="w-full h-auto bg-white border-t border-[#e5e4e1] grid grid-cols-2 md:grid-cols-4 sticky bottom-0 z-30">
        <div className="border-r border-[#e5e4e1] p-6 md:p-8 flex flex-col justify-center">
          <span className="text-[10px] uppercase tracking-widest text-[#7a7875] mb-1 font-bold">Volume</span>
          <span className="text-xl md:text-2xl font-light">{history.length} Decisions</span>
        </div>
        <div className="border-r border-[#e5e4e1] p-6 md:p-8 flex flex-col justify-center">
          <span className="text-[10px] uppercase tracking-widest text-[#7a7875] mb-1 font-bold">Trend</span>
          <div className="flex items-end gap-1 h-8 mt-2">
            {[12, 20, 32, 16, 24].map((h, i) => (
              <div key={i} className={`w-2 bg-[#1a1a1a] ${i < 4 ? 'opacity-20' : ''}`} style={{ height: `${h}px` }}></div>
            ))}
          </div>
        </div>
        <div className="border-r border-[#e5e4e1] p-6 md:p-8 hidden md:flex flex-col justify-center">
          <span className="text-[10px] uppercase tracking-widest text-[#7a7875] mb-1 font-bold">Latest Entry</span>
          <span className="text-sm font-medium truncate w-full text-[#b0aeaa]">
            {history[0]?.question || "Waiting..."}
          </span>
        </div>
        <div className="p-6 md:p-8 flex items-center justify-between col-span-1 md:col-span-1 border-t md:border-t-0 border-[#e5e4e1]">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-[#7a7875] font-bold">System</span>
            <span className="text-xs">v2.0 Minimal</span>
          </div>
          <button 
            onClick={() => setShowHistory(true)}
            className="p-2 border border-[#e5e4e1] rounded hover:bg-zinc-50 transition-colors"
          >
            <HistoryIcon className="w-4 h-4 text-[#7a7875]" />
          </button>
        </div>
      </footer>

      {/* History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black/5 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-white border-l border-[#e5e4e1] z-50 overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-16">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#b0aeaa]">Archives</span>
                  <button onClick={() => setShowHistory(false)} className="text-[#7a7875] hover:text-[#1a1a1a]">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {history.length === 0 ? (
                  <div className="text-center py-20 space-y-4">
                    <div className="w-12 h-12 border border-[#e5e4e1] rounded-full mx-auto flex items-center justify-center text-[#e5e4e1]">?</div>
                    <p className="text-[#b0aeaa] text-xs uppercase tracking-widest">No verdicts issued.</p>
                  </div>
                ) : (
                  <div className="space-y-12">
                    {history.map((item, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={item.id} 
                        className="group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[8px] uppercase tracking-widest text-[#b0aeaa]">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="font-bold text-[10px] tracking-widest">
                            {item.answer}
                          </span>
                        </div>
                        <p className="text-base font-light text-[#1a1a1a] leading-relaxed italic group-hover:text-black transition-colors">
                          "{item.question}"
                        </p>
                        <div className="w-4 h-[1px] bg-[#e5e4e1] mt-6 group-hover:w-full transition-all duration-500"></div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* About Modal */}
      <AnimatePresence>
        {showAbout && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAbout(false)}
              className="fixed inset-0 bg-black/10 backdrop-blur-md z-40"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 m-auto h-fit w-[90%] max-w-lg bg-white border border-[#e5e4e1] z-50 rounded-lg p-12 text-center shadow-2xl"
            >
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-8">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-6 uppercase">The Philosophy</h3>
              <p className="text-[#7a7875] font-light leading-relaxed mb-12 text-lg">
                Decisiveness is the ultimate luxury. Verdict eliminates the noise of deliberation, providing a pure binary output for the modern mind.
              </p>
              <button 
                onClick={() => setShowAbout(false)}
                className="w-full border-2 border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white font-bold uppercase tracking-widest text-xs py-5 transition-all"
              >
                Close Manifesto
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

}
