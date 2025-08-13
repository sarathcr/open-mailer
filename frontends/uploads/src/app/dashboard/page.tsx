'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Braces,
  Calendar,
  Code,
  Copy,
  EllipsisVertical,
  ExternalLink,
  File,
  FileArchive,
  FileCog,
  FileJson,
  FileSpreadsheet,
  FileText,
  FileWarning,
  FileX2,
  Globe,
  Images,
  Kanban,
  Lock,
  Music,
  Scaling,
  SquareCode,
  Trash2,
  Video,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import Loader from '@/customComponents/Loader';
import { PaginationComponent } from '@/customComponents/PaginationComponent';
import { SearchComponent } from '@/customComponents/SearchComponent';
import useDialog from '@/hooks/useDialog';
import { GET_USER_QUERY } from '@/modules/dashboard/gql/queries';
import { bytesToKB } from '@/utils/bytesToKB';
import { copyUrl } from '@/utils/copyURL';
import { dateFormat } from '@/utils/dateFormat';
import { useQuery } from '@apollo/client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FileData, PaginatedFile, UploadFile } from './types';

const Dashboard = () => {
  const [uploadedFiles, setUploadedFiles] = useState<PaginatedFile>();
  const [loading, setLoading] = useState(false);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [success, setSuccess] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [accessType, setAccessType] = useState<'public' | 'private' | ''>('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [limit, setLimit] = useState(18);
  const [page, setPage] = useState(1);

  const pagination = {
    currentLimit: limit,
    currentPage: page,
    files: uploadedFiles?.files || [],
    pageSize: page,
    totalFiles: uploadedFiles?.totalFiles || 0,
    totalPages: uploadedFiles?.totalPages || 0,
    onPageChange: (page: number) => {
      setPage(page);
    },
    onLimitChange: (newLimit: number) => {
      setLimit(newLimit);
    },
    showLimitSelector: true,
  };

  const isButtonDisabled = !(
    type.trim() !== '' ||
    accessType.trim() !== '' ||
    sortField.trim() !== '' ||
    sortOrder.trim() !== 'asc'
  );
  const renderFileIcon = (file: FileData) => {
    // If a thumbnail exists, render the image
    if (file?.thumbnail) {
      return renderImage(file);
    }

    // Default icons for various file types
    const fileIcons = {
      'text/plain': (
        <FileText className="text-primary" size={35} strokeWidth={2} />
      ),
      'application/pdf': (
        <FileText className="text-[#DD494B]" size={35} strokeWidth={2} />
      ),
      'application/msword': (
        <File className="text-primary" size={35} strokeWidth={2} />
      ),
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        (
          <FileSpreadsheet
            className="text-[#3E6FBE]"
            size={35}
            strokeWidth={2}
          />
        ),
      'application/vnd.ms-excel': (
        <FileSpreadsheet className="text-[#1C6C40]" size={35} strokeWidth={2} />
      ),
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': (
        <FileSpreadsheet className="text-[#1C6C40]" size={35} strokeWidth={2} />
      ),
      'video/mp4': <Video className="text-primary" size={35} strokeWidth={2} />,
      'video/webm': (
        <Video className="text-primary" size={35} strokeWidth={2} />
      ),
      'audio/mpeg': (
        <Music className="text-primary" size={35} strokeWidth={2} />
      ),
      'audio/ogg': <Music className="text-primary" size={35} strokeWidth={2} />,
      'audio/flac': (
        <Music className="text-primary" size={35} strokeWidth={2} />
      ),
      'application/json': (
        <FileJson className="text-primary" size={35} strokeWidth={2} />
      ),
      'application/zip': (
        <FileArchive className="text-primary" size={35} strokeWidth={2} />
      ),
      'application/x-tar': (
        <FileArchive className="text-primary" size={35} strokeWidth={2} />
      ),
      'text/csv': (
        <FileCog className="text-primary" size={35} strokeWidth={2} />
      ),
      'application/xml': (
        <SquareCode className="text-primary" size={35} strokeWidth={2} />
      ),
      'text/html': (
        <Code className="text-[#DD4B25]" size={35} strokeWidth={2} />
      ),
      'text/css': (
        <Kanban className="text-[#146EB0]" size={35} strokeWidth={2} />
      ),
      'application/javascript': (
        <Braces className="text-[#EFD81D]" size={35} strokeWidth={2} />
      ),
      'application/x-yaml': (
        <FileText className="text-primary" size={35} strokeWidth={2} />
      ),
      'application/octet-stream': (
        <FileWarning color="red" size={35} strokeWidth={2} />
      ),
    };

    type FileType = keyof typeof fileIcons;

    // Return the icon based on fileType, or null if not matched
    return fileIcons[file?.fileType as FileType] || null;
  };

  const customLoader = ({ src }: { src: string }) => {
    return `${src}`;
  };

  const renderImage = (file: FileData) => (
    <Image
      className="h-full w-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
      src={file?.thumbnail || '/images/logo.svg'}
      width={200}
      height={100}
      alt={file?.name || 'Image'}
      placeholder="blur"
      blurDataURL="/images/logo.svg"
      loading="lazy"
      loader={customLoader}
    />
  );

  const fetchFiles = async (params: {
    search?: string;
    type?: string;
    sortField?: string;
    sortOrder?: string;
    limit?: number;
    page?: number;
    accessType?: 'public' | 'private' | '';
  }) => {
    const queryParams = new URLSearchParams(
      Object.entries(params)
        .filter(([, value]) =>
          value !== undefined && value !== null && value !== 'all' ? value : ''
        )
        .map(([key, value]) => [
          key === 'type' ? 'fileType' : key,
          value.toString(),
        ])
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_OPEN_GATE_URL}files/getFiles?${queryParams}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    const { data } = await response.json();
    return data;
  };

  useEffect(() => {
    const loadFiles = async () => {
      setLoading(true);
      try {
        const files = await fetchFiles({
          search,
          type,
          accessType,
          sortField,
          sortOrder,
          limit,
          page,
        });
        setUploadedFiles(files);
      } catch (err) {
        console.error(err, 'Error fetching files');
      } finally {
        setLoading(false);
        setIsApiLoaded(true);
      }
    };

    loadFiles();
  }, [search, type, accessType, sortField, sortOrder, page, limit, success]);

  const { openDialog, clearDialog } = useDialog();

  const handleDelete = async (file: UploadFile) => {
    const deleteUrl = `${process.env.NEXT_PUBLIC_OPEN_GATE_URL}files/${
      file?.isPrivate ? 'private' : 'public'
    }/${file?.path}`;

    try {
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete the file: ${response.statusText}`);
      }

      setSuccess(true);
      clearDialog();
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };

  const openDeleteDialog = (file: UploadFile) => {
    setSuccess(false);
    openDialog({
      title: 'Confirm Delete',
      content: (
        <div>
          <p>
            Are you sure you want to delete this file:
            <i className="text-sm font-semibold">{file.name}</i>
          </p>
          <Button className="mt-5 w-full" onClick={() => handleDelete(file)}>
            Delete
          </Button>
        </div>
      ),
    });
  };

  const openDetailsDialog = (file: UploadFile) => {
    openDialog({
      title: 'File Details',
      content: <FileDetailsComponent file={file} />,
    });
  };

  return (
    <div className="m-5">
      <>
        <div className="mb-5 flex w-full flex-col items-center justify-between space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Uploaded files
          </h3>

          <div className="flex flex-row">
            {!isButtonDisabled && (
              <Button
                className="mr-2 bg-white text-gray-600 hover:bg-gray-200"
                onClick={() => {
                  setType('');
                  setAccessType('');
                  setSortField('');
                  setSortOrder('asc');
                }}
              >
                Clear filters
              </Button>
            )}
            <div className="px-2">
              <SearchComponent
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="px-2">
              <Select value={type} onValueChange={(value) => setType(value)}>
                <SelectTrigger className="border focus:border focus:border-solid focus:outline-none focus:ring-0">
                  <SelectValue placeholder="File Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">
                      <span className="flex items-center space-x-2">
                        <File className="text-gray-500" size={15} />
                        <span>All</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="pdf">
                      <span className="flex items-center space-x-2">
                        <FileText className="text-gray-500" size={15} />
                        <span>PDFs</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="image">
                      <span className="flex items-center space-x-2">
                        <Images className="text-gray-500" size={15} />
                        <span>Photos & images</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="audio">
                      <span className="flex items-center space-x-2">
                        <Music className="text-gray-500" size={15} />
                        <span>Audios</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="video">
                      <span className="flex items-center space-x-2">
                        <Video className="text-gray-500" size={15} />
                        <span>Videos</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="html">
                      <span className="flex items-center space-x-2">
                        <Code className="text-gray-500" size={15} />
                        <span>HTML</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="sheet">
                      <span className="flex items-center space-x-2">
                        <FileSpreadsheet className="text-gray-500" size={15} />
                        <span>Documents</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="pptx">
                      <span className="flex items-center space-x-2">
                        <FileSpreadsheet className="text-gray-500" size={15} />
                        <span>Spreadsheets</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="json">
                      <span className="flex items-center space-x-2">
                        <FileJson className="text-gray-500" size={15} />
                        <span>JSON</span>
                      </span>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="px-2">
              <Select
                value={accessType}
                onValueChange={(value) =>
                  setAccessType(value as 'public' | 'private' | '')
                }
              >
                <SelectTrigger className="border focus:border focus:border-solid focus:outline-none focus:ring-0">
                  <SelectValue placeholder="Access Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">
                      <span className="flex items-center space-x-2">
                        <File className="text-gray-500" size={15} />
                        <span>All</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="public">
                      <span className="flex items-center space-x-2">
                        <Globe className="text-gray-500" size={15} />
                        <span>Public</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="private">
                      <span className="flex items-center space-x-2">
                        <Lock className="text-gray-500" size={15} />
                        <span>Private</span>
                      </span>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex rounded-md border">
              <div className="flex items-center">
                <Select
                  value={sortField}
                  onValueChange={(value) => setSortField(value)}
                >
                  <SelectTrigger className="border-none pr-2 focus:border-none focus:outline-none focus:ring-0">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="name">
                        <span className="flex items-center space-x-2">
                          <FileText className="text-gray-500" size={15} />
                          <span>Name</span>
                        </span>
                      </SelectItem>
                      <SelectItem value="size">
                        <span className="flex items-center space-x-2">
                          <Scaling className="text-gray-500" size={15} />
                          <span>Size</span>
                        </span>
                      </SelectItem>
                      <SelectItem value="fileType">
                        <span className="flex items-center space-x-2">
                          <File className="text-gray-500" size={15} />
                          <span>File Type</span>
                        </span>
                      </SelectItem>
                      <SelectItem value="lastModified">
                        <span className="flex items-center space-x-2">
                          <Calendar className="text-gray-500" size={15} />
                          <span>Last Modified</span>
                        </span>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div
                className="flex cursor-pointer items-center pr-2"
                onClick={() =>
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                }
              >
                {sortOrder === 'asc' ? (
                  <ArrowUpWideNarrow size={18} />
                ) : (
                  <ArrowDownWideNarrow size={18} />
                )}
              </div>
            </div>
          </div>
        </div>
      </>
      <div className="mt-4">
        {loading ? (
          <div className="flex h-[calc(100vh-195px)] flex-col items-center justify-center">
            <Loader />
            <span className="sr-only">Loading...</span>
          </div>
        ) : isApiLoaded && uploadedFiles?.files?.length === 0 ? (
          <div className="flex h-[calc(100vh-210px)] flex-col items-center justify-center">
            <FileX2 size={60} color="grey" />
            <span className="mt-4 block text-lg">No files found.</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
              {uploadedFiles?.files?.map((file: UploadFile) => (
                <div
                  key={file?.url}
                  className="h-[200px] overflow-hidden rounded-lg border bg-gray-200 duration-300 ease-in-out hover:bg-gray-300"
                >
                  <div className="flex justify-between px-3 py-3">
                    <span
                      title={file?.name}
                      className="block truncate pr-3 text-xs"
                    >
                      {file?.name}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="cursor-pointer outline-none">
                        <EllipsisVertical
                          size={14}
                          color="black"
                          strokeWidth={0.5}
                          absoluteStrokeWidth
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => window.open(file?.url)}
                        >
                          <ExternalLink /> Open File
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => openDetailsDialog(file)}
                        >
                          <FileText /> Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => copyUrl(file?.url)}
                        >
                          <Copy /> Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => openDeleteDialog(file)}
                        >
                          <Trash2 /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div
                    className="relative m-3 mt-0 flex h-[calc(100%-53px)] max-w-full items-center justify-center overflow-hidden rounded-sm bg-white"
                    onDoubleClick={() => window.open(file?.url)}
                  >
                    {renderFileIcon(file)}
                  </div>
                </div>
              ))}
            </div>
            {uploadedFiles?.files?.length && (
              <div className="mt-4">
                <PaginationComponent {...pagination} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

interface FileDetailsProps {
  file: UploadFile;
}

const FileDetailsComponent: React.FC<FileDetailsProps> = ({ file }) => {
  const { data } = useQuery(GET_USER_QUERY, {
    variables: { id: file?.userId },
  });

  return (
    <div>
      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">File Details</TabsTrigger>
          <TabsTrigger value="uploadedby">Uploaded by</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
            <tbody>
              <tr className="even:bg-gray-35 odd:bg-white">
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-600">
                  Uploaded from
                </td>
                <td
                  className="max-w-[300px] truncate border border-gray-300 px-4 py-2"
                  title={file.appName}
                >
                  {file.appName}
                </td>
              </tr>
              <tr className="even:bg-gray-35 odd:bg-white">
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-600">
                  File type
                </td>
                <td
                  className="max-w-[300px] truncate border border-gray-300 px-4 py-2"
                  title={file.fileType}
                >
                  {file.fileType}
                </td>
              </tr>
              <tr className="even:bg-gray-35 odd:bg-white">
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-600">
                  Is private
                </td>
                <td
                  className="max-w-[300px] truncate border border-gray-300 px-4 py-2"
                  title={file.isPrivate ? 'Yes' : 'No'}
                >
                  {file.isPrivate ? 'Yes' : 'No'}
                </td>
              </tr>
              <tr className="even:bg-gray-35 odd:bg-white">
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-600">
                  Last modified
                </td>
                <td
                  className="max-w-[300px] truncate border border-gray-300 px-4 py-2"
                  title={dateFormat(file.lastModified)}
                >
                  {dateFormat(file.lastModified)}
                </td>
              </tr>
              <tr className="even:bg-gray-35 odd:bg-white">
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-600">
                  File Name
                </td>
                <td
                  className="max-w-[300px] truncate border border-gray-300 px-4 py-2"
                  title={file.name}
                >
                  {file.name}
                </td>
              </tr>
              <tr className="even:bg-gray-35 odd:bg-white">
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-600">
                  File URL
                </td>
                <td
                  className="max-w-[300px] truncate border border-gray-300 px-4 py-2"
                  title={file.url}
                >
                  <div className="flex">
                    <span className="max-w-[300px] truncate">{file.url}</span>
                    <span
                      title="Copy file URL"
                      className="cursor-pointer"
                      onClick={() => copyUrl(file?.url)}
                    >
                      <Copy size={14} />
                    </span>
                  </div>
                </td>
              </tr>

              <tr className="even:bg-gray-35 odd:bg-white">
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-600">
                  File Size
                </td>
                <td
                  className="max-w-[300px] truncate border border-gray-300 px-4 py-2"
                  title={bytesToKB(file.size)}
                >
                  {bytesToKB(file.size)}
                </td>
              </tr>
            </tbody>
          </table>
        </TabsContent>
        <TabsContent value="uploadedby">
          <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
            <tbody>
              <tr className="even:bg-gray-35 odd:bg-white">
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-600">
                  User Name
                </td>
                <td
                  className="max-w-[300px] truncate border border-gray-300 px-4 py-2"
                  title={data?.user.firstName}
                >
                  {data?.user.firstName}
                </td>
              </tr>
              <tr className="even:bg-gray-35 odd:bg-white">
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-600">
                  User ID
                </td>
                <td
                  className="max-w-[300px] truncate border border-gray-300 px-4 py-2"
                  title={data?.user.employeeId}
                >
                  {data?.user.employeeId}
                </td>
              </tr>
              <tr className="even:bg-gray-35 odd:bg-white">
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-600">
                  User Email ID
                </td>
                <td
                  className="max-w-[300px] truncate border border-gray-300 px-4 py-2"
                  title={data?.user.email}
                >
                  {data?.user.email}
                </td>
              </tr>
              <tr className="even:bg-gray-35 odd:bg-white">
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-600">
                  User is Admin
                </td>
                <td
                  className="max-w-[300px] truncate border border-gray-300 px-4 py-2"
                  title={data?.user.isAdmin ? 'Yes' : 'No'}
                >
                  {data?.user.isAdmin ? 'Yes' : 'No'}
                </td>
              </tr>
              <tr className="even:bg-gray-35 odd:bg-white">
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-600">
                  User Last updated at
                </td>
                <td
                  className="max-w-[300px] truncate border border-gray-300 px-4 py-2"
                  title={dateFormat(data?.user.updatedAt)}
                >
                  {dateFormat(data?.user.updatedAt)}
                </td>
              </tr>
            </tbody>
          </table>
        </TabsContent>
      </Tabs>
    </div>
  );
};
