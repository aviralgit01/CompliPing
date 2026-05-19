// "use client";
// import { useState, useEffect, useMemo, useCallback } from "react";
// import {
//   Calendar,
//   FileText,
//   UserCheck,
//   Plus,
//   Upload,
//   ChevronDown,
//   AlertTriangle,
//   CheckSquare,
//   Square,
//   Info,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { CustomInput } from "@/components/customInput";
// import Breadcrumb from "./_components/Breadcrumb";
// import DocCheckRow from "./_components/DocCheckRow";
// import SectionCard from "./_components/SectionCard";
// import SelectField from "./_components/SelectField";
// import { Frequency } from "@/lib/generated/prisma";
// import FrequencySelector from "./_components/FrequencySelector";
// import AuditorAvailability from "./_components/AuditorAvailability";
// import { DropdownSearch } from "@/components/ui/searchableDropdown";
// import { DatePicker } from "@/components/ui/date-picker";
// import { useCreateCompliance } from "@/lib/hooks/api/compliance/useCompliance";
// import { useParams, useSearchParams } from "next/navigation";
// import { useGetClients } from "@/lib/hooks/api/useClients";
// import useClientPagination from "@/lib/hooks/client/use-cientPagination";
// import { useTeam } from "@/lib/hooks/api/useTeam";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import CustomCard from "@/components/common/custom-card";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface FilingPayload {
//   type: string;
//   dueDate: string;
//   clientId: string;
//   description?: string;
//   documentsRequired?: string;
//   frequency?: Frequency;
//   period?: string;
//   assignedTo?: string;
//   notes?: string;
// }

// interface RequiredDoc {
//   id: string;
//   label: string;
//   checked: boolean;
// }

// const DEFAULT_DOCS: RequiredDoc[] = [
//   // GST
//   { id: "sales_invoices", label: "Sales Invoices", checked: true },
//   { id: "purchase_invoices", label: "Purchase Invoices", checked: true },

//   // Banking
//   { id: "bank_statement", label: "Bank Statement", checked: true },

//   // Financials
//   { id: "pnl", label: "Profit & Loss Statement", checked: false },
//   { id: "balance_sheet", label: "Balance Sheet", checked: false },
//   { id: "audited_fs", label: "Audited Financial Statements", checked: false },

//   // Tax
//   { id: "tax_working", label: "Tax Working / Computation", checked: false },
//   { id: "previous_itr", label: "Previous Year ITR", checked: false },
//   { id: "investment_proofs", label: "Investment Proofs", checked: false },

//   // TDS
//   { id: "tds_working", label: "TDS Working Sheet", checked: false },
//   { id: "tds_summary", label: "TDS Data Summary", checked: false },
//   { id: "challan", label: "Challan Details", checked: false },

//   // Advance Tax
//   {
//     id: "income_estimate",
//     label: "Estimated Income Calculation",
//     checked: false,
//   },
//   { id: "updated_estimate", label: "Updated Income Estimate", checked: false },
//   { id: "final_estimate", label: "Final Income Estimate", checked: false },

//   // ROC
//   { id: "financial_statements", label: "Financial Statements", checked: false },
//   { id: "board_resolution", label: "Board Resolution", checked: false },
//   { id: "director_list", label: "Director List", checked: false },

//   // Director KYC
//   { id: "pan", label: "PAN Card", checked: false },
//   { id: "aadhaar", label: "Aadhaar Card", checked: false },
//   { id: "address_proof", label: "Address Proof", checked: false },

//   // Payroll
//   { id: "pf_working", label: "PF Working Sheet", checked: false },
//   { id: "esi_working", label: "ESI Working Sheet", checked: false },
//   { id: "salary_register", label: "Salary Register", checked: false },
//   { id: "pt_working", label: "Professional Tax Working", checked: false },

//   // Compliance Forms
//   { id: "form_3ca_3cb", label: "Form 3CA/3CB", checked: false },

//   // License
//   { id: "fssai_license", label: "FSSAI License Copy", checked: false },
//   { id: "renewal_application", label: "Renewal Application", checked: false },
// ];

// export const COMPLIANCE_TYPE_OPTIONS = [
//   // GST
//   { value: "gstr_1_monthly", label: "GSTR-1 Monthly" },
//   { value: "gstr_1_quarterly", label: "GSTR-1 Quarterly (QRMP)" },
//   { value: "gstr_3b_monthly", label: "GSTR-3B Monthly" },
//   { value: "gstr_3b_quarterly", label: "GSTR-3B Quarterly (QRMP)" },

//   // TDS
//   { value: "tds_payment", label: "TDS Payment" },
//   { value: "tds_return_q1", label: "TDS Return Q1 (Apr–Jun)" },
//   { value: "tds_return_q2", label: "TDS Return Q2 (Jul–Sep)" },
//   { value: "tds_return_q3", label: "TDS Return Q3 (Oct–Dec)" },
//   { value: "tds_return_q4", label: "TDS Return Q4 (Jan–Mar)" },

//   // Income Tax
//   { value: "advance_tax_1", label: "Advance Tax – Instalment 1" },
//   { value: "advance_tax_2", label: "Advance Tax – Instalment 2" },
//   { value: "advance_tax_3", label: "Advance Tax – Instalment 3" },
//   { value: "advance_tax_4", label: "Advance Tax – Instalment 4" },
//   { value: "itr_non_audit", label: "ITR Filing – Non-Audit" },
//   { value: "itr_audit", label: "ITR Filing – Audit" },

