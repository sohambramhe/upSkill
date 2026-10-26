import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  PlayCircle,
  ShieldCheck,
  Infinity,
  Users,
  TrendingUp,
  Code2,
  Palette,
  Briefcase,
  BarChart3,
} from "lucide-react";
import api from "../services/api";
import CourseCard from "../components/CourseCard";
const categories = [
  {
    name: "Development",
    icon: Code2,
    color: "lavender",
    desc: "Build the future",
  },
  { name: "Design", icon: Palette, color: "peach", desc: "Make ideas visible" },
  {
    name: "Business",
    icon: Briefcase,
    color: "mint",
    desc: "Grow your impact",
  },
  {
    name: "Data Science",
    icon: BarChart3,
    color: "blue",
    desc: "Find the signal",
  },
];
export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  useEffect(() => {
    let live = true;
    setLoading(true);
    api
      .get("/courses", { params: { q, limit: 8 } })
      .then((r) => {
        if (live) setCourses(r.data.courses || []);
      })
      .catch(() => {
        if (live)
          setError(
            "Could not connect to the course API. Start the backend or check VITE_API_URL.",
          );
      })
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [q]);
  return (
    <>
      <section className="hero-section">
        <div className="hero-glow glow-one" />
        <div className="hero-glow glow-two" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              YOUR NEXT CHAPTER STARTS HERE
            </div>
            <h1>
              Skills that open
              <br />
              <span>new doors.</span>
            </h1>
            <p>
              Learn in-demand skills from people who know them best. Practical
              courses, real projects, and progress you can feel.
            </p>
            <div className="hero-actions">
              <Link to="/courses" className="btn btn-purple btn-lg">
                Explore courses <ArrowRight size={18} />
              </Link>
              <a href="#featured" className="hero-secondary">
                <PlayCircle size={20} /> Find your path
              </a>
            </div>
            <div className="hero-proof">
              <div className="avatar-stack">
                <span>J</span>
                <span>M</span>
                <span>A</span>
                <span>+</span>
              </div>
              <div>
                <strong>Join a growing community</strong>
                <small>of curious, ambitious learners</small>
              </div>
            </div>
          </div>
          <div className="hero-art">
            <div className="art-orbit orbit-a" />
            <div className="art-orbit orbit-b" />
            <div className="learning-card main-learning-card">
              <div className="learning-card-top">
                <span className="live-dot" /> LEARNING IN PROGRESS{" "}
                <span className="dots">•••</span>
              </div>
              <div className="art-code-window">
                <div className="window-dots">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="code-line short" />
                <div className="code-line medium" />
                <div className="code-line long" />
                <div className="code-line tiny" />
              </div>
              <div className="learning-progress">
                <div className="progress-label">
                  <span>Weekly goal</span>
                  <strong>72%</strong>
                </div>
                <div className="progress">
                  <div style={{ width: "72%" }} />
                </div>
              </div>
              <div className="learning-card-footer">
                <div className="mini-course-icon">
                  <Code2 size={20} />
                </div>
                <div>
                  <strong>Modern web development</strong>
                  <small>Lesson 8 of 12</small>
                </div>
                <span className="play-circle">
                  <PlayCircle size={20} />
                </span>
              </div>
            </div>
            <div className="floating-stat stat-top">
              <span className="stat-icon purple">
                <TrendingUp size={19} />
              </span>
              <div>
                <strong>One step closer</strong>
                <small>Your streak is growing</small>
              </div>
            </div>
            <div className="floating-stat stat-bottom">
              <span className="stat-icon green">
                <ShieldCheck size={20} />
              </span>
              <div>
                <strong>New skill unlocked</strong>
                <small>Keep the momentum</small>
              </div>
            </div>
            <div className="sparkle sparkle-one">✳</div>
            <div className="sparkle sparkle-two">✦</div>
          </div>
        </div>
        <div className="container hero-bottom">
          <div>
            <strong>Learn by doing</strong>
            <span>Practical, project-based courses</span>
          </div>
          <div>
            <strong>At your own pace</strong>
            <span>Your schedule, your goals</span>
          </div>
          <div>
            <strong>Keep your momentum</strong>
            <span>Track every milestone</span>
          </div>
        </div>
      </section>
      <section className="category-section section-pad">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="section-kicker">A WORLD OF POSSIBILITIES</div>
              <h2>
                What do you want to <span>learn?</span>
              </h2>
              <p>Start with a topic that excites you. The rest follows.</p>
            </div>
            <Link to="/courses" className="text-link">
              All courses <ArrowRight size={16} />
            </Link>
          </div>
          <div className="row g-3">
            {categories.map((c) => {
              const Icon = c.icon;
              return (
                <div className="col-6 col-lg-3" key={c.name}>
                  <Link
                    className="category-tile"
                    to={`/courses?category=${encodeURIComponent(c.name)}`}
                  >
                    <span className={`category-icon ${c.color}`}>
                      <Icon size={23} />
                    </span>
                    <strong>{c.name}</strong>
                    <small>{c.desc}</small>
                    <ArrowRight className="category-arrow" size={18} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section id="featured" className="featured-section section-pad">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="section-kicker">HANDPICKED FOR YOUR GROWTH</div>
              <h2>
                {q ? `Results for “${q}”` : "Popular courses, real skills."}
              </h2>
              <p>
                Explore practical learning paths designed to help you move
                forward.
              </p>
            </div>
            <Link to="/courses" className="text-link">
              Browse catalog <ArrowRight size={16} />
            </Link>
          </div>
          {error && (
            <div className="alert alert-warning">
              {error} Seed sample courses with <code>npm run seed</code> in the
              server folder.
            </div>
          )}
          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3, 4].map((n) => (
                <div className="skeleton" key={n} />
              ))}
            </div>
          ) : courses.length ? (
            <div className="course-grid">
              {courses.slice(0, 8).map((c) => (
                <CourseCard key={c._id} course={c} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No courses found yet</h3>
              <p>
                Run the seed command to add sample courses, or try another
                search.
              </p>
              <Link to="/courses" className="btn btn-purple">
                Browse all courses
              </Link>
            </div>
          )}
        </div>
      </section>
      <section className="cta-section">
        <div className="container">
          <div className="cta-panel">
            <div>
              <div className="section-kicker">SHARE WHAT YOU KNOW</div>
              <h2>
                Turn your experience
                <br />
                into someone’s next step.
              </h2>
              <p>
                Create a course, share your knowledge, and help someone build a
                skill that matters.
              </p>
              <Link to="/instructor" className="btn btn-light btn-lg">
                Become an instructor <ArrowRight size={18} />
              </Link>
            </div>
            <div className="cta-illustration">
              <div className="cta-ring ring-one" />
              <div className="cta-ring ring-two" />
              <div className="cta-book">
                <BookOpenIcon />
              </div>
              <span className="cta-star star-a">✦</span>
              <span className="cta-star star-b">✳</span>
            </div>
          </div>
        </div>
      </section>
      <section className="trust-section">
        <div className="container trust-row">
          <div>
            <Infinity size={23} />
            <span>Learn for life</span>
          </div>
          <div>
            <Users size={23} />
            <span>Community-powered</span>
          </div>
          <div>
            <ShieldCheck size={23} />
            <span>Your progress, protected</span>
          </div>
        </div>
      </section>
    </>
  );
}
function BookOpenIcon() {
  return <Code2 size={62} />;
}
