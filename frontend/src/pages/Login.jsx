import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import "../css/lr-form.css"

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: async (data) => {
            await axios.post("http://localhost:3000/api/auth/login", data, { withCredentials: true });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] });
            navigate("/");
        },
        onError: (err) => {
            alert(err.response?.data?.error || "Login failed");
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]:value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        loginMutation.mutate(formData);
    };

    return (
        <div className="lr-form-overlay">
            <div className="container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="text" name="email" value={formData.username} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} />
                    </div>
                    <button type="submit">Login</button>
                </form>
                <p>Don't have an account. <Link to={"/register"}>Click here</Link></p>
            </div>
        </div>
    );
};

export default Login;