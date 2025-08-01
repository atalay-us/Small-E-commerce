import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({ username: "", password: "", email: "" });
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const registerMutation = useMutation({
        mutationFn: async (data) => {
            await axios.post("http://localhost:3000/api/auth/register", data, { withCredentials: true });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] });
            navigate("/login");
        },
        onError: (err) => {
            alert(err.response?.data?.error || "Registration failed");
        },
    });

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]:value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        registerMutation.mutate(formData);
    };

    return (
        <div className="lr-form-overlay">
            <div className="container">
                <h2>Register</h2>
                <form onSubmit={handleSubmit} className="lr-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} />
                    </div>
                    <button type="submit">Register</button>
                </form>
                <p>Already have an account. <Link to={"/login"}>Click here</Link></p>
            </div>
        </div>
    );
};

export default Register;