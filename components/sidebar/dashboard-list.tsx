"use client";

import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { PlusIcon } from "../icons/sidebar/plus-icon";
import { ArchiveIcon } from "../icons/sidebar/archive-icon";
import { ChevronDownIcon } from "../icons/sidebar/chevron-down-icon";
import { ChevronRightIcon } from "../icons/sidebar/chevron-right-icon";
import { DocumentIcon } from "../icons/sidebar/document-icon";
import { useDashboard } from "../../contexts/DashboardContext";

interface DashboardListProps {
  className?: string;
}

export const DashboardList = ({ className = "" }: DashboardListProps) => {
  const [isArchiveExpanded, setIsArchiveExpanded] = useState(false);
  const { dashboards, archivedDashboards, setActiveDashboard } = useDashboard();

  const handleNewDashboard = () => {
    // Navigate to generate page
    window.location.href = "/generate";
  };

  const handleDashboardClick = (dashboardId: string) => {
    setActiveDashboard(dashboardId);
    // Navigate to dashboard view
    console.log("Navigate to dashboard:", dashboardId);
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
        <div className="flex flex-col gap-1">
          {dashboards.map((dashboard) => (
            <button
              key={dashboard.id}
              onClick={() => handleDashboardClick(dashboard.id)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-200 text-left w-full group ${
                dashboard.isActive
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "hover:bg-white/10 text-white/80 hover:text-white border border-transparent hover:border-white/20"
              }`}
            >
              <DocumentIcon className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="truncate font-medium">{dashboard.name}</div>
                <div className="text-xs text-white/50">
                  {formatDate(dashboard.createdAt)}
                </div>
              </div>
            </button>
          ))}
        </div>
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
              <button
                key={dashboard.id}
                onClick={() => handleDashboardClick(dashboard.id)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 text-left w-full hover:bg-white/5 text-white/60 hover:text-white/80"
              >
                <DocumentIcon className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="truncate">{dashboard.name}</div>
                  <div className="text-xs text-white/40">
                    {formatDate(dashboard.createdAt)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
