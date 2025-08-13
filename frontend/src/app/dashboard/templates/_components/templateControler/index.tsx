'use client';
import {
  EmailTemplate,
  UpdateEmailTemplate,
} from '@/modules/template/gql/types';
import React from 'react';
import AccordionSection from '../AccordionSection';
import EditorBlock, { EditorBlockState } from '../editorBlock';
import LogoBlock, { LogoBlockFormValues } from '../logoBlock';

export const TemplateController: React.FC<{
  // eslint-disable-next-line no-unused-vars
  setTemplateData: (newState: UpdateEmailTemplate) => void;
  data: EmailTemplate;
  formData: UpdateEmailTemplate;
  placeholders: string[];
}> = ({ setTemplateData, formData, placeholders }) => {
  const handleSecondaryFormChange = (newState: LogoBlockFormValues) => {
    const updatedTemplateData: UpdateEmailTemplate = {
      ...formData,
      secondaryImageUrl: newState.imageUrl,
      secondaryLinkUrl: newState.linkUrl,
      secondaryBg: newState.bg,
    };
    setTemplateData(updatedTemplateData); // Update the state in the parent
  };

  const handlePrimaryFormChange = (newState: LogoBlockFormValues) => {
    const updatedTemplateData: UpdateEmailTemplate = {
      ...formData,
      primaryImageUrl: newState.imageUrl,
      primaryLinkUrl: newState.linkUrl,
      primaryBg: newState.bg,
    };
    setTemplateData(updatedTemplateData); // Update the state in the parent
  };

  const handleEditorFormChange = (newState: EditorBlockState) => {
    const updatedTemplateData: UpdateEmailTemplate = {
      ...formData,
      footerContent: newState.footerContent,
    };
    setTemplateData(updatedTemplateData); // Update the state in the parent
  };
  const alertMessage = 'Edit not supported for this custom base template';

  return (
    <div className="flex h-full flex-col items-end justify-between">
      <div className="w-full">
        <AccordionSection
          blockName="Secondary"
          placeholders={placeholders}
          imageUrlKey="secondaryImageUrl"
          alertMessage={alertMessage}
        >
          <LogoBlock
            onSubmitFrom={handleSecondaryFormChange}
            blockName="Secondary"
            data={{
              imageUrl: formData?.secondaryImageUrl || '',
              linkUrl: formData?.secondaryLinkUrl || '',
              bg: formData?.secondaryBg || '',
            }}
            showEnableSwitch={true}
          />
        </AccordionSection>

        <AccordionSection
          blockName="Primary"
          placeholders={placeholders}
          imageUrlKey="primaryImageUrl"
          alertMessage={alertMessage}
          isActive={true}
        >
          <LogoBlock
            onSubmitFrom={handlePrimaryFormChange}
            blockName="Primary"
            data={{
              imageUrl: formData.primaryImageUrl || '',
              linkUrl: formData?.primaryLinkUrl || '',
              bg: formData?.primaryBg || '',
            }}
          />
        </AccordionSection>

        <AccordionSection
          blockName="Footer"
          placeholders={placeholders}
          imageUrlKey="footerContent"
          alertMessage={alertMessage}
        >
          <EditorBlock
            onSubmitFrom={handleEditorFormChange}
            data={{
              footerContent: formData?.footerContent || '',
            }}
          />
        </AccordionSection>
      </div>
    </div>
  );
};

export default TemplateController;
