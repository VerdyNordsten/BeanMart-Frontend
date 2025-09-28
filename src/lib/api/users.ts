// Users API with proper typing and mappers
import { apiClient } from "../api-client";
import type {
  GetUsersResponse,
  GetUserResponse,
  // CreateUserResponse,
  UpdateUserResponse,
  DeleteUserResponse,
  GetUserAddressesResponse,
  GetUserAddressResponse,
  CreateUserAddressResponse,
  UpdateUserAddressResponse,
  DeleteUserAddressResponse,
  LoginResponse,
  RegisterResponse,
  GetProfileResponse,
  RefreshTokenResponse,
  GetUsersParams,
  // CreateUserRequest,
  UpdateUserRequest,
  LoginRequest,
  RegisterRequest,
  CreateUserAddressRequest,
  UpdateUserAddressRequest,
} from "@/types/api/user";

// ===== AUTH API =====
export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  getProfile: async (): Promise<GetProfileResponse> => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  logout: async (): Promise<{ success: boolean }> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};

// ===== USERS API =====
export const usersApi = {
  // Get all users (admin only)
  getAllUsers: async (params?: GetUsersParams): Promise<GetUsersResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
    
    const response = await apiClient.get(`/users?${queryParams.toString()}`);
    return response.data;
  },

  // Get user by ID (admin only)
  getUser: async (id: string): Promise<GetUserResponse> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  // Update user (admin only)
  updateUser: async (id: string, data: UpdateUserRequest): Promise<UpdateUserResponse> => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (id: string): Promise<DeleteUserResponse> => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};

// ===== USER ADDRESSES API =====
export const userAddressesApi = {
  // Get user addresses
  getUserAddresses: async (): Promise<GetUserAddressesResponse> => {
    const response = await apiClient.get('/user-addresses');
    return response.data;
  },

  // Get address by ID
  getAddress: async (id: string): Promise<GetUserAddressResponse> => {
    const response = await apiClient.get(`/user-addresses/${id}`);
    return response.data;
  },

  // Create address
  createAddress: async (data: CreateUserAddressRequest): Promise<CreateUserAddressResponse> => {
    const response = await apiClient.post('/user-addresses', data);
    return response.data;
  },

  // Create address (alias)
  createUserAddress: async (data: CreateUserAddressRequest): Promise<CreateUserAddressResponse> => {
    const response = await apiClient.post('/user-addresses', data);
    return response.data;
  },

  // Update address
  updateAddress: async (id: string, data: UpdateUserAddressRequest): Promise<UpdateUserAddressResponse> => {
    const response = await apiClient.put(`/user-addresses/${id}`, data);
    return response.data;
  },

  // Update address (alias)
  updateUserAddress: async (id: string, data: UpdateUserAddressRequest): Promise<UpdateUserAddressResponse> => {
    const response = await apiClient.put(`/user-addresses/${id}`, data);
    return response.data;
  },

  // Delete address
  deleteAddress: async (id: string): Promise<DeleteUserAddressResponse> => {
    const response = await apiClient.delete(`/user-addresses/${id}`);
    return response.data;
  },

  // Delete address (alias)
  deleteUserAddress: async (id: string): Promise<DeleteUserAddressResponse> => {
    const response = await apiClient.delete(`/user-addresses/${id}`);
    return response.data;
  },

  // Set address as default
  setUserAddressAsDefault: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiClient.put(`/user-addresses/${id}/set-default`);
    return response.data;
  },
};
