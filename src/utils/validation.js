export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return 'Email should be valid';
  return '';
};

export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.length < 2 || name.length > 15)
    return 'Name must be between 2 and 15 characters';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6 || password.length > 15)
    return 'Password must be between 6 and 15 characters';
  return '';
};

export const validateTitle = (title) => {
  if (!title || !title.trim()) return 'Title is required';
  return '';
};
