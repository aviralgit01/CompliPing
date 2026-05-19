import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Building2, MapPin, FileText } from "lucide-react";
import { DynamicModal } from "@/components/common/modal/modal";
import { showToast } from "@/components/common/toast";
import { useGetClientById, useUpdateClient } from "@/lib/hooks/api/useClients";
import { ClientBasicDetailsTab } from "./basic-details";
import { TabNavigation } from "./tabs";

interface EditClientProps {
  clientId: string;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

type ClientDetailsType = {
  id: string;
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

const initialClientDetails: ClientDetailsType = {
  id: "",
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

const EditClient: React.FC<EditClientProps> = ({
  clientId,
  isOpen,
  onClose,
  onEdit,
}) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "onboarding">("basic");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [clientDetails, setClientDetails] =
    useState<ClientDetailsType>(initialClientDetails);
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    {
      id: "basic",
      label: "Basic Details",
      icon: <User size={16} />,
      description: "Client, business & address information",
    },
    {
      id: "onboarding",
      label: "Onboarding",
      icon: <FileText size={16} />,
      description: "Documents & additional details",
    },
  ];

  const { data, isFetching, refetch } = useGetClientById(
    clientId,
    !!clientId && isOpen,
  );
  const { mutateAsync: updateClient } = useUpdateClient();

  useEffect(() => {
    console.log("clientId =>", clientId);
    console.log("isOpen =>", isOpen);
  }, [clientId, isOpen]);

  const getClientData = async () => {
    if (!clientId) return;

    setLoading(true);
    try {
      const response: any = await refetch();
      const client = response?.data?.data?.[0] || response?.data?.data;

      if (client) {
        setClientDetails({
          id: client.id || "",
          name: client.name || "",
          businessName: client.businessName || "",
          phone: client.phone || "",
          businessType: client.businessType || "",
          isGstRegistered:
            client.isGstRegistered === true
              ? "yes"
              : client.isGstRegistered === false
                ? "no"
                : "",
          addressOne: client.addressOne || "",
          addressTwo: client.addressTwo || "",
          district: client.district || "",
          pinCode: client.pinCode || "",
          state: client.state || "",
        });
      } else {
        showToast.error("Failed to fetch client data");
      }
    } catch (err: any) {
      showToast.error(err?.message || "Error fetching client data");
    } finally {
      setLoading(false);
    }
  };

  const validateField = (key: string, value: string) => {
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

  const validateAllFields = (): boolean => {
    let isValid = true;
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};

    Object.entries(clientDetails).forEach(([key, value]) => {
      if (key === "id") return;
      const error = validateField(key, value);
      if (error) isValid = false;
      newErrors[key] = error;
      newTouched[key] = true;
    });

    setErrors(newErrors);
    setTouched(newTouched);

    return isValid;
  };

  const handleClientDetailsChange = (key: string, value: any) => {
    setClientDetails((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({
      ...prev,
      [key]: validateField(key, value),
    }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const isFormValid = validateAllFields();
      if (!isFormValid) {
        showToast.warning("Please fix validation errors before submitting.");
        setIsSaving(false);
        return;
      }

      const payload = {
        ...clientDetails,
        isGstRegistered: clientDetails.isGstRegistered === "yes",
      };

      const response: any = await updateClient({
        id: clientId,
        payload,
      });

      if (response?.data?.success || response?.success) {
        showToast.success("Client updated successfully");
        onClose();
        onEdit();
      } else {
        showToast.error(response?.data?.message || "Failed to update client");
      }
    } catch (err: any) {
      showToast.error(err?.message || "Error updating client");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (clientId && isOpen) {
      getClientData();
    }
  }, [clientId, isOpen]);

  const hasErrors = Object.values(errors).some(
    (error) => error !== "" && error !== undefined && error !== null,
  );

  return (
    <DynamicModal
      header={{
        title: (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">
                Edit Client
              </h2>
              <p className="text-sm text-neutral-600">
                {clientDetails.name || "Client Details"}
              </p>
            </div>
          </div>
        ),
      }}
      isOpen={isOpen}
      onClose={() => {
        setErrors({});
        setTouched({});
        setClientDetails(initialClientDetails);
        onClose();
      }}
      loading={loading || isFetching}
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="flex flex-1 w-full">
            <Button
              onClick={onClose}
              disabled={loading || isSaving}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>

          <div className="flex flex-1 w-full">
            <Button
              onClick={handleSave}
              disabled={loading || isSaving || hasErrors}
              className="flex-1"
            >
              {loading
                ? "Loading..."
                : isSaving
                  ? "Saving All Details..."
                  : "Save All Changes"}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="min-h-100]">
          <ClientBasicDetailsTab
            data={clientDetails}
            onChange={handleClientDetailsChange}
            errors={errors}
            touched={touched}
          />
        </div>
      </div>
    </DynamicModal>
  );
};

export default EditClient;
