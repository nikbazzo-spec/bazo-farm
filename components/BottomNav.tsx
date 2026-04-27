"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Sprout, Calculator, MoreHorizontal } from "lucide-react";

const tabs = [
  { href: "/", label: "Início", icon: Home },
  { href: "/produtores", label: "Produtores", icon: Users },
  { href: "/culturas", label: "Culturas", icon: Sprout },
  { href: "/calculadoras", label: "Calc", icon: Calculator },
  { href: "/mais", label: "Mais", icon: MoreHorizontal },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-bottom">
      <div className="flex justify-around items-center h-16">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 ${
                active ? "text-bazo-green" : "text-gray-500"
              }`}
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
