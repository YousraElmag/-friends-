// The old avatar service (avatar.iran.liara.run) is down, so old users
// have a broken image URL in the database. This helper replaces those
// URLs (and missing images) with a working DiceBear avatar.
const BROKEN_AVATAR_HOST = "avatar.iran.liara.run";

export const avatarFromName = (name = "user") =>
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(name)}`;

export const getAvatar = (user) => {
  if (!user) return avatarFromName();
  if (!user.image || user.image.includes(BROKEN_AVATAR_HOST)) {
    return avatarFromName(user.name);
  }
  return user.image;
};

// Use as onError on <img>: if an image fails to load, show a generated one
export const handleAvatarError = (name) => (e) => {
  const fallback = avatarFromName(name);
  if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
};
