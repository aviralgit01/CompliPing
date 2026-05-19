"use client";

import React, { useCallback, useEffect, useState } from "react";
import { PlanTable } from "./PlanTable";
import { Button } from "@/components/ui/button";
import CreateEditPlan from "./modal/CreateAndEditPlan";
import DeletePlanModal from "./modal/DeletePlanModal";
import { showToast } from "@/components/common/toast";
import {
  useCreatePlan,
  useDeletePlan,
  useGetPlans,
  useUpdatePlan,
} from "@/lib/hooks/api/usePayments";
import { debounce } from "@/lib/validation/debounce";
import { set } from "date-fns";
import { deleteSuperAdminPlan } from "@/lib/api/payment/payment.api";

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  maxUsers: number;
  stripeProductId: string;
  stripePriceId: string;
  taxPercentage: number;
  active: boolean;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  interval: string;
  interval_count: number;
  razor_pay_plan_id: string;
  trailDays?: number;
}

const Plans = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { data, isLoading, refetch } = useGetPlans({
    page: page,
    limit: limit,
    search: debouncedTerm,
  });

  const { mutate: createPlan, isPending: createPending } = useCreatePlan();
  const { mutate: updatePlan, isPending: updatePending } = useUpdatePlan();
  const { mutate: deletePlan, isPending: deletePending } = useDeletePlan();

  const plans = data?.data || [];
  const pagination = data?.pagination || {
    page: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedTerm(value);
      setPage(1);
    }, 800),
    [],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditData(null);
    setIsEdit(false);
  };

  const handleSavePlan = (data: any) => {
    if (isEdit && editData?.id) {
      updatePlan(
        { id: editData.id, data },
        {
          onSuccess: () => {
            handleCloseModal();
          },
        },
      );
    } else {
      createPlan(data, {
        onSuccess: () => {
          handleCloseModal();
        },
      });
    }
  };

  useEffect(() => {
    console.log("deleteTarget updated:", deleteTarget);
  }, [deleteTarget]);

  //  delete plan
  const handleDeletePlan = () => {
    if (!deleteTarget) return;

    deletePlan(
      { plan_id: deleteTarget.id },
      {
        onSuccess: () => {
          setDeleteModal(false);
          setDeleteTarget(null);
          setDeleteLoading(false);
        },
      },
    );
  };

  const formLoading = createPending || updatePending;

  return (
    <div className="p-6 bg-white min-h-screen rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Plans</h2>
        <Button
          className="rounded-xl px-6 py-2"
          onClick={() => {
            setIsEdit(false);
            setEditData(null);
            setOpenModal(true);
          }}
        >
          + Create Plan
        </Button>
      </div>

      <PlanTable
        data={plans}
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalCount={pagination.totalItems}
        itemsPerPage={pagination.limit}
        onPageChange={(page) => setPage(page)}
        onItemsPerPageChange={(limit) => setLimit(limit)}
        onView={(plan) => console.log("View", plan)}
        onEdit={(plan) => {
          setEditData(plan);
          setOpenModal(true);
          setIsEdit(true);
        }}
        loading={isLoading}
        onDelete={(plan) => {
          console.log("DELETE CLICK DATA:", plan);
          setDeleteTarget(plan);
          setDeleteModal(true);
        }}
      />

      <CreateEditPlan
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditData(null);
          setIsEdit(false);
        }}
        loading={formLoading}
        onSave={handleSavePlan}
        initialData={isEdit ? editData : undefined}
      />

      <DeletePlanModal
        isOpen={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeletePlan}
        planName={deleteTarget?.name}
        loading={deletePending}
      />
    </div>
  );
};

export default Plans;
