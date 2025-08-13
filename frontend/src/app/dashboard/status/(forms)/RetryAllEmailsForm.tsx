import { useMutation } from '@apollo/client';
import { RETRY_ALL_EMAILS } from '../_gql';
import { useState } from 'react';
import { MailStatsCard } from '@/customComponents/MailStatsCard';
import { Button } from '@/components/ui/button';

interface RetryEmail {
  totalMails: number;
  successMails: number;
  failedMails: number;
}

export const RetryAllEmailsForm = () => {
  const [retryEmails, { loading }] = useMutation(RETRY_ALL_EMAILS);
  const [data, setData] = useState<RetryEmail>();

  const onSubmit = async () => {
    try {
      const result = await retryEmails();
      setData(result?.data?.retryFailedEmails);
    } catch (err) {
      console.error('Error retrying email:', err);
    }
  };
  return (
    <>
      {data && (
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
          <MailStatsCard
            title="Total"
            value={data.totalMails}
            color="text-blue-400"
          />
          <MailStatsCard
            title="Success"
            value={data.successMails}
            color="text-green-400"
          />
          <MailStatsCard
            title="Failed"
            value={data.failedMails}
            color="text-red-400"
          />
        </div>
      )}
      <Button onClick={onSubmit} className="mt-4 w-full" disabled={loading}>
        {loading ? 'Retrying Emails...' : 'Retry Emails'}
      </Button>
    </>
  );
};
