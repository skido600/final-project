function AIhistory() {
  return (
    <div className="bg-white rounded-2xl p-6  border border-slate-200">
      <h2 className="text-xl font-semibold text-slate-800">
        Recent AI Health Suggestion
      </h2>

      <div className="mt-4 p-5 rounded-xl bg-green-50 border border-green-200">
        <p className="text-slate-700">
          Based on your last symptoms, possible conditions may include:
        </p>

        <ul className="mt-3 list-disc list-inside text-slate-600">
          <li>Malaria</li>
          <li>Flu</li>
        </ul>

        <p className="mt-4 text-sm text-slate-500">
          This AI suggestion is not a final diagnosis. Please consult a doctor.
        </p>
      </div>
    </div>
  );
}

export default AIhistory;
