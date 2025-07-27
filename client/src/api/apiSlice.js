import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

console.log('API Base URL:', import.meta.env.VITE_API_URL);
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (user) => ({
        url: '/users/register',
        method: 'POST',
        body: user,
      }),
    }),
    getProfile: builder.query({
      query: () => '/users/profile',
    }),
    getAllUsers: builder.query({
      query: (params) => ({
        url: '/users',
        params,
      }),
    }),

    getUserById: builder.query({
      query: (userid) => `/users/${userid}`,
    }),
    updateProfile: builder.mutation({
      query: (user) => ({
        url: '/users/profile',
        method: 'PATCH',
        body: user,
      }),
    }),
    changePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: '/users/change-password',
        method: 'POST',
        body: { oldPassword, newPassword },
      }),
    }),
    deleteAccount: builder.mutation({
      query: () => ({
        url: '/users/delete',
        method: 'DELETE',
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Properties
    getAllProperties: builder.query({
      query: () => '/properties',
    }),
    getProperties: builder.query({
      query: (params) => ({
        url: '/properties',
        params,
      }),
      transformResponse: (response) => ({
        properties: response.data,
        totalCount: response.totalCount,
      }),
    }),
    getProperty: builder.query({
      query: (id) => `/properties/${id}`,
    }),
    createProperty: builder.mutation({
      query: (property) => ({
        url: '/properties',
        method: 'POST',
        body: property,
      }),
    }),
    updateProperty: builder.mutation({
      query: ({ id, ...property }) => ({
        url: `/properties/${id}`,
        method: 'PATCH',
        body: property,
      }),
    }),
    deleteProperty: builder.mutation({
      query: (id) => ({
        url: `/properties/${id}`,
        method: 'DELETE',
      }),
    }),
    getPropertyCountByUser: builder.query({
      query: (userId) => `/properties/count/${userId}`,
    }),

    // Contacts
    createContact: builder.mutation({
      query: (contact) => ({
        url: '/contacts',
        method: 'POST',
        body: contact,
      }),
    }),
    getContacts: builder.query({
      query: () => '/contacts',
    }),
    updateContact: builder.mutation({
      query: ({ id, ...contact }) => ({
        url: `/contacts/${id}`,
        method: 'PATCH',
        body: contact,
      }),

    }),
    deleteContact: builder.mutation({
      query: (id) => ({
        url: `/contacts/${id}`,
        method: 'DELETE',
      }),
    }),

    // Favorites
    addFavorite: builder.mutation({
      query: (propertyId) => ({
        url: `/favorites/${propertyId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Favorites'], // Invalidate Favorites khi thêm
    }),
    getFavorites: builder.query({
      query: () => '/favorites',
      providesTags: ['Favorites'], // Cung cấp tag Favorites
    }),
    removeFavorite: builder.mutation({
      query: (propertyId) => ({
        url: `/favorites/${propertyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Favorites'], // Invalidate Favorites khi xóa
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useGetAllUsersQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useDeleteUserMutation,
  useGetPropertiesQuery,
  useGetAllPropertiesQuery,
  useGetPropertyQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useCreateContactMutation,
  useGetContactsQuery,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useAddFavoriteMutation,
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
  useGetUserByIdQuery,
  useGetPropertyCountByUserQuery,
} = apiSlice;
