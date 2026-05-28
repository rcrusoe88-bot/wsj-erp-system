export type Role = 'admin' | 'reviewer' | 'operator';

export interface UserInfo {
  id: string;
  username: string;
  role: Role;
}

let currentUser: UserInfo | null = null;

export function setCurrentUser(user: UserInfo | null) {
  currentUser = user;
}

export function getCurrentUser(): UserInfo | null {
  return currentUser;
}

export function hasRole(...roles: Role[]): boolean {
  if (!currentUser) return false;
  return roles.includes(currentUser.role);
}

export function canAccess(menuKey: string): boolean {
  if (!currentUser) return false;

  const adminPages = [
    'dashboard', 'materials', 'warehouses', 'users',
    'stock-in', 'stock-out', 'approval', 'inventory', 'trace',
  ];

  const reviewerPages = [
    'dashboard', 'approval', 'stock-in', 'stock-out', 'inventory', 'trace',
  ];

  const operatorPages = [
    'dashboard', 'stock-in', 'stock-out', 'inventory', 'trace',
  ];

  switch (currentUser.role) {
    case 'admin':
      return adminPages.includes(menuKey);
    case 'reviewer':
      return reviewerPages.includes(menuKey);
    case 'operator':
      return operatorPages.includes(menuKey);
    default:
      return false;
  }
}
