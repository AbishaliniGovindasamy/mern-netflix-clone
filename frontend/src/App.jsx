import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/home/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import Footer from "./components/Footer.jsx";
import Toaster from "react-hot-toast";
import { useAuthStore } from "./store/authStore.js";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import WatchPage from "./pages/WatchPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import SearchHistoryPage from "./pages/SearchHistoryPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function App() {
  const { user, isCheckingAuth, authCheck } = useAuthStore();

  useEffect(() => {
    authCheck(); // ✅ Call it once without dependencies to prevent re-renders
  }, [authCheck]);

  if (isCheckingAuth) {
    return (
      <div className="h-screen flex justify-center items-center bg-black">
        <Loader className="animate-spin text-red-600 size-10" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* ✅ Improved auth-based navigation */}
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
        <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" replace />} />
        <Route path="/watch/:id" element={user ? <WatchPage /> : <Navigate to="/login" replace />} />

        <Route path="/search/" element={user ? <SearchPage /> : <Navigate to="/login" replace />} />
        <Route path="/history/" element={user ? <SearchHistoryPage/> : <Navigate to="/" replace />} />





        <Route path="/*" element={<NotFoundPage/>} />
      </Routes>
      
      <Footer />
      <Toaster />
    </>
  );
}

export default App;
