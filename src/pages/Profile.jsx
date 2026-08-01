// src/pages/Profile.jsx
// Page 6: view and edit the student's own registration info. Split into
// three independent panels — profile picture, editable details
// (phone/address, per the spec's explicit list), and change password —
// each saved separately via AuthContext.updateProfile().

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import "../styles/profile.css";

export default function Profile() {
  const { currentUser, updateProfile } = useAuth();
  const [toast, setToast] = useState("");

  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [detailsForm, setDetailsForm] = useState({
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  if (!currentUser) return null;

  function handlePictureChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateProfile({ profilePicture: reader.result });
      setToast("Profile picture updated.");
    };
    reader.readAsDataURL(file);
  }

  function handleDetailsSubmit(event) {
    event.preventDefault();
    updateProfile(detailsForm);
    setIsEditingDetails(false);
    setToast("Profile updated.");
  }

  function handlePasswordSubmit(event) {
    event.preventDefault();
    setPasswordError("");

    if (passwordForm.currentPassword !== currentUser.password) {
      setPasswordError("Current password is incorrect.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    updateProfile({ password: passwordForm.newPassword });
    setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    setToast("Password changed.");
  }

  const initials = currentUser.fullName
    ?.split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="page-with-navbar">
      <Navbar />

      <main className="profile-content">
        <section className="profile-picture-panel glass-panel">
          <div className="profile-avatar-large">
            {currentUser.profilePicture ? (
              <img src={currentUser.profilePicture} alt={currentUser.fullName} />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div>
            <h2>{currentUser.fullName}</h2>
            <p className="profile-id">{currentUser.studentId}</p>
            <label className="profile-upload-btn">
              Change Profile Picture
              <input type="file" accept="image/*" onChange={handlePictureChange} />
            </label>
          </div>
        </section>

        <section className="profile-panel glass-panel">
          <div className="profile-panel-header">
            <h3>Profile Details</h3>
            {!isEditingDetails && (
              <button
                className="profile-edit-toggle"
                onClick={() => {
                  setDetailsForm({ phone: currentUser.phone, address: currentUser.address });
                  setIsEditingDetails(true);
                }}
              >
                Edit
              </button>
            )}
          </div>

          {!isEditingDetails ? (
            <div className="profile-detail-grid">
              <div>
                <span>Email</span>
                <p>{currentUser.email}</p>
              </div>
              <div>
                <span>Department</span>
                <p>{currentUser.department}</p>
              </div>
              <div>
                <span>Semester</span>
                <p>{currentUser.semester}</p>
              </div>
              <div>
                <span>Section</span>
                <p>{currentUser.section}</p>
              </div>
              <div>
                <span>Date of Birth</span>
                <p>{currentUser.dob}</p>
              </div>
              <div>
                <span>Gender</span>
                <p>{currentUser.gender}</p>
              </div>
              <div>
                <span>Blood Group</span>
                <p>{currentUser.bloodGroup}</p>
              </div>
              <div>
                <span>Phone Number</span>
                <p>{currentUser.phone}</p>
              </div>
              <div className="profile-detail-span2">
                <span>Address</span>
                <p>{currentUser.address}</p>
              </div>
            </div>
          ) : (
            <form className="profile-edit-form" onSubmit={handleDetailsSubmit}>
              <p className="profile-edit-note">
                Email, department, and academic info are set at registration —
                only phone number and address can be changed here.
              </p>
              <label className="auth-field">
                <span>Phone Number</span>
                <input
                  value={detailsForm.phone}
                  onChange={(e) => setDetailsForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </label>
              <label className="auth-field">
                <span>Address</span>
                <input
                  value={detailsForm.address}
                  onChange={(e) => setDetailsForm((f) => ({ ...f, address: e.target.value }))}
                />
              </label>
              <div className="overlay-actions">
                <button
                  type="button"
                  className="overlay-btn overlay-btn-ghost"
                  onClick={() => setIsEditingDetails(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="overlay-btn overlay-btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="profile-panel glass-panel">
          <h3>Change Password</h3>
          <form className="profile-edit-form" onSubmit={handlePasswordSubmit}>
            {passwordError && <div className="auth-alert auth-alert-error">{passwordError}</div>}
            <label className="auth-field">
              <span>Current Password</span>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))
                }
              />
            </label>
            <label className="auth-field">
              <span>New Password</span>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
              />
            </label>
            <label className="auth-field">
              <span>Confirm New Password</span>
              <input
                type="password"
                value={passwordForm.confirmNewPassword}
                onChange={(e) =>
                  setPasswordForm((f) => ({ ...f, confirmNewPassword: e.target.value }))
                }
              />
            </label>
            <div className="overlay-actions">
              <button type="submit" className="overlay-btn overlay-btn-primary">
                Update Password
              </button>
            </div>
          </form>
        </section>
      </main>

      <Toast message={toast} onDismiss={() => setToast("")} />
    </div>
  );
}
