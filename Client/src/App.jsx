import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import {apiFetch} from "./api";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ItemDetail from "./pages/ItemDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SubmitReview from "./pages/SubmitReview";

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    apiFetch("/auth/me")
    .then(setUser)
    .catch(() => setUser(null));
  }, []);
  
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
