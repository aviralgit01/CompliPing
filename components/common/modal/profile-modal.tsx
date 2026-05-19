import React, { useEffect, useState } from "react";
import { DynamicModal } from "./modal";
import {
  AlertCircle,
  BadgeCheck,
  User,
  MapPin,
  Mail,
  Phone,
  Building2,
  UserCheck,
  Banknote,
  CreditCard,
  FileText,
  Download,
  ExternalLink,
  Home,
  Shield,
  Clock,
  BadgeMinusIcon,
  CircleXIcon,
  MinusCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
} from "@/components/ui/avatar";
import { useGetClientById } from "@/lib/hooks/api/useClients";

interface BasicDetailsType {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  businessType: string;
  isGstRegistered: boolean | null;
  optInStatus: string;
  addressOne: string;
  addressTwo: string;
  district: string;
  pinCode: string;
  state: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string;
}

const getGstStatusColor = (status?: boolean | null) => {
  switch (status) {
    case true:
      return "text-green-600 border-green-200 bg-green-50";
    case false:
      return "text-red-600 border-red-200 bg-red-50";
    default:
      return "text-gray-500 border-gray-200 bg-gray-50";
  }
};

const getGstStatusIcon = (status?: boolean | null) => {
  switch (status) {
    case true:
      return <BadgeCheck className="w-3 h-3" />;
    case false:
      return <CircleXIcon className="w-3 h-3" />;
    default:
      return <MinusCircle className="w-3 h-3" />;
  }
};

const getStatusColor = (status: string = "active") => {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "inactive":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

const getStatusIcon = (status: string = "active") => {
  switch (status) {
    case "active":
      return <BadgeCheck className="w-3 h-3" />;
    case "inactive":
      return <BadgeMinusIcon className="w-3 h-3" />;
    case "pending":
      return <AlertCircle className="w-3 h-3" />;
    default:
      return <BadgeCheck className="w-3 h-3" />;
  }
};

function ProfileModal({ isOpen, onClose, clientId }: ProfileModalProps) {
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useGetClientById(clientId, !!clientId && isOpen);

  useEffect(() => {
    const client = data?.data?.[0];
    if (!client) return;

    setBasicDetails({
      id: client.id || "",
      name: client.name || "",
      businessName: client.businessName || "",
      phone: client.phone || "",
      businessType: client.businessType || "",
      isGstRegistered: client.isGstRegistered === true ? true : false,
      optInStatus: client.optInStatus || "",
      addressOne: client.addressOne || "",
      addressTwo: client.addressTwo || "",
      district: client.district || "",
      pinCode: client.pinCode || "",
      state: client.state || "",
    });
    setLoading(isLoading);
  }, [data]);

  const [basicDetails, setBasicDetails] = useState<BasicDetailsType>({
    id: "",
    name: "",
    businessName: "",
    phone: "",
    businessType: "",
    isGstRegistered: false,
    optInStatus: "",
    addressOne: "",
    addressTwo: "",
    district: "",
    pinCode: "",
    state: "",
  });

  const renderValue = (val: any) =>
    val || <span className="text-neutral-400">—</span>;

  const InfoCard = ({
    label,
    value,
    className = "",
  }: {
    label: string;
    value: any;
    className?: string;
  }) => (
    <div
      className={`p-3 rounded-lg bg-neutral-50/50 border border-neutral-200/60 ${className}`}
    >
      <p className="text-xs font-medium text-neutral-600 mb-1">{label}</p>
      <p className="text-sm font-semibold text-neutral-900 wrap-break-word">
        {value}
      </p>
    </div>
  );

  return (
    <DynamicModal
      header={{
        title: (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
              <User size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 font-montserrat">
                Client Profile
              </h2>
              <p className="text-sm text-neutral-600">
                Detailed information and records
              </p>
            </div>
          </div>
        ),
      }}
      isOpen={isOpen}
      onClose={onClose}
      loading={loading}
      className="max-w-4xl"
    >
      <div className="space-y-6 max-h-[80vh]  pr-2">
        {loading ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Enhanced Header Section */}
            <div className="bg-linear-to-r from-white via-brand-muted to-white rounded-2xl p-6  border border-neutral-200">
              <div className="flex items-start gap-6">
                <Avatar className="sm:h-20 sm:w-20 h-10 w-10 ring-4 ring-white shadow-lg">
                  <AvatarImage src="" alt={basicDetails.name} />
                  <AvatarFallback className="text-2xl font-bold bg-linear-to-br from-brand-primary to-brand-secondary text-white">
                    {basicDetails.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                    {renderValue(basicDetails.name)}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getGstStatusColor(basicDetails?.isGstRegistered)}`}
                    >
                      {getGstStatusIcon(basicDetails?.isGstRegistered)}
                      {basicDetails?.isGstRegistered
                        ? "GST Registered"
                        : "GST Not Registered"}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(basicDetails?.optInStatus)}`}
                    >
                      {getStatusIcon(basicDetails?.optInStatus)}
                      {(basicDetails?.optInStatus || "active")
                        .replace("-", " ")
                        .toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information Grid */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Client Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  label="Business Name"
                  value={renderValue(basicDetails?.businessName)}
                />

                <InfoCard
                  label="Phone Number"
                  value={renderValue(`+91-${basicDetails.phone}`)}
                />

                <InfoCard
                  label="Business Type"
                  value={
                    <span className="capitalize">
                      {renderValue(
                        basicDetails?.businessType.replace(/-/g, " "),
                      )}
                    </span>
                  }
                />

                <InfoCard
                  label="Address Line 1"
                  value={
                    <span className="capitalize">
                      {renderValue(basicDetails?.addressOne.replace(/-/g, " "))}
                    </span>
                  }
                />

                <InfoCard
                  label="Address Line 2"
                  value={
                    <span className="capitalize">
                      {renderValue(basicDetails?.addressTwo.replace(/-/g, " "))}
                    </span>
                  }
                />

                <InfoCard
                  label="District"
                  value={renderValue(`${basicDetails?.district}`)}
                />

                <InfoCard
                  label="State - PinCode"
                  value={renderValue(
                    `${basicDetails?.state} - ${basicDetails?.pinCode}`,
                  )}
                  className="md:col-span-2"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </DynamicModal>
  );
}

export default ProfileModal;
