"use client";

const InvalidLink = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-red-50/40 to-orange-50/30 p-6">
      <div className="w-full max-w-md bg-white p-8 text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-red-100 mb-4">
          <span className="text-red-600 text-2xl font-bold">!</span>
        </div>

        <h1 className="text-xl font-semibold text-slate-900 mb-2">
          Link Expired or Invalid
        </h1>

        <p className="text-sm text-slate-600 mb-6">
          This invitation link is no longer valid or has expired. Please request
          a new invite from your organization.
        </p>

        <button
          onClick={() => (window.location.href = "/login")}
          className="w-full h-11 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default InvalidLink;
