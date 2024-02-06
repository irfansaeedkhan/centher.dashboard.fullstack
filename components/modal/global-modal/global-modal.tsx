import React, {
  useState,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { customLog } from "@/utils/custom.log";
import { WrongNetworkModal } from "./wrong-network";
import { WrongConnectedAccountModal } from "./wrong-connected-account";

export const MODAL_TYPES = {
  WRONG_NETWORK: "WRONG_NETWORK",
  WRONG_CONNECTED_ACCOUNT: "WRONG_CONNECTED_ACCOUNT",
} as const;

const MODAL_COMPONENTS: any = {
  [MODAL_TYPES.WRONG_NETWORK]: WrongNetworkModal,
  [MODAL_TYPES.WRONG_CONNECTED_ACCOUNT]: WrongConnectedAccountModal,
};

type GlobalModalContext = {
  MODAL_TYPES: typeof MODAL_TYPES;
  showModal: (modalType: keyof typeof MODAL_TYPES) => void;
  hideModal: (modalType: keyof typeof MODAL_TYPES) => void;
};

const initalState: GlobalModalContext = {
  MODAL_TYPES,
  showModal: () => {},
  hideModal: () => {},
};

interface BlobalModalProps {
  children: React.ReactNode;
}

const GlobalModalContext = createContext(initalState);
export const useGlobalModalContext = () => useContext(GlobalModalContext);

export const GlobalModal: React.FC<BlobalModalProps> = ({ children }) => {
  const [modals, setModals] = useState<
    {
      name: keyof typeof MODAL_TYPES;
      component: React.FC<any>;
    }[]
  >([]);

  const showModal = useCallback((_modalType: keyof typeof MODAL_TYPES) => {
    setModals((prev) => {
      const modal = prev.find((e) => e.name === _modalType);
      if (modal) {
        return prev;
      }

      if (!MODAL_TYPES[_modalType]) {
        customLog(["development", "staging"], `${_modalType} does not exist`);
        return prev;
      }

      const newModal = {
        name: _modalType,
        component: MODAL_COMPONENTS[_modalType],
      };

      return [...prev, newModal];
    });
  }, []);

  const hideModal = useCallback((_modalType: keyof typeof MODAL_TYPES) => {
    setModals((prev) => {
      const modal = prev.find((e) => e.name === _modalType);
      if (!modal) {
        return prev;
      }

      return prev.filter((e) => e.name !== _modalType);
    });
  }, []);

  const renderComponent = useMemo(() => {
    if (modals.length > 0) {
      const ModalComponent = modals[modals.length - 1].component;

      if (!ModalComponent) {
        return null;
      }

      return <ModalComponent id="global-modal" />;
    } else {
      return null;
    }
  }, [modals]);

  return (
    <GlobalModalContext.Provider
      value={{
        MODAL_TYPES,
        showModal,
        hideModal,
      }}
    >
      {renderComponent}
      {children}
    </GlobalModalContext.Provider>
  );
};
