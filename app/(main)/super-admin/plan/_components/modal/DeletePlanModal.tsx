"use client";

import React, { useEffect, useState } from "react";
import { DynamicModal } from "@/components/common/modal/modal";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeletePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  planName?: string;
  loading?: boolean;
}

const DeletePlanModal: React.FC<DeletePlanModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  planName,
  loading = false,
}) => {
  const [submitted, setSubmitted] = useState(false);

  // close modal only after deletion completes
  useEffect(() => {
    if (submitted && !loading) {
      onClose();
      setSubmitted(false);
    }
  }, [loading, submitted, onClose]);

  const handleDelete = async () => {
    setSubmitted(true);
    await onConfirm();
  };

  return (
    <DynamicModal
      isOpen={isOpen}
      onClose={() => {
        if (!loading) onClose();
      }}
      loading={loading}
      header={{
        title: (
          <div className="flex items-center gap-3">
            <div className="p-3 flex items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                Delete Plan
              </h2>
              <p className="text-sm text-neutral-600">
                Are you sure you want to delete{" "}
                <span className="font-medium text-neutral-900">
                  {planName || "this plan"}
                </span>
                ? This action cannot be undone.
              </p>
            </div>
          </div>
        ),
      }}
      className="max-w-md"
      footer={
        <div className="flex gap-3 w-full">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 h-10"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 h-10"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      }
    >
      <div className="py-2">
        <p className="text-sm text-neutral-700">
          Deleting this plan will remove all related subscription details. This
          cannot be undone.
        </p>
      </div>
    </DynamicModal>
  );
};

export default DeletePlanModal;
