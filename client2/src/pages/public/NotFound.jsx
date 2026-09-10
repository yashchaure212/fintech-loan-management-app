import { Link } from "react-router-dom";
import { Home } from "lucide-react";

import { Button } from "@/components/ui/button";

function NotFound() {
  return (
    <main className="app-shell flex min-h-screen items-center justify-center px-4">
      <section className="w-full max-w-md text-center">
        <div className="app-card px-6 py-10 sm:px-8">
          <p className="financial-label text-brand">Error 404</p>

          <h1 className="page-title mt-3">Page not found</h1>

          <p className="text-helper mt-2">
            The page you’re looking for doesn’t exist or may have been moved.
          </p>

          <Button asChild className="mt-6">
            <Link to="/">
              <Home className="size-4" />
              Back to home
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

export default NotFound;
