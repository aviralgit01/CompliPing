import React, { useEffect, useState, useCallback, useRef } from "react";
import { DynamicModal } from "@/components/common/modal/modal";
import { CustomInput } from "@/components/customInput";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/common/toast";
import { useCreateClient } from "@/lib/hooks/api/useClients";
import {
  User,
  Mail,
  Lock,
  Building2,
  UserCheck,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  Banknote,
  MapPin,
  Phone,
  MapPinCheck,
  MapPinPlusInside,
  MapPinHouse,
} from "lucide-react";
import { DropdownSearch } from "@/components/ui/searchableDropdown";
import toast from "react-hot-toast";

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

type ClientForm = {
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
};

const initialClientData: ClientForm = {
  name: "",
  businessName: "",
  phone: "",
  businessType: "",
  isGstRegistered: "",
  addressOne: "",
  addressTwo: "",
  district: "",
  pinCode: "",
  state: "",
};

interface CreateClientProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: () => void;
}

const CreateClient: React.FC<CreateClientProps> = ({
  isOpen,
  onClose,
  onAddClient,
}) => {
  const [clientData, setClientData] = useState<ClientForm>(initialClientData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ClientForm, string>>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof ClientForm, boolean>>
  >({});

  const [loading, setLoading] = useState<boolean>(false);

  const { mutate: createClient, isPending } = useCreateClient();

  const validateField = (key: keyof ClientForm, value: string) => {
    switch (key) {
      case "name":
        return value.trim() ? "" : "Full name is required";
      case "businessName":
        return value.trim() ? "" : "Business name is required";
      case "phone":
        return /^\d{10}$/.test(value)
          ? ""
          : "Enter a valid 10-digit phone number";
      case "businessType":
        return value ? "" : "Business type is required";
      case "isGstRegistered":
        return value ? "" : "GST status is required";
      case "addressOne":
        return value.trim() ? "" : "Address line 1 is required";
      case "addressTwo":
        return value.trim() ? "" : "Address line 2 is required";
      case "district":
        return value.trim() ? "" : "District is required";
      case "pinCode":
        return /^\d{6}$/.test(value) ? "" : "Enter a valid 6-digit pincode";
      case "state":
        return value.trim() ? "" : "State is required";
      default:
        return "This field is required";
    }
  };

  const validateAllFields = () => {
    const nextErrors = {} as Partial<Record<keyof ClientForm, string>>;
    let valid = true;

    (Object.keys(clientData) as (keyof ClientForm)[]).forEach((key) => {
      const error = validateField(key, clientData[key]);
      if (error) valid = false;
      nextErrors[key] = error;
    });

    setErrors(nextErrors);
    setTouched(
      Object.keys(clientData).reduce(
        (acc, key) => {
          acc[key as keyof ClientForm] = true;
          return acc;
        },
        {} as Partial<Record<keyof ClientForm, boolean>>,
      ),
    );

    return valid;
  };

  const handleInputChange = (key: keyof ClientForm, value: any) => {
    setClientData((prev) => ({ ...prev, [key]: value }));
    if (touched[key]) {
      setErrors((prev) => ({
        ...prev,
        [key]: validateField(key, value),
      }));
    }
  };

  const handleClose = useCallback((): void => {
    setClientData({
      name: "",
      businessName: "",
      phone: "",
      businessType: "",
      isGstRegistered: "",
      addressOne: "",
      addressTwo: "",
      district: "",
      pinCode: "",
      state: "",
    });
    setErrors({});
    setTouched({});
    onClose();
  }, [onClose]);

  // --- END OF UPDATES ---

  const handleClientCreate = async (): Promise<void> => {
    if (!validateAllFields()) {
      showToast.error("Please fix the validation errors.");
      return;
    }

    if (clientData.phone == "" || !/^\d{10}$/.test(clientData.phone)) {
      showToast.error("Please enter a valid 10-digit phone number");
      return;
    }

    const payload = {
      ...clientData,
      isGstRegistered: clientData.isGstRegistered === "yes",
    };

    createClient(payload, {
      onSuccess: () => {
        handleClose(); // Resets and closes modal
        onAddClient(); // Triggers any parent refetch logic if needed
      },
    });
  };

  return (
    <DynamicModal
      header={{
        title: (
          <div className="flex items-center gap-3">
            <div className="w-12 h-10 bg-linear-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 font-montserrat">
                Create Client
              </h2>
              <p className="text-sm text-neutral-600">
                Add a new business client to your organization
              </p>
            </div>
          </div>
        ),
      }}
      isOpen={isOpen}
      onClose={handleClose}
      loading={loading}
      className="max-w-4xl"
      footer={
        <div className="flex gap-3 w-full pt-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="flex-1 h-10 border-neutral-300 hover:bg-neutral-50 font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={handleClientCreate}
            // disabled={loading || !isFormValid}
            className={`flex-1 h-10 font-medium transition-all duration-300 `}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <UserCheck size={18} />
                Create Client
              </div>
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-6 max-h-[75vh] pr-2">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
            <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center">
              <User size={16} className="text-brand-primary" />
            </div>
            <h3 className="font-semibold text-neutral-900">
              Personal Information
            </h3>
          </div>

          <CustomInput
            label="Full Name"
            id="name"
            type="text"
            placeholder="Enter full name"
            value={clientData.name}
            iconLeft={<User size={18} />}
            inputClassName="bg-white border-neutral-200 focus:border-brand-primary"
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
            error={touched.name ? errors.name : ""}
            height="h-10"
          />

          <CustomInput
            label="Business Name"
            id="businessName"
            type="text"
            placeholder="Enter your business name"
            value={clientData.businessName}
            iconLeft={<Building2 size={18} />}
            inputClassName="bg-white border-neutral-200 focus:border-brand-primary"
            onChange={(e) => handleInputChange("businessName", e.target.value)}
            required
            error={touched.businessName ? errors.businessName : ""}
            height="h-10"
          />

          <CustomInput
            label="Phone Number (+91)"
            id="phone"
            type="tel"
            iconLeft={<Phone size={18} />}
            placeholder="Enter phone number"
            value={clientData.phone}
            inputClassName="bg-white border-neutral-200 focus:border-brand-primary"
            onChange={(e) => handleInputChange("phone", e.target.value)}
            required
            error={touched.phone ? errors.phone : ""}
            height="h-10"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DropdownSearch
              multiSelect={false}
              label="Business Type"
              placeholder={`Select Business Type`}
              options={businessTypeOptions}
              selected={clientData.businessType}
              onChange={(val) => handleInputChange("businessType", val)}
              required
              error={touched.businessType ? errors.businessType : ""}
            />

            <DropdownSearch
              multiSelect={false}
              label="GST Registerd"
              placeholder={`Select GST status`}
              options={gstOptions}
              selected={clientData.isGstRegistered}
              onChange={(val) => handleInputChange("isGstRegistered", val)}
              required
              error={touched.isGstRegistered ? errors.isGstRegistered : ""}
            />
          </div>

          <CustomInput
            label="Address One"
            id="addressOne"
            type="text"
            placeholder="Enter your building name / landmark"
            value={clientData.addressOne}
            iconLeft={<MapPin size={18} />}
            inputClassName="bg-white border-neutral-200 focus:border-brand-primary"
            onChange={(e) => handleInputChange("addressOne", e.target.value)}
            required
            error={touched.addressOne ? errors.addressOne : ""}
            height="h-10"
          />

          <CustomInput
            label="Address Two"
            id="addressTwo"
            type="text"
            placeholder="Enter your street name"
            value={clientData.addressTwo}
            iconLeft={<MapPin size={18} />}
            inputClassName="bg-white border-neutral-200 focus:border-brand-primary"
            onChange={(e) => handleInputChange("addressTwo", e.target.value)}
            required
            error={touched.addressTwo ? errors.addressTwo : ""}
            height="h-10"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              label="District"
              id="district"
              type="text"
              placeholder="Enter your district"
              value={clientData.district}
              iconLeft={<MapPinCheck size={18} />}
              inputClassName="bg-white border-neutral-200 focus:border-brand-primary"
              onChange={(e) => handleInputChange("district", e.target.value)}
              required
              error={touched.district ? errors.district : ""}
              height="h-10"
            />

            <CustomInput
              label="Pincode"
              id="pinCode"
              type="text"
              placeholder="Enter your pinCode"
              value={clientData.pinCode}
              iconLeft={<MapPinPlusInside size={18} />}
              inputClassName="bg-white border-neutral-200 focus:border-brand-primary"
              onChange={(e) => handleInputChange("pinCode", e.target.value)}
              required
              error={touched.pinCode ? errors.pinCode : ""}
              height="h-10"
            />
          </div>

          <CustomInput
            label="State"
            id="state"
            type="text"
            placeholder="Enter your state"
            value={clientData.state}
            iconLeft={<MapPinHouse size={18} />}
            inputClassName="bg-white border-neutral-200 focus:border-brand-primary"
            onChange={(e) => handleInputChange("state", e.target.value)}
            required
            error={touched.state ? errors.state : ""}
            height="h-10"
          />
        </div>
      </div>
    </DynamicModal>
  );
};

export default CreateClient;
