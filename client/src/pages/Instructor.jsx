import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, BookOpen, Users, Eye, Edit3, ExternalLink } from "lucide-react";
import { useSelector } from "react-redux";
import api from "../services/api";

const blank = {
  title: "",
  subtitle: "",
  description: "",
  category: "Development",
  level: "Beginner",
  price: 0,
  thumbnail: "",
  learningOutcomes: [""],
  sections: [
    {
      title: "Getting started",
      lessons: [
        {
          title: "Welcome lesson",
          videoUrl: "",
          duration: 0,
          isPreview: true,
          order: 1,
        },
      ],
    },
  ],
};

const emptyForm = () => ({
  ...blank,
  learningOutcomes: [...blank.learningOutcomes],
  sections: blank.sections.map((section) => ({
    ...section,
    lessons: section.lessons.map((lesson) => ({ ...lesson })),
  })),
});

export default function Instructor() {
  const user = useSelector((state) => state.auth.user);

  const [courses, setCourses] = useState([]);
  const [show, setShow] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const response = await api.get("/courses/mine/teaching");
      setCourses(response.data.courses || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Sign in as an instructor to manage courses.",
      );
    }
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const startCreate = () => {
    setEditingCourse(null);
    setForm(emptyForm());
    setMessage("");
    setError("");
    setShow(true);
  };

  const startEdit = (course) => {
    setEditingCourse(course);
    setForm({
      ...emptyForm(),
      title: course.title || "",
      subtitle: course.subtitle || "",
      description: course.description || "",
      category: course.category || "Development",
      level: course.level || "Beginner",
      price: course.price ?? 0,
      thumbnail: course.thumbnail || "",
      learningOutcomes:
        course.learningOutcomes?.length > 0
          ? [...course.learningOutcomes]
          : [""],
      sections: course.sections?.length
        ? course.sections.map((section) => ({
            ...section,
            lessons: (section.lessons || []).map((lesson) => ({
              ...lesson,
            })),
          }))
        : emptyForm().sections,
    });

    setMessage("");
    setError("");
    setShow(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditor = () => {
    setShow(false);
    setEditingCourse(null);
    setForm(emptyForm());
    setError("");
  };

  const updateSection = (sectionIndex, field, value) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex ? { ...section, [field]: value } : section,
      ),
    }));
  };

  const addSection = () => {
    setForm((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        { title: `Section ${prev.sections.length + 1}`, lessons: [] },
      ],
    }));
  };

  const removeSection = (sectionIndex) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, index) => index !== sectionIndex),
    }));
  };

  const updateLesson = (sectionIndex, lessonIndex, field, value) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) =>
        sIndex !== sectionIndex
          ? section
          : {
              ...section,
              lessons: section.lessons.map((lesson, lIndex) =>
                lIndex === lessonIndex ? { ...lesson, [field]: value } : lesson,
              ),
            },
      ),
    }));
  };

  const addLesson = (sectionIndex) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index !== sectionIndex
          ? section
          : {
              ...section,
              lessons: [
                ...section.lessons,
                {
                  title: "",
                  description: "",
                  videoUrl: "",
                  duration: 0,
                  isPreview: false,
                  order: section.lessons.length + 1,
                },
              ],
            },
      ),
    }));
  };

  const removeLesson = (sectionIndex, lessonIndex) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index !== sectionIndex
          ? section
          : {
              ...section,
              lessons: section.lessons.filter(
                (_, lessonIndexToRemove) => lessonIndexToRemove !== lessonIndex,
              ),
            },
      ),
    }));
  };

  const saveCourse = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    const payload = {
      ...form,
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      learningOutcomes: form.learningOutcomes
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      if (editingCourse) {
        await api.patch(`/courses/${editingCourse._id}`, payload);
        setMessage("Course updated successfully.");
      } else {
        await api.post("/courses", payload);
        setMessage(
          "Course draft created. Add more sections and publish when ready.",
        );
      }

      cancelEditor();
      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Could not ${editingCourse ? "update" : "create"} course.`,
      );
    } finally {
      setBusy(false);
    }
  };

  const publish = async (course) => {
    setError("");
    setMessage("");

    try {
      await api.patch(`/courses/${course._id}`, {
        status: course.status === "published" ? "draft" : "published",
      });

      setMessage(
        course.status === "published"
          ? "Course unpublished."
          : "Course published.",
      );

      await load();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not update course status.",
      );
    }
  };

  const deleteCourse = async (course) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setBusy(true);
    setError("");
    setMessage("");

    try {
      await api.delete(`/courses/${course._id}`);
      setMessage("Course deleted successfully.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete course.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="page-shell">
      <div className="container py-5 instructor-page">
        <div className="instructor-hero">
          <div>
            <div className="section-kicker">INSTRUCTOR STUDIO</div>
            <h1>
              Teach what you <span>love.</span>
            </h1>
            <p>
              Build a learning experience, share your expertise, and help others
              take their next step.
            </p>

            <div className="instructor-hero-actions">
              <button className="btn btn-purple btn-lg" onClick={startCreate}>
                <Plus size={18} /> Create a course
              </button>

              <Link to="/dashboard" className="btn btn-outline-dark btn-lg">
                My dashboard
              </Link>
            </div>
          </div>

          <div className="instructor-hero-art">
            <BookOpen size={74} />
            <span className="teacher-star">✦</span>
          </div>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-warning">{error}</div>}

        {show && (
          <form className="course-editor" onSubmit={saveCourse}>
            <div className="section-heading">
              <div>
                <div className="section-kicker">
                  {editingCourse ? "EDIT COURSE" : "NEW COURSE"}
                </div>
                <h2>
                  {editingCourse ? "Update course details" : "Course basics"}
                </h2>
              </div>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={cancelEditor}
                disabled={busy}
              >
                Cancel
              </button>
            </div>

            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label">Course title *</label>
                <input
                  className="form-control"
                  required
                  maxLength={140}
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  placeholder="e.g. Build your first full-stack app"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                >
                  {[
                    "Development",
                    "Design",
                    "Business",
                    "Data Science",
                    "Marketing",
                    "Personal Development",
                  ].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Subtitle</label>
                <input
                  className="form-control"
                  value={form.subtitle}
                  onChange={(event) =>
                    setForm({ ...form, subtitle: event.target.value })
                  }
                  placeholder="A clear one-line promise"
                />
              </div>

              <div className="col-12">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-control"
                  rows={4}
                  required
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="What will students learn?"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Level</label>
                <select
                  className="form-select"
                  value={form.level}
                  onChange={(event) =>
                    setForm({ ...form, level: event.target.value })
                  }
                >
                  {["Beginner", "Intermediate", "Advanced", "All levels"].map(
                    (level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Price (USD)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="form-control"
                  required
                  value={form.price}
                  onChange={(event) =>
                    setForm({ ...form, price: event.target.value })
                  }
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Thumbnail URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={form.thumbnail}
                  onChange={(event) =>
                    setForm({ ...form, thumbnail: event.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Course sections and lessons</h3>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={addSection}
                  disabled={busy}
                >
                  + Add section
                </button>
              </div>

              {form.sections.map((section, sectionIndex) => (
                <div
                  className="card mb-3 p-3"
                  key={section._id || sectionIndex}
                >
                  <div className="d-flex gap-2 align-items-center mb-3">
                    <input
                      className="form-control"
                      aria-label="Section title"
                      required
                      value={section.title}
                      onChange={(event) =>
                        updateSection(sectionIndex, "title", event.target.value)
                      }
                      placeholder="Section title"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => removeSection(sectionIndex)}
                      disabled={busy}
                    >
                      Remove
                    </button>
                  </div>

                  {section.lessons.map((lesson, lessonIndex) => (
                    <div
                      className="border rounded p-3 mb-3"
                      key={lesson._id || lessonIndex}
                    >
                      <label className="form-label">Lesson title *</label>
                      <input
                        className="form-control mb-3"
                        required
                        value={lesson.title}
                        onChange={(event) =>
                          updateLesson(
                            sectionIndex,
                            lessonIndex,
                            "title",
                            event.target.value,
                          )
                        }
                        placeholder="e.g. Introduction to React"
                      />

                      <label className="form-label">YouTube video URL</label>
                      <input
                        className="form-control mb-3"
                        type="url"
                        value={lesson.videoUrl || ""}
                        onChange={(event) =>
                          updateLesson(
                            sectionIndex,
                            lessonIndex,
                            "videoUrl",
                            event.target.value,
                          )
                        }
                        placeholder="https://www.youtube.com/watch?v=..."
                      />

                      <label className="form-label">Duration (minutes)</label>
                      <input
                        className="form-control mb-3"
                        type="number"
                        min="0"
                        value={lesson.duration || 0}
                        onChange={(event) =>
                          updateLesson(
                            sectionIndex,
                            lessonIndex,
                            "duration",
                            Number(event.target.value),
                          )
                        }
                      />

                      <div className="form-check mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`preview-${sectionIndex}-${lessonIndex}`}
                          checked={Boolean(lesson.isPreview)}
                          onChange={(event) =>
                            updateLesson(
                              sectionIndex,
                              lessonIndex,
                              "isPreview",
                              event.target.checked,
                            )
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`preview-${sectionIndex}-${lessonIndex}`}
                        >
                          Free preview lesson
                        </label>
                      </div>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeLesson(sectionIndex, lessonIndex)}
                        disabled={busy}
                      >
                        Remove lesson
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => addLesson(sectionIndex)}
                    disabled={busy}
                  >
                    + Add lesson
                  </button>
                </div>
              ))}
            </div>

            <div className="editor-note">
              {editingCourse
                ? "Save your changes to update this course. Existing sections and lessons are preserved."
                : "This creates a draft. Before publishing a paid course, add and verify lesson video URLs and ensure you have rights to the content."}
            </div>

            <button className="btn btn-purple" disabled={busy}>
              {busy
                ? "Saving..."
                : editingCourse
                  ? "Save changes"
                  : "Create course draft"}
            </button>
          </form>
        )}

        <div className="instructor-stats">
          <div>
            <span>
              <BookOpen />
            </span>
            <div>
              <small>Total courses</small>
              <strong>{courses.length}</strong>
            </div>
          </div>

          <div>
            <span>
              <Users />
            </span>
            <div>
              <small>Total enrollments</small>
              <strong>
                {courses.reduce(
                  (total, course) => total + (course.enrollmentCount || 0),
                  0,
                )}
              </strong>
            </div>
          </div>

          <div>
            <span>
              <Eye />
            </span>
            <div>
              <small>Published</small>
              <strong>
                {
                  courses.filter((course) => course.status === "published")
                    .length
                }
              </strong>
            </div>
          </div>
        </div>

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <div className="section-kicker">YOUR CONTENT</div>
              <h2>Course management</h2>
            </div>

            <button className="btn btn-purple" onClick={startCreate}>
              <Plus size={17} /> New course
            </button>
          </div>

          {courses.length ? (
            <div className="instructor-course-list">
              {courses.map((course) => (
                <div className="instructor-course-row" key={course._id}>
                  <img
                    src={
                      course.thumbnail ||
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80"
                    }
                    alt={course.title}
                  />

                  <div className="instructor-course-info">
                    <strong>{course.title}</strong>
                    <span>
                      {course.category} • {course.level}
                    </span>
                    <small>
                      {course.sections?.reduce(
                        (total, section) =>
                          total + (section.lessons?.length || 0),
                        0,
                      ) || 0}{" "}
                      lessons • ${course.price || 0}
                    </small>
                  </div>

                  <span className={`status-pill ${course.status}`}>
                    {course.status}
                  </span>

                  <button
                    type="button"
                    className="btn btn-outline-dark btn-sm"
                    onClick={() => startEdit(course)}
                    disabled={busy}
                  >
                    <Edit3 size={15} /> Edit
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-dark btn-sm"
                    onClick={() => publish(course)}
                    disabled={busy}
                  >
                    {course.status === "published" ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => deleteCourse(course)}
                    disabled={busy}
                  >
                    Delete
                  </button>

                  <Link
                    className="btn btn-light btn-sm"
                    to={`/courses/${course.slug || course._id}`}
                    aria-label={`View ${course.title}`}
                  >
                    <ExternalLink size={15} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty">
              <BookOpen size={27} />
              <div>
                <strong>No courses yet</strong>
                <p>Create your first course draft to get started.</p>
              </div>
              <button className="btn btn-purple" onClick={startCreate}>
                Create course
              </button>
            </div>
          )}
        </section>

        <div className="editor-note mt-4">
          Video upload integration: use the protected{" "}
          <code>POST /api/uploads/signature</code> endpoint with Cloudinary
          direct uploads. Configure credentials before using it. Full video
          processing/streaming depends on your selected hosting plan.
        </div>
      </div>
    </main>
  );
}
