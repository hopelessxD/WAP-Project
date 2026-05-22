import React, { useState } from "react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const STATUS_OPTIONS = ["Admitted", "Discharged", "Under Observation"];

function PatientForm({ onCreate, onClose }) {
  const [form, setForm] = useState({
    full_name: "",
    age: "",
    contact_number: "",
    height_cm: "",
    weight_kg: "",
    blood_group: "O+",
    diagnosis: "",
    status: "Admitted",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/patients/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      onCreate && onCreate(data);
      setForm({
        full_name: "",
        age: "",
        contact_number: "",
        height_cm: "",
        weight_kg: "",
        blood_group: "O+",
        diagnosis: "",
        status: "Admitted",
      });
      onClose && onClose();
    } catch (err) {
      setError(err.message || "Failed to create");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 640 }}
      >
        <div className="modal-head">
          <h2 className="modal-title">Create Patient</h2>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Age
            <input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Contact number
            <input
              name="contact_number"
              value={form.contact_number}
              onChange={handleChange}
            />
          </label>
          <label>
            Height (cm)
            <input
              name="height_cm"
              value={form.height_cm}
              onChange={handleChange}
              placeholder="e.g. 170"
            />
          </label>
          <label>
            Weight (kg)
            <input
              name="weight_kg"
              value={form.weight_kg}
              onChange={handleChange}
              placeholder="e.g. 65"
            />
          </label>
          <label>
            Blood group
            <select
              name="blood_group"
              value={form.blood_group}
              onChange={handleChange}
            >
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </label>
          <label>
            Diagnosis
            <input
              name="diagnosis"
              value={form.diagnosis}
              onChange={handleChange}
            />
          </label>
          <label>
            Status
            <select name="status" value={form.status} onChange={handleChange}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <div className="modal-footer" style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PatientForm;
