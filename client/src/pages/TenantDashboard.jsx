import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFavorites, getBookings } from "../services/dashboardService";
import { AuthContext } from "../context/AuthContext";
import formatINR from "../utils/formatCurrency";

const SEARCH_HISTORY_KEY = "rentify_search_history";

const readSearchHistory = () => {
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const writeSearchHistory = (history) => {
  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  } catch {}
};

const TenantDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchHistory, setSearchHistory] = useState(() => readSearchHistory());

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [favoritesResponse, bookingsResponse] = await Promise.all([getFavorites(), getBookings()]);
        setFavorites(favoritesResponse.data.favorites || []);
        setBookings(bookingsResponse.data.bookings || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load your dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const clearHistory = () => {
    writeSearchHistory([]);
    setSearchHistory([]);
  };

  const runHistorySearch = (q) => {
    // navigate to properties with query param
    navigate(`/properties?q=${encodeURIComponent(q)}`);
  };

  if (loading) {
    return <div className="rounded-3xl border border-[#E7D5E7] bg-[#F8F3FB] p-8 text-center text-[#4A3B5B] shadow-pastel">Loading your dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-[#E7D5E7] bg-[#F8F3FB] p-8 shadow-pastel">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[#2F2E41]">Tenant Dashboard</h1>
            <p className="mt-2 text-[#5F4A6D]">Your saved properties, applications, searches, and profile.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="rounded-full border border-[#E7D5E7] bg-[#FAF4FF] px-4 py-2 text-sm font-medium text-[#2F2E41] hover:bg-[#F4ECF7]"
            >
              Logout
            </button>
          </div>
        </div>
      </section>

      {error && <div className="rounded-3xl border border-red-300 bg-red-50 px-6 py-4 text-sm text-red-700">{error}</div>}

      {!favorites.length && !bookings.length && !error && (
        <section className="rounded-[2rem] border border-[#E7D5E7] bg-[#F8F3FB] p-8 text-center text-[#4A3B5B] shadow-pastel">
          <h2 className="text-xl font-semibold text-[#2F2E41]">No properties available yet.</h2>
          <p className="mt-2 text-[#5F4A6D]">Start by browsing rentals and saving your favorites or applying for a booking.</p>
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-[#E7D5E7] bg-[#F8F3FB] p-6 shadow-pastel">
          <h2 className="text-xl font-semibold text-[#2F2E41]">Profile</h2>
          <p className="mt-2 text-[#5F4A6D]">View your account details.</p>
          <div className="mt-4 space-y-2">
            <div>
              <div className="text-sm text-[#5F4A6D]">Name</div>
              <div className="font-medium">{user?.name || "—"}</div>
            </div>
            <div>
              <div className="text-sm text-[#5F4A6D]">Email</div>
              <div className="font-medium">{user?.email || "—"}</div>
            </div>
            <div>
              <div className="text-sm text-[#5F4A6D]">Phone</div>
              <div className="font-medium">{user?.phone || "—"}</div>
            </div>
            <div>
              <div className="text-sm text-[#5F4A6D]">Role</div>
              <div className="font-medium capitalize">{user?.role || "tenant"}</div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#E7D5E7] bg-[#F8F3FB] p-6 shadow-pastel">
          <h2 className="text-xl font-semibold text-[#2F2E41]">Saved Properties</h2>
          <p className="mt-2 text-[#5F4A6D]">Properties you’ve saved for later.</p>
          <div className="mt-4 space-y-3">
            {favorites.length ? (
              favorites.map((fav) => {
                const prop = fav.property || fav;
                return (
                  <Link key={prop._id} to={`/properties/${prop._id}`} className="block rounded-2xl border border-[#E7D5E7] p-3 hover:bg-[#F4ECF7]">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-[#2F2E41]">{prop.title}</div>
                        <div className="text-sm text-[#5F4A6D]">{prop.city} • {formatINR(prop.rent)}</div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="text-sm text-[#5F4A6D]">You have not saved any properties yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#E7D5E7] bg-[#F8F3FB] p-6 shadow-pastel">
          <h2 className="text-xl font-semibold text-[#2F2E41]">Applied Properties</h2>
          <p className="mt-2 text-[#5F4A6D]">Your booking / inquiry applications.</p>
          <div className="mt-4 space-y-3">
            {bookings.length ? (
              bookings.map((b) => (
                <div key={b._id} className="rounded-2xl border border-[#E7D5E7] bg-[#F8F3FB] p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[#2F2E41]">{b.property?.title || "Unknown"}</div>
                      <div className="text-sm text-[#5F4A6D]">Visit: {new Date(b.visitDate).toLocaleDateString()}</div>
                    </div>
                    <div className="text-sm font-medium">
                      <span className="rounded-full px-3 py-1 bg-[#e5def6] text-[#5F4A6D]">{b.status}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#5F4A6D]">No applications found.</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[#E7D5E7] bg-[#F8F3FB] p-6 shadow-pastel">
        <h2 className="text-xl font-semibold text-[#2F2E41]">Search History</h2>
        <p className="mt-2 text-[#5F4A6D]">Recent searches you performed while browsing properties.</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {searchHistory.length ? (
              searchHistory.map((q, i) => (
                <button
                  key={`${q}-${i}`}
                  onClick={() => runHistorySearch(q)}
                  className="rounded-full border border-[#E7D5E7] bg-[#F8F3FB] px-4 py-2 text-sm text-[#2F2E41] hover:bg-[#F4ECF7]"
                >
                  {q}
                </button>
              ))
            ) : (
              <p className="text-sm text-[#5F4A6D]">No recent searches.</p>
            )}
          </div>
          {searchHistory.length > 0 && (
            <button onClick={clearHistory} className="rounded-full px-4 py-2 text-sm text-[#A52A2A] hover:underline">
              Clear
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default TenantDashboard;
