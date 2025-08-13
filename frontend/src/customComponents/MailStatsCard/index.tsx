import { FC } from 'react';
import { RotateCcw } from 'lucide-react';

interface MailStatsCardProps {
  title: string;
  value: number;
  color: string;
  onRetry?: () => void;
}

export const MailStatsCard: FC<MailStatsCardProps> = ({
  title,
  value,
  color,
  onRetry,
}) => {
  return (
    <div className="flex w-full max-w-[125px] items-center justify-between rounded-xl bg-gray-100 p-3 shadow-sm">
      <p className={`text-sm font-semibold ${color} truncate`}>{title}</p>
      <div className="flex items-center gap-2">
        <p className={`text-xl font-bold ${color}`}>{value}</p>
        {onRetry && value > 0 && (
          <RotateCcw
            onClick={onRetry}
            size={16}
            className="cursor-pointer text-blue-400 transition hover:text-blue-500"
          />
        )}
      </div>
    </div>
  );
};
