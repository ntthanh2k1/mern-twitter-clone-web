import { Navigate, Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import SignInPage from "./pages/auth/signin/SignInPage";
import HomePage from "./pages/home/HomePage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  const { data:authUser, isLoading } = useQuery({
    // we use queryKey to give a unique name to our query and refer to it later
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/getInfo");
      const data = await res.json();

      if (data.error) {
        return null;
      }

      if (!res.ok) {
        throw new Error(data.error || "Error getting user's info.");
      }

      return data;
    },
    retry: false
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="flex max-w-6xl mx-auto">
        {authUser && <Sidebar />}

        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/signIn" />} />
          <Route path="/signIn" element={authUser ? <Navigate to="/" /> : <SignInPage />} />
          <Route path="/signUp" element={authUser ? <Navigate to="/" /> : <SignUpPage />} />
          <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/signIn" />} />
          <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/signIn" />} />
        </Routes>

        {authUser && <RightPanel />}

        <Toaster />
      </div>
    </>
  );
}

export default App;
