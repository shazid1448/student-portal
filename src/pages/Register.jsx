// src/pages/Register.jsx
// Full registration form (all fields from the spec). Validates client-side,
// then hands off to AuthContext.register(), which does the duplicate
// Student ID / Email checks against Local Storage. On success, shows a
// message and redirects to Login rather than logging the person straight in.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validateRegisterForm } from "../utils/validation";
import "../styles/auth.css";

const initialFormData = {
  fullName: "",
  studentId: "",
  email: "",
  phone: "",
  department: "",
  semester: "",
  section: "",
  dob: "",
  gender: "",
  bloodGroup: "",
  address: "",
  password: "",
  confirmPassword: "",
};

const DEPARTMENTS = ["CSE", "SWE", "EEE", "BBA", "English", "Law", "Architecture"];
const SEMESTERS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [profilePicture, setProfilePicture] = useState(null); // data URL preview only
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handlePictureChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfilePicture(reader.result);
    reader.readAsDataURL(file);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSuccessMessage("");
    setSubmitError("");

    const validationErrors = validateRegisterForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const { confirmPassword, ...studentRecord } = formData;
      const result = register({ ...studentRecord, profilePicture });
      setIsSubmitting(false);

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      setSuccessMessage("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    }, 300);
  }

  return (
    <div className="auth-page auth-page-register">
      <div className="auth-form-side">
        <form className="glass-panel auth-form auth-form-wide" onSubmit={handleSubmit} noValidate>
          <h2 className="auth-form-title">Create your account</h2>
          <p className="auth-form-subtitle">Fill in your details to join the portal.</p>

          {submitError && <div className="auth-alert auth-alert-error">{submitError}</div>}
          {successMessage && <div className="auth-alert auth-alert-success">{successMessage}</div>}

          <div className="auth-picture-row">
            <div className="auth-picture-preview">
              {profilePicture ? (
                <img src={profilePicture} alt="Profile preview" />
              ) : (
                <span>No photo</span>
              )}
            </div>
            <label className="auth-picture-upload">
              <span>Upload profile picture</span>
              <input type="file" accept="image/*" onChange={handlePictureChange} />
            </label>
          </div>

          <div className="auth-grid">
            <label className="auth-field">
              <span>Full Name</span>
              <input name="fullName" value={formData.fullName} onChange={handleChange} />
              {errors.fullName && <small className="auth-field-error">{errors.fullName}</small>}
            </label>

            <label className="auth-field">
              <span>Student ID</span>
              <input name="studentId" value={formData.studentId} onChange={handleChange} />
              {errors.studentId && <small className="auth-field-error">{errors.studentId}</small>}
            </label>

            <label className="auth-field">
              <span>Email</span>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
              {errors.email && <small className="auth-field-error">{errors.email}</small>}
            </label>

            <label className="auth-field">
              <span>Phone Number</span>
              <input name="phone" value={formData.phone} onChange={handleChange} />
              {errors.phone && <small className="auth-field-error">{errors.phone}</small>}
            </label>

            <label className="auth-field">
              <span>Department</span>
              <select name="department" value={formData.department} onChange={handleChange}>
                <option value="">Select department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && <small className="auth-field-error">{errors.department}</small>}
            </label>

            <label className="auth-field">
              <span>Semester</span>
              <select name="semester" value={formData.semester} onChange={handleChange}>
                <option value="">Select semester</option>
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
              {errors.semester && <small className="auth-field-error">{errors.semester}</small>}
            </label>

            <label className="auth-field">
              <span>Section</span>
              <input name="section" value={formData.section} onChange={handleChange} />
              {errors.section && <small className="auth-field-error">{errors.section}</small>}
            </label>

            <label className="auth-field">
              <span>Date of Birth</span>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
              {errors.dob && <small className="auth-field-error">{errors.dob}</small>}
            </label>

            <label className="auth-field">
              <span>Gender</span>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <small className="auth-field-error">{errors.gender}</small>}
            </label>

            <label className="auth-field">
              <span>Blood Group</span>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
              {errors.bloodGroup && <small className="auth-field-error">{errors.bloodGroup}</small>}
            </label>

            <label className="auth-field auth-field-span2">
              <span>Address</span>
              <input name="address" value={formData.address} onChange={handleChange} />
              {errors.address && <small className="auth-field-error">{errors.address}</small>}
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <small className="auth-field-error">{errors.password}</small>}
            </label>

            <label className="auth-field">
              <span>Confirm Password</span>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <small className="auth-field-error">{errors.confirmPassword}</small>
              )}
            </label>
          </div>

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Register"}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}