import { AppProps as NextAppProps } from 'next/app';

export type LayoutType = 'auth' | 'dashboard';

export type InitialProps = {
  layout: LayoutType;
};

export interface AppProps extends NextAppProps {
  pageProps: {
    layout?: LayoutType;
  };
}
