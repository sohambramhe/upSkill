import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <main className="page-shell">
      <div className="container py-5">
        <div className="empty-state">
          <div className="section-kicker">404 — PAGE NOT FOUND</div>
          <h1>Looks like this lesson took a detour.</h1>
          <p>The page may have moved, or the link may be out of date.</p>
          <Link to="/" className="btn btn-purple">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
