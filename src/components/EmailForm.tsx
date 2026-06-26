import React from "react";
import { Sparkles, Trash2, ArrowRight } from "lucide-react";
import { EmailGenerationInput, EmailType, EmailTone } from "../types";

interface EmailFormProps {
  input: EmailGenerationInput;
  onChange: (field: keyof EmailGenerationInput, value: any) => void;
  onSubmit: () => void;
  onClear: () => void;
  isLoading: boolean;
}

const EMAIL_TYPES: EmailType[] = [
  "Leave Request",
  "Job Application",
  "Complaint",
  "Meeting Request",
  "Internship Request",
  "Custom Email",
];

const TONES: EmailTone[] = ["Formal", "Professional", "Friendly", "Casual"];

const TONE_DESCRIPTIONS: Record<EmailTone, string> = {
  Formal: "Standard business, polite & highly respectful",
  Professional: "Efficient, productive, direct & polished",
  Friendly: "Warm, collaborative, enthusiastic & close",
  Casual: "Relaxed, conversational & direct",
};

export default function EmailForm({
  input,
  onChange,
  onSubmit,
  onClear,
  isLoading,
}: EmailFormProps) {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!input.recipientName.trim()) {
      newErrors.recipientName = "Recipient name or title is required.";
    }
    if (!input.purpose.trim()) {
      newErrors.purpose = "Please describe the main purpose or details of the email.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  return (
    <form
      id="email-generator-form"
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Configure Email</h2>
          <p className="text-xs text-slate-500">Provide the context to generate your draft</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          id="btn-clear-form"
          className="text-slate-400 hover:text-rose-600 transition-colors duration-150 p-2 rounded-lg hover:bg-rose-50 flex items-center gap-1.5 text-xs font-semibold"
          title="Clear Form"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Clear Form</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Email Type */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email-type" className="text-xs font-bold text-slate-700 tracking-wide uppercase">
            Email Type
          </label>
          <select
            id="email-type"
            value={input.emailType}
            onChange={(e) => onChange("emailType", e.target.value as EmailType)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/20 transition-all"
          >
            {EMAIL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Recipient Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="recipient-name" className="text-xs font-bold text-slate-700 tracking-wide uppercase">
            Recipient Name / Title
          </label>
          <input
            id="recipient-name"
            type="text"
            value={input.recipientName}
            onChange={(e) => onChange("recipientName", e.target.value)}
            placeholder="e.g. Sarah Jenkins (HR Director)"
            className={`w-full bg-slate-50 border ${
              errors.recipientName ? "border-rose-400 focus:ring-rose-500/10 focus:border-rose-500" : "border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500"
            } rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:bg-white focus:ring-1 transition-all`}
          />
          {errors.recipientName && (
            <span className="text-[11px] font-medium text-rose-500">{errors.recipientName}</span>
          )}
        </div>

        {/* Sender Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sender-name" className="text-xs font-bold text-slate-700 tracking-wide uppercase">
            Sender Name (Your Name)
          </label>
          <input
            id="sender-name"
            type="text"
            value={input.senderName}
            onChange={(e) => onChange("senderName", e.target.value)}
            placeholder="e.g. James Carter"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Desired Tone Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email-tone" className="text-xs font-bold text-slate-700 tracking-wide uppercase">
            Tone
          </label>
          <select
            id="email-tone"
            value={input.tone}
            onChange={(e) => onChange("tone", e.target.value as EmailTone)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/20 transition-all"
          >
            {TONES.map((t) => (
              <option key={t} value={t}>
                {t} — {TONE_DESCRIPTIONS[t]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Purpose / Core Message */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email-purpose" className="text-xs font-bold text-slate-700 tracking-wide uppercase">
          What is the email about? (Main Purpose)
        </label>
        <textarea
          id="email-purpose"
          rows={3}
          value={input.purpose}
          onChange={(e) => onChange("purpose", e.target.value)}
          placeholder="Describe what you want to achieve or convey. (e.g., Applying for the Internship position, requesting annual leave for medical checkup next Thursday, or scheduling a product feedback review meeting)"
          className={`w-full bg-slate-50 border ${
            errors.purpose ? "border-rose-400 focus:ring-rose-500/10 focus:border-rose-500" : "border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500"
          } rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 transition-all resize-none`}
        />
        {errors.purpose && <span className="text-[11px] font-medium text-rose-500">{errors.purpose}</span>}
      </div>

      {/* Additional Details (Optional) */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email-additional" className="text-xs font-bold text-slate-700 tracking-wide uppercase">
          Additional Details / Specific Constraints (Optional)
        </label>
        <textarea
          id="email-additional"
          rows={2}
          value={input.additionalInfo}
          onChange={(e) => onChange("additionalInfo", e.target.value)}
          placeholder="Mention key dates, times, files attached, or custom request details to make it highly precise."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        id="btn-generate-email"
        className={`w-full relative overflow-hidden text-sm font-semibold text-white py-3 px-5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 select-none shadow-md ${
          isLoading
            ? "bg-indigo-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] hover:shadow-indigo-500/10 hover:shadow-lg"
        }`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Generating Perfect Draft...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>Generate Email</span>
            <ArrowRight className="w-4 h-4 ml-0.5 opacity-70 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}
