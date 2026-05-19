// app/(main)/compliance/layout.tsx

import { ReactNode } from "react";

interface ComplianceLayoutProps {
  children: ReactNode;
  section1: ReactNode;
  section2: ReactNode;
  section3: ReactNode;
}

export default function ComplianceLayout({
  children,
  section1,
  section2,
  section3,
}: ComplianceLayoutProps) {
  return (
    <div className="w-full">
      <div className="max-w-360 mx-auto py-8">
        {/* <div>{section1}</div>
        <div>{section2}</div>
        <div>{section3}</div> */}
        {children}
      </div>
    </div>
  );
}
