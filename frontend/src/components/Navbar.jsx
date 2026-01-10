import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useRef, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import API from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Decode user info
  let firstName = "";
  let firstLetter = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      firstName = decoded.name?.split(" ")[0] || "";
      firstLetter = firstName.charAt(0).toUpperCase();
    } catch {
      localStorage.removeItem("token");
    }
  }

  // Google Login (ONLY AUTH METHOD)
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseToken = await result.user.getIdToken();

      const res = await API.post("/auth/google", { token: firebaseToken });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login failed", err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="fixed top-0 left-0 w-full h-16 bg-slate-900 text-white flex items-center justify-between px-6 shadow z-50">
      {/* App Name */}
      <h1
        className="text-lg font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Task Manager
      </h1>

      {/* Right Side */}
      <div className="relative" ref={dropdownRef}>
        {!token ? (
          <button
            onClick={handleGoogleLogin}
            className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-700"
          >
            Continue with Google
          </button>
        ) : (
          <>
            <div
              onClick={() => setOpen((prev) => !prev)}
              className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-semibold cursor-pointer"
              title={firstName}
            >
              {firstLetter}
            </div>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg">
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/history");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  📜 History
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;