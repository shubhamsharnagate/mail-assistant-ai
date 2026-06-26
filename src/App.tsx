import React, { useState } from "react";
import Hero from "./components/Hero";
import EmailForm from "./components/EmailForm";
import EmailPreview from "./components/EmailPreview";
import { EmailGenerationInput, EmailGenerationResult } from "./types";

const INITIAL_INPUT: EmailGenerationInput = {
  emailType: "Leave Request",
  recipientName: "",
  senderName: "",
  purpose: "",
  tone: "Professional",
  additionalInfo: "",
};

export default function App() {
  const [input, setInput] = useState<EmailGenerationInput>(INITIAL_INPUT);
  const [result, setResult] = useState<EmailGenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFieldChange = (field: keyof EmailGenerationInput, value: any) => {
    setInput((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred during email generation.");
      }

      if (data.success) {
        setResult({
          subject: data.subject,
          body: data.body,
        });
      } else {
        throw new Error("Unable to generate email. Please check your inputs.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while generating the email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInput(INITIAL_INPUT);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-indigo-100 selection:text-indigo-900 pb-16">
      {/* Container holding header / hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />

        {/* Dashboard Grid */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left panel: Form */}
          <div className="lg:col-span-5 xl:col-span-5">
            <EmailForm
              input={input}
              onChange={handleFieldChange}
              onSubmit={handleGenerate}
              onClear={handleClear}
              isLoading={isLoading}
            />
          </div>

          {/* Right panel: Preview */}
          <div className="lg:col-span-7 xl:col-span-7">
            <EmailPreview
              result={result}
              input={input}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
