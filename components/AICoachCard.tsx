import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { getAIAdvice } from '../services/geminiService';
import { Task, AppUsage } from '../types';

interface AICoachCardProps {
  tasks: Task[];
  usage: AppUsage[];
  focusScore: number;
}

const AICoachCard: React.FC<AICoachCardProps> = ({ tasks, usage, focusScore }) => {
  const [advice, setAdvice] = useState<string>("Analyzing your day...");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    setError(false);
    try {
      const text = await getAIAdvice(tasks, usage, focusScore);
      setAdvice(text);
    } catch (e) {
      setError(true);
      setAdvice("Could not connect to Coach.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchAdvice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasApiKey = !!process.env.API_KEY;

  if (!hasApiKey) {
      return (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg mb-6 relative overflow-hidden">
             <div className="flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-yellow-300" />
                <h3 className="font-bold text-sm uppercase tracking-wider">AI Focus Coach</h3>
            </div>
            <p className="text-sm opacity-90 leading-relaxed mb-3">
               Please select an API Key to enable your personal AI coach.
            </p>
             <button 
                onClick={() => window.aistudio?.openSelectKey()}
                className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold py-2 px-4 rounded-full transition-colors"
            >
                Connect Key
            </button>
        </div>
      )
  }

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200 mb-6 relative overflow-hidden group">
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-400 opacity-20 rounded-full blur-xl"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-lg">
                     <Sparkles size={16} className="text-yellow-300" />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-wider">Focus Coach</h3>
            </div>
            <button 
                onClick={fetchAdvice} 
                disabled={loading}
                className="text-white/70 hover:text-white transition-colors"
            >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
        </div>
        
        <p className="text-sm font-medium leading-relaxed opacity-95">
          {loading ? "Thinking..." : `"${advice}"`}
        </p>

        {error && (
            <div className="flex items-center gap-1 mt-2 text-xs text-red-200">
                <AlertCircle size={12} />
                <span>Retry connection</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default AICoachCard;