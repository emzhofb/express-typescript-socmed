export const generateAvatar = async (username: string) => {
  const initials = username.charAt(0).toUpperCase();
  return initials;
};
