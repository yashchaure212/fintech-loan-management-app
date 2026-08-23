import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function getUserRole(user) {
  if (!user?.role) {
    return null;
  }

  if (typeof user.role === "string") {
    return user.role;
  }

  return user.role?.name ?? null;
}

function ApplyNowButton({ className = "", children = "Apply Now" }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const role = getUserRole(user);

  const destination =
    isAuthenticated && role === "CUSTOMER"
      ? "/customer/loans/apply"
      : "/login?redirect=/customer/loans/apply";

  return (
    <Link to={destination} className={className}>
      <span>{children}</span>

      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export default ApplyNowButton;
