// import { buttonVariants } from '@/components/ui/button';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface DashboardCardProps {
  title: string;
  description: string;
  link: string;
}

export default function DashboardCard({
  title,
  description,
  link,
}: DashboardCardProps) {
  return (
    <Card className="relative w-full max-w-md overflow-hidden rounded-3xl shadow-2xl md:max-w-lg lg:max-w-xl">
      <div className="absolute inset-0">
        <Image
          src="/images/card/cardimage.jpg"
          alt="Card Image"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="h-full w-full object-cover"
        />
        <div className="from-primary-400 absolute inset-0 bg-gradient-to-r" />
      </div>
      <div className="relative z-10 flex flex-col justify-between gap-4 p-4 text-accent md:p-6">
        <div>
          <CardTitle className="text-xl md:text-2xl lg:text-3xl">
            {title}
          </CardTitle>
          <CardDescription className="text-sm text-accent md:text-base">
            {description}
          </CardDescription>
        </div>
        <div className="flex justify-end text-black">
          <Link href={link} target="_blank">
            <ChevronRight href={link} className="-ml-1.5 h-6 w-6 text-accent" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
