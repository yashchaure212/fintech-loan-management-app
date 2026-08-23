import { baseApi } from "@/app/api/baseApi";

export const institutionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchInstitutions: builder.query({
      query: ({ q, city }) => ({
        url: `/institutions/search`,
        method: "GET",
        params: {
          q,
          ...(city ? { city } : {}),
        },
      }),

      providesTags: ["Institution"],
    }),
  }),
});

export const { useSearchInstitutionsQuery, useLazySearchInstitutionsQuery } =
  institutionApi;
