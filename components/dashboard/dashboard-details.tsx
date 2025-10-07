"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import { TrashIcon } from "../icons/sidebar/trash-icon";
import { ArchiveIcon } from "../icons/sidebar/archive-icon";
import { EditIcon } from "../icons/sidebar/edit-icon";
import { useDashboard } from "../../contexts/DashboardContext";

interface DashboardDetailsProps {
  dashboardId: string;
  onClose: () => void;
}

export const DashboardDetails = ({ dashboardId, onClose }: DashboardDetailsProps) => {
  const { dashboards, archivedDashboards, archiveDashboard, deleteDashboard } = useDashboard();
  
  // Find the dashboard in both active and archived lists
  const dashboard = [...dashboards, ...archivedDashboards].find(d => d.id === dashboardId);
  
  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white/60">Dashboard not found</p>
      </div>
    );
  }

  const handleArchive = () => {
    archiveDashboard(dashboardId);
    onClose();
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this dashboard? This action cannot be undone.")) {
      deleteDashboard(dashboardId);
      onClose();
    }
  };

  const isArchived = dashboard.isArchived;

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-normal text-white mb-2">{dashboard.name}</h2>
          <p className="text-white/60">Created on {dashboard.createdAt.toLocaleDateString()}</p>
        </div>
        <Button
          variant="light"
          onPress={onClose}
          className="text-white/60 hover:text-white"
        >
          ✕
        </Button>
      </div>

      {/* Status Badge */}
      <div className="mb-6">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          isArchived 
            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
            : 'bg-green-500/20 text-green-400 border border-green-500/30'
        }`}>
          {isArchived ? 'Archived' : 'Active'}
        </span>
      </div>

      {/* Dashboard Content Preview */}
      <div className="mb-8">
        <h3 className="text-lg font-normal text-white mb-4">Dashboard Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-white/80 font-normal mb-2">Client Information</h4>
            <p className="text-white/60 text-sm">Multi-state client dashboard with comprehensive tax monitoring</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-white/80 font-normal mb-2">Key Metrics</h4>
            <p className="text-white/60 text-sm">Real-time compliance tracking and threshold monitoring</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-white/80 font-normal mb-2">States Monitored</h4>
            <p className="text-white/60 text-sm">CA, TX, NY, FL, IL, PA, OH, GA, NC, MI</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-white/80 font-normal mb-2">Last Updated</h4>
            <p className="text-white/60 text-sm">{dashboard.createdAt.toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="bordered"
          startContent={<EditIcon />}
          className="border-white/20 text-white hover:bg-white/10"
        >
          Edit Dashboard
        </Button>
        
        {!isArchived && (
          <Button
            variant="bordered"
            startContent={<ArchiveIcon />}
            onPress={handleArchive}
            className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
          >
            Archive
          </Button>
        )}
        
        <Button
          variant="bordered"
          startContent={<TrashIcon />}
          onPress={handleDelete}
          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

