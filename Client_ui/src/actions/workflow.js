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

export function useGetWorkFlows() {
  const url = endpoints.workflow.list;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      workflows: data?.workflows || [],
      workflowsLoading: isLoading,
      workflowsError: error,
      workflowsValidating: isValidating,
      workflowsEmpty: !isLoading && !data?.workflows.length,
    }),
    [data?.workflows, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetWorkflow(workflowId) {
  const url = workflowId ? [endpoints.workflow.details, { params: { workflowId } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      workflow: data?.workflow,
      workflowLoading: isLoading,
      workflowError: error,
      workflowValidating: isValidating,
    }),
    [data?.workflow, error, isLoading, isValidating]
  );

  return memoizedValue;

}
// ----------------------------------------------------------------------

export function useGetButtons() {
  const url = endpoints.button.list;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      buttons: data?.buttons || [],
      buttonsLoading: isLoading,
      buttonsError: error,
      buttonsValidating: isValidating,
      buttonsEmpty: !isLoading && !data?.buttons.length,
    }),
    [data?.buttons, error, isLoading, isValidating]
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

