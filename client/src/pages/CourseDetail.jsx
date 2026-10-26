import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  BookOpen,
  Clock,
  Globe,
  PlayCircle,
  Star,
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/api";
import { addToCart } from "../store/cartSlice";

function youtubeEmbedUrl(rawUrl = "") {
  try {
    const url = new URL(rawUrl);
    let videoId = "";
    if (url.hostname.includes("youtu.be"))
      videoId = url.pathname.slice(1).split("/")[0];
    else if (url.hostname.includes("youtube.com")) {
      if (url.pathname === "/watch") videoId = url.searchParams.get("v") || "";
      else if (url.pathname.startsWith("/embed/"))
        videoId = url.pathname.split("/")[2] || "";
      else if (url.pathname.startsWith("/shorts/"))
        videoId = url.pathname.split("/")[2] || "";
    }
    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : "";
  } catch {
    return "";
  }
}

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setCourse(null);
    setSelectedLesson(null);
    setError("");
    api
      .get(`/courses/${id}`)
      .then((r) => setCourse(r.data.course))
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load this course"),
      );
  }, [id]);

  const buy = async () => {
    if (!user) return navigate("/login", { state: { from: `/courses/${id}` } });
    if (Number(course.price) === 0) {
      setBusy(true);
      try {
        await api.post(`/payments/free/${course._id}`);
        navigate("/dashboard");
      } catch (e) {
        setError(e.response?.data?.message || "Enrollment failed");
      } finally {
        setBusy(false);
      }
      return;
    }
    dispatch(addToCart(course));
    navigate("/cart");
  };

  const openLesson = async (lesson) => {
    setError("");
    if (lesson.isPreview && lesson.videoUrl) {
      setSelectedLesson(lesson);
      return;
    }
    if (!user) {
      navigate("/login", { state: { from: `/courses/${id}` } });
      return;
    }
    setBusy(true);
    try {
      const response = await api.get(`/courses/${id}/learning`);
      const fullCourse = response.data.course;
      setCourse((previous) => ({ ...previous, sections: fullCourse.sections }));
      const fullLesson = fullCourse.sections
        ?.flatMap((section) => section.lessons || [])
        .find((item) => item._id === lesson._id);
      if (fullLesson) setSelectedLesson(fullLesson);
      else setError("This lesson is not available yet.");
    } catch (e) {
      setError(
        e.response?.status === 403
          ? "Enroll in this course to access this lesson."
          : e.response?.data?.message || "Could not open lesson",
      );
    } finally {
      setBusy(false);
    }
  };

  if (error && !course)
    return (
      <div className="container py-5">
        <div className="alert alert-warning">{error}</div>
        <Link to="/courses">Back to courses</Link>
      </div>
    );
  if (!course)
    return (
      <div className="container py-5">
        <div className="loading-bar" />
        Loading course...
      </div>
    );
  const lessons =
    course.sections?.reduce(
      (n, section) => n + (section.lessons?.length || 0),
      0,
    ) || 0;
  const playerUrl = youtubeEmbedUrl(selectedLesson?.videoUrl);

  return (
    <main className="course-detail-page">
      <section className="course-detail-hero">
        <div className="container course-detail-grid">
          <div className="course-detail-copy">
            <div className="breadcrumb-line light">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/courses">Courses</Link>
              <span>/</span>
              {course.category}
            </div>
            <span className="detail-category">
              {course.category} <span>•</span> {course.level}
            </span>
            <h1>{course.title}</h1>
            <p className="detail-subtitle">{course.subtitle}</p>
            <div className="detail-rating">
              <strong>{Number(course.averageRating || 4.8).toFixed(1)}</strong>
              <Star size={16} fill="currentColor" />
              <span>({course.reviewCount || 120} ratings)</span>
              <span>•</span>
              <span>{course.enrollmentCount || "Join"} learners</span>
            </div>
            <p className="detail-author">
              Created by{" "}
              <u>{course.instructor?.name || "upSkill Instructor"}</u>
            </p>
            <div className="detail-badges">
              <span>
                <Globe size={15} /> {course.language || "English"}
              </span>
              <span>
                <Clock size={15} /> {lessons} lessons
              </span>
              <span>
                <BookOpen size={15} /> Lifetime access
              </span>
            </div>
          </div>
          <aside className="purchase-card">
            <img src={course.thumbnail} alt={course.title} />
            <div className="purchase-card-body">
              <div className="purchase-price">
                {Number(course.price) === 0
                  ? "Free"
                  : new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(course.price)}
                {course.compareAtPrice > course.price && (
                  <del>${course.compareAtPrice}</del>
                )}
              </div>
              <button
                disabled={busy}
                onClick={buy}
                className="btn btn-purple btn-lg w-100"
              >
                {busy
                  ? "Please wait…"
                  : Number(course.price) === 0
                    ? "Enroll for free"
                    : "Add to cart"}
              </button>
              <p className="purchase-note">
                {Number(course.price) === 0
                  ? "Start learning right away"
                  : "Secure checkout with Stripe"}
              </p>
              <h6>This course includes:</h6>
              <ul className="included-list">
                <li>
                  <PlayCircle size={16} /> On-demand video lessons
                </li>
                <li>
                  <LockKeyhole size={16} /> Access to enrolled lessons
                </li>
                <li>
                  <BookOpen size={16} /> Practical learning outcomes
                </li>
                <li>
                  <CheckCircle2 size={16} /> Progress tracking
                </li>
              </ul>
              <p className="guarantee">
                <CheckCircle2 size={16} /> Learn with confidence
              </p>
            </div>
          </aside>
        </div>
      </section>
      <section className="container course-detail-content">
        <div className="what-you-learn">
          <h2>What you'll learn</h2>
          <div className="outcome-grid">
            {(course.learningOutcomes?.length
              ? course.learningOutcomes
              : [
                "Build practical skills step by step",
                "Apply concepts in real projects",
                "Learn at your own pace",
                "Build confidence through practice",
              ]
            ).map((item, index) => (
              <div key={index}>
                <CheckCircle2 size={18} />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="curriculum">
          <h2>Course content</h2>
          <p>
            {course.sections?.length || 0} sections • {lessons} lessons
          </p>
          {error && (
            <div className="alert alert-info" role="status">
              {error}
            </div>
          )}
          {course.sections?.map((section, index) => (
            <details key={section._id || index} open={index === 0}>
              <summary>
                {section.title}
                <span>{section.lessons?.length || 0} lessons</span>
              </summary>
              <div className="lesson-list">
                {section.lessons?.map((lesson, lessonIndex) => (
                  <button
                    type="button"
                    className="lesson-row"
                    key={lesson._id || lessonIndex}
                    onClick={() => openLesson(lesson)}
                    disabled={busy}
                    aria-label={`Play lesson ${lesson.title}`}
                  >
                    <PlayCircle size={16} />
                    <span>{lesson.title}</span>
                    <small>{lesson.isPreview ? "Preview" : "Lesson"}</small>
                  </button>
                ))}
              </div>
            </details>
          ))}
        </div>
        {selectedLesson && (
          <section className="lesson-player mt-4" aria-label="Lesson video">
            <h2>{selectedLesson.title}</h2>
            {playerUrl ? (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 9",
                }}
              >
                <iframe
                  title={selectedLesson.title}
                  src={playerUrl}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ) : (
              <p>This lesson does not have a valid YouTube URL yet.</p>
            )}
          </section>
        )}
        <div className="instructor-bio">
          <h2>Your instructor</h2>
          <div className="instructor-avatar">
            {course.instructor?.name?.[0] || "L"}
          </div>
          <strong>{course.instructor?.name || "upSkill Instructor"}</strong>
          <p>
            Learn from practical experience, structured lessons, and a clear
            learning path.
          </p>
        </div>
      </section>
    </main>
  );
}
