import { Outlet } from "@remix-run/react";
import Footer from "~/components/footer";
import Navigation from "~/components/navigation";

export default function AppLayout() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1">
        <Navigation />
        <Outlet />
      </div>
      <Footer />
    </main>
  );
}
