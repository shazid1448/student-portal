// src/utils/validation.js
// Small, framework-free validation helpers shared by Login and Register forms.

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isRequired(value) {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

/**
 * Validate the Registration form.
 * @param {object} data - the form data
 * @returns {object} errors - field name -> error message (empty object if valid)
 */
export function validateRegisterForm(data) {
  const errors = {};

  const requiredFields = [
    ["fullName", "Full name"],
    ["studentId", "Student ID"],
    ["email", "Email"],
    ["phone", "Phone number"],
    ["department", "Department"],
    ["semester", "Semester"],
    ["section", "Section"],
    ["dob", "Date of birth"],
    ["gender", "Gender"],
    ["bloodGroup", "Blood group"],
    ["address", "Address"],
    ["password", "Password"],
    ["confirmPassword", "Confirm password"],
  ];

  requiredFields.forEach(([field, label]) => {
    if (!isRequired(data[field])) {
      errors[field] = `${label} is required.`;
    }
  });

  if (data.email && !isValidEmail(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (data.password && data.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (
    data.password &&
    data.confirmPassword &&
    data.password !== data.confirmPassword
  ) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export function validateLoginForm(data) {
  const errors = {};
  if (!isRequired(data.email)) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!isRequired(data.password)) {
    errors.password = "Password is required.";
  }
  return errors;
}
