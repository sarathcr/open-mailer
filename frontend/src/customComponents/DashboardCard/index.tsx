'use client';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { ArrowRight, MailIcon } from 'lucide-react';
import Link from 'next/link';

interface DashboardCardProps {
  title: string;
  count: number;
  description: string;
  link: string;
}

export default function DashboardCard({
  title,
  count,
  description,
  link,
}: DashboardCardProps) {
  return (
    <Card className="relative flex min-h-[250px] w-full min-w-[300px] flex-col justify-between rounded-2xl bg-blue-light bg-gradient-to-b p-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center justify-center">
          <div className="rounded-full bg-white/10 p-4">
            <MailIcon className="h-8 w-8 text-white" />
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <CardTitle className="text-2xl font-light leading-tight text-accent">
            {title}
          </CardTitle>
          <CardDescription className="text-sm leading-snug text-accent">
            {description}
          </CardDescription>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-4xl font-bold leading-tight text-white">
          {count}
        </div>
        <Link href={link} className="p-2">
          <ArrowRight className="h-8 w-8 text-accent" />
        </Link>
      </div>
    </Card>
  );
}
