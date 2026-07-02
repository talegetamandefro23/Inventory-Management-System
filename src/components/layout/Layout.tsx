import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 font-sans text-[14px]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="animate-fade-in">
            <Outlet />
          </div>
          <footer className="text-xs text-zinc-300 dark:text-zinc-700 text-center mt-10 pb-4">
            © 2024 EAGPBTU Inventory & Warehouse Management System. All rights
            reserved.
          </footer>
        </div>
      </div>
    </div>
  );
}
