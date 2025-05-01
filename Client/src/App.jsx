import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ItemDetail from "./pages/ItemDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SubmitReview from "./pages/SubmitReview";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/submit" element={<SubmitReview />} />
      </Routes>
    </Router>
  );
}

export default App
