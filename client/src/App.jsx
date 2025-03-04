import { Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import SignInPage from "./pages/auth/signin/SignInPage";
import HomePage from "./pages/home/HomePage";

function App() {
  return (
    <>
      <div className="flex max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signIn" element={<SignInPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
