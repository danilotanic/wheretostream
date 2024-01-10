import { Outlet } from "@remix-run/react";
import Navigation from "~/components/navigation";

export default function AppLayout() {
  return (
    <main>
      <Navigation />
      <Outlet />
    </main>
  );
}
