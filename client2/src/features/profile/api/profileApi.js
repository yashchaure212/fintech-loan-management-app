import { baseApi } from "@/app/api/baseApi";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =========================
    // PROFILE
    // =========================

    getProfile: builder.query({
      query: () => "/profile",
      providesTags: ["Profile"],
      keepUnusedDataFor: 300,
    }),

    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/profile",
        method: "PUT",
        body,
      }),

      invalidatesTags: ["Profile"],
    }),

    // =========================
    // ADDRESS
    // =========================

    getAddress: builder.query({
      query: () => "/address",

      providesTags: ["Address"],

      keepUnusedDataFor: 300,
    }),

    createAddress: builder.mutation({
      query: (body) => ({
        url: "/address",

        method: "POST",

        body,
      }),

      invalidatesTags: ["Address"],
    }),

    updateAddress: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/address/${id}`,

        method: "PUT",

        body,
      }),

      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,

  useGetAddressQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
} = profileApi;
