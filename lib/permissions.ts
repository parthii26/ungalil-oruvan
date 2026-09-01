export type Role = "customer" | "admin" | "anonymous";

export function isAdminRole(role: Role | string | null | undefined): boolean {
  return role === "admin";
}

export function canAccessAdmin(role: Role | string | null | undefined): boolean {
  return isAdminRole(role);
}

export function canAccessAccount(role: Role | string | null | undefined): boolean {
  return role === "customer" || role === "admin";
}
