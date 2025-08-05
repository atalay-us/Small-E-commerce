import { Routes, Route } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import Navbar from "./components/Navbar";

import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  const { data: user } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/check-auth", { withCredentials: true });
        return res.data.user;
      } catch (error) {
        return null
      }
    },
    retry: false
  })

  return (
    <>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Homepage user={user} />} />
        <Route path="/login" element={user ? <Homepage user={user} /> : <Login />} />
        <Route path="/register" element={user ? <Homepage user={user} /> : <Register />} />
        <Route path="/profile" element={user ? <Profile user={user} /> : <Login />} />
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </>
  )
}

export default App