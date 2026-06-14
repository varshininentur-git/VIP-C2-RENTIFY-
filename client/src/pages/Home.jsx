import { Link } from "react-router-dom";
import formatINR from "../utils/formatCurrency";

const featuredProperties = [
  {
    id: 1,
    title: "Modern 2BHK Apartment",
    location: "Bandra, Mumbai",
    rent: 28000,
    badge: "Available",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Cozy Studio Flat",
    location: "Koramangala, Bangalore",
    rent: 22000,
    badge: "Available",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Luxury 3BHK Villa",
    location: "Kharadi, Pune",
    rent: 52000,
    badge: "Limited",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  },
];

const Home = () => {
  return (
    <section className="space-y-16">
      <div className="rounded-[2rem] bg-gradient-to-br from-[#CDB4DB] via-[#FFC8DD] to-[#BDE0FE] px-6 py-12 text-[#2F2E41] shadow-pastel sm:px-10 sm:py-16 lg:px-14">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.28em] text-[#5F4A6D]">Rentify</p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight sm:text-6xl">
              Discover your perfect rental home with fast search and verified listings.
            </h1>
            <p className="max-w-2xl text-lg text-slate-200 sm:text-xl">
              Search modern apartments, houses, and villas across major cities. Manage favorites,
              contact landlords, and find the right place in minutes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/properties"
                className="rounded-full bg-[#FFC8DD] px-7 py-3 text-sm font-semibold text-[#2F2E41] transition hover:bg-[#F6B6D2]"
              >
                Browse Properties
              </Link>
              <Link
                to="/register"
                className="rounded-full border border-white/50 bg-[#F8F3FB] px-7 py-3 text-sm font-semibold text-[#2F2E41] transition hover:bg-[#F4ECF7]"
              >
                Register
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#E7D5E7] bg-[#F8F3FB] p-8 shadow-xl shadow-pastel backdrop-blur-xl">
            <div className="space-y-6">
              <div className="rounded-[2rem] bg-[#D8B4E8] p-8 text-[#2F2E41] shadow-lg">
                <p className="text-sm uppercase tracking-[0.28em] text-[#6B527F]">Featured Rental</p>
                <h2 className="mt-4 text-3xl font-semibold">Luxury 3BHK with city views</h2>
                <p className="mt-4 text-[#3F3250]">
                  Beautifully furnished home with a rooftop lounge, modern amenities, and quick access to transit.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    "Verified landlord",
                    "Flexible lease",
                    "Secure booking",
                    "24/7 support",
                  ].map((item) => (
                    <div key={item} className="rounded-3xl bg-[#F4ECF7]/80 px-4 py-4 text-sm text-[#5F4A6D]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-[#E7D5E7] bg-[#F8F3FB] p-6 text-[#2F2E41]">
                <p className="text-sm uppercase tracking-[0.28em] text-[#6B527F]">Quick search</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Search city or property"
                    className="rounded-3xl border border-[#D8B4E8] bg-[#F8F3FB] px-5 py-4 text-[#2F2E41] outline-none focus:border-[#CDB4DB] focus:ring-2 focus:ring-[#CDB4DB]/30"
                  />
                  <button className="rounded-3xl bg-[#BDE0FE] px-6 py-4 text-sm font-semibold text-[#2F2E41] transition hover:bg-[#9EC9F8]">
                    Search Rentals
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-500">Featured properties</p>
            <h2 className="text-3xl font-semibold text-[#2F2E41]">Popular rentals to explore</h2>
          </div>
          <Link
            to="/properties"
            className="text-sm font-semibold text-[#5F4A6D] underline-offset-4 transition hover:text-[#2F2E41]"
          >
            Browse all properties
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {featuredProperties.map((property) => (
            <div key={property.id} className="rounded-[2rem] border border-[#E7D5E7] bg-[#F8F3FB] p-6 shadow-pastel transition hover:-translate-y-1 hover:shadow-lg">
              <div className="h-52 overflow-hidden rounded-[1.75rem] bg-[#F4ECF7]">
                <img
                  src={property.image || "https://images.unsplash.com/photo-1560185127-6a5d1a4e35d6?auto=format&fit=crop&w=1200&q=80"}
                  alt={property.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-sky-600">
                  <span>{property.badge}</span>
                  <span className="rounded-full bg-[#F4ECF7] px-3 py-1 text-xs font-semibold text-[#5F4A6D]">
                    {formatINR(property.rent)}/mo
                  </span>
                </div>
                <h3 className="text-2xl font-semibold text-[#2F2E41]">{property.title}</h3>
                <p className="text-[#5F4A6D]">{property.location}</p>
                <Link
                  to="/properties"
                  className="inline-flex rounded-full bg-[#CDB4DB] px-5 py-3 text-sm font-semibold text-[#2F2E41] transition hover:bg-[#B79BC6]"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
