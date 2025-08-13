'use client';

import keycloak from '@/auth/keycloak';
import { AlignJustify } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import DropdownUser from './DropdownUser';

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  // eslint-disable-next-line no-unused-vars
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const firstName = keycloak.tokenParsed?.given_name || '';
  const lastName = keycloak.tokenParsed?.family_name || '';
  const email = keycloak.tokenParsed?.email || '';
  const employeeId = keycloak.tokenParsed?.employeeId || '';

  return (
    <header className="sticky top-0 z-20 flex w-full border-b border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark">
      <div className="flex flex-grow items-center justify-between px-4 shadow-2 md:px-5 2xl:px-10">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-30 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-dark-3 dark:bg-dark-2 lg:hidden"
          >
            <AlignJustify />
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          <Link className="block flex-shrink-0 lg:hidden" href="/">
            <Image
              width={32}
              height={32}
              src={'/images/logo/logo-icon.svg'}
              alt="Logo"
            />
          </Link>
        </div>

        <div className="ml-auto">
          <DropdownUser
            email={email}
            name={`${firstName} ${lastName}`}
            emp_id={employeeId}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
