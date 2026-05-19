import React, { Dispatch, SetStateAction } from "react";
import { CustomInput } from "@/components/customInput";
import { DropdownSearch } from "@/components/ui/searchableDropdown";
import {
  Phone,
  User,
  Building2,
  MapPin,
  MapPinCheck,
  MapPinPlusInside,
  MapPinHouse,
} from "lucide-react";

interface ClientDetailsType {
  name: string;
  businessName: string;
  phone: string;
  businessType: string;
  isGstRegistered: string;
  addressOne: string;
  addressTwo: string;
  district: string;
  pinCode: string;
  state: string;
}

interface ClientBasicDetailsTabProps {
  data: ClientDetailsType;
  onChange: (key: string, value: any) => void;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export const ClientBasicDetailsTab: React.FC<ClientBasicDetailsTabProps> = ({
  data,
  onChange,
  errors,
  touched,
}) => {
  const businessTypeOptions = [
    { label: "Pvt Ltd", value: "pvt_ltd" },
    { label: "Partnership", value: "partnership" },
    { label: "Proprietorship", value: "proprietorship" },
    { label: "LLP", value: "llp" },
  ];

  const gstOptions = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];

  return (
    <div className="space-y-6">
      {/* Personal & Business Information Section */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-neutral-900 border-b border-neutral-200 pb-2">
          Client Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="Full Name"
            id="name"
            type="text"
            placeholder="Enter full name"
            value={data.name}
            iconLeft={<User size={18} />}
            inputClassName="bg-white border-neutral-200 focus:border-brand-primary"
            onChange={(e) => onChange("name", e.target.value)}
            required
            height="h-10"
            error={touched.name && errors.name ? errors.name : ""}
          />

          <CustomInput
            label="Business Name"
            id="businessName"
            type="text"
            placeholder="Enter business name"
            value={data.businessName}
            iconLeft={<Building2 size={18} />}
            inputClassName="bg-white border-neutral-200 focus:border-brand-primary"
            onChange={(e) => onChange("businessName", e.target.value)}
            required
            height="h-10"
            error={
              touched.businessName && errors.businessName
                ? errors.businessName
                : ""
            }
          />
        </div>

        <CustomInput
          label="Phone Number (+91)"
          id="phone"
          type="tel"
          placeholder="Enter phone number"
          value={data.phone}
          iconLeft={<Phone size={18} />}
          inputClassName="bg-white border-neutral-200 focus:border-brand-primary"
          onChange={(e) => onChange("phone", e.target.value)}
          required
          height="h-10"
          error={touched.phone && errors.phone ? errors.phone : ""}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DropdownSearch
            multiSelect={false}
            label="Business Type"
            placeholder="Select Business Type"
            options={businessTypeOptions}
            selected={data.businessType}
            onChange={(val) => onChange("businessType", val)}
            required
            error={
              touched.businessType && errors.businessType
                ? errors.businessType
                : ""
            }
          />

          <DropdownSearch
            multiSelect={false}
            label="GST Registered"
            placeholder="Select GST status"
            options={gstOptions}
            selected={data.isGstRegistered}
            onChange={(val) => onChange("isGstRegistered", val)}
            required
            error={
              touched.isGstRegistered && errors.isGstRegistered
                ? errors.isGstRegistered
                : ""
            }
          />
        </div>
      </div>

      {/* Address Information Section */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-neutral-900 border-b border-neutral-200 pb-2">
          Address Information
        </h3>

        <CustomInput
          label="Address Line 1"
          id="addressOne"
          type="text"
          placeholder="Building name / landmark"
          value={data.addressOne}
          iconLeft={<MapPin size={18} />}
          inputClassName="bg-white border-neutral-200 focus:border-brand-primary"
          onChange={(e) => onChange("addressOne", e.target.value)}
          required
          height="h-10"
          error={
            touched.addressOne && errors.addressOne ? errors.addressOne : ""
          }
        />

        <CustomInput
          label="Address Line 2"
          id="addressTwo"
          type="text"
          placeholder="Street name / area"
          value={data.addressTwo}
          iconLeft={<MapPin size={18} />}
          inputClassName="bg-white border-neutral-200 focus:border-brand-primary"
          onChange={(e) => onChange("addressTwo", e.target.value)}
          required
          height="h-10"
          error={
            touched.addressTwo && errors.addressTwo ? errors.addressTwo : ""
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="District"
            id="district"
            type="text"
            placeholder="Enter district"
            value={data.district}
            iconLeft={<MapPinCheck size={18} />}
            inputClassName="bg-white border-neutral-200 focus:border-brand-primary"
            onChange={(e) => onChange("district", e.target.value)}
            required
            height="h-10"
            error={touched.district && errors.district ? errors.district : ""}
          />

          <CustomInput
            label="PIN Code"
            id="pinCode"
            type="text"
            placeholder="Enter PIN code"
            value={data.pinCode}
            iconLeft={<MapPinPlusInside size={18} />}
            inputClassName="bg-white border-neutral-200 focus:border-brand-primary"
            onChange={(e) => onChange("pinCode", e.target.value)}
            required
            height="h-10"
            error={touched.pinCode && errors.pinCode ? errors.pinCode : ""}
          />
        </div>

        <CustomInput
          label="State"
          id="state"
          type="text"
          placeholder="Enter state"
          value={data.state}
          iconLeft={<MapPinHouse size={18} />}
          inputClassName="bg-white border-neutral-200 focus:border-brand-primary"
          onChange={(e) => onChange("state", e.target.value)}
          required
          height="h-10"
          error={touched.state && errors.state ? errors.state : ""}
        />
      </div>
    </div>
  );
};
