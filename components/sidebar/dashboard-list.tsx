"use client";

import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { PlusIcon } from "../icons/sidebar/plus-icon";
import { ArchiveIcon } from "../icons/sidebar/archive-icon";
import { ChevronDownIcon } from "../icons/sidebar/chevron-down-icon";
import { ChevronRightIcon } from "../icons/sidebar/chevron-right-icon";
import { DocumentIcon } from "../icons/sidebar/document-icon";
import { TrashIcon } from "../icons/profile/trash-icon";
import { useDashboard } from "../../contexts/DashboardContext";
import { apiClient } from "../../lib/api";

// External link icon component
const ExternalLinkIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

interface DashboardListProps {
  className?: string;
  onDashboardSelect?: (dashboardId: string) => void;
}

export const DashboardList = ({ className = "", onDashboardSelect }: DashboardListProps) => {
  const [isArchiveExpanded, setIsArchiveExpanded] = useState(false);
  const [deletingDashboardId, setDeletingDashboardId] = useState<string | null>(null);
  const { dashboards, archivedDashboards, loading, error, setActiveDashboard, refreshDashboards } = useDashboard();

  const handleNewDashboard = () => {
    // Navigate to generate page
    window.location.href = "/generate";
  };

  const handleDashboardClick = (dashboardId: string) => {
    setActiveDashboard(dashboardId);
    onDashboardSelect?.(dashboardId);
  };

  const handleViewLink = (dashboard: any, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent dashboard selection when clicking the view link
    const url = dashboard.dashboardUrl || `${window.location.origin}/dashboard/view/${dashboard.uniqueUrl}`;
    window.open(url, '_blank');
  };

  const handleDeleteDashboard = async (dashboard: any, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent dashboard selection when clicking delete
    
    if (!confirm(`Are you sure you want to delete "${dashboard.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingDashboardId(dashboard.id);
    
    try {
      const response = await apiClient.deleteDashboard(dashboard.id);
      
      if (response.success) {
        console.log('Dashboard deleted successfully');
        await refreshDashboards();
        alert('Dashboard deleted successfully');
      } else {
        throw new Error(response.error || 'Failed to delete dashboard');
      }
    } catch (error) {
      console.error('Error deleting dashboard:', error);
      alert(`Error deleting dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDeletingDashboardId(null);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={`flex flex-col gap-3 p-4 ${className}`}>
      {/* New Dashboard Button */}
      <Button
        variant="flat"
        color="primary"
        startContent={<PlusIcon />}
        onClick={handleNewDashboard}
        className="justify-start h-12 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl"
        size="md"
      >
        New Dashboard
      </Button>

      {/* Recent Dashboards */}
      <div className="space-y-1">
        <h4 className="text-white/80 text-sm font-medium mb-2">Recent Dashboards</h4>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-white/60 text-sm">Loading dashboards...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-red-400 text-sm text-center">
              <div>Failed to load dashboards</div>
              <div className="text-xs text-red-300 mt-1">{error}</div>
            </div>
          </div>
        ) : dashboards.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-white/60 text-sm text-center">
              <div>No dashboards yet</div>
              <div className="text-xs text-white/40 mt-1">Create your first dashboard above</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {dashboards.map((dashboard) => (
              <div
                key={dashboard.id}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-200 w-full group ${
                  dashboard.isActive
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "hover:bg-white/10 text-white/80 hover:text-white border border-transparent hover:border-white/20"
                }`}
              >
                <button
                  onClick={() => handleDashboardClick(dashboard.id)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
                >
                  <DocumentIcon className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{dashboard.name}</div>
                    <div className="text-xs text-white/50">
                      {formatDate(dashboard.createdAt)}
                    </div>
                  </div>
                </button>
                <button
                  onClick={(e) => handleViewLink(dashboard, e)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-white/10 rounded-md"
                  title="View Dashboard"
                >
                  <ExternalLinkIcon />
                </button>
                <button
                  onClick={(e) => handleDeleteDashboard(dashboard, e)}
                  disabled={deletingDashboardId === dashboard.id}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-500/20 rounded-md disabled:opacity-50"
                  title="Delete Dashboard"
                >
                  {deletingDashboardId === dashboard.id ? (
                    <div className="w-3 h-3 border border-white/40 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <TrashIcon className="w-3 h-3 text-red-400" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Archive Section */}
      <div className="mt-4">
        <button
          onClick={() => setIsArchiveExpanded(!isArchiveExpanded)}
          className="flex items-center gap-3 px-3 py-2 text-sm text-white/60 hover:text-white/80 transition-colors w-full rounded-lg hover:bg-white/5"
        >
          {isArchiveExpanded ? (
            <ChevronDownIcon className="w-4 h-4" />
          ) : (
            <ChevronRightIcon className="w-4 h-4" />
          )}
          <ArchiveIcon className="w-4 h-4" />
          <span className="font-medium">Archive</span>
          <span className="ml-auto text-xs bg-white/20 text-white/80 px-2 py-1 rounded-full">
            {archivedDashboards.length}
          </span>
        </button>

        {isArchiveExpanded && (
          <div className="ml-6 mt-2 flex flex-col gap-1">
            {archivedDashboards.map((dashboard) => (
              <div
                key={dashboard.id}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 w-full hover:bg-white/5 text-white/60 hover:text-white/80 group"
              >
                <button
                  onClick={() => handleDashboardClick(dashboard.id)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
                >
                  <DocumentIcon className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{dashboard.name}</div>
                    <div className="text-xs text-white/40">
                      {formatDate(dashboard.createdAt)}
                    </div>
                  </div>
                </button>
                <button
                  onClick={(e) => handleViewLink(dashboard, e)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-white/10 rounded-md"
                  title="View Dashboard"
                >
                  <ExternalLinkIcon />
                </button>
                <button
                  onClick={(e) => handleDeleteDashboard(dashboard, e)}
                  disabled={deletingDashboardId === dashboard.id}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-500/20 rounded-md disabled:opacity-50"
                  title="Delete Dashboard"
                >
                  {deletingDashboardId === dashboard.id ? (
                    <div className="w-3 h-3 border border-white/40 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <TrashIcon className="w-3 h-3 text-red-400" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
