import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Select Passengers · Qoomlee",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
