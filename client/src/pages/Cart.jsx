import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, clearCart } from "../store/cartSlice";
import { useState } from "react";
import api from "../services/api";
export default function Cart() {
  const items = useSelector((s) => s.cart.items);
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const total = items.reduce((s, c) => s + Number(c.price || 0), 0);
  const checkout = async () => {
    if (!user) return navigate("/login");
    if (items.length !== 1) {
      setError(
        "For this starter, check out one course at a time. Remove other items to continue.",
      );
      return;
    }
    setBusy(true);
    setError("");
    try {
      const r = await api.post("/payments/checkout", {
        courseId: items[0]._id,
      });
      window.location.assign(r.data.url);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Checkout failed. Configure Stripe test keys on the backend.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="page-shell">
      <div className="container py-5 cart-page">
        <div className="breadcrumb-line">
          <Link to="/">Home</Link>
          <span>/</span>Shopping cart
        </div>
        <div className="section-kicker">YOUR NEXT STEP</div>
        <h1>
          Your learning <span>cart.</span>
        </h1>
        <p className="cart-subtitle">
          Invest in a skill you’ll use again and again.
        </p>
        {error && <div className="alert alert-warning">{error}</div>}
        {items.length ? (
          <div className="cart-layout">
            <section className="cart-items">
              <div className="cart-items-heading">
                <strong>
                  {items.length} course{items.length === 1 ? "" : "s"} in your
                  cart
                </strong>
                <button onClick={() => dispatch(clearCart())}>
                  Remove all
                </button>
              </div>
              {items.map((c) => (
                <div className="cart-item" key={c._id}>
                  <img src={c.thumbnail} alt="" />
                  <div className="cart-item-info">
                    <Link to={`/courses/${c.slug || c._id}`}>{c.title}</Link>
                    <small>{c.instructor?.name || "upSkill Instructor"}</small>
                    <span className="cart-rating">
                      ★ {Number(c.averageRating || 4.8).toFixed(1)}{" "}
                      <span>• {c.level || "All levels"}</span>
                    </span>
                  </div>
                  <div className="cart-item-price">
                    <strong>${Number(c.price || 0).toFixed(2)}</strong>
                    <button
                      onClick={() => dispatch(removeFromCart(c._id))}
                      aria-label="Remove course"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </section>
            <aside className="cart-summary">
              <span className="summary-label">TOTAL</span>
              <div className="summary-total">${total.toFixed(2)}</div>
              <p className="summary-tax">
                Taxes, if applicable, are calculated at checkout.
              </p>
              <button
                onClick={checkout}
                disabled={busy}
                className="btn btn-purple btn-lg w-100"
              >
                {busy ? "Opening checkout…" : "Continue to checkout"}{" "}
                <ArrowRight size={17} />
              </button>
              <div className="secure-note">
                <ShieldCheck size={16} /> Secure Stripe checkout
              </div>
              <hr />
              <p className="summary-small">
                Course access is granted after the payment provider confirms the
                transaction.
              </p>
            </aside>
          </div>
        ) : (
          <div className="empty-state cart-empty">
            <span className="empty-icon">
              <ShoppingBag size={30} />
            </span>
            <h3>Your cart is taking a little break.</h3>
            <p>Explore courses and find something worth learning.</p>
            <Link to="/courses" className="btn btn-purple">
              Explore courses <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
