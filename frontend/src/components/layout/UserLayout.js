import Navbar from "./Navbar";
import Footer from "./Footer";

function UserLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default UserLayout;
