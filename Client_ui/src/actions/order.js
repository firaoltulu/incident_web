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

// export function useGetOrders() {
//     const url = endpoints.order.list;

//     console.log({ url });


//     const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

//     const memoizedValue = useMemo(
//         () => ({
//             orders: data?.services || [],
//             ordersLoading: isLoading,
//             ordersError: error,
//             ordersValidating: isValidating,
//             ordersEmpty: !isLoading && !data?.services.length,
//         }),
//         [data?.orders, error, isLoading, isValidating]
//     );

//     return memoizedValue;
// }

export function useGetOrders(query) {
    const url = query ? [endpoints.order.list, { params: { ...query } }] : '';

    const { data, isLoading, error, isValidating } = useSWR(url, fetcher, {
        ...swrOptions,
        keepPreviousData: true,
    });

    const memoizedValue = useMemo(
        () => ({
            orders: data?.orders || [],
            length: data?.length || 0,
            ordersLoading: isLoading,
            ordersError: error,
            ordersValidating: isValidating,
            ordersEmpty: !isLoading && !data?.orders.length,
        }),
        [data?.orders, data?.length, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetOrder(orderId) {
    const url = orderId ? [endpoints.order.details, { params: { orderId } }] : '';

    const { data, isLoading, error, isValidating } = useSWR(url, fetcher, {
        ...swrOptions,
        keepPreviousData: true,
    });

    console.log({ data })

    const memoizedValue = useMemo(
        () => ({
            order: data?.order,
            orderLoading: isLoading,
            orderError: error,
            orderValidating: isValidating,
        }),
        [data?.order, error, isLoading, isValidating]
    );

    return memoizedValue;

}