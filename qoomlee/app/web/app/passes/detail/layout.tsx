import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boarding Pass · Qoomlee",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