//   // ROC
//   { value: "roc_annual_return", label: "ROC Annual Return" },
//   { value: "director_kyc", label: "Director KYC (DIR-3 KYC)" },

//   // Payroll / Employee
//   { value: "pf_payment", label: "PF Payment" },
//   { value: "esi_payment", label: "ESI Payment" },
//   { value: "professional_tax", label: "Professional Tax" },

//   // License
//   { value: "fssai_renewal", label: "FSSAI License Renewal" },

//   // Custom
//   { value: "custom", label: "Custom Compliance" },
// ];

// type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

// export const EditFiling: React.FC<{
//   onSubmit?: (payload: FilingPayload) => void;
//   onCancel?: () => void;
// }> = ({ onSubmit, onCancel }) => {
//   const params = useParams();
//   const id = params?.id as string;

//   // ── State ──────────────────────────────────────────────────────────────────
//   const searchParams = useSearchParams();
//   const date = searchParams.get("date");
//   const [clientId, setClientId] = useState("");
//   const [type, setType] = useState("");
//   const [dueDate, setDueDate] = useState<string>(date || "");
//   const [frequency, setFrequency] = useState<Frequency>("QUARTERLY");
//   const [description, setDescription] = useState("");
//   const [notes, setNotes] = useState("");
//   const [assignedTo, setAssignedTo] = useState("marcus_thorne");
//   const [docs, setDocs] = useState<RequiredDoc[]>(DEFAULT_DOCS);
//   const [customDocInput, setCustomDocInput] = useState(false);
//   const [customDoc, setCustomDoc] = useState("");
//   const INITIAL_VISIBLE = 5;
//   const sortedDocs = [...docs].sort((a, b) => {
//     if (a.checked === b.checked) return 0;
//     return a.checked ? -1 : 1;
//   });
//   const [periodFrom, setPeriodFrom] = useState<{
//     quarter: Quarter;
//     year: number;
//   }>({
//     quarter: "Q1",
//     year: new Date().getFullYear(),
//   });

//   const [periodTo, setPeriodTo] = useState<{ quarter: Quarter; year: number }>({
//     quarter: "Q1",
//     year: new Date().getFullYear(),
//   });
//   const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

//   const visibleDocs = sortedDocs.slice(0, visibleCount);
//   const hasMore = docs.length > visibleCount;
//   const isExpanded = visibleCount >= docs.length;

//   const { data, isLoading, error } = useComplianceById(id);
//   const complianceData = data?.data?.complianceItem;
//   const { clients, setPage, search, setSearch, isLoading } =
//     useClientPagination();
//   const clientOptions = useMemo(() => {
//     return [
//       ...clients.map((client: any) => ({
//         value: client.id,
//         label: `${client.name} (${client.businessName})`,
//       })),
//     ];
//   }, [clients]);

//   const { getMember } = useTeam({
//     page: 1,
//     limit: 1000,
//   });
//   const teamMembers = getMember.data?.data?.data || [];
//   const formatRole = useCallback((role: string) => {
//     return role.charAt(0) + role.slice(1).toLowerCase();
//   }, []);

//   const AUDITOR_OPTIONS = useMemo(() => {
//     return [
//       ...teamMembers.map((member: any) => ({
//         value: member.id,
//         label: `${member.name} (${formatRole(member.role)})`,
//       })),
//     ];
//   }, [teamMembers, formatRole]);

//   // ── Derived ────────────────────────────────────────────────────────────────
//   const isPastDue = dueDate && new Date(dueDate) < new Date();
//   const { mutate, isPending } = useCreateCompliance();
//   const toggleDoc = (id: string) =>
//     setDocs((prev) =>
//       prev.map((d) => (d.id === id ? { ...d, checked: !d.checked } : d)),
//     );

//   const addCustomDoc = () => {
//     if (!customDoc.trim()) return;
//     setDocs((prev) => [
//       ...prev,
//       { id: `custom_${Date.now()}`, label: customDoc.trim(), checked: true },
//     ]);
//     setCustomDoc("");
//     setCustomDocInput(false);
//   };

//   // ── Submit ─────────────────────────────────────────────────────────────────
//   const handleSubmit = () => {
//     const payload: FilingPayload = {
//       type,
//       dueDate,
//       clientId,
//       description: description || undefined,
//       documentsRequired: docs
//         .filter((d) => d.checked)
//         .map((d) => d.label)
//         .join(","),
//       frequency,
//       period: `${periodFrom.quarter} ${periodFrom.year} – ${periodTo.quarter} ${periodTo.year}`,
//       assignedTo,
//       notes: notes || undefined,
//     };

//     mutate(payload);
//   };

//   const formatDateLocal = (date: Date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");

//     return `${year}-${month}-${day}`;
//   };
//   const parsedDate = dueDate ? new Date(`${dueDate}T00:00:00`) : undefined;

//   const QUARTERS: Quarter[] = ["Q1", "Q2", "Q3", "Q4"];
//   const YEARS = Array.from({ length: 10 }, (_, i) => 2020 + i);
//   const period = `${periodFrom.quarter} ${periodFrom.year} – ${periodTo.quarter} ${periodTo.year}`;
//   const isInvalid =
//     periodFrom.year > periodTo.year ||
//     (periodFrom.year === periodTo.year &&
//       QUARTERS.indexOf(periodFrom.quarter) >
//         QUARTERS.indexOf(periodTo.quarter));
//   // ── Render ─────────────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen font-sans">
//       <div className=" mx-auto">
//         <Breadcrumb />
//         <h1 className="text-3xl font-bold text-neutral-900 mb-1 tracking-tight">
//           Create New Filing
//         </h1>
//         <p className="text-sm text-neutral-500 mb-8 max-w-md leading-relaxed">
//           Initialize a new compliance task. Ensure all regulatory periods and
//           required documentation are accurately mapped to the client profile.
//         </p>

