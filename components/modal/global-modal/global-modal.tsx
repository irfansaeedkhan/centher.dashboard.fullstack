import React, { useState, createContext, useContext, useMemo } from "react";
import { WrongNetworkModal } from "./wrong-network";

export const MODAL_TYPES = {
  WRONG_NETWORK: "WRONG_NETWORK",
};

const MODAL_COMPONENTS: any = {
  [MODAL_TYPES.WRONG_NETWORK]: WrongNetworkModal,
};

type GlobalModalContext = {
  showModal: (modalType: string) => void;
  hideModal: () => void;
};

const initalState: GlobalModalContext = {
  showModal: () => {},
  hideModal: () => {},
};

interface BlobalModalProps {
  children: React.ReactNode;
}

const GlobalModalContext = createContext(initalState);
export const useGlobalModalContext = () => useContext(GlobalModalContext);

export const GlobalModal: React.FC<BlobalModalProps> = ({ children }) => {
  const [modalType, setModalType] = useState<string | null>(null);

  const showModal = (_modalType: string) => {
    setModalType(_modalType);
  };

  const hideModal = () => {
    setModalType(null);
  };

  const renderComponent = useMemo(() => {
    if (modalType) {
      const ModalComponent = MODAL_COMPONENTS[modalType];
      if (!modalType || !ModalComponent) {
        return null;
      }
      return <ModalComponent id="global-modal" />;
    }
  }, [modalType]);

  return (
    <GlobalModalContext.Provider value={{ showModal, hideModal }}>
      {renderComponent}
      {children}
    </GlobalModalContext.Provider>
  );
};
