'use client';
import Uppy from '@uppy/core';
import { useEffect, useState } from 'react';
import Dashboard from '@uppy/react/lib/Dashboard';
import { Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import XHRUpload from '@uppy/xhr-upload';
import ImageEditor from '@uppy/image-editor';
import ScreenCapture from '@uppy/screen-capture';
import Webcam from '@uppy/webcam';
import Audio from '@uppy/audio';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/image-editor/dist/style.min.css';
import '@uppy/screen-capture/dist/style.min.css';
import '@uppy/webcam/dist/style.min.css';
import '@uppy/audio/dist/style.min.css';

type UppyMeta = {
  type?: string;
  appName: string;
  isPrivate: boolean;
};

function createUppy() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'mailer';
  const uppy = new Uppy<UppyMeta>({
    meta: { isPrivate: false, appName },
    restrictions: {
      maxNumberOfFiles: 3,
      maxFileSize: 5000000,
    },
    autoProceed: false,
  });

  // Use the XHRUpload plugin for file upload
  uppy
    .use(XHRUpload, {
      endpoint: 'http://localhost:5000/uploads',
      fieldName: 'file',
      formData: true,
      withCredentials: true, // cors issue in gateway when enabling withCredentials
      allowedMetaFields: ['isPrivate', 'appName'], // Include 'isPrivate' in the upload request
    })
    .use(ImageEditor)
    .use(Webcam)
    .use(ScreenCapture)
    .use(Audio);

  uppy.on('complete', (result) => {
    console.log('Upload complete! Files:', result.successful);
  });

  return uppy;
}

export default function UppyDashboard() {
  const [uppy, setUppy] = useState<Uppy<UppyMeta> | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    const newUppy = createUppy();
    setUppy(newUppy);
    console.log(window.location.hostname);
    return () => {
      if (newUppy) {
        newUppy.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (uppy) {
      uppy.setMeta({ isPrivate }); // Update meta dynamically without recreating
    }
  }, [isPrivate, uppy]);

  return (
    <div className="m-10 space-y-6">
      <h2 className="text-2xl font-semibold">Upload Files</h2>
      <div className="mt-5 flex items-center">
        <label htmlFor="isPrivate" className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">Is Private</span>
          <Switch
            id="isPrivate"
            checked={isPrivate}
            onCheckedChange={(checked) => setIsPrivate(checked === true)}
          />
        </label>

        <Info
          className={`text-xs ${isPrivate ? 'text-gray-700' : 'text-gray-500'} ml-4 mr-2 h-3 w-3`}
        />
        <p
          className={`text-xs ${isPrivate ? 'text-gray-700' : 'text-gray-500'} font-medium`}
          style={{ whiteSpace: 'nowrap' }}
        >
          {isPrivate
            ? 'This file will require authentication for access.'
            : 'This file will be accessible without authentication.'}
        </p>
      </div>
      {uppy && <Dashboard uppy={uppy} width={'100%'} />}
    </div>
  );
}
