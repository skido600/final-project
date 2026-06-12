import { Brain, Stethoscope, Notebook } from "lucide-react";
import { useForm } from "react-hook-form";

import { useMutation } from "@tanstack/react-query";
import { Aichecker } from "../util/auth";

function SymptomChecker() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});
  const { mutate, isPending, data } = useMutation({
    mutationFn: (formData) => Aichecker(formData.symptoms),
  });
  // console.log(data.data, "on ai");
  const onSubmit = (formData) => {
    mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          AI Symptom Checker
        </h1>

        <p className="text-slate-500 text-sm mt-2">
          Enter your symptoms and get possible AI-based health suggestions.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Symptoms
            </label>

            <textarea
              rows={6}
              {...register("symptoms", {
                required: "symptoms is required",
              })}
              placeholder="Example: fever, headache, cough..."
              className="mt-2 w-full border border-slate-300 rounded-xl p-4 outline-none"
            />

            {errors.symptoms && (
              <p className="text-red-500 text-sm mt-1">
                {errors.symptoms.message}
              </p>
            )}
          </div>

          <button
            disabled={isPending}
            className="w-full bg-sidebar-primary disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl flex items-center justify-center gap-2">
            <Brain className="w-5 h-5" />

            {isPending ? "Analyzing..." : "Analyze Symptoms"}
          </button>
        </div>
      </form>

      {data && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          {data?.data?.error && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
              <p>{data.data.message}</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Stethoscope className="text-green-600" />

            <h2 className="text-xl font-semibold text-slate-800">
              AI Suggestion
            </h2>
          </div>

          <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-5">
            <p className="font-medium">Symptoms</p>
            <p className="text-slate-600">{data.data.symptoms}</p>

            <p className="mt-4 font-medium">Possible Conditions</p>

            <ul className="mt-2 list-disc list-inside">
              {data.data.possibleConditions?.map((condition, index) => (
                <li key={index}>{condition}</li>
              ))}
            </ul>

            <p className="mt-4 font-medium">Recommendation</p>

            <p className="text-slate-600">{data.data.recommendation}</p>

            <p className="mt-4 text-sm flex gap-1.5 items-center text-slate-500">
              <Notebook size={15} className="text-amber-300" /> This AI result
              is only a suggestion and not a medical diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SymptomChecker;
