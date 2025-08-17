"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

import ApplicationForm from "./components/ApplicationForm";
import ApplicationList from "./components/ApplicationList";
import StatsPanel from "./components/StatsPanel";
import DeleteModal from "./components/DeleteModal";

export default function Home() {
  // ---- FORM STATE -----------------------------------------------------------
  const [form, setForm] = useState({
    company: "",
    position: "",
    appliedDate: new Date(),
    status: "Applied",
    startDate: null as Date | null,
    endDate: null as Date | null,
    platform: "",
    lastEdited: null as Date | null,
    description: "",
    category: "",
    subcategory: "",
    confidence: 0 as number,
    applicationUrl: "",
  });

  // ---- APP STATE ------------------------------------------------------------
  const [applications, setApplications] = useState<typeof form[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);

  const [filter, setFilter] = useState("All"); // Status filter
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [subcategoryFilter, setSubcategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Drives taxonomy choice in the classifier
  const [userMajor, setUserMajor] = useState("Computer Science");

  // Submit state
  const [saving, setSaving] = useState(false);

  // Optional: show which backend mode is running (MOCK/RULES/OPENAI)
  const [serverMode, setServerMode] = useState<string>("");

  // ---- PERSISTENCE ----------------------------------------------------------
  useEffect(() => {
    const saved = localStorage.getItem("applications");
    if (saved) setApplications(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("applications", JSON.stringify(applications));
  }, [applications]);

  // ---- MODE BADGE (health check) -------------------------------------------
  useEffect(() => {
    fetch("/api/classify")
      .then((r) => r.json())
      .then((d) => setServerMode(d?.mode || ""))
      .catch(() => setServerMode(""));
  }, []);

  // ---- HELPERS --------------------------------------------------------------
  const getCycle = (date: Date) => {
    const d = new Date(date);
    const month = d.getMonth();
    const year = d.getFullYear();
    if (month >= 0 && month <= 3) return `Spring–Summer ${year}`;
    if (month >= 4 && month <= 6) return `Summer–Fall ${year}`;
    return `Fall–Winter ${year}`;
  };

  // Aggregates for StatsPanel
  const cycleCounts = applications.reduce((acc, app) => {
    const cycle = getCycle(new Date(app.appliedDate));
    acc[cycle] = (acc[cycle] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const platformCounts = applications.reduce((acc, app) => {
    const p = app.platform || "Unknown";
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Classifier (works with MOCK/RULES/OPENAI server modes)
  async function classifyCategory(title: string, description: string, major: string) {
    const res = await fetch("/api/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, major }),
    });
    if (!res.ok) throw new Error("classification failed");
    const data = await res.json();
    return {
      category: (data.category as string) || "Other",
      subcategory: (data.subcategory as string) || "Other",
      confidence: typeof data.confidence === "number" ? data.confidence : 0.5,
    };
  }

  function isValidUrl(url: string) {
    if (!url) return true;
    try {
      const u = new URL(url);
      return u.protocol === "https:" || u.protocol === "http:";
    } catch {
      return false;
    }
  }

  // ---- FORM HANDLERS --------------------------------------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: (e.target as any).value });

  const handleSubmit = async () => {
    if (!form.company || !form.position) return;
    if (form.applicationUrl && !isValidUrl(form.applicationUrl)) {
      alert("Please enter a valid http(s) URL for the application link.");
      return;
    }

    setSaving(true);

    // Only call classifier when position/description/major changed or on create
    const shouldReclassify =
      editingIndex === null ||
      form.position !== applications[editingIndex].position ||
      (form.description || "") !== (applications[editingIndex].description || "") ||
      true; // always classify for demo; set to false to save tokens in OPENAI mode

    let cat = form.category;
    let sub = form.subcategory;
    let conf = form.confidence;

    try {
      if (shouldReclassify) {
        const ai = await classifyCategory(form.position, form.description || "", userMajor);
        cat = ai.category;
        sub = ai.subcategory;
        conf = ai.confidence;
      }
    } catch {
      cat = "Other";
      sub = "Other";
      conf = 0;
    }

    if (editingIndex !== null) {
      const updated = [...applications];
      updated[editingIndex] = {
        ...form,
        category: cat,
        subcategory: sub,
        confidence: conf,
        lastEdited: new Date(),
      };
      setApplications(updated);
      setEditingIndex(null);
    } else {
      setApplications([...applications, { ...form, category: cat, subcategory: sub, confidence: conf }]);
    }

    setSaving(false);
    setForm({
      company: "",
      position: "",
      appliedDate: new Date(),
      status: "Applied",
      startDate: null,
      endDate: null,
      platform: "",
      lastEdited: null,
      description: "",
      category: "",
      subcategory: "",
      confidence: 0,
      applicationUrl: "",
    });
  };

  const handleEdit = (index: number) => {
    setForm(applications[index]);
    setEditingIndex(index);
  };

  const confirmDelete = (index: number) => setConfirmDeleteIndex(index);
  const cancelDelete = () => setConfirmDeleteIndex(null);

  const deleteApplication = () => {
    if (confirmDeleteIndex === null) return;
    const updated = [...applications];
    updated.splice(confirmDeleteIndex, 1);
    setApplications(updated);
    setConfirmDeleteIndex(null);
  };

  // ---- FILTERS/SORT ---------------------------------------------------------
  const categoryOptions = ["All", ...Array.from(new Set(applications.map((a) => a.category?.trim() || "Other")))];
  const subcategoryOptions = ["All", ...Array.from(new Set(applications.map((a) => a.subcategory?.trim() || "Other")))];

  const filteredApplications = applications
    .filter((a) => filter === "All" || a.status === filter)
    .filter((a) => categoryFilter === "All" || (a.category || "Other") === categoryFilter)
    .filter((a) => subcategoryFilter === "All" || (a.subcategory || "Other") === subcategoryFilter)
    .sort((a, b) => {
      const da = new Date(a.appliedDate).getTime();
      const db = new Date(b.appliedDate).getTime();
      return sortOrder === "asc" ? da - db : db - da;
    });

  // ---- UI -------------------------------------------------------------------
  return (
    <main
      className={`${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      } min-h-screen p-8 flex flex-col md:flex-row md:space-x-8`}
    >
      {/* LEFT COLUMN */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Internship Tracker</h1>
          <div className="flex items-center gap-3">
            {serverMode ? (
              <span className="text-[11px] px-2 py-0.5 rounded-full border border-gray-600/70 bg-gray-800/40">
                Mode: {serverMode}
              </span>
            ) : null}
            <button onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4 items-end">
          <div className="flex flex-col">
            <label htmlFor="status-filter" className="text-xs mb-1 text-gray-400">Status</label>
            <select
              id="status-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 bg-zinc-900 border border-gray-700 text-white rounded"
            >
              <option value="All">All</option>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="category-filter" className="text-xs mb-1 text-gray-400">Category</label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-2 bg-zinc-900 border border-gray-700 text-white rounded"
            >
              {categoryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="subcategory-filter" className="text-xs mb-1 text-gray-400">Subcategory</label>
            <select
              id="subcategory-filter"
              value={subcategoryFilter}
              onChange={(e) => setSubcategoryFilter(e.target.value)}
              className="p-2 bg-zinc-900 border border-gray-700 text-white rounded"
            >
              {subcategoryOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="sort-order" className="text-xs mb-1 text-gray-400">Sort</label>
            <select
              id="sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="p-2 bg-zinc-900 border border-gray-700 text-white rounded"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>

          <div className="flex flex-col flex-1 min-w-[220px]">
            <label htmlFor="user-major" className="text-xs mb-1 text-gray-400">Your Major (improves AI categorization)</label>
            <input
              id="user-major"
              value={userMajor}
              onChange={(e) => setUserMajor(e.target.value)}
              placeholder="e.g., Computer Science"
              className="p-2 bg-zinc-900 border border-gray-700 text-white rounded"
            />
          </div>
        </div>

        <hr className="my-6 border-zinc-700" />

        {/* FORM */}
        <h2 className="text-xl font-semibold mb-2">Add New Application</h2>
        <ApplicationForm
          form={form}
          setForm={setForm}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          editingIndex={editingIndex}
          saving={saving}
        />

        <hr className="my-6 border-zinc-700" />

        {/* APPLICATIONS */}
        <h2 className="text-xl font-semibold mb-2">My Applications</h2>
        {filteredApplications.length === 0 ? (
          <p className="text-gray-400">No applications yet. Start tracking your internships above!</p>
        ) : (
          <ApplicationList
            applications={filteredApplications}
            handleEdit={handleEdit}
            confirmDelete={confirmDelete}
            getCycle={getCycle}
          />
        )}

        {/* DELETE MODAL */}
        {confirmDeleteIndex !== null && (
          <DeleteModal deleteApplication={deleteApplication} cancelDelete={cancelDelete} />
        )}
      </div>

      {/* RIGHT COLUMN: STATS (sticky) */}
      <div className="w-full md:w-80 mt-12 md:mt-0">
        <div className="sticky top-8">
          <StatsPanel
            applications={applications}
            statusCounts={statusCounts}
            platformCounts={platformCounts}
            cycleCounts={cycleCounts}
          />
        </div>
      </div>
    </main>
  );
}
