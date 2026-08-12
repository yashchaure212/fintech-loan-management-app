import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function ApplyNowButton({ className = "" }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const destination =
    isAuthenticated && user?.role?.name === "CUSTOMER"
      ? "/customer/loans/apply"
      : "/login?redirect=/customer/loans/apply";

  return (
    <Link to={destination} className={className}>
      <span>Apply Now</span>
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export default ApplyNowButton;
