import { apiClient, unwrap } from '@/lib/api-client';

export const reportService = {
  async submit(payload: {
    user?: string;
    email: string;
    title: string;
    message: string;
  }): Promise<unknown> {
    return unwrap<unknown>(
      apiClient.post('/reports', {
        ...payload,
      }),
    );
  },
};
