'use client';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import {
  ArrowRight,
  CheckCircle,
  MailIcon,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

interface MailStatusCardProps {
  title: string;
  successCount: number;
  failedCount: number;
  pendingCount: number;
  description: string;
  totalCount: number;
  link: string;
  onResend: () => void;
}

export default function MailStatusCard({
  title,
  successCount,
  failedCount,
  pendingCount,
  totalCount,
  description,
  link,
  onResend,
}: MailStatusCardProps) {
  return (
    <Card className="flex min-h-[250px] w-full min-w-[300px] flex-col justify-between rounded-2xl bg-blue-light bg-gradient-to-b p-4">
      {/* Top Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center justify-center">
            <div className="rounded-full bg-white/10 p-4">
              <MailIcon className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="flex flex-col">
            <CardTitle className="text-2xl font-light leading-tight text-accent">
              {title}
            </CardTitle>
            <CardDescription className="text-sm leading-snug text-accent md:text-base lg:text-lg">
              {description}
            </CardDescription>
          </div>
        </div>

        <div className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
          {totalCount}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8 text-white">
          {/* Success */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-3xl font-bold">{successCount}</p>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-400" size={16} />
              <p className="text-sm md:text-base">Success</p>
            </div>
          </div>

          <div className="h-12 w-px bg-white/50"></div>

          {/* Fail */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-3xl font-bold">{failedCount}</p>
            <div className="flex items-center gap-2">
              <XCircle className="text-red-400" size={16} />
              <p className="text-sm md:text-base">Fail</p>
              <button
                onClick={onResend}
                className="flex items-center gap-2 rounded-full border border-green-400 px-3 py-1 text-sm font-medium text-green-400 hover:bg-black hover:opacity-30 hover:shadow-md"
              >
                <RefreshCw size={14} />
                Resend
              </button>
            </div>
          </div>

          <div className="h-12 w-px bg-white/50"></div>

          {/* Pending */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-3xl font-bold">{pendingCount}</p>
            <div className="flex items-center gap-2">
              <RefreshCw className="text-yellow-400" size={16} />
              <p className="text-sm md:text-base">Pending</p>
            </div>
          </div>
        </div>

        <Link href={link} className="p-2">
          <ArrowRight className="h-8 w-8 text-accent" />
        </Link>
      </div>
    </Card>
  );
}
