import { Input, InputProps } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { FC } from 'react';

export const SearchComponent: FC<InputProps> = (props) => {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
      <Input type="search" placeholder="Search" className="pl-8" {...props} />
    </div>
  );
};
