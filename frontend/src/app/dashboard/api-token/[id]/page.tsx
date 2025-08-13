'use client';

import { Button } from '@/components/ui/button';
import APITokenForm from '@/forms/api-token/APITokenForm';
import { Label } from '@radix-ui/react-label';
import { KeyRound, Copy } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import {
  FIND_ONE_APITOKEN_QUERY,
  REGENERATE_APITOKEN_QUERY,
} from '@/modules/api-token/gql/queries';
import { useToken } from '@/providers/TokenContext';

const TokenDetailPage = () => {
  const { id } = useParams() as { id: string };

  const { token, setToken } = useToken();
  const [isCopied, setIsCopied] = useState(false);

  const { data } = useQuery(FIND_ONE_APITOKEN_QUERY, {
    variables: { id },
    onError: (error) => {
      console.error('Error fetching API token:', error);
    },
  });

  const { refetch } = useQuery(REGENERATE_APITOKEN_QUERY, {
    variables: { id },
    skip: true,
    onCompleted: (data) => {
      if (data?.regenerateToken?.token) {
        setToken(data.regenerateToken.token);
      }
    },
    onError: (error) => {
      console.error('Error fetching API token:', error);
    },
  });

  const handleRegenerate = () => {
    refetch();
  };

  const handleCopy = () => {
    if (token) {
      navigator.clipboard.writeText(token).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="flex w-full flex-col items-center justify-between space-y-4 p-5 md:flex-row md:space-x-4 md:space-y-0">
        <h3 className="text-2xl font-semibold tracking-tight">
          {data?.apiToken?.name}
        </h3>
        <div className="gap flex flex-row gap-2">
          <Button
            className="w-full md:w-auto"
            variant="outline"
            onClick={handleRegenerate}
          >
            Regenerate
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-center bg-gray-50">
        <div className="w-full rounded-lg bg-white p-6 shadow-md">
          <div className="flex items-center space-x-4">
            <KeyRound size={48} className="text-black-500 flex-shrink-0" />
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <div className="w-full">
                  <span className="block break-all">{token}</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="ml-4 flex items-center rounded-lg border bg-gray-100 px-3 py-2 hover:bg-gray-200 active:bg-gray-300"
                >
                  <Copy size={20} className="text-gray-600" />
                </button>
                {isCopied && (
                  <div className="absolute bottom-8 rounded bg-green-100 px-4 py-2 text-green-600 shadow-md">
                    Token copied to clipboard!
                  </div>
                )}
              </div>
            </div>
          </div>
          <p className="mt-4 text-gray-600">
            {token
              ? "Make sure to copy this token, you won't be able to see it again!"
              : 'You have no token now. To get the token, regenerate or update the data.'}
          </p>
        </div>
      </div>
      <div className="mt-4 w-full rounded-lg bg-white p-5 shadow-md">
        <Label>Details</Label>
        <div className="mt-4">
          <APITokenForm values={data} />
        </div>
      </div>
    </div>
  );
};

export default TokenDetailPage;
