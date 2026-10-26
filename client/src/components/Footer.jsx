import { Link } from "react-router-dom";
import { BookOpen, Heart } from "lucide-react";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-5">
            <Link to="/" className="brand text-white">
              <span className="brand-icon">
                <BookOpen size={20} />
              </span>
              up<span>Skill</span>
            </Link>
            <p className="footer-copy mt-3">
              Build skills for your next chapter. Learn at your own pace with
              practical courses from people who do the work.
            </p>
          </div>
          <div className="col-6 col-md-2">
            <h6>Learn</h6>
            <Link to="/courses">Browse courses</Link>
            <Link to="/dashboard">My learning</Link>
            <Link to="/">Categories</Link>
          </div>
          <div className="col-6 col-md-2">
            <h6>Teach</h6>
            <Link to="/instructor">Become an instructor</Link>
            <Link to="/login">Instructor login</Link>
          </div>
          <div className="col-md-3">
            <h6>Keep growing</h6>
            <p className="footer-copy">
              A little progress each day adds up to big results.
            </p>
          </div>
        </div>
        <hr className="footer-rule" />
        <div className="d-flex justify-content-between flex-wrap gap-2 footer-bottom">
          <span>
            © {new Date().getFullYear()} upSkill. Demo learning platform.
          </span>
          <span>
            Made for learners <Heart size={14} className="d-inline" />
          </span>
        </div>
      </div>
    </footer>
  );
}
