import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "accent" | "dark" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[transform,background-color,color,border-color] duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  accent: "bg-accent text-on-accent hover:bg-accent-press",
  dark: "bg-ink text-bg hover:bg-accent hover:text-on-accent",
  outline: "border border-line-strong text-ink hover:border-ink",
  ghost: "text-ink hover:bg-surface-sunk",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

export function buttonStyles(variant: Variant = "accent", size: Size = "md", extra?: string) {
  return cn(base, variants[variant], sizes[size], extra);
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({ variant = "accent", size = "md", className, ...props }: Props) {
  return <button className={buttonStyles(variant, size, className)} {...props} />;
}
