import { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="bg-bazo-darkgreen text-white px-4 pt-8 pb-6 rounded-b-3xl">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && <p className="text-bazo-lightgreen text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

export function Metric({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="flex-1 bg-white rounded-xl p-3 border border-gray-100">
      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-xl font-bold text-bazo-darkgreen">{value}</div>
    </div>
  );
}

export function Badge({ text, color = "green" }: { text: string; color?: "green" | "red" | "yellow" | "blue" | "gray" }) {
  const colors = {
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    blue: "bg-blue-100 text-blue-800",
    gray: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${colors[color]}`}>
      {text}
    </span>
  );
}

export function Button({ children, onClick, variant = "primary", className = "" }: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const styles = variant === "primary"
    ? "bg-bazo-green text-white"
    : "bg-white text-bazo-green border border-bazo-green";
  return (
    <button
      onClick={onClick}
      className={`w-full py-3 rounded-xl font-semibold active:scale-95 transition ${styles} ${className}`}
    >
      {children}
    </button>
  );
}
