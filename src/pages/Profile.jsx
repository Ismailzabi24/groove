import React, { useState } from 'react';
import './Profile.css';
import { FaEdit, FaSave, FaTimes, FaEye, FaEyeSlash, FaCamera } from 'react-icons/fa';

const Profile = ({ user, onUpdateUser }) => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    address: user.address || '',
    avatar: user.avatar,
    password: '',
    newPassword: '',
    showPassword: false,
    showNewPassword: false
  });
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setForm({ ...form, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Optionally validate password change here
    const updatedUser = {
      ...user,
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      avatar: form.avatar
    };
    if (onUpdateUser) onUpdateUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      avatar: user.avatar,
      password: '',
      newPassword: '',
      showPassword: false,
      showNewPassword: false
    });
    setAvatarPreview(user.avatar);
  };

  return (
    <div className="profile-page-container">
      <div className="profile-header">
        <div className="profile-avatar-edit">
          <img src={avatarPreview} alt={form.name} className="profile-avatar-large" />
          {editMode && (
            <label className="avatar-upload-btn">
              <FaCamera />
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            </label>
          )}
        </div>
        {editMode ? (
          <input
            className="profile-edit-input profile-edit-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Username"
          />
        ) : (
          <h2>{user.name}</h2>
        )}
        {editMode ? (
          <input
            className="profile-edit-input profile-edit-email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />
        ) : (
          <p className="profile-email">{user.email}</p>
        )}
      </div>
      <div className="profile-details">
        <div className="profile-detail-item">
          <span className="label">Phone Number:</span>
          {editMode ? (
            <input
              className="profile-edit-input"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
            />
          ) : (
            <span>{user.phone || 'Not set'}</span>
          )}
        </div>
        <div className="profile-detail-item">
          <span className="label">Address:</span>
          {editMode ? (
            <input
              className="profile-edit-input"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
            />
          ) : (
            <span>{user.address || 'Not set'}</span>
          )}
        </div>
        <div className="profile-detail-item">
          <span className="label">Password:</span>
          {editMode ? (
            <div className="password-fields">
              <div className="password-input-group">
                <input
                  className="profile-edit-input"
                  type={form.showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Current Password"
                />
                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() => setForm(f => ({ ...f, showPassword: !f.showPassword }))}
                >
                  {form.showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="password-input-group">
                <input
                  className="profile-edit-input"
                  type={form.showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="New Password"
                />
                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() => setForm(f => ({ ...f, showNewPassword: !f.showNewPassword }))}
                >
                  {form.showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          ) : (
            <span>********</span>
          )}
        </div>
      </div>
      <div className="profile-actions">
        {editMode ? (
          <>
            <button className="profile-save-btn" onClick={handleSave}><FaSave /> Save</button>
            <button className="profile-cancel-btn" onClick={handleCancel}><FaTimes /> Cancel</button>
          </>
        ) : (
          <button className="profile-edit-btn" onClick={() => setEditMode(true)}><FaEdit /> Edit</button>
        )}
      </div>
    </div>
  );
};

export default Profile; 