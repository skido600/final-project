"use client";

export default function OtpModel({
  otp,
  verifying,
  timeLeft,

  onChange,
  onKeyDown,
  onVerify,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111] w-[90%] max-w-sm rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold">Verify Email</h2>

        <p className="text-xs mt-2">
          Code expires in <span className="text-red-400">{timeLeft} mins</span>
        </p>

        <div className="flex justify-between gap-2 mt-4">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              maxLength={1}
              value={digit}
              onChange={(e) => onChange(e.target.value, i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className="w-8 h-8 text-center bg-transparent border rounded"
            />
          ))}
        </div>

        <button
          onClick={onVerify}
          className="bg-red-600 w-full mt-4 py-2 disabled:cursor-not-allowed disabled:opacity-15 rounded">
          {verifying ? "Verifing ..." : "Verify OTP"}
        </button>

        <button onClick={onClose} className="w-full mt-3 text-sm text-gray-400">
          Cancel
        </button>
      </div>
    </div>
  );
}
