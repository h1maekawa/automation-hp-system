"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { clsx } from "clsx";

export function cn(...args: Array<string | false | null | undefined>) {
  return clsx(args);
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  href,
  type = "button",
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  href?: string;
}) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed",
    variant === "primary" && "bg-primary text-white hover:opacity-90",
    variant === "secondary" && "bg-bgSecondary text-primary border border-black/10 hover:bg-bgTertiary",
    variant === "ghost" && "bg-transparent text-primary hover:bg-bgSecondary",
    variant === "danger" && "bg-danger text-white hover:opacity-90",
    size === "sm" && "h-9 px-3 text-sm",
    size === "md" && "h-11 px-4 text-sm",
    size === "lg" && "h-12 px-5 text-base",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-black/10 bg-white shadow-sm", className)}>{children}</div>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("h-11 w-full rounded-lg border border-black/10 px-3 text-sm outline-none ring-0 placeholder:text-tertiary focus:border-primary", props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("w-full rounded-lg border border-black/10 px-3 py-3 text-sm outline-none placeholder:text-tertiary focus:border-primary", props.className)} />;
}

export function Select({
  options,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <select {...props} className={cn("h-11 w-full rounded-lg border border-black/10 bg-white px-3 text-sm outline-none focus:border-primary", className)}>
      <option value="">選択してください</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "info" | "success" | "warning" | "danger" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium",
        tone === "default" && "bg-bgSecondary text-secondary",
        tone === "info" && "bg-infoBg text-info",
        tone === "success" && "bg-successBg text-success",
        tone === "warning" && "bg-warningBg text-warning",
        tone === "danger" && "bg-dangerBg text-danger"
      )}
    >
      {children}
    </span>
  );
}

export function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="mb-2 block text-sm font-medium text-primary">
      {children}
      {required && <span className="ml-1 text-danger">*</span>}
    </label>
  );
}

export function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-5 space-y-1">
      <h2 className="text-xl font-semibold tracking-tight text-primary">{title}</h2>
      {description && <p className="text-sm text-secondary">{description}</p>}
    </div>
  );
}

export function StepNav({ current }: { current: number }) {
  const steps = ["テンプレート", "解析", "情報入力", "生成", "プレビュー", "デプロイ"];
  return (
    <div className="sticky top-0 z-20 border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-4">
        {steps.map((label, index) => {
          const step = index + 1;
          const state = step < current ? "done" : step === current ? "active" : "pending";
          return (
            <div key={label} className="flex min-w-fit items-center gap-2">
              <div className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold",
                state === "done" && "border-success bg-success text-white",
                state === "active" && "border-primary bg-primary text-white",
                state === "pending" && "border-black/10 bg-white text-tertiary"
              )}>{step}</div>
              <span className={cn("text-sm", state === "pending" ? "text-tertiary" : "text-primary")}>{label}</span>
              {step < steps.length && <div className="mx-2 h-px w-8 bg-black/10" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-[16px] bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <h3 className="text-base font-semibold">{title}</h3>
          <button onClick={onClose} className="text-sm text-secondary">閉じる</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function ProjectSidebar({ items }: { items: Array<{ label: string; value?: ReactNode }> }) {
  return (
    <Card className="sticky top-24 p-5">
      <h3 className="mb-4 text-sm font-semibold text-primary">Project情報</h3>
      <div className="space-y-3 text-sm">
        {items.map((item) => (
          <div key={String(item.label)}>
            <div className="text-xs text-tertiary">{item.label}</div>
            <div className="mt-1 font-medium text-primary">{item.value || "-"}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function TemplateCard({
  title,
  subtitle,
  tags,
  gradient,
  selected,
  onClick
}: {
  title: string;
  subtitle: string;
  tags: string[];
  gradient: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className={cn("overflow-hidden rounded-2xl border text-left transition hover:-translate-y-0.5 hover:shadow-soft", selected ? "border-primary ring-2 ring-primary/15" : "border-black/10")}>
      <div className="h-40 w-full" style={{ background: gradient }} />
      <div className="space-y-3 p-4">
        <div>
          <div className="font-semibold text-primary">{title}</div>
          <div className="mt-1 text-sm text-secondary">{subtitle}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>
    </button>
  );
}

export function CheckRow({ label, status, note }: { label: string; status: "ok" | "missing" | "optional"; note?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm">
      <div>
        <div className="font-medium text-primary">{label}</div>
        {note && <div className="mt-1 text-secondary">{note}</div>}
      </div>
      {status === "ok" && <Badge tone="success">入力済み</Badge>}
      {status === "missing" && <Badge tone="warning">未入力</Badge>}
      {status === "optional" && <Badge tone="default">任意</Badge>}
    </div>
  );
}

export function EditableBlock({
  title,
  value,
  onChange,
  multiline = false
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <Card className="p-4">
      <div className="mb-2 text-sm font-semibold text-primary">{title}</div>
      {multiline ? (
        <Textarea rows={4} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <Input value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </Card>
  );
}
