// src/api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
    updateProfile: builder.mutation({
      query: (user) => ({
        url: '/users/profile',
        method: 'PATCH',
        body: user,
      }),
    }),
    // Properties
    getProperties: builder.query({
      query: (params) => ({
        url: '/properties',
        params,
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
    }),
    getFavorites: builder.query({
      query: () => '/favorites',
    }),
    removeFavorite: builder.mutation({
      query: (propertyId) => ({
        url: `/favorites/${propertyId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetPropertiesQuery,
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
} = apiSlice;