//         <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
//           <div className="flex flex-col gap-5">
//             <SectionCard
//               icon={<Info size={16} color="#4f46e5" />}
//               title="Primary Information"
//               className="border border-neutral-200!"
//             >
//               <DropdownSearch
//                 label="Client"
//                 options={clientOptions}
//                 selected={clientId}
//                 onChange={(value) => setClientId(value as string)}
//                 searchValue={search}
//                 onChangeSearch={setSearch}
//                 loading={isLoading}
//                 onPageChange={() => setPage((prev) => prev + 1)}
//               />

//               <div className="grid grid-cols-2 gap-4 mb-4 mt-2">
//                 <DropdownSearch
//                   label="Compliance Type"
//                   options={COMPLIANCE_TYPE_OPTIONS}
//                   selected={type}
//                   onChange={(value) => setType(value as string)}
//                   required
//                 />

//                 <DatePicker
//                   label="Due Date"
//                   value={parsedDate}
//                   onDateChange={(date) => {
//                     if (!date) return;
//                     setDueDate(formatDateLocal(date));
//                   }}
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//                 <FrequencySelector value={frequency} onChange={setFrequency} />
//               </div>

//               {/* Filing Period */}
//               <div className="flex flex-col gap-2">
//                 <label className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
//                   Filing Period
//                 </label>

//                 <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 w-full">
//                   {/* From box */}
//                   <div
//                     className={cn(
//                       "flex flex-col gap-2 bg-neutral-50 border rounded-xl px-4 py-3 w-full",
//                       isInvalid ? "border-red-400" : "border-neutral-200",
//                     )}
//                   >
//                     <span className="text-[9px] font-semibold uppercase tracking-widest text-neutral-400">
//                       From
//                     </span>
//                     <div className="grid grid-cols-[1fr_1.4fr] gap-2 w-full">
//                       <Select
//                         value={periodFrom.quarter}
//                         onValueChange={(v) =>
//                           setPeriodFrom((p) => ({
//                             ...p,
//                             quarter: v as Quarter,
//                           }))
//                         }
//                       >
//                         <SelectTrigger
//                           className={cn(
//                             "h-9 text-xs font-medium w-full",
//                             isInvalid && "border-red-400 ring-1 ring-red-200",
//                           )}
//                         >
//                           <SelectValue placeholder="Q" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {QUARTERS.map((q) => (
//                             <SelectItem key={q} value={q}>
//                               {q}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>

//                       <Select
//                         value={String(periodFrom.year)}
//                         onValueChange={(v) =>
//                           setPeriodFrom((p) => ({ ...p, year: Number(v) }))
//                         }
//                       >
//                         <SelectTrigger
//                           className={cn(
//                             "h-9 text-xs font-medium w-full",
//                             isInvalid && "border-red-400 ring-1 ring-red-200",
//                           )}
//                         >
//                           <SelectValue placeholder="Year" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {YEARS.map((y) => (
//                             <SelectItem key={y} value={String(y)}>
//                               {y}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>

//                   {/* Divider */}
//                   <div className="flex flex-col items-center gap-1 shrink-0">
//                     <div className="w-px h-5 bg-neutral-300" />
//                     <span className="text-[11px] font-medium text-neutral-400">
//                       to
//                     </span>
//                     <div className="w-px h-5 bg-neutral-300" />
//                   </div>

//                   {/* To box */}
//                   <div
//                     className={cn(
//                       "flex flex-col gap-2 bg-neutral-50 border rounded-xl px-4 py-3 w-full",
//                       isInvalid ? "border-red-400" : "border-neutral-200",
//                     )}
//                   >
//                     <span className="text-[9px] font-semibold uppercase tracking-widest text-neutral-400">
//                       To
//                     </span>
//                     <div className="grid grid-cols-[1fr_1.4fr] gap-2 w-full">
//                       <Select
//                         value={periodTo.quarter}
//                         onValueChange={(v) =>
//                           setPeriodTo((p) => ({ ...p, quarter: v as Quarter }))
//                         }
//                       >
//                         <SelectTrigger
//                           className={cn(
//                             "h-9 text-xs font-medium w-full",
//                             isInvalid && "border-red-400 ring-1 ring-red-200",
//                           )}
//                         >
//                           <SelectValue placeholder="Q" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {QUARTERS.map((q) => (
//                             <SelectItem key={q} value={q}>
//                               {q}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>

//                       <Select
//                         value={String(periodTo.year)}
//                         onValueChange={(v) =>
//                           setPeriodTo((p) => ({ ...p, year: Number(v) }))
//                         }
//                       >
//                         <SelectTrigger
//                           className={cn(
//                             "h-9 text-xs font-medium w-full",
//                             isInvalid && "border-red-400 ring-1 ring-red-200",
//                           )}
//                         >
//                           <SelectValue placeholder="Year" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {YEARS.map((y) => (
//                             <SelectItem key={y} value={String(y)}>
//                               {y}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Feedback row */}
//                 {isInvalid ? (
//                   <p className="flex items-center gap-1.5 text-xs text-red-500">
//                     <AlertTriangle size={12} />
//                     End period must be after start period
//                   </p>
//                 ) : (
//                   <p className="text-xs text-neutral-400">
//                     Period:{" "}
//                     <span className="font-medium text-neutral-600">
//                       {period}
//                     </span>
//                   </p>
//                 )}
//               </div>
//             </SectionCard>

