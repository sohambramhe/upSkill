import { Link } from "react-router-dom";
import { Star, Clock, Users } from "lucide-react";
export default function CourseCard({ course }) {
  const price = Number(course.price || 0);
  return (
    <article className="course-card">
      <Link
        to={`/courses/${course.slug || course._id}`}
        className="course-image-wrap"
      >
        <img
          src={
            course.thumbnail ||
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"
          }
          alt={course.title}
          loading="lazy"
        />
        <span className="course-level">{course.level || "All levels"}</span>
      </Link>
      <div className="course-card-body">
        <Link
          to={`/courses/${course.slug || course._id}`}
          className="course-title"
        >
          {course.title}
        </Link>
        <p className="course-subtitle">
          {course.subtitle || course.description?.slice(0, 80)}
        </p>
        <div className="course-instructor">
          {course.instructor?.name || "upSkill Instructor"}
        </div>
        <div className="course-meta">
          <span className="rating-number">
            {Number(course.averageRating || 4.8).toFixed(1)}
          </span>
          <Star size={14} fill="currentColor" />
          <span className="muted">
            (
            {course.reviewCount ||
              Math.floor(120 + String(course._id || "x").length * 13)}
            )
          </span>
          <span className="meta-spacer" />
          <span className="muted">
            <Users size={14} />
            {course.enrollmentCount || "New"}
          </span>
        </div>
        <div className="price-row">
          <strong>
            {price === 0
              ? "Free"
              : new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(price)}
          </strong>
          {course.compareAtPrice > price && <del>${course.compareAtPrice}</del>}
        </div>
      </div>
    </article>
  );
}
