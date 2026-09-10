export function getUserRole(user) {
  if (!user?.role) return null;

  if (typeof user.role === "string") {
    return user.role;
  }

  return user.role?.name ?? null;
}

export function isPathActive(pathname, path) {
  if (!path) return false;

  return (
    pathname === path ||
    pathname.startsWith(`${path}/`)
  );
}