export const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(String(email).toLowerCase());
export const validatePassword = (p) => p && p.length >= 6;
export const validateUsername = (u) => u && u.length >= 3 && u.length <= 30;
export const getValidationErrors = (form) => {
  const e = {};
  if (form.username !== undefined && !validateUsername(form.username))
     e.username = 'Username 3-30 chars';
  if (form.email !== undefined && !validateEmail(form.email)) 
    e.email = 'Invalid email';
  if (form.password !== undefined && !validatePassword(form.password))
     e.password = 'Min 6 chars';
  if (form.confirmPassword !== undefined && form.password !== form.confirmPassword)
     e.confirmPassword = 'Passwords do not match';
  return e;
};