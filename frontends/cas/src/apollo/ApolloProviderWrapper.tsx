'use client'; // Ensure this file is used in a client component

import { ApolloClient, ApolloProvider } from '@apollo/client';
import React, { useMemo, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createErrorLink } from './errorLink';
import { createApolloClient } from './apolloClient';
import { useRouter } from 'next/navigation'; // Use 'next/navigation' for App Router

type ApolloProviderWrapperProps = {
  children: React.ReactNode;
};

export const ApolloProviderWrapper = ({
  children,
}: ApolloProviderWrapperProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const clientRef = useRef<ApolloClient<any> | null>(null); // Holds the Apollo Client instance

  const client = useMemo(() => {
    const errorLink = createErrorLink(toast, clientRef, router);
    const apolloClient = createApolloClient(errorLink);
    clientRef.current = apolloClient; // Initialize the clientRef here
    return apolloClient;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
