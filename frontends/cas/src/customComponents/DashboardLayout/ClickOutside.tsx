'use client';

import React, { useRef, useEffect } from 'react';

interface Props {
  children: React.ReactNode;
  exceptionRef?: React.RefObject<HTMLElement>;
  onClick: () => void;
  className?: string;
}

const ClickOutside: React.FC<Props> = ({
  children,
  exceptionRef,
  onClick,
  className,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickListener = (event: MouseEvent) => {
      let clickedInside: null | boolean = false;
      if (exceptionRef) {
        clickedInside =
          (wrapperRef.current?.contains(event.target as Node) ?? false) ||
          exceptionRef.current === event.target ||
          (exceptionRef.current?.contains(event.target as Node) ?? false);
      } else {
        clickedInside =
          wrapperRef.current?.contains(event.target as Node) ?? false;
      }

      if (!clickedInside) onClick();
    };

    document.addEventListener('mousedown', handleClickListener);

    return () => {
      document.removeEventListener('mousedown', handleClickListener);
    };
  }, [exceptionRef, onClick]);

  return (
    <div ref={wrapperRef} className={`${className ?? ''}`}>
      {children}
    </div>
  );
};

export default ClickOutside;
