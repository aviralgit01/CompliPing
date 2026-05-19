import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white  rounded-2xl p-8 flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800">
          Verifying your email...
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 text-center max-w-xs">
          Please wait while we confirm your email address. This will only take a
          moment.
        </p>
      </div>
    </div>
  );
};

export default Loading;
