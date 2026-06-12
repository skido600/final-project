import { useAIHistory, useDeleteAI, useClearAI } from "../hooks/useHistory";
import { useState } from "react";
useAIHistory;
function AIhistory() {
  const { data, isLoading } = useAIHistory();
  const { mutate: deleteAI } = useDeleteAI();
  const { mutate: clearAI } = useClearAI();
  console.log("data", data);
  const [openId, setOpenId] = useState(null);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">
          Recent AI Health Suggestion
        </h2>

        <button onClick={() => clearAI()} className="text-sm text-red-500">
          Clear All
        </button>
      </div>
      <p className="text-sm text-slate-500 mt-1">
        You can clear your history anytime to keep your records private and
        organized.
      </p>

      <div className="mt-4 space-y-4">
        {Array.isArray(data) &&
          data.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl bg-green-50 border border-green-200 relative">
              {/* dropdown */}
              <div className="absolute top-3 right-3">
                <button
                  onClick={() =>
                    setOpenId(openId === item.id ? null : item.id)
                  }>
                  ⋮
                </button>

                {openId === item.id && (
                  <div className="bg-white border rounded shadow p-2 absolute right-0">
                    <button
                      onClick={() => deleteAI(item.id)}
                      className="text-red-500 text-sm">
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <h1 className="mb-4 text-slate-900 text-sm">
                <span className="font-bold">Symptom </span> : {item.symptoms}
              </h1>
              <p className="font-bold list-none text-slate-900 text-sm">
                Recommendation:
              </p>
              <p className="text-slate-700 text-sm ">{item.recommendation}</p>

              <ul className="mt-3 list-disc text-sm list-inside text-slate-600">
                <li className="font-bold text-sm list-none text-slate-900 mb-2">
                  possibleConditions:
                </li>
                {item.possibleConditions?.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
}

export default AIhistory;
