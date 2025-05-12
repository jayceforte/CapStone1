import { Link } from "react-router-dom";

export default function Navbar () {
    return (
        <nav>
            <Link to="/">Home</Link> |
            <Link to="/login">Login</Link> |
            <Link to="/Signup">Make Account Here</Link> |
            <Link to="/restaurants">Find Restaurants</Link>

        </nav>
    );
}