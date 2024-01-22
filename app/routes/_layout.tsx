import { Outlet } from "@remix-run/react";
import Footer from "~/components/footer";
import Navigation from "~/components/navigation";
import { SearchDialog } from "~/components/search";

export default function AppLayout() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1 w-screen overflow-x-hidden flex flex-col">
        <Navigation />
        <Outlet />
      </div>
      <Footer />
      <SearchDialog />
    </main>
  );
}
