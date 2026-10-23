import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./pages/Footer";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans antialiased">
      <div className="py-2 px-4 sm:px-8 max-w-7xl w-full mx-auto flex flex-col grow">
        <Header />
        <main className="grow pt-2">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
