import { baseApi } from "@/app/api/baseApi";

export const businessRegistrationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBusinessRegistrations: builder.query({
      query: (parentEmploymentId) => ({
        url: `/school-loans/employment/${parentEmploymentId}/registrations`,
        method: "GET",
      }),

      providesTags: (result, error, parentEmploymentId) => [
        {
          type: "BusinessRegistration",
          id: parentEmploymentId,
        },
      ],
    }),

    addBusinessRegistration: builder.mutation({
      query: ({ parentEmploymentId, data }) => ({
        url: `/school-loans/employment/${parentEmploymentId}/registrations`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: (result, error, { parentEmploymentId }) => [
        {
          type: "BusinessRegistration",
          id: parentEmploymentId,
        },
      ],
    }),

    updateBusinessRegistration: builder.mutation({
      query: ({ registrationId, data }) => ({
        url: `/school-loans/registrations/${registrationId}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (result, error, { parentEmploymentId }) => [
        {
          type: "BusinessRegistration",
          id: parentEmploymentId,
        },
      ],
    }),

    deleteBusinessRegistration: builder.mutation({
      query: ({ registrationId }) => ({
        url: `/school-loans/registrations/${registrationId}`,
        method: "DELETE",
      }),

      invalidatesTags: (result, error, { parentEmploymentId }) => [
        {
          type: "BusinessRegistration",
          id: parentEmploymentId,
        },
      ],
    }),
  }),
});

export const {
  useGetBusinessRegistrationsQuery,
  useAddBusinessRegistrationMutation,
  useUpdateBusinessRegistrationMutation,
  useDeleteBusinessRegistrationMutation,
} = businessRegistrationApi;
