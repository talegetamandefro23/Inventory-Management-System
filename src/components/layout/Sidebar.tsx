import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Briefcase, Moon, Sun, ChevronDown, Package } from "lucide-react";
import { NAV, ICONS } from "../../routes/nav";
import { useTheme } from "../../context/ThemeContext";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { dark, toggleDark } = useTheme();

  const activeParentKey = NAV.find(
    (n) =>
      location.pathname === n.path ||
      n.children?.some((c) =>
        location.pathname.startsWith(c.path.replace(":id", ""))
      )
  )?.key;

  const [openGroup, setOpenGroup] = useState<string | null>(
    activeParentKey ?? "master-data"
  );

  return (
    <div className="w-60 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col shrink-0 transition-colors">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="h-8 w-8 rounded-lg bg-primary-600 text-white flex items-center justify-center shadow-primary-sm">
          <Package size={16} />
        </div>
        <div>
          <span className="font-bold tracking-tight text-zinc-900 dark:text-white text-sm">
            EAGPBTU
          </span>
          <p className="text-[10px] text-zinc-400 -mt-0.5">Inventory System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        {NAV.map((item) => {
          const Icon = ICONS[item.icon];
          const isParentActive =
            location.pathname === item.path ||
            item.children?.some((c) =>
              location.pathname.startsWith(c.path.replace(":id", ""))
            );

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
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isParentActive
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400"
                    : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                <Icon size={16} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.children && (
                  <ChevronDown
                    size={14}
                    className={`text-zinc-400 transition-transform duration-200 ${
                      openGroup === item.key ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
              {item.children && openGroup === item.key && (
                <div className="ml-4 mt-0.5 border-l-2 border-zinc-100 dark:border-zinc-800 pl-3 space-y-0.5 animate-slide-down">
                  {item.children.map((c) => {
                    const isActive = location.pathname.startsWith(
                      c.path.replace(":id", "")
                    );
                    return (
                      <Link
                        key={c.key}
                        to={
                          c.path.includes(":id")
                            ? c.path.replace(":id", "SKU-001")
                            : c.path
                        }
                        className={`block px-2.5 py-1.5 rounded-md text-xs transition-all duration-150 ${
                          isActive
                            ? "text-primary-700 bg-primary-50 font-semibold dark:text-primary-400 dark:bg-primary-950/30"
                            : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 dark:hover:text-zinc-300 dark:hover:bg-zinc-800/40"
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

      {/* Footer */}
      <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800">
        <button
          onClick={toggleDark}
          className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-300 mb-3 hover:text-zinc-700 dark:hover:text-zinc-100 transition-colors w-full"
        >
          <div className="relative h-5 w-9 rounded-full bg-zinc-200 dark:bg-zinc-700 transition-colors">
            <div
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
                dark ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </div>
          <span className="text-xs">{dark ? "Light Mode" : "Dark Mode"}</span>
        </button>
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary-500 animate-pulse" />
          System Health — Cloud Sync Active
        </div>
      </div>
    </div>
  );
}