//             {/* Context & Narrative */}
//             <SectionCard
//               icon={<FileText size={16} color="#4f46e5" />}
//               title="Context & Narrative"
//               className="border border-neutral-200!"
//             >
//               {/* Description */}
//               <div className="mb-4 flex flex-col gap-1">
//                 <label className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
//                   Description
//                 </label>
//                 <textarea
//                   placeholder="Short summary of filing intent..."
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   rows={2}
//                   className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary/30 resize-none transition"
//                 />
//               </div>

//               {/* Internal Notes */}
//               <div className="flex flex-col gap-1">
//                 <label className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
//                   Internal Notes
//                 </label>
//                 <textarea
//                   placeholder="Confidential auditor notes and cross-references..."
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   rows={4}
//                   className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary/30 resize-none transition"
//                 />
//               </div>
//             </SectionCard>
//           </div>

//           {/* ── Right Column ── */}
//           <div className="flex flex-col gap-5">
//             {/* Assignment */}
//             <CustomCard classname="border border-neutral-200!">
//               <div className="flex items-center gap-2 mb-4">
//                 <UserCheck size={16} className="text-brand-primary" />
//                 <h2 className="text-sm font-semibold text-brand-primary">
//                   Assignment
//                 </h2>
//               </div>

//               {/* Lead Auditor */}
//               <div className="flex flex-col gap-1 mb-1">
//                 <label className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
//                   Lead Auditor
//                 </label>
//                 <div className="relative">
//                   <DropdownSearch
//                     label="Lead Auditor"
//                     options={AUDITOR_OPTIONS}
//                     selected={assignedTo}
//                     onChange={(value) => setAssignedTo(value as string)}
//                   />
//                 </div>
//               </div>

//               <AuditorAvailability name="Marcus T." workload={64} active />
//             </CustomCard>

//             {/* Required Docs */}

//             <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
//               <CustomCard classname="border border-neutral-200!">
//                 <div className="flex items-center gap-2 mb-4">
//                   <Upload size={16} className="text-brand-primary" />
//                   <h2 className="text-sm font-semibold text-brand-primary">
//                     Required Docs
//                   </h2>
//                 </div>

//                 <div className="flex flex-col gap-1 divide-y divide-neutral-100">
//                   {visibleDocs.map((doc) => (
//                     <div key={doc.id} className="py-1 first:pt-0 last:pb-0">
//                       <DocCheckRow
//                         label={doc.label}
//                         checked={doc.checked}
//                         onToggle={() => toggleDoc(doc.id)}
//                       />
//                     </div>
//                   ))}
//                 </div>

//                 {/* Load More / Show Less */}
//                 {docs.length > INITIAL_VISIBLE && (
//                   <button
//                     type="button"
//                     onClick={() =>
//                       isExpanded
//                         ? setVisibleCount(INITIAL_VISIBLE)
//                         : setVisibleCount((prev) => prev + 5)
//                     }
//                     className="mt-3 w-full text-xs font-semibold text-brand-primary hover:underline"
//                   >
//                     {isExpanded ? "Show Less" : "Load More"}
//                   </button>
//                 )}

//                 {/* Add custom requirement */}
//                 {customDocInput ? (
//                   <div className="mt-3 flex gap-2 items-center">
//                     <CustomInput
//                       placeholder="Requirement name..."
//                       value={customDoc}
//                       onChange={(e) => setCustomDoc(e.target.value)}
//                       onKeyDown={(e) => e.key === "Enter" && addCustomDoc()}
//                       className="flex-1"
//                       inputClassName="text-xs"
//                     />
//                     <button
//                       type="button"
//                       onClick={addCustomDoc}
//                       className="shrink-0 rounded-lg bg-brand-primary px-3 py-2 text-xs font-semibold text-white hover:bg-brand-primary transition cursor-pointer"
//                     >
//                       Add
//                     </button>
//                   </div>
//                 ) : (
//                   <button
//                     type="button"
//                     onClick={() => setCustomDocInput(true)}
//                     className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-neutral-300 py-2.5 text-xs font-semibold uppercase tracking-widest text-neutral-400 hover:border-brand-primary hover:text-brand-primary transition cursor-pointer"
//                   >
//                     <Plus size={13} />
//                     Add Custom Requirement
//                   </button>
//                 )}
//               </CustomCard>
//             </div>
//           </div>

//           {/* Footer Actions */}
//           <div className="mt-6 flex items-center justify-end gap-3">
//             <button
//               type="button"
//               onClick={onCancel}
//               className="rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition"
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleSubmit}
//               className="flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-brand-primary active:scale-95 transition-all cursor-pointer"
//             >
//               <Upload size={14} />
//               {isPending ? "Creating..." : "Create Filing"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditFiling;

"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  FileText,
  UserCheck,
  Plus,
  Upload,
  AlertTriangle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomInput } from "@/components/customInput";
