import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { FC } from 'react';
import { ProfileProps } from '../types';
import { getUserAvatarURL } from '@/utils';
import { Loader2, Settings } from 'lucide-react';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Profile: FC<ProfileProps> = ({
  email,
  name,
  emp_id,
  loading,
  dropdownItems = [],
}) => {
  return (
    <>
      {loading ? <Loader2 className="m-auto animate-spin" /> : <></>}
      <div className="mb-[26px] flex items-center justify-between border-b-[1px] pb-4">
        <div className="just flex items-center gap-[16px]">
          <Avatar>
            <AvatarImage
              className="cursor-pointer rounded-full"
              src={getUserAvatarURL(email)}
              width={70}
              height={70}
              onClick={() => {
                window.open('https://gravatar.com/');
              }}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="flex flex-col justify-between">
            <p>{name}</p>
            <p>{email}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Settings className="cursor-pointer" />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            {dropdownItems.map((item, index) => (
              <DropdownMenuItem key={index} onClick={item.action}>
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col gap-[24px]">
        <div className="flex justify-between gap-[100px] border-b-[1px] pb-[24px]">
          <p>Name</p>
          <p className="break-all">{name}</p>
        </div>
        <div className="flex justify-between gap-[100px] border-b-[1px] pb-[24px]">
          <p>email account</p>
          <p className="break-all">{email}</p>
        </div>
        <div className="flex justify-between gap-[100px] pb-[24px]">
          <p>Employee Id</p>
          <p className="break-all">{emp_id}</p>
        </div>
      </div>
    </>
  );
};
