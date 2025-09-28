// API types for User endpoints
import type { User, UserAddress } from "../domain/user";
import type { ApiResponse, PaginatedResponse, SearchParams } from "./common";

// ===== USER API RESPONSES =====
export type GetUsersResponse = PaginatedResponse<User>;
export type GetUserResponse = ApiResponse<User>;
export type CreateUserResponse = ApiResponse<User>;
export type UpdateUserResponse = ApiResponse<User>;
export type DeleteUserResponse = ApiResponse<{ id: string }>;

// ===== USER ADDRESS API RESPONSES =====
export type GetUserAddressesResponse = ApiResponse<UserAddress[]>;
export type GetUserAddressResponse = ApiResponse<UserAddress>;
export type CreateUserAddressResponse = ApiResponse<UserAddress>;
export type UpdateUserAddressResponse = ApiResponse<UserAddress>;
export type DeleteUserAddressResponse = ApiResponse<{ id: string }>;

// ===== AUTH API RESPONSES =====
export type LoginResponse = ApiResponse<{
  user: User;
  token: string;
  refreshToken?: string;
}>;

export type RegisterResponse = ApiResponse<{
  user: User;
  token: string;
  refreshToken?: string;
}>;

export type GetProfileResponse = ApiResponse<User>;
export type RefreshTokenResponse = ApiResponse<{
  token: string;
  refreshToken?: string;
}>;

// ===== USER REQUEST TYPES =====
export interface GetUsersParams extends SearchParams {
  is_active?: boolean;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
}

export interface UpdateUserRequest {
  email?: string;
  full_name?: string;
  phone?: string;
  is_active?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  isAdmin?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
}

// ===== USER ADDRESS REQUEST TYPES =====
export interface CreateUserAddressRequest {
  label: string;
  recipient_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export interface UpdateUserAddressRequest {
  label?: string;
  recipient_name?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  is_default?: boolean;
}