import Breadcrumb from "./_components/Breadcrumb";
import DocCheckRow from "./_components/DocCheckRow";
import SectionCard from "./_components/SectionCard";
import FrequencySelector from "./_components/FrequencySelector";
import AuditorAvailability from "./_components/AuditorAvailability";
import { DropdownSearch } from "@/components/ui/searchableDropdown";
import { DatePicker } from "@/components/ui/date-picker";
import {
  useComplianceById,
  useUpdateCompliance,
} from "@/lib/hooks/api/compliance/useCompliance"; //  added useComplianceById + useUpdateCompliance
import { useParams, useSearchParams } from "next/navigation";
import useClientPagination from "@/lib/hooks/client/use-cientPagination";
import { useTeam } from "@/lib/hooks/api/useTeam";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomCard from "@/components/common/custom-card";
import { Frequency } from "@/lib/generated/prisma";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FilingPayload {
  type: string;
  dueDate: string;
  clientId: string;
  description?: string;
  documentsRequired?: string;
  frequency?: Frequency;
  period?: string;
  assignedTo?: string;
  notes?: string;
}

interface RequiredDoc {
  id: string;
  label: string;
  checked: boolean;
}

const DEFAULT_DOCS: RequiredDoc[] = [
  { id: "sales_invoices", label: "Sales Invoices", checked: true },
  { id: "purchase_invoices", label: "Purchase Invoices", checked: true },
  { id: "bank_statement", label: "Bank Statement", checked: true },
  { id: "pnl", label: "Profit & Loss Statement", checked: false },
  { id: "balance_sheet", label: "Balance Sheet", checked: false },
  { id: "audited_fs", label: "Audited Financial Statements", checked: false },
  { id: "tax_working", label: "Tax Working / Computation", checked: false },
  { id: "previous_itr", label: "Previous Year ITR", checked: false },
  { id: "investment_proofs", label: "Investment Proofs", checked: false },
  { id: "tds_working", label: "TDS Working Sheet", checked: false },
  { id: "tds_summary", label: "TDS Data Summary", checked: false },
  { id: "challan", label: "Challan Details", checked: false },
  {
    id: "income_estimate",
    label: "Estimated Income Calculation",
    checked: false,
  },
  { id: "updated_estimate", label: "Updated Income Estimate", checked: false },
  { id: "final_estimate", label: "Final Income Estimate", checked: false },
  { id: "financial_statements", label: "Financial Statements", checked: false },
  { id: "board_resolution", label: "Board Resolution", checked: false },
  { id: "director_list", label: "Director List", checked: false },
  { id: "pan", label: "PAN Card", checked: false },
  { id: "aadhaar", label: "Aadhaar Card", checked: false },
  { id: "address_proof", label: "Address Proof", checked: false },
  { id: "pf_working", label: "PF Working Sheet", checked: false },
  { id: "esi_working", label: "ESI Working Sheet", checked: false },
  { id: "salary_register", label: "Salary Register", checked: false },
  { id: "pt_working", label: "Professional Tax Working", checked: false },
  { id: "form_3ca_3cb", label: "Form 3CA/3CB", checked: false },
  { id: "fssai_license", label: "FSSAI License Copy", checked: false },
  { id: "renewal_application", label: "Renewal Application", checked: false },
];

export const COMPLIANCE_TYPE_OPTIONS = [
  { value: "gstr_1_monthly", label: "GSTR-1 Monthly" },
  { value: "gstr_1_quarterly", label: "GSTR-1 Quarterly (QRMP)" },
  { value: "gstr_3b_monthly", label: "GSTR-3B Monthly" },
  { value: "gstr_3b_quarterly", label: "GSTR-3B Quarterly (QRMP)" },
  { value: "tds_payment", label: "TDS Payment" },
  { value: "tds_return_q1", label: "TDS Return Q1 (Apr–Jun)" },
  { value: "tds_return_q2", label: "TDS Return Q2 (Jul–Sep)" },
  { value: "tds_return_q3", label: "TDS Return Q3 (Oct–Dec)" },
  { value: "tds_return_q4", label: "TDS Return Q4 (Jan–Mar)" },
  { value: "advance_tax_1", label: "Advance Tax – Instalment 1" },
  { value: "advance_tax_2", label: "Advance Tax – Instalment 2" },
  { value: "advance_tax_3", label: "Advance Tax – Instalment 3" },
  { value: "advance_tax_4", label: "Advance Tax – Instalment 4" },
  { value: "itr_non_audit", label: "ITR Filing – Non-Audit" },
  { value: "itr_audit", label: "ITR Filing – Audit" },
  { value: "roc_annual_return", label: "ROC Annual Return" },
  { value: "director_kyc", label: "Director KYC (DIR-3 KYC)" },
  { value: "pf_payment", label: "PF Payment" },
  { value: "esi_payment", label: "ESI Payment" },
  { value: "professional_tax", label: "Professional Tax" },
  { value: "fssai_renewal", label: "FSSAI License Renewal" },
  { value: "custom", label: "Custom Compliance" },
];

type Quarter = "Q1" | "Q2" | "Q3" | "Q4";
const QUARTERS: Quarter[] = ["Q1", "Q2", "Q3", "Q4"];
const YEARS = Array.from({ length: 10 }, (_, i) => 2020 + i);

