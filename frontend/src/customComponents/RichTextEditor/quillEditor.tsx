import { textContentSchema } from '@/modules/smtp/schemas/flexibleContent.schema';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import React, { useEffect, useRef, useState } from 'react';
import { z } from 'zod';

interface QuillEditorProps {
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  // eslint-disable-next-line no-unused-vars
  onError?: (error: string | null) => void;
  placeholder?: string;
}

const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  onError,
  placeholder,
}) => {
  const quillRef = useRef<HTMLDivElement | null>(null);
  const [quillInstance, setQuillInstance] = useState<Quill | null>(null);

  const validate = (content: string) => {
    try {
      textContentSchema.parse(content);
      if (onError) onError(null);
    } catch (error) {
      if (onError && error instanceof z.ZodError) {
        onError(error.errors[0].message);
      }
    }
  };

  useEffect(() => {
    if (!quillRef.current || quillInstance) return;
    const quill = new Quill(quillRef.current, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link'],
          ['clean'],
        ],
      },
      placeholder: placeholder || 'Edit footer html/text here...',
    });

    setQuillInstance(quill);

    quill.root.innerHTML = value;
    quill.on('text-change', () => {
      const content = quill.root.innerHTML;
      onChange(content);
      validate(content);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, quillInstance, onChange, placeholder]);

  return <div ref={quillRef} style={{ height: '300px' }} />;
};

export default QuillEditor;
