



import React from "react";
import { User, Phone } from "lucide-react";
import { Client } from "@/lib/api/compliance/compliance.types";
import { useRouter } from "next/navigation";
import { Button } from "@base-ui/react";

interface ClientCardProps {
  client: Client;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      
      {/* Label */}
      <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        Assignee Client
      </span>

      {/* Identity */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-[15px] font-bold tracking-wide text-indigo-600">
          {client.initials}
        </div>

        <div>
          <div className="text-[16px] font-semibold text-gray-900">
            {client.businessName}
          </div>
          <div className="mt-0.5 text-[12px] text-gray-500">
            {client.entityType}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
        
        <div className="flex items-center gap-2 text-[13px] text-gray-600">
          <User size={14} className="text-gray-400" />
          <span>{client.name}</span>
        </div>

        <div className="flex items-center gap-2 text-[13px] text-gray-600">
          <Phone size={14} className="text-gray-400" />
          <span>{client.phone}</span>
        </div>

      </div>

      {/* Button */}
      <Button className="mt-2 w-full rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2.5 text-[13px] font-semibold text-indigo-600 transition hover:bg-indigo-100 hover:border-indigo-300 hover:cursor-pointer"
      onClick={()=>{
        router.push(`/clients/${client.id}`);
      }}>
        View Client Profile
      </Button>
    </div>
  );
};