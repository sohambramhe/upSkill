import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Clock,
  TrendingUp,
  PlayCircle,
  ArrowRight,
  Plus,
  BarChart3,
  Users,
} from "lucide-react";
import { useSelector } from "react-redux";
import api from "../services/api";
import CourseCard from "../components/CourseCard";
export default function Dashboard() {
  const user = useSelector((s) => s.auth.user);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/courses/mine/enrolled")
      .then((r) => setEnrollments(r.data.enrollments || []))
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load your courses"),
      );
    if (["instructor", "admin"].includes(user?.role))
      api
        .get("/courses/mine/teaching")
        .then((r) => setCourses(r.data.courses || []))
        .catch(() => {});
  }, [user?.role]);
  return (
    <main className="page-shell dashboard-page">
      <div className="container py-5">
        <div className="dashboard-welcome">
          <div>
            <div className="section-kicker">YOUR LEARNING SPACE</div>
            <h1>
              Welcome back,{" "}
              <span>{user?.name?.split(" ")[0] || "learner"}.</span>
            </h1>
            <p>Every lesson is a step toward something bigger.</p>
          </div>
          <div className="welcome-avatar">{user?.name?.[0] || "U"}</div>
        </div>
        <div className="stats-grid">
          <div className="dashboard-stat">
            <span className="stat-icon purple">
              <BookOpen size={20} />
            </span>
            <div>
              <small>My courses</small>
              <strong>{enrollments.length}</strong>
            </div>
          </div>
          <div className="dashboard-stat">
            <span className="stat-icon green">
              <TrendingUp size={20} />
            </span>
            <div>
              <small>Learning progress</small>
              <strong>
                {enrollments.length
                  ? Math.round(
                      enrollments.reduce((n, e) => n + (e.progress || 0), 0) /
                        enrollments.length,
                    )
                  : 0}
                %
              </strong>
            </div>
          </div>
          <div className="dashboard-stat">
            <span className="stat-icon peach">
              <Clock size={20} />
            </span>
            <div>
              <small>Keep your streak</small>
              <strong>Today</strong>
            </div>
          </div>
        </div>
        {error && <div className="alert alert-warning">{error}</div>}
        {["instructor", "admin"].includes(user?.role) && (
          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <div className="section-kicker">TEACHER STUDIO</div>
                <h2>Your courses</h2>
              </div>
              <Link to="/instructor" className="btn btn-purple">
                <Plus size={17} /> Create a course
              </Link>
            </div>
            {courses.length ? (
              <div className="course-grid">
                {courses.map((c) => (
                  <CourseCard key={c._id} course={c} />
                ))}
              </div>
            ) : (
              <div className="dashboard-empty">
                <BarChart3 size={27} />
                <div>
                  <strong>Your teaching journey starts here</strong>
                  <p>Create a course draft and add your first lessons.</p>
                </div>
                <Link to="/instructor" className="text-link">
                  Open instructor studio <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </section>
        )}
        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <div className="section-kicker">YOUR PERSONAL LEARNING PATH</div>
              <h2>Pick up where you left off</h2>
            </div>
            <Link to="/courses" className="text-link">
              Explore more <ArrowRight size={16} />
            </Link>
          </div>
          {enrollments.length ? (
            <div className="enrollment-list">
              {enrollments.map((e) => (
                <div className="enrollment-card" key={e._id}>
                  <img src={e.course?.thumbnail} alt="" />
                  <div className="enrollment-info">
                    <strong>{e.course?.title || "Course unavailable"}</strong>
                    <span>{e.course?.instructor?.name || "Instructor"}</span>
                    <div className="progress-label">
                      <small>{e.progress || 0}% complete</small>
                    </div>
                    <div className="progress">
                      <div style={{ width: `${e.progress || 0}%` }} />
                    </div>
                  </div>
                  <Link
                    to={`/courses/${e.course?.slug || e.course?._id}`}
                    className="btn btn-outline-dark btn-sm"
                  >
                    <PlayCircle size={16} /> Continue
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty">
              <BookOpen size={28} />
              <div>
                <strong>Your next skill is waiting</strong>
                <p>Enroll in a course to build your personal learning path.</p>
              </div>
              <Link to="/courses" className="btn btn-purple">
                Explore courses <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </section>
        <section className="dashboard-bottom-cta">
          <div>
            <h3>Curious about teaching?</h3>
            <p>Turn what you know into a course that helps others grow.</p>
          </div>
          <Link to="/instructor" className="btn btn-outline-dark">
            Explore instructor tools
          </Link>
        </section>
      </div>
    </main>
  );
}
