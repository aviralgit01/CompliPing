// "use client";

// import React, { useState } from "react";
// import { useOnBoarding } from "@/lib/hooks/api/auth/useAuth";
// import { Button } from "@/components/ui/button";
// import { CustomInput } from "@/components/customInput";
// import { Building2, User, Lock } from "lucide-react";

// type OnboardingData = {
//   whatsAppBusinessAccountID: string;
//   whatsAppPhoneNumber: string;
//   whatsAppAccessToken: string;
// };

// type Errors = Partial<Record<keyof OnboardingData, string>>;

// export default function OnboardingPage() {
//   const [formData, setFormData] = useState<OnboardingData>({
//     whatsAppBusinessAccountID: "",
//     whatsAppPhoneNumber: "",
//     whatsAppAccessToken: "",
//   });

//   const [errors, setErrors] = useState<Errors>({});
//   const [submitClicked, setSubmitClicked] = useState(false);
//   const onboardingMutation = useOnBoarding();

//   const handleInputChange = ({
//     key,
//     value,
//   }: {
//     key: keyof OnboardingData;
//     value: string;
//   }) => {
//     setFormData((prev) => ({ ...prev, [key]: value }));

//     if (submitClicked) {
//       setErrors((prev) => ({
//         ...prev,
//         [key]: value.trim() ? "" : prev[key],
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors: Errors = {};

//     if (!formData.whatsAppBusinessAccountID.trim()) {
//       newErrors.whatsAppBusinessAccountID = "Business Account ID is required";
//     }
//     if (!formData.whatsAppPhoneNumber.trim()) {
//       newErrors.whatsAppPhoneNumber = "Phone Number is required";
//     }
//     if (!formData.whatsAppAccessToken.trim()) {
//       newErrors.whatsAppAccessToken = "Access Token is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setSubmitClicked(true);

//     if (!validateForm()) return;

//     onboardingMutation.mutate({
//       body: {
//         whatsAppAccessToken: formData.whatsAppAccessToken,
//         whatsAppPhoneNumber: formData.whatsAppPhoneNumber,
//         whatsAppBusinessAccountID: formData.whatsAppBusinessAccountID,
//       },
//     });
//   };

//   return (
//     <div className="min-h-[80dvh] bg-slate-50 flex items-center justify-center">
//       <div className="w-full max-w-md">
//         <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-white/50 lg:p-8 p-6 shadow-sm">
//           <div className="text-center mb-6">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/80 shadow-lg border border-white/40 mb-4">
//               <Building2 className="w-8 h-8 text-brand-primary" />
//             </div>
//             <h1 className="text-3xl font-bold text-neutral-900 mb-2">
//               WhatsApp Onboarding
//             </h1>
//             <p className="text-neutral-600">
//               Connect your WhatsApp Business API credentials to complete setup.
//             </p>
//           </div>

//           <form className="space-y-5" onSubmit={handleSubmit}>
//             <CustomInput
//               label="WhatsApp Business Account ID"
//               id="whatsAppBusinessAccountID"
//               type="text"
//               value={formData.whatsAppBusinessAccountID}
//               placeholder="WhatsApp Business Account ID"
//               iconLeft={<User className="w-4 h-4 text-neutral-400" />}
//               required
//               inputClassName="h-12 text-base bg-white border-neutral-200 focus:border-brand-primary focus:ring-0"
//               labelClassName="text-sm font-medium text-neutral-700 mb-2"
//               onChange={(e) =>
//                 handleInputChange({
//                   key: "whatsAppBusinessAccountID",
//                   value: e.target.value,
//                 })
//               }
//               error={errors.whatsAppBusinessAccountID}
//             />

//             <CustomInput
//               label="WhatsApp Phone Number"
//               id="whatsAppPhoneNumber"
//               type="text"
//               value={formData.whatsAppPhoneNumber}
//               placeholder="WhatsApp Phone Number"
//               iconLeft={<User className="w-4 h-4 text-neutral-400" />}
//               required
//               inputClassName="h-12 text-base bg-white border-neutral-200 focus:border-brand-primary focus:ring-0"
//               labelClassName="text-sm font-medium text-neutral-700 mb-2"
//               onChange={(e) =>
//                 handleInputChange({
//                   key: "whatsAppPhoneNumber",
//                   value: e.target.value,
//                 })
//               }
//               error={errors.whatsAppPhoneNumber}
//             />