//  Helper: parse "Q3 2023 – Q4 2023" → { from, to }
function parsePeriod(period?: string): {
  from: { quarter: Quarter; year: number };
  to: { quarter: Quarter; year: number };
} {
  const fallback = { quarter: "Q1" as Quarter, year: new Date().getFullYear() };
  if (!period) return { from: fallback, to: fallback };
  const match = period.match(
    /^(Q[1-4])\s+(\d{4})\s*[–-]\s*(Q[1-4])\s+(\d{4})$/,
  );
  if (!match) return { from: fallback, to: fallback };
  return {
    from: { quarter: match[1] as Quarter, year: Number(match[2]) },
    to: { quarter: match[3] as Quarter, year: Number(match[4]) },
  };
}

//  Helper: merge saved doc labels into DEFAULT_DOCS checkboxes
function buildDocsFromSaved(savedCsv?: string): RequiredDoc[] {
  if (!savedCsv) return DEFAULT_DOCS;
  const savedLabels = new Set(savedCsv.split(",").map((s) => s.trim()));
  const base = DEFAULT_DOCS.map((d) => ({
    ...d,
    checked: savedLabels.has(d.label),
  }));
  // Add any saved doc that doesn't exist in DEFAULT_DOCS as a custom entry
  const baseLabels = new Set(DEFAULT_DOCS.map((d) => d.label));
  const customs: RequiredDoc[] = [];
  savedLabels.forEach((label) => {
    if (!baseLabels.has(label)) {
      customs.push({ id: `custom_${label}`, label, checked: true });
    }
  });
  return [...base, ...customs];
}

