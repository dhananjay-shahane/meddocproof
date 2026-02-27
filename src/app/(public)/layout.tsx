import PublicHeader from "@/components/public/header";
import PublicFooter from "@/components/public/footer";
import { PageTransitionWrapper } from "@/components/public/page-transition-wrapper";
import { FloatingActionButtons } from "@/components/public/floating-action-buttons";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-neubg">
      <PublicHeader />
      <main className="flex-1">
        <PageTransitionWrapper>{children}</PageTransitionWrapper>
      </main>
      <PublicFooter />
      <FloatingActionButtons />
    </div>
  );
}
