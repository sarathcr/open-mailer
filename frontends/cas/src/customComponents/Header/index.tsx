import Image from 'next/image';
import { FC } from 'react';

interface HeaderProps {}

export const Header: FC<HeaderProps> = () => {
  return (
    <header className="flex items-center p-5 px-14">
      <Image
        src={'/images/logo/logo-icon.svg'}
        width={32}
        height={44}
        alt="Logo image"
        className="h-[44px]"
      />
      <h1 className="ml-2 text-3xl font-semibold">Open CAS</h1>
    </header>
  );
};
