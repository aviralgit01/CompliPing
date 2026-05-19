// "use client";

// import { useEffect, useState } from "react";
// import { loadFacebookSDK } from "@/lib/loadFacebookSDK";

// export default function WhatsAppSignup() {
//   const [fb, setFb] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     loadFacebookSDK()
//       .then((FB) => {
//         console.log("SDK READY");
//         setFb(FB);
//       })
//       .catch((err) => {
//         console.error("SDK ERROR:", err);
//       });

//     // Embedded signup event listener
//     const handleMessage = (event: MessageEvent) => {
//       if (!event.origin.endsWith("facebook.com")) return;

//       try {
//         const data = JSON.parse(event.data);

//         if (data.type === "WA_EMBEDDED_SIGNUP") {
//           console.log("EMBEDDED EVENT:", data);

//           if (data.event === "FINISH") {
//             console.log("Signup Complete:", data.data);
//           }
//         }
//       } catch {
//         console.log("RAW EVENT:", event.data);
//       }
//     };

//     window.addEventListener("message", handleMessage);
//     return () => window.removeEventListener("message", handleMessage);
//   }, []);

//   const handleSignup = () => {
//     if (!fb || loading) return;

//     setLoading(true);
//     console.log("Calling FB.login...");

//     fb.login(
//       (response: any) => {
//         setLoading(false);

//         console.log("LOGIN RESPONSE:", response);

//         if (response.authResponse?.code) {
//           console.log("AUTH CODE:", response.authResponse.code);
//         } else {
//           console.error("Login failed");
//         }
//       },
//       {
//         config_id: process.env.NEXT_PUBLIC_FB_CONFIG_ID,
//         response_type: "code",
//         override_default_response_type: true,
//         extras: {
//           setup: {}, // ✅ same as working HTML
//         },
//       }
//     );
//   };

//   return (
//     <button
//       onClick={handleSignup}
//       disabled={!fb || loading}
//       className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
//     >
//       {loading ? "Opening..." : fb ? "Connect WhatsApp" : "Loading SDK..."}
//     </button>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import { loadFacebookSDK } from "@/lib/loadFacebookSDK";

export default function WhatsAppSignup() {
  const [fb, setFb] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFacebookSDK()
      .then((FB) => {
        setFb(FB);
      })
      .catch((err) => {
        console.error("SDK ERROR:", err);
      });

    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes("facebook.com")) return;

      try {
        const data = JSON.parse(event.data);

        if (data.type === "WA_EMBEDDED_SIGNUP") {
          console.log("EMBEDDED EVENT:", data);

          if (data.event === "FINISH") {
            console.log("Signup Complete:", data.data);
            /**
             * data.data contains:
             * - phone_number_id
             * - waba_id
             */
          }
        }
      } catch {
        console.log("RAW EVENT:", event.data);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleSignup = () => {
    if (!fb || loading) return;

    setLoading(true);

    fb.login(
      (response: any) => {
        setLoading(false);

        console.log("LOGIN RESPONSE:", response);

        if (response.status === "connected" && response.authResponse?.code) {
          console.log("AUTH CODE:", response.authResponse.code);

          // send this code to backend → exchange for access token
        } else {
          console.error("Login failed or cancelled");
        }
      },
      {
        config_id: process.env.NEXT_PUBLIC_FB_CONFIG_ID, // MUST be correct
        response_type: "code",
        override_default_response_type: true,
        scope:
          "whatsapp_business_management,whatsapp_business_messaging",
        extras: {
          feature: 'whatsapp_embedded_signup',
          setup: {},
        },

      }
    );
  };

  return (
    <button
      onClick={handleSignup}
      disabled={!fb || loading}
      className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
    >
      {loading ? "Opening..." : fb ? "Connect WhatsApp" : "Loading SDK..."}
    </button>
  );
}