// ── Skeleton loader ────────────────────────────────────────────────────────────
function EditFilingSkeleton() {
  return (
    <div className="min-h-screen font-sans animate-pulse">
      <div className="mx-auto">
        {/* Breadcrumb placeholder */}
        <div className="h-4 w-48 bg-neutral-200 rounded mb-4" />
        <div className="h-8 w-64 bg-neutral-200 rounded mb-2" />
        <div className="h-4 w-96 bg-neutral-200 rounded mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
          <div className="flex flex-col gap-5">
            {/* Primary Info card */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
              <div className="h-4 w-36 bg-neutral-200 rounded" />
              <div className="h-10 bg-neutral-100 rounded-xl" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-neutral-100 rounded-xl" />
                <div className="h-10 bg-neutral-100 rounded-xl" />
              </div>
              <div className="h-10 bg-neutral-100 rounded-xl" />
              <div className="h-20 bg-neutral-100 rounded-xl" />
            </div>

            {/* Context card */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
              <div className="h-4 w-36 bg-neutral-200 rounded" />
              <div className="h-16 bg-neutral-100 rounded-xl" />
              <div className="h-24 bg-neutral-100 rounded-xl" />
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-3">
              <div className="h-4 w-24 bg-neutral-200 rounded" />
              <div className="h-10 bg-neutral-100 rounded-xl" />
              <div className="h-6 bg-neutral-100 rounded" />
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-2">
              <div className="h-4 w-28 bg-neutral-200 rounded" />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 bg-neutral-100 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export const EditFiling: React.FC<{
  onSubmit?: (payload: FilingPayload) => void;
  onCancel?: () => void;
}> = ({ onSubmit, onCancel }) => {
  const params = useParams();
  const id = params?.id as string;
  const searchParams = useSearchParams();
  const date = searchParams.get("date");

  // ── Fetch existing compliance ──────────────────────────────────────────────
  const { data, isLoading: isLoadingCompliance, error } = useComplianceById(id); //  renamed isLoading
  const complianceData = data?.data?.complianceItem;

  // ── State ──────────────────────────────────────────────────────────────────
  const [clientId, setClientId] = useState("");
  const [type, setType] = useState("");
  const [dueDate, setDueDate] = useState<string>(date || "");
  const [frequency, setFrequency] = useState<Frequency>("QUARTERLY");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [docs, setDocs] = useState<RequiredDoc[]>(DEFAULT_DOCS);
  const [customDocInput, setCustomDocInput] = useState(false);
  const [customDoc, setCustomDoc] = useState("");
  const [periodFrom, setPeriodFrom] = useState<{
    quarter: Quarter;
    year: number;
  }>({
    quarter: "Q1",
    year: new Date().getFullYear(),
  });
  const [periodTo, setPeriodTo] = useState<{ quarter: Quarter; year: number }>({
    quarter: "Q1",
    year: new Date().getFullYear(),
  });
  const INITIAL_VISIBLE = 5;
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  //  Pre-populate form once complianceData is loaded
  useEffect(() => {
    if (!complianceData) return;

    setClientId(complianceData.clientId ?? "");
    setType(complianceData.type ?? "");
    // Strip time portion for date input
    setDueDate(
      complianceData.dueDate ? complianceData.dueDate.split("T")[0] : "",
    );
    setFrequency((complianceData.frequency as Frequency) ?? "QUARTERLY");
    setDescription(complianceData.description ?? "");
    setNotes(complianceData.notes ?? "");
    setAssignedTo(complianceData.assignedTo ?? "");

    const { from, to } = parsePeriod(complianceData.period);
    setPeriodFrom(from);
    setPeriodTo(to);

    setDocs(buildDocsFromSaved(complianceData.documentsRequired));
  }, [complianceData]);

  // ── Clients & Team ─────────────────────────────────────────────────────────
  const {
    clients,
    setPage,
    search,
    setSearch,
    isLoading: isLoadingClients,
  } = useClientPagination(); //  renamed
  const clientOptions = useMemo(
    () =>
      clients.map((client: any) => ({
        value: client.id,
        label: `${client.name} (${client.businessName})`,
      })),
    [clients],
  );

  const { getMember } = useTeam({ page: 1, limit: 1000 });
  const teamMembers = getMember.data?.data?.data || [];
  const formatRole = useCallback(
    (role: string) => role.charAt(0) + role.slice(1).toLowerCase(),
    [],
  );
  const AUDITOR_OPTIONS = useMemo(
    () =>
      teamMembers.map((member: any) => ({
        value: member.id,
        label: `${member.name} (${formatRole(member.role)})`,
      })),
    [teamMembers, formatRole],
  );

  // ── Derived ────────────────────────────────────────────────────────────────
  const sortedDocs = [...docs].sort((a, b) => {
    if (a.checked === b.checked) return 0;
    return a.checked ? -1 : 1;
  });
  const visibleDocs = sortedDocs.slice(0, visibleCount);
  const isExpanded = visibleCount >= docs.length;
  const isPastDue = dueDate && new Date(dueDate) < new Date();
  const period = `${periodFrom.quarter} ${periodFrom.year} – ${periodTo.quarter} ${periodTo.year}`;
  const isInvalid =
    periodFrom.year > periodTo.year ||
    (periodFrom.year === periodTo.year &&
      QUARTERS.indexOf(periodFrom.quarter) >
        QUARTERS.indexOf(periodTo.quarter));

  //  Use update mutation instead of create
  const { mutate: updateCompliance, isPending } = useUpdateCompliance();

  const toggleDoc = (id: string) =>
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, checked: !d.checked } : d)),
    );

  const addCustomDoc = () => {
    if (!customDoc.trim()) return;
    setDocs((prev) => [
      ...prev,
      { id: `custom_${Date.now()}`, label: customDoc.trim(), checked: true },
    ]);
    setCustomDoc("");
    setCustomDocInput(false);
  };

  const formatDateLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const parsedDate = dueDate ? new Date(`${dueDate}T00:00:00`) : undefined;

  // handleSubmit now calls updateCompliance with id
  const handleSubmit = () => {
    updateCompliance({
      id,
      data: {
        type,
        dueDate,
        clientId,
        description: description || undefined,
        documentsRequired: docs
          .filter((d) => d.checked)
          .map((d) => d.label)
          .join(","),
        frequency,
        period: `${periodFrom.quarter} ${periodFrom.year} – ${periodTo.quarter} ${periodTo.year}`,
        assignedTo: assignedTo || undefined,
        notes: notes || undefined,
      },
    });
  };

  //  Show skeleton while loading
  if (isLoadingCompliance) return <EditFilingSkeleton />;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen font-sans">
      <div className="mx-auto">
        <Breadcrumb />
        <h1 className="text-3xl font-bold text-neutral-900 mb-1 tracking-tight">
          Edit Filing
        </h1>
        <p className="text-sm text-neutral-500 mb-8 max-w-md leading-relaxed">
          Update this compliance task. Ensure all regulatory periods and
          required documentation are accurately mapped to the client profile.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
          <div className="flex flex-col gap-5">
            <SectionCard
              icon={<Info size={16} color="#4f46e5" />}
              title="Primary Information"
              className="border border-neutral-200!"
            >
              <DropdownSearch
                label="Client"
                options={clientOptions}
                selected={clientId}
                onChange={(value) => setClientId(value as string)}
                searchValue={search}
                onChangeSearch={setSearch}
                loading={isLoadingClients}
                onPageChange={() => setPage((prev) => prev + 1)}
              />

              <div className="grid grid-cols-2 gap-4 mb-4 mt-2">
                <DropdownSearch
                  label="Compliance Type"
                  options={COMPLIANCE_TYPE_OPTIONS}
                  selected={type}
                  onChange={(value) => setType(value as string)}
                  required
                />
                <DatePicker
                  label="Due Date"
                  value={parsedDate}
                  onDateChange={(date) => {
                    if (!date) return;
                    setDueDate(formatDateLocal(date));
                  }}
                  required
                />
              </div>

              <div className="mb-4">
                <FrequencySelector value={frequency} onChange={setFrequency} />
              </div>

              {/* Filing Period */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                  Filing Period
                </label>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 w-full">
                  {/* From */}
                  <div
                    className={cn(
                      "flex flex-col gap-2 bg-neutral-50 border rounded-xl px-4 py-3 w-full",
                      isInvalid ? "border-red-400" : "border-neutral-200",
                    )}
                  >
                    <span className="text-[9px] font-semibold uppercase tracking-widest text-neutral-400">
                      From
                    </span>
                    <div className="grid grid-cols-[1fr_1.4fr] gap-2 w-full">
                      <Select
                        value={periodFrom.quarter}
                        onValueChange={(v) =>
                          setPeriodFrom((p) => ({
                            ...p,
                            quarter: v as Quarter,
                          }))
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            "h-9 text-xs font-medium w-full",
                            isInvalid && "border-red-400 ring-1 ring-red-200",
                          )}
                        >
                          <SelectValue placeholder="Q" />
                        </SelectTrigger>
                        <SelectContent>
                          {QUARTERS.map((q) => (
                            <SelectItem key={q} value={q}>
                              {q}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={String(periodFrom.year)}
                        onValueChange={(v) =>
                          setPeriodFrom((p) => ({ ...p, year: Number(v) }))
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            "h-9 text-xs font-medium w-full",
                            isInvalid && "border-red-400 ring-1 ring-red-200",
                          )}
                        >
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {YEARS.map((y) => (
                            <SelectItem key={y} value={String(y)}>
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className="w-px h-5 bg-neutral-300" />
                    <span className="text-[11px] font-medium text-neutral-400">
                      to
                    </span>
                    <div className="w-px h-5 bg-neutral-300" />
                  </div>

                  {/* To */}
                  <div
                    className={cn(
                      "flex flex-col gap-2 bg-neutral-50 border rounded-xl px-4 py-3 w-full",
                      isInvalid ? "border-red-400" : "border-neutral-200",
                    )}
                  >
                    <span className="text-[9px] font-semibold uppercase tracking-widest text-neutral-400">
                      To
                    </span>
                    <div className="grid grid-cols-[1fr_1.4fr] gap-2 w-full">
                      <Select
                        value={periodTo.quarter}
                        onValueChange={(v) =>
                          setPeriodTo((p) => ({ ...p, quarter: v as Quarter }))
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            "h-9 text-xs font-medium w-full",
                            isInvalid && "border-red-400 ring-1 ring-red-200",
                          )}
                        >
                          <SelectValue placeholder="Q" />
                        </SelectTrigger>
                        <SelectContent>
                          {QUARTERS.map((q) => (
                            <SelectItem key={q} value={q}>
                              {q}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={String(periodTo.year)}
                        onValueChange={(v) =>
                          setPeriodTo((p) => ({ ...p, year: Number(v) }))
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            "h-9 text-xs font-medium w-full",
                            isInvalid && "border-red-400 ring-1 ring-red-200",
                          )}
                        >
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {YEARS.map((y) => (
                            <SelectItem key={y} value={String(y)}>
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {isInvalid ? (
                  <p className="flex items-center gap-1.5 text-xs text-red-500">
                    <AlertTriangle size={12} /> End period must be after start
                    period
                  </p>
                ) : (
                  <p className="text-xs text-neutral-400">
                    Period:{" "}
                    <span className="font-medium text-neutral-600">
                      {period}
                    </span>
                  </p>
                )}
              </div>
            </SectionCard>

            {/* Context & Narrative */}
            <SectionCard
              icon={<FileText size={16} color="#4f46e5" />}
              title="Context & Narrative"
              className="border border-neutral-200!"
            >
              <div className="mb-4 flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                  Description
                </label>
                <textarea
                  placeholder="Short summary of filing intent..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary/30 resize-none transition"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                  Internal Notes
                </label>
                <textarea
                  placeholder="Confidential auditor notes and cross-references..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary/30 resize-none transition"
                />
              </div>
            </SectionCard>
          </div>

          {/* ── Right Column ── */}
          <div className="flex flex-col gap-5">
            <CustomCard classname="border border-neutral-200!">
              <div className="flex items-center gap-2 mb-4">
                <UserCheck size={16} className="text-brand-primary" />
                <h2 className="text-sm font-semibold text-brand-primary">
                  Assignment
                </h2>
              </div>
              <div className="flex flex-col gap-1 mb-1">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                  Lead Auditor
                </label>
                <DropdownSearch
                  label="Lead Auditor"
                  options={AUDITOR_OPTIONS}
                  selected={assignedTo}
                  onChange={(value) => setAssignedTo(value as string)}
                />
              </div>
              <AuditorAvailability name="Marcus T." workload={64} active />
            </CustomCard>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <CustomCard classname="border border-neutral-200!">
                <div className="flex items-center gap-2 mb-4">
                  <Upload size={16} className="text-brand-primary" />
                  <h2 className="text-sm font-semibold text-brand-primary">
                    Required Docs
                  </h2>
                </div>
                <div className="flex flex-col gap-1 divide-y divide-neutral-100">
                  {visibleDocs.map((doc) => (
                    <div key={doc.id} className="py-1 first:pt-0 last:pb-0">
                      <DocCheckRow
                        label={doc.label}
                        checked={doc.checked}
                        onToggle={() => toggleDoc(doc.id)}
                      />
                    </div>
                  ))}
                </div>

                {docs.length > INITIAL_VISIBLE && (
                  <button
                    type="button"
                    onClick={() =>
                      isExpanded
                        ? setVisibleCount(INITIAL_VISIBLE)
                        : setVisibleCount((prev) => prev + 5)
                    }
                    className="mt-3 w-full text-xs font-semibold text-brand-primary hover:underline"
                  >
                    {isExpanded ? "Show Less" : "Load More"}
                  </button>
                )}

                {customDocInput ? (
                  <div className="mt-3 flex gap-2 items-center">
                    <CustomInput
                      placeholder="Requirement name..."
                      value={customDoc}
                      onChange={(e) => setCustomDoc(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addCustomDoc()}
                      className="flex-1"
                      inputClassName="text-xs"
                    />
                    <button
                      type="button"
                      onClick={addCustomDoc}
                      className="shrink-0 rounded-lg bg-brand-primary px-3 py-2 text-xs font-semibold text-white transition cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCustomDocInput(true)}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 px-2 rounded-xl border border-dashed border-neutral-300 py-2.5 text-xs font-semibold uppercase tracking-widest text-neutral-400 hover:border-brand-primary hover:text-brand-primary transition cursor-pointer"
                  >
                    <Plus size={13} /> Add Custom Requirement
                  </button>
                )}
              </CustomCard>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || isInvalid}
              className="flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-brand-primary active:scale-95 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Upload size={14} />
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFiling;
