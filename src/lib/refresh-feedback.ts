import type { QueryObserverResult } from '@tanstack/react-query';

import { isRecoverableApiError } from '@/lib/api-client';
import { useAppStore } from '@/store/app-store';

export function showOfflineNoticeAfterRefresh(
  results: ArrayLike<Pick<QueryObserverResult<unknown, Error>, 'error'>>,
) {
  const hasRecoverableError = Array.from(results).some((result) =>
    isRecoverableApiError(result.error),
  );

  if (hasRecoverableError) {
    useAppStore.getState().showServerDownNotice();
  }
}
