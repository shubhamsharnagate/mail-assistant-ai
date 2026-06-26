import { Mail, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden py-10 md:py-14 text-center">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 left-1/3 w-48 h-48 bg-purple-200/30 rounded-full blur-2xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-3xl mx-auto px-4"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Powered by Gemini 3.5 Flash</span>
        </div>

        <h1 className="font-sans text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-none">
          Mail<span className="text-indigo-600">Genius</span>
        </h1>
        
        <p className="mt-4 text-base md:text-lg text-slate-600 max-w-xl mx-auto font-normal leading-relaxed">
          Craft flawlessly formatted, context-aware emails in any tone or format. State your purpose, and let AI write the perfect email for you.
        </p>

        {/* CSS-illustrated dynamic email graphic */}
        <div className="mt-8 flex justify-center">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative flex items-center justify-center p-3.5 rounded-2xl bg-white border border-slate-100 shadow-xl"
          >
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100/50 px-4 py-2 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-800">MailGenius Writer</div>
                <div className="text-[10px] text-slate-400 font-mono">status: ready to write</div>
              </div>
            </div>
            {/* Tiny accent spark */}
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400/15 rounded-full flex items-center justify-center border border-yellow-200">
              <Sparkles className="w-3 h-3 text-yellow-600" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
