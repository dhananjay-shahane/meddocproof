export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-gradient-bg">
      <div className="w-full overflow-hidden">{children}</div>
    </div>
  );
}
