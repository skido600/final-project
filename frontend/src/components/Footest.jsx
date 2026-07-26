function Footest() {
  return (
    <div className="mt-12 pt-6 text-center">
      <p className="text-sm text-slate-400">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-cyan-400">MediCare AI</span>. All
        Rights Reserved.
      </p>

      <p className="mt-2 text-sm text-slate-500">
        Developed by{" "}
        <span className="font-semibold text-pink-500">
          Ebisi Chinechere Leonard
        </span>
      </p>

      <p className="mt-2 max-w-2xl mx-auto text-xs text-slate-500 leading-6">
        <span className="font-medium text-slate-900">
          Design and Implementation of an Artificial Intelligence-Based Patient
          Management System
        </span>
      </p>
    </div>
  );
}

export default Footest;
