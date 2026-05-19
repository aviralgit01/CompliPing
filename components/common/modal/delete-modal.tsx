import React from "react";
import { DynamicModal } from "./modal";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface DeleteEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  children?: React.ReactNode;
  headerText: string;
}

const DeleteModal: React.FC<DeleteEmployeeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  children,
  headerText,
}) => {
  return (
    <DynamicModal
      isOpen={isOpen}
      onClose={onClose}
      loading={loading}
      header={{
        title: (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="text-red-600" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-red-700">{headerText}</h2>
              <p className="text-sm text-neutral-600">
                This action cannot be undone
              </p>
            </div>
          </div>
        ),
      }}
      footer={
        <div className="flex flex-1 justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="h-10 border-neutral-300 hover:bg-neutral-50"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="h-10 bg-red-600 hover:bg-red-700 cursor-pointer text-white"
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </Button>
        </div>
      }
      className="max-w-md"
    >
      <div className="text-sm text-neutral-800 pt-4">{children}</div>
    </DynamicModal>
  );
};

export default DeleteModal;
