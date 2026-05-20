import Sidebar from "./Sidebar";

function AdminLayout({ children, title }) {
  return (
    <div className="min-h-screen flex bg-surface-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-surface-100 px-8 py-5">
          <h1 className="text-2xl font-bold text-surface-900">{title}</h1>
        </header>
        {/* Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
