import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check-in Details · Qoomlee",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
