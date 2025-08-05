import { useState, useEffect, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import axios from "axios";

import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";

const Navbar = ({ user }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const menuRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setShowMenu(false)
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["auth"]);
      setShowMenu(false)
      navigate("/login")
    },
    onError: (err) => {
      alert(err.response?.data?.error || "Server error.");
    }
  })

  return (
    <nav className='navbar'>
      <h1 onClick={() => navigate("/")}>Store-Img</h1>
      <div className="menu">
        <button onClick={toggleTheme} className="theme-btn">{theme === "dark" ? <MdDarkMode /> : <MdLightMode />}</button>
        {!user ?
          <Link to={"/login"}>Login</Link> :
          <img src={user.profileImg || "/avatar.png"} alt="navbar-profile-pic" onClick={()=>setShowMenu(!showMenu) } className="navbar-profile-pic" />
        }
        {showMenu &&
          <div className="menu-dropdown" ref={menuRef}>
            <button onClick={() => { navigate("/profile"); setShowMenu(false); }} className="menu-btn">Profile</button>
            <button onClick={() => logoutMutation.mutate()} className="menu-btn">Logout</button>
          </div>}
      </div>
    </nav>
  )
}

export default Navbar