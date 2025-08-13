import md5 from 'md5';

export const getUserAvatarURL = (email: string) => {
  if (!email) return '';
  const emailHash = md5(email);
  return `https://www.gravatar.com/avatar/${emailHash}`;
};
