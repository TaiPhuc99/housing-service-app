import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/template/Navbar";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ContactPage from "./pages/ContactPage";
import AddServicePage from "./pages/AddServicePage";
import DetailServicePage from "./pages/DetailServicePage";
import UpdatePage from "./pages/UpdatePage";
import ResetPage from "./pages/ResetPage";
import ProfilePage from "./pages/ProfilePage";
import OfferPage from "./pages/OfferPage";
import CategoryPage from "./pages/CategoryPage";
import ProtectedRoute from "./HOC/ProtectedRoute";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/offer" element={<OfferPage />} />
          <Route path="/category/:typeCategory" element={<CategoryPage />} />
          <Route
            path="/profile"
            element={<ProtectedRoute Component={<ProfilePage />} />}
          />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ResetPage />} />
          <Route path="/add" element={<AddServicePage />} />
          <Route
            path="/category/:typeCategory/:id"
            element={<DetailServicePage />}
          />
          <Route path="/update/:idUpdate" element={<UpdatePage />} />
          <Route path="/contact/:landId" element={<ContactPage />} />
        </Routes>

        <Navbar />
      </Router>

      <ToastContainer />
    </>
  );
}

export default App;
