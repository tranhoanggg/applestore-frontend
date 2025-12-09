import "./App.css";
import { Routes, Route } from "react-router-dom";
import NavigationBar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import HomePage from "./components/HomePage/HomePage";
import SignUpPage from "./components/SignUpPage/SignUpPage";
import LoginPage from "./components/LoginPage/LoginPage";

function AppContent() {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default AppContent;
