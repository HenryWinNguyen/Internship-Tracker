"use client";

import { Dispatch, SetStateAction } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export type FormState = {
  company: string;
  position: string;
  appliedDate: Date;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  platform: string;
  lastEdited: Date | null;
  description: string;
  category: string;
  subcategory: string;       // <-- required to match page.tsx
  confidence: number;        // <-- required to match page.tsx
  applicationUrl: string;
};

type Props = {
  form: FormState;
  // Use the real React setter type so setForm={setForm} works
  setForm: Dispatch<SetStateAction<FormState>>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: () => void;
  editingIndex: number | null;
  saving?: boolean;
};

export default function ApplicationForm({
  form,
  setForm,
  handleChange,
  handleSubmit,
  editingIndex,
  saving = false,
}: Props) {
  return (
    <div className="grid gap-4 max-w-xl mb-6">
      <input
        name="company"
        placeholder="Company Name"
        value={form.company}
        onChange={handleChange}
        className="p-2 bg-zinc-900 border border-gray-700 text-white rounded"
      />

      <input
        name="position"
        placeholder="Position Title"
        value={form.position}
        onChange={handleChange}
        className="p-2 bg-zinc-900 border border-gray-700 text-white rounded"
      />

      <DatePicker
        selected={form.appliedDate instanceof Date ? form.appliedDate : new Date(form.appliedDate)}
        onChange={(date: Date | null) => setForm((prev) => ({ ...prev, appliedDate: date || new Date() }))}
        placeholderText="Applied Date"
        className="p-2 bg-zinc-900 border border-gray-700 text-white rounded w-full"
      />

      <DatePicker
        selected={form.startDate}
        onChange={(date: Date | null) => setForm((prev) => ({ ...prev, startDate: date }))}
        placeholderText="Internship Start Date"
        className="p-2 bg-zinc-900 border border-gray-700 text-white rounded w-full"
      />

      <DatePicker
        selected={form.endDate}
        onChange={(date: Date | null) => setForm((prev) => ({ ...prev, endDate: date }))}
        placeholderText="Internship End Date"
        className="p-2 bg-zinc-900 border border-gray-700 text-white rounded w-full"
      />

      <input
        name="platform"
        placeholder="Application Platform"
        value={form.platform}
        onChange={handleChange}
        className="p-2 bg-zinc-900 border border-gray-700 text-white rounded"
      />

      {/* Application Link */}
      <input
        name="applicationUrl"
        placeholder="Link to your application (https://...)"
        value={form.applicationUrl}
        onChange={handleChange}
        className="p-2 bg-zinc-900 border border-gray-700 text-white rounded"
        inputMode="url"
      />

      <textarea
        name="description"
        placeholder="Optional: paste job description for better categorization"
        value={form.description}
        onChange={handleChange}
        className="p-2 bg-zinc-900 border border-gray-700 text-white rounded min-h-[90px]"
      />

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
      >
        {saving
          ? editingIndex !== null
            ? "Updating..."
            : "Adding..."
          : editingIndex !== null
          ? "Update Application"
          : "Add Application"}
      </button>
    </div>
  );
}
