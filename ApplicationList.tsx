"use client";
import React from "react";

type AppItem = {
  company: string;
  position: string;
  appliedDate: Date | string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  platform: string;
  lastEdited: Date | null;
  description: string;
  category: string;          // AI/RULES/MOCK output
  subcategory?: string;      // optional: older entries may not have it
  confidence?: number;       // optional: present in AI path
  applicationUrl?: string;   // optional: link to application
};

type Props = {
  applications: AppItem[];
  handleEdit: (index: number) => void;
  confirmDelete: (index: number) => void;
  getCycle: (d: Date) => string;
};

export default function ApplicationList({
  applications,
  handleEdit,
  confirmDelete,
  getCycle,
}: Props) {
  return (
    <ul className="space-y-3">
      {applications.map((app, i) => {
        const applied = new Date(app.appliedDate);

        // Always show Category → Subcategory so the demo is obvious
        const cat = app.category || "Other";
        const sub = app.subcategory || "Other";
        const badgeText = `${cat} \u2192 ${sub}`; // → arrow
        const confidenceTitle =
          typeof app.confidence === "number"
            ? `Confidence: ${(app.confidence * 100).toFixed(0)}%`
            : "";

        return (
          <li key={i} className="border border-gray-700 rounded-xl p-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold">
                  {app.position} <span className="opacity-70">at</span> {app.company}
                </h3>

                {/* Category → Subcategory badge (always visible) */}
                <span
                  className="text-[11px] px-2 py-0.5 rounded-full border border-gray-600/70 bg-gray-800/40"
                  title={confidenceTitle}
                >
                  {badgeText}
                </span>
              </div>

              <div className="text-xs opacity-70">
                {app.status} • {applied.toLocaleDateString()} • {getCycle(applied)}
              </div>
            </div>

            {/* Description */}
            {app.description ? (
              <p className="text-sm mt-2 whitespace-pre-wrap">{app.description}</p>
            ) : null}

            {/* Actions */}
            <div className="mt-3 flex flex-wrap gap-2">
              {app.applicationUrl ? (
                <a
                  href={app.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm border border-blue-600 text-blue-300 rounded-lg px-3 py-1 hover:bg-blue-900/30"
                >
                  Open Application
                </a>
              ) : null}

              <button
                onClick={() => handleEdit(i)}
                className="text-sm border border-gray-600 rounded-lg px-3 py-1 hover:bg-gray-800"
              >
                Edit
              </button>
              <button
                onClick={() => confirmDelete(i)}
                className="text-sm border border-red-600 text-red-300 rounded-lg px-3 py-1 hover:bg-red-900/30"
              >
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
