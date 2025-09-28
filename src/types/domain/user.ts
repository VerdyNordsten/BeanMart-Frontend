// Domain types for User entities - mirrors database schema exactly
import type { UUID, ISODate } from "./product";

export interface User {
  id: UUID;
  email: string;
  phone?: string | null;
  full_name?: string | null;
  password_hash?: string | null;
  created_at: ISODate;
  // Note: users table doesn't have updated_at in DB
}

export interface UserAddress {
  id: UUID;
  user_id: UUID;
  label?: string | null;
  recipient_name?: string | null;
  phone?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country: string; // CHAR(2) - default 'US'
  is_default: boolean;
  created_at: ISODate;
  // Note: user_addresses table doesn't have updated_at in DB
}

// ===== ADMIN TYPES =====
export interface Admin {
  id: UUID;
  email: string;
  full_name?: string | null;
  password_hash: string;
  is_active: boolean;
  created_at: ISODate;
  updated_at: ISODate;
}

// ===== UTILITY TYPES =====
export interface UserWithAddresses extends User {
  addresses: UserAddress[];
}
