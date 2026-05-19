// export function emailTemplate(button_link: string, buttonText: string) {
//   const reset_password = `
//   <div style="font-family: 'Helvetica Neue', sans-serif; padding: 40px; background-color: #f4f4f4;">
//     <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
//       <h2 style="color: #333333;">Reset Your Password</h2>
//       <p style="font-size: 16px; color: #555555;">
//         You recently requested to reset your password for your account. Click the button below to reset it.
//       </p>
//       <div style="text-align: center; margin: 30px 0;">
//         <a href="${button_link}" target="_blank" style="
//           background-color: #0070f3;
//           color: #ffffff;
//           text-decoration: none;
//           padding: 12px 24px;
//           border-radius: 6px;
//           font-size: 16px;
//           display: inline-block;
//         ">${buttonText}</a>
//       </div>
//       <p style="font-size: 14px; color: #999999;">
//         If you didn’t request a password reset, you can safely ignore this email.
//       </p>
//       <hr style="border: none; border-top: 1px solid #eeeeee; margin: 40px 0;">
//       <p style="font-size: 12px; color: #cccccc; text-align: center;">
//         © ${new Date().getFullYear()} WorkStation. All rights reserved.
//       </p>
//     </div>
//   </div>
// `;

//   const verification_mail = `
//    <div style="font-family: 'Helvetica Neue', sans-serif; padding: 40px; background-color: #f2f4f6;">
//     <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
//       <div style="text-align: center;">
//         <h1 style="color: #333;">Verify Your Email</h1>
//       </div>
//       <p style="font-size: 16px; color: #555;">
//         Thank you for signing up with <strong>WorkStation</strong>. To complete your registration, please verify your email by clicking the button below.
//       </p>
//       <div style="text-align: center; margin: 30px 0;">
//         <a href="${button_link}" target="_blank" style="
//           background-color: #0070f3;
//           color: #ffffff;
//           text-decoration: none;
//           padding: 12px 24px;
//           border-radius: 6px;
//           font-size: 16px;
//           display: inline-block;
//         ">${buttonText}</a>
//       </div>
//       <hr style="border: none; border-top: 1px solid #eaeaea; margin: 40px 0;">
//       <p style="font-size: 12px; color: #aaa; text-align: center;">
//         &copy; ${new Date().getFullYear()} WorkStation. All rights reserved.
//       </p>
//     </div>
//   </div>
// `;
//   return {
//     reset_password: reset_password,
//     verification_mail: verification_mail,
//   };
// }

export function emailTemplate(button_link: string, buttonText: string) {
  const reset_password = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f7fa;">
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; padding: 40px 20px; background-color: #f5f7fa;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">
      
      <!-- Header with branding -->
      <div style="background: linear-gradient(135deg, #0070f3 0%, #0052cc 100%); padding: 40px 30px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">WorkStation</h1>
        <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">by Atticbits Solutions Private Limited</p>
      </div>
      
      <!-- Content -->
      <div style="padding: 40px 30px;">
        <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">Reset Your Password</h2>
        
        <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4a5568;">
          We received a request to reset the password for your WorkStation account. Click the button below to create a new password.
        </p>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="${button_link}" target="_blank" style="
            background: linear-gradient(135deg, #0070f3 0%, #0052cc 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            display: inline-block;
            box-shadow: 0 4px 12px rgba(0, 112, 243, 0.3);
          ">${buttonText}</a>
        </div>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #0070f3; padding: 16px; border-radius: 6px; margin: 24px 0;">
          <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.5;">
            <strong style="color: #334155;">Security tip:</strong> If you didn't request this password reset, please ignore this email or contact our support team if you have concerns about your account security.
          </p>
        </div>
        
        <p style="margin: 24px 0 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">
          This link will expire in 24 hours for security reasons.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #f8fafc; padding: 30px; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0 0 12px; font-size: 13px; color: #64748b; text-align: center; line-height: 1.6;">
          Need help? Contact us at <a href="mailto:connect@atticbits.com" style="color: #0070f3; text-decoration: none;">connect@atticbits.com</a>
        </p>
        <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
          &copy; ${new Date().getFullYear()} Atticbits Solutions Private Limited. All rights reserved.
        </p>
      </div>
      
    </div>
  </div>
</body>
</html>
`;

  const verification_mail = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f7fa;">
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; padding: 40px 20px; background-color: #f5f7fa;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">
      
      <!-- Header with branding -->
      <div style="background: linear-gradient(135deg, #0070f3 0%, #0052cc 100%); padding: 40px 30px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">WorkStation</h1>
        <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">by Atticbits Solutions Private Limited</p>
      </div>
      
      <!-- Content -->
      <div style="padding: 40px 30px;">
        <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">Welcome to WorkStation! 🎉</h2>
        
        <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4a5568;">
          Thank you for joining WorkStation. We're excited to have you on board! To get started and unlock all features, please verify your email address.
        </p>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="${button_link}" target="_blank" style="
            background: linear-gradient(135deg, #0070f3 0%, #0052cc 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            display: inline-block;
            box-shadow: 0 4px 12px rgba(0, 112, 243, 0.3);
          ">${buttonText}</a>
        </div>
        
        <div style="background-color: #f0f9ff; border-left: 4px solid #0070f3; padding: 16px; border-radius: 6px; margin: 24px 0;">
          <p style="margin: 0 0 8px; font-size: 14px; color: #0c4a6e; font-weight: 600;">Why verify your email?</p>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #0369a1; line-height: 1.8;">
            <li>Secure your account</li>
            <li>Receive important updates</li>
            <li>Access all platform features</li>
          </ul>
        </div>
        
        <p style="margin: 24px 0 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">
          This verification link will expire in 48 hours. If you didn't create an account with WorkStation, you can safely ignore this email.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #f8fafc; padding: 30px; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0 0 12px; font-size: 13px; color: #64748b; text-align: center; line-height: 1.6;">
          Questions? Reach out to us at <a href="mailto:connect@atticbits.com" style="color: #0070f3; text-decoration: none;">connect@atticbits.com</a>
        </p>
        <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
          &copy; ${new Date().getFullYear()} Atticbits Solutions Private Limited. All rights reserved.
        </p>
      </div>
      
    </div>
  </div>
</body>
</html>
`;

  return {
    reset_password: reset_password,
    verification_mail: verification_mail,
  };
}
