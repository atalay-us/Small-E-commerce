import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FaCamera } from "react-icons/fa";
import { MdEdit } from "react-icons/md";


const Profile = ({ user }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    username: "",
    oldPassword: "",
    newPassword: "",
  });
  const [selectedImg, setSelectedImg] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const ChangeInfomutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        `http://localhost:3000/api/profile/change-info/${user._id}`,
        data,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (data) => {
      alert(data.message);
      setFormData({
        username: "",
        oldPassword: "",
        newPassword: "",
      });
      queryClient.invalidateQueries(["auth"]);
    },
    onError: (error) => {
      alert(error.response?.data?.error || "Failed to update profile");
    },
  });

  const changeProfileImgMutation = useMutation({
    mutationFn: async (profileImg) => {
      const response = await axios.post(
        `http://localhost:3000/api/profile/change-profile-img/${user._id}`,
        { profileImg },
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (data) => {
      setSelectedImg(null);
      alert(data.message);
      queryClient.invalidateQueries(["auth"]);
    },
    onError: (err) => {
      setSelectedImg(null);
      alert(err.response?.data?.error || "Failed to update profile image");
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      changeProfileImgMutation.mutate(base64Image);
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ChangeInfomutation.mutate(formData);
  }

  return (
    <div className="profile-page-overlay">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profileImg">
            <img
              src={selectedImg || user.profileImg || "/avatar.png"}
              alt="Profile"
              className="size-32 rounded-full object-cover border-4"
            />
            <label htmlFor="updateProfileImg">
              <FaCamera />
              <input
                type="file"
                accept="image/*"
                id="updateProfileImg"
                hidden
                onChange={handleImageUpload}
              />
            </label>
          </div>
          <h2>{user.username}</h2>
        </div>
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              onChange={handleChange}
              value={formData.username}
            />
          </div>
          <div className="form-group">
            <label htmlFor="oldPassword">Old Password</label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              onChange={handleChange}
              value={formData.oldPassword}
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              onChange={handleChange}
              value={formData.newPassword}
            />
          </div>
          <button type="submit">
            <MdEdit /> Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;