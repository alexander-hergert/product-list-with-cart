import { createContext, useState } from "react";
import { ReactNode } from "react";

interface ModalContextType {
  isModal: boolean;
  setIsModal: (isModal: boolean) => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModal, setIsModal] = useState<boolean>(false);

  return (
    <ModalContext.Provider value={{ isModal, setIsModal }}>
      {children}
    </ModalContext.Provider>
  );
};
