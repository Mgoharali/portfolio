// src/components/layout/PageLayout.jsx
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function PageLayout({ children, className = "" }) {
  return (
    <div className="min-h-screen mesh-bg">
      <Navbar />
      <main className={`pt-20 sm:pt-24 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
