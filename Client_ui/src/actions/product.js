import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetCompanies() {
  const url = endpoints.company.list;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      companies: data?.companies || [],
      companiesLoading: isLoading,
      companiesError: error,
      companiesValidating: isValidating,
      companiesEmpty: !isLoading && !data?.companies.length,
    }),
    [data?.companies, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCompany(companyId) {
  console.log({ companyId });

  const url = companyId ? [endpoints.company.details, { params: { companyId } }] : '';

  console.log({ url });

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      company: data?.company,
      companyLoading: isLoading,
      companyError: error,
      companyValidating: isValidating,
    }),
    [data?.company, error, isLoading, isValidating]
  );

  return memoizedValue;

}

// ----------------------------------------------------------------------

export function useSearchProducts(query) {
  const url = query ? [endpoints.product.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}
