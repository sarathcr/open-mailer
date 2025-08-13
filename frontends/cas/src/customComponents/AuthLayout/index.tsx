import { FC, ReactNode } from 'react';
import { Header } from '../Header';
import { AuthCarousel } from '../AuthCarousel';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <main>
      <Header />
      <div className="container flex min-h-[calc(100vh-120px)] pb-14">
        <div className="flex w-full gap-x-8">
          <section className="flex flex-1 items-center justify-center md:justify-start">
            <div className="my-14 w-full max-w-sm">{children}</div>
          </section>
          <div className="relative hidden flex-1 items-center justify-center rounded-lg bg-banner-background md:flex">
            <AuthCarousel />
          </div>
        </div>
      </div>
    </main>
  );
};
