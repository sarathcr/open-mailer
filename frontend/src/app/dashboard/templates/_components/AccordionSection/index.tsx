import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { TriangleAlert } from 'lucide-react';
import React, { useEffect } from 'react';

type AccordionSectionProps = {
  blockName: string;
  placeholders: string[];
  imageUrlKey: string;
  alertMessage: string;
  isActive?: boolean;
  children: React.ReactNode;
};

export const AccordionSection: React.FC<AccordionSectionProps> = ({
  blockName,
  placeholders,
  imageUrlKey,
  alertMessage,
  isActive,
  children,
}) => {
  const isPlaceholderIncluded = placeholders.includes(`{{${imageUrlKey}}}`);
  const [accordionValue, setAccordionValue] = React.useState<
    string | undefined
  >(isPlaceholderIncluded && isActive ? blockName : undefined);

  useEffect(() => {
    setAccordionValue(
      isPlaceholderIncluded && isActive ? blockName : undefined
    );
  }, [isPlaceholderIncluded, isActive, blockName]);

  const handleValueChange = (newValue: string | undefined) =>
    setAccordionValue(newValue === accordionValue ? undefined : newValue);

  return (
    <Accordion
      type="single"
      collapsible
      value={accordionValue}
      onValueChange={handleValueChange}
    >
      <AccordionItem value={blockName}>
        <AccordionTrigger
          className="px-5 hover:no-underline"
          disabled={!isPlaceholderIncluded}
        >
          {`Edit ${blockName} logo (${
            isPlaceholderIncluded ? 'Optional' : 'Not supported'
          })`}
          {!isPlaceholderIncluded && (
            <span title={alertMessage}>
              <TriangleAlert color="#FF9800" />
            </span>
          )}
        </AccordionTrigger>
        <AccordionContent className="px-5">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AccordionSection;
