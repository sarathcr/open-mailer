'use client';

import React from 'react';
import Link from 'next/link';

import { ChevronDown } from 'lucide-react';
import SidebarDropdown from './SidebarDropdown';
import { usePathname } from 'next/navigation';

interface SidebarItemProps {
  item: {
    label: string;
    route: string;
    message?: string;
    Icon: React.ComponentType;
    pro?: boolean;
    children?: {
      label: string;
      route: string;
      pro?: boolean;
    }[];
  };
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item: { label, route, message, Icon, pro, children },
}) => {
  const pathname = usePathname();
  const isActive = pathname === route;

  return (
    <li>
      <Link
        href={route}
        className={`${
          isActive
            ? 'bg-primary/[.07] text-primary dark:bg-white/10 dark:text-white'
            : 'text-dark-4 hover:bg-gray-2 hover:text-dark dark:text-gray-5 dark:hover:bg-white/10 dark:hover:text-white'
        } group relative flex items-center gap-3 rounded-[7px] px-3.5 py-3 font-medium duration-300 ease-in-out`}
      >
        <Icon />
        {label}
        {message && (
          <span className="absolute right-11.5 top-1/2 -translate-y-1/2 rounded-full bg-red-light-6 px-1.5 py-px text-[10px] font-medium leading-[17px] text-red">
            {message}
          </span>
        )}
        {pro && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md bg-primary px-1.5 py-px text-[10px] font-medium leading-[17px] text-white">
            Pro
          </span>
        )}
        {children && (
          <ChevronDown
            className={`absolute right-3.5 top-1/2 -translate-y-1/2 transform duration-300 ${
              !isActive && 'rotate-180'
            }`}
            width="22"
            height="22"
          />
        )}
      </Link>

      {children && (
        <div
          className={`overflow-hidden transition-all duration-300 ${
            !isActive && 'hidden'
          }`}
        >
          <SidebarDropdown item={children} />
        </div>
      )}
    </li>
  );
};

export default SidebarItem;
