import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">RateUrEatz</Link>
      </div>
      <div className="nav-right">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/Restaurants">Restaurants</Link>
      </div>
    </nav>
  );
}
