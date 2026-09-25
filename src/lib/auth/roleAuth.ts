'use client';

export interface RoleCredential {
  role: 'super_admin' | 'manager' | 'staff' | 'delivery' | 'seller';
  title: string;
  defaultEmail: string;
  defaultUsername: string;
  demoPassword: string;
  dashboardUrl: string;
  profileUrl: string;
  avatar: string;
  name: string;
  designation: string;
}

export const ROLE_CREDENTIALS: Record<string, RoleCredential> = {
  super_admin: {
    role: 'super_admin',
    title: 'Super Admin',
    defaultEmail: 'admin@selbar.com',
    defaultUsername: 'arjun_admin',
    demoPassword: 'admin123',
    dashboardUrl: '/admin/dashboard',
    profileUrl: '/admin/profile',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    name: 'Arjun Nambiar',
    designation: 'Principal System Administrator',
  },
  manager: {
    role: 'manager',
    title: 'Operations Manager',
    defaultEmail: 'manager@selbar.com',
    defaultUsername: 'vikram_manager',
    demoPassword: 'manager123',
    dashboardUrl: '/manager',
    profileUrl: '/manager/profile',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    name: 'Vikramaditya Rao',
    designation: 'Operations & Hub Manager (Mumbai Hub)',
  },
  staff: {
    role: 'staff',
    title: 'Staff / QC Specialist',
    defaultEmail: 'staff@selbar.com',
    defaultUsername: 'karan_staff',
    demoPassword: 'staff123',
    dashboardUrl: '/staff',
    profileUrl: '/staff/profile',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    name: 'Karan Mehra',
    designation: 'Senior QC Hardware Technician (Bay #1)',
  },
  delivery: {
    role: 'delivery',
    title: 'Delivery Field Executive',
    defaultEmail: 'delivery@selbar.com',
    defaultUsername: 'ravi_delivery',
    demoPassword: 'delivery123',
    dashboardUrl: '/delivery',
    profileUrl: '/delivery/profile',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    name: 'Ravi Kumar',
    designation: 'Lead Field Pickup Executive (Zone West)',
  },
  seller: {
    role: 'seller',
    title: 'Seller / Merchant',
    defaultEmail: 'seller@selbar.com',
    defaultUsername: 'sameer_seller',
    demoPassword: 'seller123',
    dashboardUrl: '/seller',
    profileUrl: '/seller/profile',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    name: 'Sameer Chawla',
    designation: 'Apex Refurbished Gadgets LLP',
  },
};

/**
 * Validates role credentials against configured accounts
 */
export function verifyRoleCredentials(
  targetRole: string,
  identifier: string,
  password: string
): { success: boolean; error?: string; credential?: RoleCredential } {
  const cred = ROLE_CREDENTIALS[targetRole];
  if (!cred) {
    return { success: false, error: 'Unknown role definition' };
  }

  const cleanIdent = identifier.trim().toLowerCase();
  const matchesIdentifier =
    cleanIdent === cred.defaultEmail.toLowerCase() ||
    cleanIdent === cred.defaultUsername.toLowerCase() ||
    cleanIdent === cred.role;

  if (!matchesIdentifier) {
    return {
      success: false,
      error: `Invalid username/email for ${cred.title}. (Demo: ${cred.defaultEmail} or ${cred.defaultUsername})`,
    };
  }

  if (password !== cred.demoPassword && password !== 'selbar123') {
    return {
      success: false,
      error: `Incorrect password for ${cred.title}. (Demo password: ${cred.demoPassword})`,
    };
  }

  // Set authenticated session in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(`selbar_session_${cred.role}`, JSON.stringify({
      authenticatedAt: new Date().toISOString(),
      role: cred.role,
      user: cred.name,
      email: cred.defaultEmail,
    }));
    localStorage.setItem('selbar_current_active_role', cred.role);
  }

  return { success: true, credential: cred };
}

/**
 * Checks if a role currently has an active logged-in session
 */
export function isRoleAuthenticated(role: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(`selbar_session_${role}`);
    return Boolean(raw);
  } catch {
    return false;
  }
}

/**
 * Clears authentication for a specific role
 */
export function logoutRoleSession(role: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`selbar_session_${role}`);
}
