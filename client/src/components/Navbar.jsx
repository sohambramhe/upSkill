import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Search,
  ShoppingCart,
  Menu,
  X,
  UserRound,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
export default function Navbar() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const user = useSelector((s) => s.auth.user);
  const cart = useSelector((s) => s.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const search = (e) => {
    e.preventDefault();
    navigate(`/?q=${encodeURIComponent(q)}`);
    setOpen(false);
  };
  return (
    <>
      <div className="top-strip">
        Learn something new today <span>•</span> Skills that move you forward
      </div>
      <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top main-nav">
        <div className="container-fluid px-lg-4">
          <Link to="/" className="brand">
            <span className="brand-icon">
              <BookOpen size={20} />
            </span>
            up<span>Skill</span>
          </Link>
          <button
            className="mobile-toggle"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
          <div className={`nav-content ${open ? "show" : ""}`}>
            <Link to="/courses" className="explore-link">
              Explore
            </Link>
            <form className="search-form" onSubmit={search}>
              <Search size={18} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search for anything"
                aria-label="Search courses"
              />
              <button>Search</button>
            </form>
            <Link
              className="teach-link"
              to={user?.role === "instructor" ? "/instructor" : "/login"}
            >
              Teach on upSkill
            </Link>
            <Link to="/cart" className="icon-link" aria-label="Cart">
              <ShoppingCart size={20} />
              {cart.length > 0 && <small>{cart.length}</small>}
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="avatar-link">
                  <span className="avatar">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </span>
                  <span className="user-name">{user.name}</span>
                </Link>
                <button
                  className="btn btn-outline-dark btn-sm"
                  onClick={() => {
                    dispatch(logout());
                    navigate("/");
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-dark btn-sm px-3">
                  Log in
                </Link>
                <Link to="/register" className="btn btn-purple btn-sm px-3">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
