import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import {apiFetch} from "./api";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ReviewDetail from "./pages/ReviewDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SubmitReview from "./pages/SubmitReview";
import ReviewList from "./pages/ReviewList";
import ReviewsPage from "./pages/ReviewsPage";
import RestaurantList from "./components/RestaurantList";
import RestaurantDetail from "./pages/RestaurantDetail";



function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4001/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => {
        setUserId(data.userId);
      })
      .catch(() => {
        setUserId(null);
      });
  }, []);
  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      <Route path="/reviews/:id" element={<ReviewDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/submit" element={<SubmitReview />} /> */}
        <Route path="/reviews" element={<ReviewList />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurants/:id" element={<RestaurantDetail />} />
        <Route path="/item/:id" element={<ReviewDetail />} />

      </Routes>
    </Router>
  );
}

export default App
