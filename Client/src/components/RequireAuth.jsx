import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4001/api/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          setAuthed(true);
        } else {
          navigate("/login");
        }
      })
      .catch(() => navigate("/login"))
      .finally(() => setChecking(false));
  }, []);

  if (checking) return <p>Checking authorization...</p>;
  return authed ? children : null;
}
