import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel Checklist · Qoomlee",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
