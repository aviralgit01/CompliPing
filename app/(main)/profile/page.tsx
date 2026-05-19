"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building,
  MapPin,
  Shield,
  Award,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  InfoIcon,
} from "lucide-react";
import { Spinner } from "@/components/layout/spinner";
import { useGetUserProfile } from "@/lib/hooks/api/auth/useAuth";
import SecurityTab from "./_components/change-password";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
} from "@/components/ui/avatar";

export interface Profile {
  name: string;
  email: string;
  role: string;
  status: string;
  tenant: {
    firmName: string;
    ownerName: string;
    phone: string;
    city: string;
  };
  plans: any[];
  subscriptions: any[];
  subscriptionPayments: any[];
}

const ProfilePage: React.FC = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  const { data: profile, isLoading, error, refetch } = useGetUserProfile();

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getStatusBadge = (status: string) => {
    const isActive = status === "ACTIVE";
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
          isActive
            ? "bg-gray-100 text-gray-700 border border-gray-200"
            : "bg-gray-50 text-gray-500 border border-gray-100"
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            isActive ? "bg-green-500" : "bg-gray-400"
          }`}
        />
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const getRoleBadge = (role: string) => (
    <span className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
      <Shield size={10} />
      <span className="capitalize">{role}</span>
    </span>
  );

  if (isLoading) return <Spinner size="large" type="general" />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 max-w-md w-full text-center">
          <AlertCircle className="text-red-500 mx-auto mb-3" size={40} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Unable to load profile
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {typeof error === "string"
              ? error
              : error?.message || "Something went wrong"}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw size={14} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="bg-gray-50">
      <div className="max-w-450 mx-auto py-4 sm:py-8 space-y-4 sm:space-y-6">
        <div className="bg-white rounded-lg sm:rounded-xl border-gray-200">
          <div className="p-4 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
              <div className="flex items-center gap-3 sm:gap-6">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                    <Avatar className="sm:h-20 sm:w-20 h-10 w-10 ring-4 ring-white shadow-lg">
                      <AvatarImage src="" alt={profile.name} />
                      <AvatarFallback className="text-2xl font-bold bg-linear-to-br from-brand-primary to-brand-secondary text-white rounded-md">
                        {profile.name?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white ${
                      profile.status === "ACTIVE"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1 truncate">
                    {profile.name}
                  </h1>

                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    {getStatusBadge(profile.status)}
                    {getRoleBadge(profile.role)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl border-gray-200">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex min-w-max sm:min-w-0">
              {[
                { id: "overview", label: "Overview", icon: User },
                { id: "security", label: "Security", icon: Shield },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon size={16} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 sm:p-8">
            {activeTab === "overview" && (
              <div className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200 shrink-0">
                            <Mail className="text-gray-600" size={14} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-gray-500 font-medium">
                              Email
                            </p>
                            <p className="text-gray-900 text-sm sm:text-base truncate">
                              {profile.email}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard(profile.email, "email")
                          }
                          className="text-gray-400 hover:text-blue-600 transition-colors ml-2"
                        >
                          {copiedField === "email" ? (
                            <Check size={14} />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>

                      {profile.tenant?.phone && (
                        <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200 shrink-0">
                              <Phone className="text-gray-600" size={14} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-500 font-medium">
                                Phone
                              </p>
                              <p className="text-gray-900 text-sm sm:text-base">
                                +91 {profile.tenant?.phone || "Not provided"}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              copyToClipboard(profile.tenant?.phone, "phone")
                            }
                            className="text-gray-400 hover:text-blue-600 transition-colors ml-2"
                          >
                            {copiedField === "phone" ? (
                              <Check size={14} />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {profile.tenant && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Tenant Information
                        </h3>
                        <div className="space-y-3 sm:space-y-4">
                          <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200 shrink-0">
                                <Building className="text-gray-600" size={14} />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">
                                  Firm Name
                                </p>
                                <p className="text-gray-900 text-sm sm:text-base">
                                  {profile.tenant?.firmName || "Not assigned"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200 shrink-0">
                                <MapPin className="text-gray-600" size={14} />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">
                                  City
                                </p>
                                <p className="text-gray-900 text-sm sm:text-base">
                                  {profile.tenant?.city || "Not provided"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "security" && <SecurityTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
