'use client';

import keycloak from '@/auth/keycloak';
import { ProfileProps } from '@/customComponents/types/profile';
import { getUserAvatarURL } from '@/utils';
import { ChevronDown, LogOut, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FC, useState } from 'react';
import ClickOutside from '../ClickOutside';

const DropdownUser: FC<ProfileProps> = ({ email, name }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleLogout: () => void = () => {
    setDropdownOpen(false);
    keycloak.logout();
  };

  const handleProfile = () => {
    setDropdownOpen(false);
  };
  const profileUrl = `${process.env.NEXT_PUBLIC_PROFILE_URL || ''}`;
  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="h-12 w-12 rounded-full">
            <Image
              width={112}
              height={112}
              src={getUserAvatarURL(email)}
              style={{
                width: 'auto',
                height: 'auto',
              }}
              alt="User"
              className="overflow-hidden rounded-full"
            />
          </span>
          <span className="block">
            <span className="block font-medium text-dark dark:text-white">
              {name}
            </span>
            <span className="block break-all font-medium text-dark-5 dark:text-dark-6">
              {email}
            </span>
          </span>
        </div>

        <span className="flex·items-center·gap-2·dark:text-dark-6">
          <ChevronDown
            className={`duration-200 ease-in ${dropdownOpen && 'rotate-180'}`}
            width="20"
            height="20"
          />
        </span>
      </Link>

      {/* <!-- Dropdown Star --> */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-[15px] flex w-[280px] flex-col rounded-lg border-[0.5px] border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark`}
        >
          <ul className="flex flex-col gap-1 border-b-[0.5px] border-stroke p-2.5">
            <li>
              <Link
                href={profileUrl}
                onClick={handleProfile}
                className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
              >
                <User width="18" height="18" />
                View profile
              </Link>
            </li>
          </ul>
          <div className="p-2.5">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
            >
              <LogOut width="18" height="18" />
              Logout
            </button>
          </div>
        </div>
      )}
      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};

export default DropdownUser;
