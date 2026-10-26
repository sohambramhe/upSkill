import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { useDispatch } from "react-redux";
import { clearCart } from "../store/cartSlice";
import { useEffect } from "react";
export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);
  return (
    <main className="page-shell">
      <div className="container py-5">
        <div className="payment-result">
          <span className="payment-result-icon">
            <CheckCircle2 size={42} />
          </span>
          <div className="section-kicker">CHECKOUT RETURNED</div>
          <h1>
            Thanks for investing in <span>yourself.</span>
          </h1>
          <p>
            Stripe has redirected you back. Course access appears after the
            server verifies the payment webhook. If it doesn't show immediately,
            wait a moment and refresh your dashboard.
          </p>
          <div className="webhook-note">
            <ShieldCheck size={18} /> Payment is verified securely on the
            server.
            <br />
            <Clock size={18} /> Session:{" "}
            {params.get("session_id") ? "received" : "not provided"}
          </div>
          <Link to="/dashboard" className="btn btn-purple btn-lg">
            Go to my learning
          </Link>
        </div>
      </div>
    </main>
  );
}
