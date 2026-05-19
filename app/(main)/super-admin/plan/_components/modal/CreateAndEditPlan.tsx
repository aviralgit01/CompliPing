import React, { useState, useEffect, useCallback } from "react";
import { DynamicModal } from "@/components/common/modal/modal";
import { CustomInput } from "@/components/customInput";
import { Button } from "@/components/ui/button";
import { FileText, Layers, Save, CheckCircle2 } from "lucide-react";
import { Plan } from "../Plans";
import { DropdownSearch, Option } from "@/components/ui/searchableDropdown";

export interface PlanFormData {
  name: string;
  description?: string;
  price_per_user: number;
  currency: string;
  status: string | null;
  maxUsers: number;
  interval?: string;
  interval_count: number;
  taxPercentage?: number;
  trail_day: number;
}

interface CreateEditPlanProps {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onSave: (payload: any) => void;
  initialData?: Plan | null;
}

const initialFormState: PlanFormData = {
  name: "",
  description: "",
  price_per_user: 10,
  currency: "INR",
  status: "paid",
  maxUsers: 0,
  interval: "month",
  interval_count: 1,
  taxPercentage: 18,
  trail_day: 0,
};

const CreateEditPlan: React.FC<CreateEditPlanProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  loading,
}) => {
  const [planData, setPlanData] = useState<PlanFormData>(initialFormState);

  useEffect(() => {
    if (initialData) {
      setPlanData({
        name: initialData.name || "",
        description: initialData.description || "",
        price_per_user: initialData.price || 0,
        currency: initialData.currency || "INR",
        status: initialData.status || "paid",
        maxUsers: initialData.maxUsers || 0,
        interval: initialData.interval || "month",
        interval_count: initialData.interval_count || 1,
        taxPercentage: initialData.taxPercentage || 18,
        trail_day: initialData.trailDays || 0,
      });
    } else {
      setPlanData(initialFormState);
    }
  }, [initialData, isOpen]);

  const handleInputChange = useCallback(
    ({ key, value }: { key: string; value: any }) => {
      setPlanData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const isEditing = Boolean(initialData);
  const isFreePlan = planData.status === "free";

  const handleSave = () => {
    if (isEditing && initialData?.id) {
      const updatePayload = {
        id: initialData.id,
        name: planData.name,
        description: planData.description,
        price_per_user: Number(planData.price_per_user),
        currency: planData.currency,
        trail_day: Number(planData.trail_day),
        interval: planData.interval,
        interval_count: Number(planData.interval_count),
      };

      onSave(updatePayload);
      return;
    }

    const createPayload = {
      name: planData.name,
      description: planData.description,
      amount: Number(planData.price_per_user),
      currency: planData.currency,
      period: planData.interval,
      interval: Number(planData.interval_count),
      notes: {
        status: planData.status,
        maxUsers: planData.maxUsers,
        taxPercentage: planData.taxPercentage,
        trail_day: planData.trail_day,
      },
    };

    onSave(createPayload);
  };

  const billingPeriodOptions: Option[] = [
    { label: "Day", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
  ];

  const currencyOptions: Option[] = [
    { label: "INR", value: "INR" },
    { label: "USD", value: "USD" },
    { label: "EUR", value: "EUR" },
  ];

  return (
    <DynamicModal
      loading={loading}
      header={{
        title: (
          <div className="flex items-center gap-3">
            <div className="w-12 h-10 bg-linear-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center shadow-lg">
              <Layers size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 font-montserrat">
                {isEditing ? "Edit Plan" : "Create Plan"}
              </h2>
              <p className="text-sm text-neutral-600">
                {isEditing
                  ? "Update your subscription plan details"
                  : "Add a new subscription plan"}
              </p>
            </div>
          </div>
        ),
      }}
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-3xl"
      footer={
        <div className="flex gap-3 w-full pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-10 border-neutral-300 hover:bg-neutral-50 font-medium"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            className="flex-1 h-10 font-medium transition-all duration-300 hover:scale-[1.02]"
            disabled={loading}
          >
            <Save size={18} className="mr-2" />
            {isEditing ? "Update Plan" : "Create Plan"}
          </Button>
        </div>
      }
    >
      <div className="space-y-6 max-h-[70vh] pr-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
            <FileText size={16} className="text-brand-primary" />
            <h3 className="font-semibold text-neutral-900">Plan Information</h3>
          </div>

          <CustomInput
            label="Plan Name"
            id="name"
            type="text"
            placeholder="Enter plan name"
            value={planData.name}
            onChange={(e) =>
              handleInputChange({ key: "name", value: e.target.value })
            }
            required
          />

          <CustomInput
            label="Plan description"
            id="description"
            type="text"
            placeholder="Give description"
            value={planData.description}
            onChange={(e) =>
              handleInputChange({ key: "description", value: e.target.value })
            }
            required
          />

          <div
            className={`grid grid-cols-1 gap-4 ${isFreePlan ? "md:grid-cols-1" : "md:grid-cols-2"}`}
          >
            {isFreePlan && (
              <CustomInput
                label="Trial days"
                id="trail_day"
                type="number"
                placeholder="trial days"
                value={planData.trail_day}
                onChange={(e) =>
                  handleInputChange({
                    key: "trail_day",
                    value: Number(e.target.value),
                  })
                }
                required
              />
            )}

            {!isFreePlan && (
              <>
                <DropdownSearch
                  label="Interval"
                  options={billingPeriodOptions}
                  selected={planData.interval}
                  onChange={(val) =>
                    handleInputChange({ key: "interval", value: val })
                  }
                  required
                />

                <CustomInput
                  label="Interval Count"
                  id="interval_count"
                  type="number"
                  placeholder="Enter plan interval_count"
                  value={planData.interval_count}
                  onChange={(e) =>
                    handleInputChange({
                      key: "interval_count",
                      value: Number(e.target.value),
                    })
                  }
                  required
                />

                <DropdownSearch
                  label="Currency"
                  options={currencyOptions}
                  selected={planData.currency}
                  onChange={(val) =>
                    handleInputChange({ key: "currency", value: val })
                  }
                  required
                />

                <CustomInput
                  label="Price"
                  id="price"
                  type="number"
                  placeholder="Enter plan price"
                  value={planData.price_per_user}
                  onChange={(e) =>
                    handleInputChange({
                      key: "price_per_user",
                      value: Number(e.target.value),
                    })
                  }
                  required
                />
              </>
            )}
          </div>
        </div>

        {planData.name && (isFreePlan || planData.price_per_user > 0) && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-600" />
              <p className="font-medium text-green-900">
                {isEditing
                  ? "Plan ready for update!"
                  : "Plan ready for creation!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </DynamicModal>
  );
};

export default CreateEditPlan;
