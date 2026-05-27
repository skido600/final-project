import { Brain, Stethoscope } from "lucide-react";

function SymptomChecker() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          AI Symptom Checker
        </h1>

        <p className="text-slate-500 text-sm mt-2">
          Enter your symptoms and get possible AI-based health suggestions.
        </p>
      </div>

      {/* Checker Card */}
      <div className="bg-white rounded-2xl  border border-slate-200 p-6">
        <div className="space-y-5">
          {/* Input */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Symptoms
            </label>
            <p className="text-slate-500 text-sm mt-2">
              Describe your symptoms to receive AI-powered health insights and
              possible medical suggestions.
            </p>
            <textarea
              rows={6}
              placeholder="Example: fever, headache, cough..."
              className="mt-2 w-full border border-slate-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Analyze Button */}
          <button className="w-full bg-sidebar-primary text-sidebar-primary-foreground transition text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2">
            <Brain className="w-5 h-5" />
            Analyze Symptoms
          </button>
        </div>
      </div>

      {/* AI Result */}
      <div className="bg-white rounded-2xl  border border-slate-200 p-6">
        <div className="flex items-center gap-2">
          <Stethoscope className="text-green-600" />

          <h2 className="text-xl font-semibold text-slate-800">
            AI Suggestion
          </h2>
        </div>

        <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-5">
          <p className="text-slate-700">
            Possible conditions based on your symptoms:
          </p>

          <ul className="mt-3 list-disc list-inside text-slate-600 space-y-1">
            <li>Malaria</li>
            <li>Flu</li>
          </ul>

          <p className="mt-4 text-sm text-slate-500">
            This AI result is only a suggestion and not a medical diagnosis.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SymptomChecker;