//             <CustomInput
//               label="WhatsApp Access Token"
//               id="whatsAppAccessToken"
//               type="password"
//               value={formData.whatsAppAccessToken}
//               placeholder="Permanent System User Access Token"
//               iconLeft={<Lock className="w-4 h-4 text-neutral-400" />}
//               showPasswordToggle
//               required
//               inputClassName="h-12 text-base bg-white border-neutral-200 focus:border-brand-primary focus:ring-0"
//               labelClassName="text-sm font-medium text-neutral-700 mb-2"
//               onChange={(e) =>
//                 handleInputChange({
//                   key: "whatsAppAccessToken",
//                   value: e.target.value,
//                 })
//               }
//               error={errors.whatsAppAccessToken}
//             />

//             <Button
//               type="submit"
//               disabled={onboardingMutation.isPending}
//               className="w-full h-12 text-base font-semibold bg-brand-primary hover:bg-brand-secondary transition-all duration-200 flex items-center justify-center gap-2"
//             >
//               <span>
//                 {onboardingMutation.isPending
//                   ? "Submitting..."
//                   : "Verify Connection"}
//               </span>
//             </Button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

import React, { useState } from "react";
import { useOnBoarding } from "@/lib/hooks/api/auth/useAuth";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/customInput";
import {
  Building2,
  User,
  Lock,
  ShieldCheck,
  MessageCircleMore,
  BadgeCheck,
  BellRing,
  FileText,
} from "lucide-react";

type OnboardingData = {
  whatsAppBusinessAccountID: string;
  whatsAppPhoneNumber: string;
  whatsAppAccessToken: string;
};

type Errors = Partial<Record<keyof OnboardingData, string>>;

