export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-white flex-col md:flex-row lg:flex-row">
      {children}
    </div>
  );
}
