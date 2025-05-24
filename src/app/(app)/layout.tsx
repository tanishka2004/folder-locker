import { AppSidebar } from "@/components/layout/sidebar-nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppSidebar>{children}</AppSidebar>;
}