export default function OnboardingPage() {
  const [formData, setFormData] = useState<OnboardingData>({
    whatsAppBusinessAccountID: "",
    whatsAppPhoneNumber: "",
    whatsAppAccessToken: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [submitClicked, setSubmitClicked] = useState(false);

  const onboardingMutation = useOnBoarding();

  const handleInputChange = ({
    key,
    value,
  }: {
    key: keyof OnboardingData;
    value: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (submitClicked) {
      setErrors((prev) => ({
        ...prev,
        [key]: value.trim() ? "" : prev[key],
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!formData.whatsAppBusinessAccountID.trim()) {
      newErrors.whatsAppBusinessAccountID =
        "Business Account ID is required";
    }

    if (!formData.whatsAppPhoneNumber.trim()) {
      newErrors.whatsAppPhoneNumber =
        "WhatsApp Phone Number is required";
    }

    if (!formData.whatsAppAccessToken.trim()) {
      newErrors.whatsAppAccessToken =
        "Access Token is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitClicked(true);

    if (!validateForm()) return;

    onboardingMutation.mutate({
      body: {
        whatsAppAccessToken: formData.whatsAppAccessToken,
        whatsAppPhoneNumber: formData.whatsAppPhoneNumber,
        whatsAppBusinessAccountID:
          formData.whatsAppBusinessAccountID,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          {/* Left Section */}
          <div className="space-y-6">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-linear-to-br from-emerald-50 via-white to-green-50 p-8 lg:p-10">
              <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-200/20 blur-3xl rounded-full" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-sm font-semibold text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                  Secure WhatsApp Integration
                </div>

                <div className="mt-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shadow-sm">
                    <MessageCircleMore className="w-8 h-8 text-emerald-700" />
                  </div>

                  <h1 className="mt-6 text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                    WhatsApp Business
                    <br />
                    Automation Setup
                  </h1>

                  <p className="mt-5 text-slate-600 text-base leading-relaxed max-w-2xl">
                    Connect your WhatsApp Business API to automate
                    compliance reminders, filing notifications,
                    onboarding communication, and document collection
                    workflows directly from your platform.
                  </p>
                </div>

                
                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                      <BellRing className="w-5 h-5 text-emerald-700" />
                    </div>

                    <h3 className="font-bold text-slate-900">
                      Automated Notifications
                    </h3>

                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      Automatically send reminders for filings,
                      pending documents, compliance updates, and
                      client actions.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
                    <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center mb-4">
                      <FileText className="w-5 h-5 text-indigo-700" />
                    </div>

                    <h3 className="font-bold text-slate-900">
                      Streamlined Communication
                    </h3>

                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      Reduce manual follow-ups and centralize all
                      client communication inside your workflow.
                    </p>
                  </div>
                </div>

                
                <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <div className="flex items-start gap-3">
                    <BadgeCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Before You Continue
                      </h3>

                      <ul className="mt-3 space-y-2 text-sm text-slate-700">
                        <li>
                          • Use a verified WhatsApp Business account.
                        </li>

                        <li>
                          • Ensure your access token has permanent API
                          permissions.
                        </li>

                        <li>
                          • Phone number must be connected to the same
                          Meta Business account.
                        </li>

                        <li>
                          • Incorrect credentials will fail API
                          verification.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        
          <div className="lg:sticky lg:top-8 mt-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 lg:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Complete Setup
                </h2>

                <p className="text-sm text-slate-500 mt-2">
                  Enter your WhatsApp Business API credentials to
                  activate automation features.
                </p>
              </div>

              <form
                className="space-y-5"
                onSubmit={handleSubmit}
              >
                <CustomInput
                  label="WhatsApp Business Account ID"
                  id="whatsAppBusinessAccountID"
                  type="text"
                  value={formData.whatsAppBusinessAccountID}
                  placeholder="WhatsApp Business Account ID"
                  iconLeft={
                    <Building2 className="w-4 h-4 text-neutral-400" />
                  }
                  required
                  inputClassName="h-12 text-base bg-white border-neutral-200 focus:border-emerald-500 focus:ring-0"
                  labelClassName="text-sm font-medium text-neutral-700 mb-2"
                  onChange={(e) =>
                    handleInputChange({
                      key: "whatsAppBusinessAccountID",
                      value: e.target.value,
                    })
                  }
                  error={errors.whatsAppBusinessAccountID}
                />

                <CustomInput
                  label="WhatsApp Phone Number"
                  id="whatsAppPhoneNumber"
                  type="text"
                  value={formData.whatsAppPhoneNumber}
                  placeholder="+91XXXXXXXXXX"
                  iconLeft={
                    <User className="w-4 h-4 text-neutral-400" />
                  }
                  required
                  inputClassName="h-12 text-base bg-white border-neutral-200 focus:border-emerald-500 focus:ring-0"
                  labelClassName="text-sm font-medium text-neutral-700 mb-2"
                  onChange={(e) =>
                    handleInputChange({
                      key: "whatsAppPhoneNumber",
                      value: e.target.value,
                    })
                  }
                  error={errors.whatsAppPhoneNumber}
                />

                <CustomInput
                  label="Permanent Access Token"
                  id="whatsAppAccessToken"
                  type="password"
                  value={formData.whatsAppAccessToken}
                  placeholder="Permanent System User Access Token"
                  iconLeft={
                    <Lock className="w-4 h-4 text-neutral-400" />
                  }
                  showPasswordToggle
                  required
                  inputClassName="h-12 text-base bg-white border-neutral-200 focus:border-emerald-500 focus:ring-0"
                  labelClassName="text-sm font-medium text-neutral-700 mb-2"
                  onChange={(e) =>
                    handleInputChange({
                      key: "whatsAppAccessToken",
                      value: e.target.value,
                    })
                  }
                  error={errors.whatsAppAccessToken}
                />

                <Button
                  type="submit"
                  disabled={onboardingMutation.isPending}
                  className="w-full h-12 rounded-xl text-base font-semibold bg-brand-primary hover:bg-blue-700 transition-all duration-200"
                >
                  {onboardingMutation.isPending
                    ? "Verifying Connection..."
                    : "Verify & Complete Setup"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}