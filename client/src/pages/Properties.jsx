import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import PropertyCard from "../components/property/PropertyCard";

const Properties = () => {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProperties = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};

      if (city) params.city = city;
      if (minRent) params.minRent = minRent;
      if (maxRent) params.maxRent = maxRent;

      const response = await api.get("/property", { params });
      setProperties(response.data.properties || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    if (!search.trim()) {
      return properties;
    }

    const query = search.toLowerCase();
    return properties.filter((property) => {
      return (
        property.title?.toLowerCase().includes(query) ||
        property.address?.toLowerCase().includes(query) ||
        property.city?.toLowerCase().includes(query)
      );
    });
  }, [properties, search]);

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-[#E7D5E7] bg-[#F8F3FB] p-6 shadow-pastel">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[#2F2E41]">Search properties</h1>
            <p className="mt-2 text-[#5F4A6D]">Filter available rentals by location and monthly rent.</p>
          </div>
          <button
            onClick={fetchProperties}
            className="inline-flex items-center justify-center rounded-full bg-[#CDB4DB] px-6 py-3 text-sm font-semibold text-[#2F2E41] transition hover:bg-[#B79BC6]"
          >
            Refresh listings
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr]">
          <input
            type="text"
            placeholder="Search by title or location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-3xl border border-[#E7D5E7] bg-[#F8F3FB] px-5 py-4 text-[#2F2E41] outline-none focus:border-[#CDB4DB] focus:ring-2 focus:ring-[#CDB4DB]/30"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-3xl border border-[#E7D5E7] bg-[#F8F3FB] px-5 py-4 text-[#2F2E41] outline-none focus:border-[#CDB4DB] focus:ring-2 focus:ring-[#CDB4DB]/30"
            />
            <input
              type="number"
              placeholder="Min rent"
              value={minRent}
              onChange={(e) => setMinRent(e.target.value)}
              className="rounded-3xl border border-[#E7D5E7] bg-[#F8F3FB] px-5 py-4 text-[#2F2E41] outline-none focus:border-[#CDB4DB] focus:ring-2 focus:ring-[#CDB4DB]/30"
            />
            <input
              type="number"
              placeholder="Max rent"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value)}
              className="rounded-3xl border border-[#E7D5E7] bg-[#F8F3FB] px-5 py-4 text-[#2F2E41] outline-none focus:border-[#CDB4DB] focus:ring-2 focus:ring-[#CDB4DB]/30"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[2rem] border border-[#E7D5E7] bg-[#F8F3FB] p-12 text-center text-[#4A3B5B] shadow-pastel">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#D8B4E8]">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
          </div>
          <p className="mt-4 text-base font-medium">Loading properties...</p>
        </div>
      ) : error ? (
        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-pastel">
          <p className="text-lg font-semibold">Unable to load properties</p>
          <p className="mt-2">{error}</p>
          <button
            onClick={fetchProperties}
            className="mt-6 rounded-full bg-[#CDB4DB] px-6 py-3 text-sm font-semibold text-[#2F2E41] transition hover:bg-[#B79BC6]"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))
          ) : (
            <div className="col-span-full rounded-[2rem] border border-dashed border-[#D8B4E8] bg-[#F8F3FB] p-12 text-center text-[#5F4A6D] shadow-pastel">
              No properties matched your search. Try adjusting the city or rent filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Properties;
