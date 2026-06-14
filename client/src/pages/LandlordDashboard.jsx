import { useEffect, useState } from "react";
import formatINR from "../utils/formatCurrency";
import { getOwnerProperties, createProperty, updateProperty, deleteProperty } from "../services/propertyService";
import { getOwnerInquiries, updateInquiryStatus } from "../services/dashboardService";

const initialFormState = {
  title: "",
  description: "",
  address: "",
  city: "",
  rent: "",
  bedrooms: "1",
  bathrooms: "1",
  furnishing: "Unfurnished",
  parking: false,
  contactNumber: "",
  propertyType: "Apartment",
  image: "",
};

const LandlordDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [formState, setFormState] = useState(initialFormState);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const loadOwnerData = async () => {
    setLoading(true);
    setError("");
    try {
      const [propertiesResponse, inquiriesResponse] = await Promise.all([
        getOwnerProperties(),
        getOwnerInquiries(),
      ]);

      setProperties(propertiesResponse.data.properties || []);
      setInquiries(inquiriesResponse.data.inquiries || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load landlord dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwnerData();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formState.title.trim()) errors.title = "Title is required.";
    if (!formState.address.trim()) errors.address = "Address is required.";
    if (!formState.city.trim()) errors.city = "City is required.";
    if (!formState.rent || Number(formState.rent) <= 0) errors.rent = "Rent must be greater than zero.";
    if (!formState.bedrooms || Number(formState.bedrooms) <= 0) errors.bedrooms = "Bedrooms are required.";
    if (!formState.bathrooms || Number(formState.bathrooms) <= 0) errors.bathrooms = "Bathrooms are required.";
    if (!formState.contactNumber.trim()) errors.contactNumber = "Contact number is required.";
    if (!formState.propertyType.trim()) errors.propertyType = "Property type is required.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setSelectedPropertyId(null);
    setFormState(initialFormState);
    setFormErrors({});
    setSuccessMessage("");
  };

  const handleInput = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setError("");

    if (!validateForm()) return;

    setFormLoading(true);

    try {
      if (selectedPropertyId) {
        await updateProperty(selectedPropertyId, formState);
        setSuccessMessage("Property updated successfully.");
      } else {
        await createProperty(formState);
        setSuccessMessage("Property added successfully.");
      }
      resetForm();
      await loadOwnerData();
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to save property. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (property) => {
    setSelectedPropertyId(property._id);
    setFormState({
      title: property.title || "",
      description: property.description || "",
      address: property.address || "",
      city: property.city || "",
      rent: property.rent || "",
      bedrooms: property.bedrooms || "1",
      bathrooms: property.bathrooms || "1",
      furnishing: property.furnishing || "Unfurnished",
      parking: property.parking || false,
      contactNumber: property.contactNumber || "",
      propertyType: property.propertyType || "Apartment",
      image: property.image || "",
    });
    setSuccessMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this property? This cannot be undone.");
    if (!confirmed) return;
    setFormLoading(true);
    setError("");

    try {
      await deleteProperty(id);
      setSuccessMessage("Property deleted successfully.");
      await loadOwnerData();
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to delete property.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, status) => {
    setError("");
    try {
      await updateInquiryStatus(bookingId, status);
      setSuccessMessage("Inquiry status updated.");
      await loadOwnerData();
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to update inquiry status.");
    }
  };

  if (loading) {
    return <div className="rounded-3xl border border-[#E7D5E7] bg-[#F8F3FB] p-8 text-center text-[#4A3B5B] shadow-pastel">Loading landlord dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-[#E7D5E7] bg-[#F8F3FB] p-8 shadow-pastel">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[#2F2E41]">Landlord Dashboard</h1>
            <p className="mt-2 text-[#5F4A6D]">Add, edit, and remove your listings, and review tenant inquiries.</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end">
          <a href="/properties/add" className="btn-primary">Add property</a>
        </div>
      </section>

      {(error || successMessage) && (
        <div className="space-y-3">
          {error && <div className="rounded-3xl border border-red-300 bg-red-50 px-6 py-4 text-sm text-red-700">{error}</div>}
          {successMessage && <div className="rounded-3xl border border-emerald-300 bg-emerald-50 px-6 py-4 text-sm text-emerald-700">{successMessage}</div>}
        </div>
      )}

      <section className="rounded-[2rem] border border-[#E7D5E7] bg-[#F8F3FB] p-8 shadow-pastel">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#2F2E41]">{selectedPropertyId ? "Edit Property" : "Add Property"}</h2>
            <p className="mt-2 text-[#5F4A6D]">Use this form to publish a new rental or update an existing listing.</p>
          </div>
          {selectedPropertyId && (
            <button
              onClick={resetForm}
              className="rounded-full border border-[#E7D5E7] bg-[#FAF4FF] px-4 py-2 text-sm font-medium text-[#2F2E41] hover:bg-[#F4ECF7]"
            >
              Cancel edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-[#5F4A6D]">Title</label>
            <input
              type="text"
              value={formState.title}
              onChange={(e) => handleInput("title", e.target.value)}
              className={`w-full rounded-3xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#CDB4DB]/40 ${
                formErrors.title ? "border-red-400 bg-red-50" : "border-[#E7D5E7] bg-[#FCF5FF]"
              }`}
              placeholder="Charming 2BR apartment"
            />
            {formErrors.title && <p className="text-sm text-red-500">{formErrors.title}</p>}

            <label className="block text-sm font-medium text-[#5F4A6D]">Description</label>
            <textarea
              value={formState.description}
              onChange={(e) => handleInput("description", e.target.value)}
              className="w-full rounded-3xl border border-[#E7D5E7] bg-[#FCF5FF] px-4 py-3 text-[#2F2E41] outline-none focus:ring-2 focus:ring-[#CDB4DB]/40"
              rows={5}
              placeholder="Add a short description for your property"
            />

            <label className="block text-sm font-medium text-[#5F4A6D]">Property type</label>
            <select
              value={formState.propertyType}
              onChange={(e) => handleInput("propertyType", e.target.value)}
              className={`w-full rounded-3xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#CDB4DB]/40 ${
                formErrors.propertyType ? "border-red-400 bg-red-50" : "border-[#E7D5E7] bg-[#FCF5FF]"
              }`}
            >
              <option>Apartment</option>
              <option>House</option>
              <option>Studio</option>
              <option>Duplex</option>
              <option>Townhouse</option>
            </select>
            {formErrors.propertyType && <p className="text-sm text-red-500">{formErrors.propertyType}</p>}

            <label className="block text-sm font-medium text-[#5F4A6D]">Image URL</label>
            <input
              type="text"
              value={formState.image}
              onChange={(e) => handleInput("image", e.target.value)}
              className="w-full rounded-3xl border border-[#E7D5E7] bg-[#FCF5FF] px-4 py-3 outline-none focus:ring-2 focus:ring-[#CDB4DB]/40"
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-[#5F4A6D]">Address</label>
            <input
              type="text"
              value={formState.address}
              onChange={(e) => handleInput("address", e.target.value)}
              className={`w-full rounded-3xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#CDB4DB]/40 ${
                formErrors.address ? "border-red-400 bg-red-50" : "border-[#E7D5E7] bg-[#FCF5FF]"
              }`}
              placeholder="123 Main St"
            />
            {formErrors.address && <p className="text-sm text-red-500">{formErrors.address}</p>}

            <label className="block text-sm font-medium text-[#5F4A6D]">City</label>
            <input
              type="text"
              value={formState.city}
              onChange={(e) => handleInput("city", e.target.value)}
              className={`w-full rounded-3xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#CDB4DB]/40 ${
                formErrors.city ? "border-red-400 bg-red-50" : "border-[#E7D5E7] bg-[#FCF5FF]"
              }`}
              placeholder="San Francisco"
            />
            {formErrors.city && <p className="text-sm text-red-500">{formErrors.city}</p>}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#5F4A6D]">Rent (₹)</label>
                <input
                  type="number"
                  value={formState.rent}
                  onChange={(e) => handleInput("rent", e.target.value)}
                  className={`w-full rounded-3xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#CDB4DB]/40 ${
                    formErrors.rent ? "border-red-400 bg-red-50" : "border-[#E7D5E7] bg-[#FCF5FF]"
                  }`}
                  placeholder="15000"
                />
                {formErrors.rent && <p className="text-sm text-red-500">{formErrors.rent}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#5F4A6D]">Contact number</label>
                <input
                  type="tel"
                  value={formState.contactNumber}
                  onChange={(e) => handleInput("contactNumber", e.target.value)}
                  className={`w-full rounded-3xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#CDB4DB]/40 ${
                    formErrors.contactNumber ? "border-red-400 bg-red-50" : "border-[#E7D5E7] bg-[#FCF5FF]"
                  }`}
                  placeholder="(555) 123-4567"
                />
                {formErrors.contactNumber && <p className="text-sm text-red-500">{formErrors.contactNumber}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#5F4A6D]">Bedrooms</label>
                <input
                  type="number"
                  min="1"
                  value={formState.bedrooms}
                  onChange={(e) => handleInput("bedrooms", e.target.value)}
                  className={`w-full rounded-3xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#CDB4DB]/40 ${
                    formErrors.bedrooms ? "border-red-400 bg-red-50" : "border-[#E7D5E7] bg-[#FCF5FF]"
                  }`}
                />
                {formErrors.bedrooms && <p className="text-sm text-red-500">{formErrors.bedrooms}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#5F4A6D]">Bathrooms</label>
                <input
                  type="number"
                  min="1"
                  value={formState.bathrooms}
                  onChange={(e) => handleInput("bathrooms", e.target.value)}
                  className={`w-full rounded-3xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#CDB4DB]/40 ${
                    formErrors.bathrooms ? "border-red-400 bg-red-50" : "border-[#E7D5E7] bg-[#FCF5FF]"
                  }`}
                />
                {formErrors.bathrooms && <p className="text-sm text-red-500">{formErrors.bathrooms}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#5F4A6D]">Furnishing</label>
                <select
                  value={formState.furnishing}
                  onChange={(e) => handleInput("furnishing", e.target.value)}
                  className="w-full rounded-3xl border border-[#E7D5E7] bg-[#FCF5FF] px-4 py-3 outline-none focus:ring-2 focus:ring-[#CDB4DB]/40"
                >
                  <option>Unfurnished</option>
                  <option>Semi Furnished</option>
                  <option>Fully Furnished</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#5F4A6D]">Parking</label>
                <div className="flex items-center gap-3 rounded-3xl border border-[#E7D5E7] bg-[#FCF5FF] px-4 py-3">
                  <input
                    type="checkbox"
                    checked={formState.parking}
                    onChange={(e) => handleInput("parking", e.target.checked)}
                    className="h-5 w-5 accent-[#CDB4DB]"
                  />
                  <span className="text-[#2F2E41]">Available</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="w-full rounded-3xl bg-[#CDB4DB] px-6 py-4 text-base font-semibold text-[#2F2E41] transition hover:bg-[#B79BC6] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {selectedPropertyId ? (formLoading ? "Updating..." : "Update Property") : formLoading ? "Adding..." : "Add Property"}
            </button>
          </div>
        </form>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-[#E7D5E7] bg-[#F8F3FB] p-8 shadow-pastel">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-[#2F2E41]">My properties</h2>
              <p className="mt-2 text-[#5F4A6D]">Edit or delete your active listings.</p>
            </div>
          </div>

          {properties.length ? (
            <div className="mt-6 space-y-4">
              {properties.map((property) => (
                <div key={property._id} className="rounded-3xl border border-[#E7D5E7] bg-[#F8F3FB] p-5 shadow-pastel">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[#2F2E41]">{property.title}</h3>
                      <p className="text-sm text-[#5F4A6D]">{property.city} • {formatINR(property.rent)}/month</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(property)}
                        className="rounded-full border border-[#E7D5E7] bg-[#FAF4FF] px-4 py-2 text-sm font-medium text-[#2F2E41] hover:bg-[#F4ECF7]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(property._id)}
                        className="rounded-full border border-red-300 bg-[#FFE5E8] px-4 py-2 text-sm font-medium text-red-700 hover:bg-[#FFD6DE]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-[#5F4A6D] line-clamp-2">{property.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-[#5F4A6D]">You haven’t added any properties yet. Start by adding a property above.</p>
          )}
        </div>

        <div className="rounded-[2rem] border border-[#E7D5E7] bg-[#F8F3FB] p-8 shadow-pastel">
          <div>
            <h2 className="text-2xl font-semibold text-[#2F2E41]">Tenant inquiries</h2>
            <p className="mt-2 text-[#5F4A6D]">Review and manage booking requests for your listings.</p>
          </div>

          {inquiries.length ? (
            <div className="mt-6 space-y-4">
              {inquiries.map((inquiry) => (
                <div key={inquiry._id} className="rounded-3xl border border-[#E7D5E7] bg-[#FCF5FF] p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[#2F2E41]">{inquiry.property?.title || "Unknown property"}</h3>
                      <p className="text-sm text-[#5F4A6D]">Tenant: {inquiry.user?.name || inquiry.user?.email}</p>
                      <p className="text-sm text-[#5F4A6D]">Visit date: {new Date(inquiry.visitDate).toLocaleDateString()}</p>
                    </div>
                    <span className="rounded-full bg-[#E9E0F6] px-3 py-1 text-sm font-medium text-[#5F4A6D]">
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[#5F4A6D]">Contact: {inquiry.user?.phone || "N/A"}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {inquiry.status !== "Approved" && (
                      <button
                        onClick={() => handleStatusChange(inquiry._id, "Approved")}
                        className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-400"
                      >
                        Approve
                      </button>
                    )}
                    {inquiry.status !== "Rejected" && (
                      <button
                        onClick={() => handleStatusChange(inquiry._id, "Rejected")}
                        className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-[#5F4A6D]">No tenant inquiries yet. Your listings will show inquiries here.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandlordDashboard;
