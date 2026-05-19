// let fbPromise: Promise<any> | null = null;

// export function loadFacebookSDK() {
//   if (fbPromise) return fbPromise;

//   fbPromise = new Promise((resolve, reject) => {
//     if (typeof window === "undefined") return;

//     // Already loaded
//     if (window.FB) {
//       resolve(window.FB);
//       return;
//     }

//     // MUST define before script loads
//     window.fbAsyncInit = function () {
//       window.FB.init({
//         appId: process.env.NEXT_PUBLIC_FB_APP_ID,
//         autoLogAppEvents: true,
//         xfbml: false,
//         version: "v23.0",
//       });

//       console.log("FB INIT DONE");
//       resolve(window.FB);
//     };

//     // Prevent duplicate script
//     if (document.getElementById("facebook-jssdk")) return;

//     const script = document.createElement("script");
//     script.id = "facebook-jssdk";
//     script.src = "https://connect.facebook.net/en_US/sdk.js";
//     script.async = true;
//     script.defer = true;
//     script.crossOrigin = "anonymous";

//     script.onerror = () => reject("Failed to load FB SDK");

//     document.body.appendChild(script);
//   });

//   return fbPromise;
// }





let fbPromise: Promise<any> | null = null;

export function loadFacebookSDK() {
  if (fbPromise) return fbPromise;

  fbPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") return;

    // already loaded
    if ((window as any).FB) {
      resolve((window as any).FB);
      return;
    }

    (window as any).fbAsyncInit = function () {
      (window as any).FB.init({
        appId: process.env.NEXT_PUBLIC_FB_APP_ID,
        cookie: true, // REQUIRED
        xfbml: false,
        version: "v23.0",
      });

      console.log("FB INIT DONE");
      resolve((window as any).FB);
    };

    // if script already exists → wait for FB
    if (document.getElementById("facebook-jssdk")) {
      const wait = setInterval(() => {
        if ((window as any).FB) {
          clearInterval(wait);
          resolve((window as any).FB);
        }
      }, 50);
      return;
    }

    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";

    script.onerror = () => reject("Failed to load FB SDK");

    document.body.appendChild(script);
  });

  return fbPromise;
}