import { QueryClient } from '@tanstack/react-query';

import { isRecoverableApiError } from '@/lib/api-client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: (failureCount, error) =>
        isRecoverableApiError(error) ? failureCount < 2 : failureCount < 1,
      retryDelay: (failureCount) => Math.min(1000 * 2 ** failureCount, 10000),
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  },
});
