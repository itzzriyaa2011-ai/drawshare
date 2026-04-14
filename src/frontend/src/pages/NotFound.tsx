import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Palette } from "lucide-react";
import { Layout } from "../components/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
        data-ocid="not_found.page"
      >
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
          <Palette size={36} className="text-muted-foreground" />
        </div>
        <h1 className="font-display text-5xl font-bold text-foreground mb-3">
          404
        </h1>
        <h2 className="font-display text-xl font-semibold text-foreground mb-2">
          Page not found
        </h2>
        <p className="text-muted-foreground max-w-md mb-8">
          This canvas is blank — the page you're looking for doesn't exist or
          has been moved.
        </p>
        <Button asChild size="lg" data-ocid="not_found.home_button">
          <Link to="/">Back to Gallery</Link>
        </Button>
      </div>
    </Layout>
  );
}
