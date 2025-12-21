import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { LoginModal, RegisterModal, AccountSettings } from '../components/auth';

type ActiveModal = 'login' | 'register' | 'settings' | null;

interface ModalContextValue {
  activeModal: ActiveModal;
  openLogin: () => void;
  openRegister: () => void;
  openSettings: () => void;
  closeAll: () => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

interface ModalProviderProps {
  children: React.ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps): React.ReactElement {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const openLogin = useCallback(() => setActiveModal('login'), []);
  const openRegister = useCallback(() => setActiveModal('register'), []);
  const openSettings = useCallback(() => setActiveModal('settings'), []);
  const closeAll = useCallback(() => setActiveModal(null), []);

  const handleSwitchToRegister = useCallback(() => {
    setActiveModal('register');
  }, []);

  const handleSwitchToLogin = useCallback(() => {
    setActiveModal('login');
  }, []);

  const contextValue = useMemo<ModalContextValue>(() => ({
    activeModal,
    openLogin,
    openRegister,
    openSettings,
    closeAll,
  }), [activeModal, openLogin, openRegister, openSettings, closeAll]);

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      
      <LoginModal
        isOpen={activeModal === 'login'}
        onClose={closeAll}
        onSwitchToRegister={handleSwitchToRegister}
      />

      <RegisterModal
        isOpen={activeModal === 'register'}
        onClose={closeAll}
        onSwitchToLogin={handleSwitchToLogin}
      />

      <AccountSettings
        isOpen={activeModal === 'settings'}
        onClose={closeAll}
      />
    </ModalContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useModal(): ModalContextValue {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
