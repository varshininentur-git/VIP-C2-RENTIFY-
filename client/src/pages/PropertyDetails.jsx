import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import formatINR from "../utils/formatCurrency";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(`/property/${id}`);
        setProperty(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load property details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const amenities = [
    property?.furnishing && `${property.furnishing}`,
    property?.parking ? "Parking available" : "No parking",
    property?.bedrooms ? `${property.bedrooms} bedrooms` : null,
    property?.bathrooms ? `${property.bathrooms} bathrooms` : null,
    property?.propertyType ? property.propertyType : null,
  ]
    .filter(Boolean)
    .slice(0, 5);

  const contactLink = property?.owner?.email ? `mailto:${property.owner.email}` : "#";

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="rounded-[2rem] border border-[#E7D5E7] bg-[#F8F3FB] p-12 text-center text-[#4A3B5B] shadow-pastel">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#D8B4E8]">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#5F4A6D] border-t-transparent" />
          </div>
          <p className="mt-4 text-base font-medium">Loading property details...</p>
        </div>
      ) : error ? (
        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-pastel">
          <p className="text-lg font-semibold">Oops!</p>
          <p className="mt-2">{error}</p>
        </div>
      ) : property ? (
        <>
          <section className="rounded-[2rem] border border-[#E7D5E7] bg-[#F8F3FB] p-8 shadow-pastel">
            <h1 className="text-4xl font-semibold text-[#2F2E41]">{property.title}</h1>
            <p className="mt-3 text-[#5F4A6D]">{property.address}, {property.city}</p>
          </section>
          <section className="grid gap-8 lg:grid-cols-[0.65fr_0.35fr]">
            <div className="rounded-[2rem] border border-[#E7D5E7] bg-[#F8F3FB] p-8 shadow-pastel">
              <div className="h-72 overflow-hidden rounded-[2rem] bg-[#F4ECF7]">
                <img
                  src={property.image || "https://images.unsplash.com/photo-1560185127-6a5d1a4e35d6?auto=format&fit=crop&w=1200&q=80"}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-6 space-y-6">
                <div>
                  <h2 className="text-3xl font-semibold text-[#2F2E41]">About this property</h2>
                  <p className="mt-4 text-[#5F4A6D] leading-relaxed">{property.description}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {amenities.map((item) => (
                    <div key={item} className="rounded-3xl bg-[#F4ECF7] p-4 text-[#5F4A6D]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <aside className="space-y-6 rounded-[2rem] border border-[#E7D5E7] bg-[#F8F3FB] p-8 shadow-pastel">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-[#5F4A6D]">
                  <span>Rent</span>
                  <span className="text-[#2F2E41]">{formatINR(property.rent)}/month</span>
                </div>
                <div className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-[#5F4A6D]">
                  <span>Availability</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${property.availability ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                    {property.availability ? "Available" : "Unavailable"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-[#5F4A6D]">
                  <span>Contact</span>
                  <span className="text-[#2F2E41]">{property.owner?.phone || "Not available"}</span>
                </div>
              </div>
              <a
                href={contactLink}
                className="block w-full rounded-3xl bg-[#BDE0FE] px-6 py-4 text-center text-sm font-semibold text-[#2F2E41] transition hover:bg-[#9EC9F8]"
              >
                Contact Landlord
              </a>
              <div className="rounded-3xl bg-[#F4ECF7] p-5 text-sm text-[#5F4A6D]">
                <p className="font-semibold text-[#2F2E41]">Property type</p>
                <p>{property.propertyType || "N/A"}</p>
              </div>
            </aside>
          </section>
        </>
      ) : (
        <div className="rounded-[2rem] border border-[#E7D5E7] bg-[#F8F3FB] p-12 text-center text-[#4A3B5B] shadow-pastel">
          <p className="text-base font-medium">Property not found.</p>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
