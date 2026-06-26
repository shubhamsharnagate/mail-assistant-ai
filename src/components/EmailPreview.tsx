import { useState } from "react";
import { Mail, Copy, Check, Info, FileText } from "lucide-react";
import { motion } from "motion/react";
import { EmailGenerationResult, EmailGenerationInput } from "../types";

interface EmailPreviewProps {
  result: EmailGenerationResult | null;
  input: EmailGenerationInput;
  isLoading: boolean;
  error: string | null;
}

export default function EmailPreview({ result, input, isLoading, error }: EmailPreviewProps) {
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [copiedEntire, setCopiedEntire] = useState(false);

  const handleCopySubject = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.subject);
      setCopiedSubject(true);
      setTimeout(() => setCopiedSubject(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyBody = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.body);
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyEntire = async () => {
    if (!result) return;
    try {
      const fullContent = `Subject: ${result.subject}\n\n${result.body}`;
      await navigator.clipboard.writeText(fullContent);
      setCopiedEntire(true);
      setTimeout(() => setCopiedEntire(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // 1. Loading / Generating State
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm min-h-[450px] flex flex-col">
        {/* Mock email client header */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200 animate-pulse" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200 animate-pulse" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200 animate-pulse" />
          </div>
          <div className="h-4 w-32 bg-slate-100 rounded animate-pulse ml-2" />
        </div>

        <div className="flex-1 flex flex-col gap-5 justify-center">
          <div className="space-y-3">
            <div className="h-4 bg-slate-100 rounded w-1/4 animate-pulse" />
            <div className="h-10 bg-slate-50 border border-slate-100 rounded-xl w-full animate-pulse" />
          </div>

          <div className="space-y-3 flex-1 flex flex-col">
            <div className="h-4 bg-slate-100 rounded w-1/5 animate-pulse" />
            <div className="flex-1 border border-slate-100 rounded-xl bg-slate-50 p-4 space-y-3 animate-pulse">
              <div className="h-3 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-5/6" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="h-3 bg-slate-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-6 md:p-8 text-center flex flex-col items-center justify-center min-h-[450px]">
        <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-4 shadow-sm">
          <Info className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Generation Unsuccessful</h3>
        <p className="mt-2 text-sm text-rose-700 max-w-sm leading-relaxed">{error}</p>
        <div className="mt-6 text-xs text-slate-500 bg-white border border-slate-150 rounded-xl p-3.5 max-w-md text-left leading-normal">
          <p className="font-semibold text-slate-700 mb-1">How to fix this:</p>
          Please make sure your <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px] text-indigo-600 font-bold">GEMINI_API_KEY</code> is correctly configured in your project's secrets or environment.
        </div>
      </div>
    );
  }

  // 3. Complete Result State
  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border border-slate-200 rounded-2xl shadow-sm min-h-[500px] flex flex-col overflow-hidden"
      >
        {/* Interactive mail bar style */}
        <div className="bg-slate-50/50 border-b border-slate-100 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <span className="text-xs font-semibold text-slate-400 font-mono select-none">draft_preview.eml</span>
          </div>
          
          <button
            onClick={handleCopyEntire}
            id="btn-copy-entire"
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all duration-150 ${
              copiedEntire
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-white border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/30"
            }`}
          >
            {copiedEntire ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied Email!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Entire Email</span>
              </>
            )}
          </button>
        </div>

        <div className="p-6 flex-1 flex flex-col gap-5">
          {/* Email Headers block */}
          <div className="space-y-2 border-b border-slate-100 pb-4 text-xs">
            <div className="flex items-center">
              <span className="w-14 text-slate-400 font-medium">To:</span>
              <span className="text-slate-800 font-semibold">{input.recipientName || "Recipient"}</span>
            </div>
            {input.senderName && (
              <div className="flex items-center">
                <span className="w-14 text-slate-400 font-medium">From:</span>
                <span className="text-slate-800 font-semibold">{input.senderName}</span>
              </div>
            )}
            <div className="flex items-center">
              <span className="w-14 text-slate-400 font-medium">Tone:</span>
              <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">{input.tone}</span>
            </div>
          </div>

          {/* Subject Line */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">Subject Line</span>
              <button
                onClick={handleCopySubject}
                id="btn-copy-subject"
                className="text-slate-400 hover:text-indigo-600 text-[11px] font-semibold flex items-center gap-1 p-1 hover:bg-slate-50 rounded"
                title="Copy Subject"
              >
                {copiedSubject ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Subject</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-slate-50 border border-slate-150/80 rounded-xl px-4 py-3 text-slate-800 font-semibold text-sm">
              {result.subject}
            </div>
          </div>

          {/* Email Body */}
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">Email Body</span>
              <button
                onClick={handleCopyBody}
                id="btn-copy-body"
                className="text-slate-400 hover:text-indigo-600 text-[11px] font-semibold flex items-center gap-1 p-1 hover:bg-slate-50 rounded"
                title="Copy Body"
              >
                {copiedBody ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Body</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex-1 bg-slate-50 border border-slate-150/80 rounded-xl p-5 text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-wrap select-text min-h-[220px]">
              {result.body}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // 4. Initial Empty State
  return (
    <div className="bg-white border border-dashed border-slate-200/80 rounded-2xl p-6 md:p-8 text-center flex flex-col items-center justify-center min-h-[450px]">
      <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
        <Mail className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-bold text-slate-800">Your Draft Appears Here</h3>
      <p className="mt-2 text-sm text-slate-500 max-w-sm leading-relaxed">
        Configure the options in the form on the left and hit <b>Generate Email</b> to craft a custom response instantly.
      </p>

      {/* Suggested prompts / shortcuts */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-md text-left">
        <div className="bg-slate-50 hover:bg-indigo-50/20 border border-slate-100 hover:border-indigo-100 rounded-xl p-3 text-xs transition-colors cursor-pointer select-none">
          <p className="font-bold text-slate-700">Leave Request</p>
          <p className="text-slate-400 mt-0.5">"Requesting medical leave for medical checkup..."</p>
        </div>
        <div className="bg-slate-50 hover:bg-indigo-50/20 border border-slate-100 hover:border-indigo-100 rounded-xl p-3 text-xs transition-colors cursor-pointer select-none">
          <p className="font-bold text-slate-700">Meeting Request</p>
          <p className="text-slate-400 mt-0.5">"Reschedule Wednesday sync to Friday morning..."</p>
        </div>
      </div>
    </div>
  );
}
