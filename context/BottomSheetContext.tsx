import BottomSheetInternal from "@/components/ui/BottomSheet";
import React, { createContext, useCallback, useContext, useState } from "react";

type BottomSheetContextType = {
  open: (content: React.ReactNode) => void;
  close: () => void;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined
);

export function useBottomSheet() {
  const ctx = useContext(BottomSheetContext);
  if (!ctx)
    throw new Error("useBottomSheet must be used inside BottomSheetProvider");
  return ctx;
}

export const BottomSheetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);

  const open = useCallback((newContent: React.ReactNode) => {
    setIsOpen(true);
    setTimeout(() => {
      setContent(newContent);
    }, 100);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setContent(null), 500); // delay cleanup after close anim
  }, []);

  return (
    <BottomSheetContext.Provider value={{ open, close }}>
      {children}
      <BottomSheetInternal isOpen={isOpen} onClose={close}>
        {content}
      </BottomSheetInternal>
    </BottomSheetContext.Provider>
  );
};
