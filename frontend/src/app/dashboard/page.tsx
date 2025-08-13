'use client';
import DashboardCard from '@/customComponents/DashboardCard';
import MailStatusCard from '@/customComponents/MailStatusCard';
import useDialog from '@/hooks/useDialog';
import { GET_SMTP_COUNT } from '@/modules/smtp/gql/queries';
import { GET_MAIL_COUNTS } from '@/modules/statuses/gql/queries';

import { GET_TEMPLATE_COUNT } from '@/modules/template/gql/queries';
import { useQuery } from '@apollo/client';
import { NextPage } from 'next';
import { RetryAllEmailsForm } from './status/(forms)/RetryAllEmailsForm';

const DashboardPage: NextPage = () => {
  const { openDialog } = useDialog();
  const { data: templateData } = useQuery(GET_TEMPLATE_COUNT);
  const { data: SMTPData } = useQuery(GET_SMTP_COUNT);
  const { data: mailCountsData } = useQuery(GET_MAIL_COUNTS);

  const totalTemplates = templateData?.findAllEmailTemplates?.total;
  const totalSMTP = SMTPData?.findAllSmtp?.total;

  const onResend = () => {
    openDialog({
      title: 'Retry mails',
      content: <RetryAllEmailsForm />,
    });
  };

  return (
    <>
      <div className="flex flex-wrap gap-6 p-8">
        {/* First Two Cards (Fixed Half Width) */}
        <div className="flex w-full flex-1 flex-wrap gap-6 sm:flex-nowrap lg:w-1/2">
          <DashboardCard
            title="Email Templates"
            count={totalTemplates}
            description="Number of available email templates for various communications."
            link="/dashboard/templates"
          />
          <DashboardCard
            title="SMTP Accounts"
            count={totalSMTP}
            description="Number of SMTP configurations available for sending emails."
            link="/dashboard/smtp"
          />
        </div>

        {/* Third Card (Same Row on Large Screens, Stacks Below on Small Screens) */}
        <div className="w-full 2xl:w-1/2">
          <MailStatusCard
            title="Mail Status"
            successCount={mailCountsData?.getMailCounts?.success ?? 0}
            failedCount={mailCountsData?.getMailCounts?.failed ?? 0}
            pendingCount={mailCountsData?.getMailCounts?.pending ?? 0}
            totalCount={mailCountsData?.getMailCounts?.total ?? 0}
            description="Status of sent, failed, and pending emails."
            link="/dashboard/status"
            onResend={onResend}
          />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
