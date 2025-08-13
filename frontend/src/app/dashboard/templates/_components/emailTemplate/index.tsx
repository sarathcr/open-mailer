'use client';
import { Button } from '@/components/ui/button';
type EmailTemplateProps = {
  handleSave: () => void; // Directly passing FormState
  compiledHtml: string;
  isModified: boolean;
  loading: boolean;
};

const EmailTemplate = ({
  compiledHtml,
  handleSave,
  isModified = false,
  loading,
}: EmailTemplateProps) => {
  return (
    <>
      <div
        className="max-h-[calc(100vh-250px)] overflow-auto bg-gray-100"
        dangerouslySetInnerHTML={{ __html: compiledHtml }}
      />
      <div className="mt-3 flex justify-end gap-2 bg-gray-100 p-5">
        <div className="flex flex-col items-end">
          <Button onClick={handleSave} disabled={!isModified || loading}>
            Save
          </Button>
        </div>
      </div>
    </>
  );
};

export default EmailTemplate;
