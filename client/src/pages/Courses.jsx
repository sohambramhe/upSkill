import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SlidersHorizontal, Search } from "lucide-react";
import api from "../services/api";
import CourseCard from "../components/CourseCard";
const cats = [
  "All",
  "Development",
  "Design",
  "Business",
  "Data Science",
  "Marketing",
  "Personal Development",
];
export default function Courses() {
  const [params, setParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const q = params.get("q") || "";
  const category = params.get("category") || "All";
  const level = params.get("level") || "All levels";
  const sort = params.get("sort") || "newest";
  useEffect(() => {
    let live = true;
    setLoading(true);
    api
      .get("/courses", { params: { q, category, level, sort, limit: 48 } })
      .then((r) => live && setCourses(r.data.courses || []))
      .catch(
        () =>
          live &&
          setError(
            "API unavailable. Start the backend and check your environment variables.",
          ),
      )
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [q, category, level, sort]);
  const update = (k, v) => {
    const p = new URLSearchParams(params);
    if (v && v !== "All" && v !== "All levels" && v !== "newest") p.set(k, v);
    else p.delete(k);
    setParams(p);
  };
  return (
    <main className="page-shell">
      <div className="container py-5">
        <div className="breadcrumb-line">
          <Link to="/">Home</Link>
          <span>/</span>Courses
        </div>
        <div className="catalog-heading">
          <div>
            <div className="section-kicker">THE COURSE CATALOG</div>
            <h1>
              Find your next <span>skill.</span>
            </h1>
            <p>Curated learning for wherever you want to go.</p>
          </div>
          <div className="catalog-count">
            <strong>{courses.length}</strong>
            <span>courses shown</span>
          </div>
        </div>
        <div className="catalog-layout">
          <aside className="filter-panel">
            <h5>
              <SlidersHorizontal size={17} /> Filters
            </h5>
            <label>Category</label>
            <div className="filter-options">
              {cats.map((c) => (
                <button
                  key={c}
                  className={category === c ? "active" : ""}
                  onClick={() => update("category", c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <hr />
            <label>Level</label>
            <select
              className="form-select"
              value={level}
              onChange={(e) => update("level", e.target.value)}
            >
              <option>All levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <hr />
            <label>Sort by</label>
            <select
              className="form-select"
              value={sort}
              onChange={(e) => update("sort", e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="rating">Top rated</option>
              <option value="priceLow">Price: low to high</option>
              <option value="priceHigh">Price: high to low</option>
            </select>
            <button
              className="clear-filters"
              onClick={() => setParams(q ? { q } : {})}
            >
              Clear filters
            </button>
          </aside>
          <section className="catalog-results">
            <div className="catalog-toolbar">
              <span>
                {q ? (
                  <>
                    Search results for <strong>“{q}”</strong>
                  </>
                ) : (
                  <strong>Explore all courses</strong>
                )}
              </span>
              <div>
                <Search size={16} />
                <span>Learn at your own pace</span>
              </div>
            </div>
            {error && <div className="alert alert-warning">{error}</div>}
            {loading ? (
              <div className="course-grid">
                {[1, 2, 3, 4].map((n) => (
                  <div className="skeleton" key={n} />
                ))}
              </div>
            ) : courses.length ? (
              <div className="course-grid">
                {courses.map((c) => (
                  <CourseCard key={c._id} course={c} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No matches this time</h3>
                <p>Try a different search or clear the filters.</p>
                <button
                  className="btn btn-purple"
                  onClick={() => setParams({})}
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
