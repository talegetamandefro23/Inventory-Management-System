import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Briefcase, Moon, Sun } from "lucide-react";
import { NAV, ICONS } from "../../routes/nav";
import { useTheme } from "../../context/ThemeContext";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { dark, toggleDark } = useTheme();

  const activeParentKey = NAV.find(
    (n) => location.pathname === n.path || n.children?.some((c) => location.pathname.startsWith(c.path.replace(":id", "")))
  )?.key;

  const [openGroup, setOpenGroup] = useState<string | null>(activeParentKey ?? "master-data");

  return (
    <div className="w-60 bg-white dark:bg-zinc-900 dark:border-zinc-800 border-r border-zinc-200 flex flex-col shrink-0">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="h-7 w-7 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center">
          <Briefcase size={14} />
        </div>
        <span className="font-bold tracking-tight dark:text-white">EAGPBTU</span>
      </div>

      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        {NAV.map((item) => {
          const Icon = ICONS[item.icon];
          const isParentActive =
            location.pathname === item.path ||
            item.children?.some((c) => location.pathname.startsWith(c.path.replace(":id", "")));

          return (
            <div key={item.key} className="mb-0.5">
              <button
                onClick={() => {
                  if (item.children) {
                    setOpenGroup(openGroup === item.key ? null : item.key);
                    navigate(item.children[0].path);
                  } else {
                    navigate(item.path);
                  }
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                  isParentActive
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
              {item.children && openGroup === item.key && (
                <div className="ml-6 mt-0.5 border-l border-zinc-100 dark:border-zinc-800 pl-3 space-y-0.5">
                  {item.children.map((c) => {
                    const isActive = location.pathname.startsWith(c.path.replace(":id", ""));
                    return (
                      <Link
                        key={c.key}
                        to={c.path.includes(":id") ? c.path.replace(":id", "SKU-001") : c.path}
                        className={`block px-2 py-1.5 rounded-md text-xs ${
                          isActive ? "text-zinc-900 dark:text-white font-semibold" : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                        }`}
                      >
                        {c.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800">
        <button onClick={toggleDark} className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-300 mb-3">
          {dark ? <Sun size={15} /> : <Moon size={15} />} {dark ? "Light Mode" : "Dark Mode"}
        </button>
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> System Health — Cloud Sync Active
        </div>
      </div>
    </div>
  );
}
