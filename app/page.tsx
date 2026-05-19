import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = async () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
      <div className="text-center flex flex-col items-center gap-6 px-6">
        {/* Logo */}
        <div className="w-20 h-20 rounded-2xl bg-white shadow-md border flex items-center justify-center">
          <span className="text-2xl font-bold text-brand-primary">CP</span>
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          CompliPingPro
        </h1>

        {/* Tagline */}
        <p className="text-gray-500 max-w-md">
          Simplifying compliance tracking, alerts, and management in one
          powerful platform.
        </p>

        {/* Button */}
        <Link href="/dashboard">
          <Button
            size="lg"
            className="px-6 text-base bg-brand-primary hover:bg-brand-secondary"
          >
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default page;
