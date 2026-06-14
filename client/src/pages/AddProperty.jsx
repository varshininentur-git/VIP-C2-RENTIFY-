import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProperty } from "../services/propertyService";

const AddProperty = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rent, setRent] = useState("");
  const [location, setLocation] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [availability, setAvailability] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Title is required.";
    if (!description.trim()) e.description = "Description is required.";
    if (!rent || Number(rent) <= 0) e.rent = "Rent must be greater than zero.";
    if (!location.trim()) e.location = "Location is required.";
    if (!furnishing) e.furnishing = "Furnishing is required.";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError("");
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      // Map simple fields to backend structure. Use location for both address and city when user provides a single value.
      const payload = {
        title: title.trim(),
        description: description.trim(),
        rent: Number(rent),
        address: location.trim(),
        city: location.trim(),
        furnishing,
        parking: false,
        contactNumber: "",
        propertyType: "Other",
        image: "",
        availability,
      };

      await createProperty(payload);
      navigate("/dashboard/landlord");
    } catch (err) {
      setServerError(err?.response?.data?.message || "Unable to add property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-[#E7D5E7] bg-[#F8F3FB] p-8 shadow-pastel">
        <h1 className="text-2xl font-semibold text-[#2F2E41]">Add Property</h1>
        <p className="mt-2 text-[#5F4A6D]">Create a new property listing.</p>

        {serverError && <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-red-700">{serverError}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#5F4A6D]">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`mt-1 w-full rounded-3xl border px-3 py-2 bg-[#FCF5FF] text-[#2F2E41] outline-none focus:ring-2 ${errors.title ? "border-red-300 focus:ring-red-200" : "border-[#E7D5E7] focus:ring-[#CDB4DB]/40"}`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5F4A6D]">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className={`mt-1 w-full rounded-lg border px-3 py-2 bg-[#FCF5FF] outline-none focus:ring-2 ${errors.description ? "border-red-300 focus:ring-red-200" : "border-[#E7D5E7] focus:ring-[#CDB4DB]/40"}`}
            />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
            <label className="block text-sm font-medium text-[#5F4A6D]">Rent (₹)</label>
            <input
              type="number"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              className={`mt-1 w-full rounded-3xl border px-3 py-2 bg-[#FCF5FF] text-[#2F2E41] outline-none focus:ring-2 ${errors.rent ? "border-red-300 focus:ring-red-200" : "border-[#E7D5E7] focus:ring-[#CDB4DB]/40"}`}
              placeholder="15000"
            />
            {errors.rent && <p className="mt-1 text-sm text-red-500">{errors.rent}</p>}
          </div>

            <div>
              <label className="block text-sm font-medium text-[#5F4A6D]">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`mt-1 w-full rounded-lg border px-3 py-2 bg-[#FCF5FF] outline-none focus:ring-2 ${errors.location ? "border-red-300 focus:ring-red-200" : "border-[#E7D5E7] focus:ring-[#CDB4DB]/40"}`}
                placeholder="Street address or city"
              />
              {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5F4A6D]">Furnishing</label>
            <select
              value={furnishing}
              onChange={(e) => setFurnishing(e.target.value)}
              className={`mt-1 w-full rounded-lg border px-3 py-2 bg-[#FCF5FF] outline-none focus:ring-2 ${errors.furnishing ? "border-red-300 focus:ring-red-200" : "border-[#E7D5E7] focus:ring-[#CDB4DB]/40"}`}
            >
              <option value="">Select furnishing</option>
              <option value="Fully Furnished">Fully Furnished</option>
              <option value="Semi Furnished">Semi Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
            {errors.furnishing && <p className="mt-1 text-sm text-red-500">{errors.furnishing}</p>}
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" checked={availability} onChange={(e) => setAvailability(e.target.checked)} className="h-4 w-4 accent-[#CDB4DB]" />
            <label className="text-sm text-[#5F4A6D]">Available</label>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#CDB4DB] px-4 py-2 text-[#2F2E41] hover:bg-[#B79BC6] disabled:opacity-70"
            >
              {loading ? "Adding..." : "Add Property"}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="rounded-lg border border-[#E7D5E7] bg-[#F8F3FB] px-4 py-2 text-sm text-[#2F2E41] hover:bg-[#F4ECF7]">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
