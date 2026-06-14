import { Link } from "react-router-dom";
import formatINR from "../../utils/formatCurrency";

const PropertyCard = ({ property }) => {
  return (
    <article className="card overflow-hidden group transition hover:-translate-y-1 hover:shadow-pastel">
      <div className="h-56 overflow-hidden bg-[#F5EBF9]">
        <img
          src={property.image || "https://images.unsplash.com/photo-1560185127-6a5d1a4e35d6?auto=format&fit=crop&w=1200&q=80"}
          alt={property.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="flex flex-col gap-3 text-xs uppercase tracking-wider text-sky-600 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-semibold text-sky-600">{property.propertyType || "Apartment"}</span>
          <span className="muted">{property.city || "Unknown"}</span>
        </div>
        <h3 className="mt-3 text-lg font-semibold text-[#2F2E41]">{property.title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#5F4A6D] line-clamp-2">{property.description}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[#4A3B5B]">
          <div className="space-y-2">
            <p className="text-lg font-semibold text-[#2F2E41]">{formatINR(property.rent)}/mo</p>
            <p className="text-sm text-[#5F4A6D]">{property.address ? `${property.address}, ${property.city}` : property.city || "Unknown location"}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${property.availability ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
            {property.availability ? "Available" : "Unavailable"}
          </span>
        </div>
        <div className="mt-5 flex items-center justify-between gap-4">
          <span className="muted text-sm">{property.bedrooms || 0} beds • {property.bathrooms || 0} baths</span>
          <Link to={`/properties/${property._id}`} className="rounded-full bg-[#BDE0FE] px-4 py-2 text-[#2F2E41] transition hover:bg-[#9EC9F8]">
            View
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;
