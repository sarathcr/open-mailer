import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowLeft,
  FileAxis3D,
  House,
  KeyRound,
  LayoutPanelTop,
  Mail,
  Mails,
} from 'lucide-react';
import ClickOutside from '../ClickOutside';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  sidebarOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  setSidebarOpen: (arg: boolean) => void;
}

export const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const menuGroups = [
    {
      name: 'MAIN MENU',
      menuItems: [
        {
          Icon: House,
          label: 'Dashboard',
          route: '/dashboard',
        },
        {
          Icon: FileAxis3D,
          label: 'Templates',
          route: '/dashboard/templates',
        },
        {
          Icon: LayoutPanelTop,
          label: 'Content builder',
          route: '/dashboard/content-builder',
        },
        {
          Icon: Mail,
          label: 'SMTP',
          route: '/dashboard/smtp',
        },
        {
          Icon: KeyRound,
          label: 'API Token',
          route: '/dashboard/api-token',
        },
        {
          Icon: Mails,
          label: 'Status',
          route: '/dashboard/status',
        },
      ],
    },
  ];

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-9999 flex h-screen w-67 flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${
          sidebarOpen
            ? 'translate-x-0 duration-300 ease-linear'
            : '-translate-x-full'
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 xl:py-10">
          <Link href="/">
            <Image
              width={176}
              height={32}
              src="/images/logo/mailer-logo.png"
              alt="Logo"
              priority
              // style={{ width: 'auto', height: 'auto' }}
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden"
          >
            <ArrowLeft />
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-1 px-4 lg:px-6">
            {menuGroups.map((group) => (
              <div key={group.name}>
                <h3 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {' '}
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-2">
                  {group.menuItems.map((menuItem) => (
                    <SidebarItem key={menuItem.label} item={menuItem} />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
