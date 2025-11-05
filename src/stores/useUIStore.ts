import { create } from 'zustand';
import { UIState } from '@types/index';

interface UIStore extends UIState {
  // Actions
  setLoading: (loading: boolean) => void;
  showModal: (modal: string | null) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  hideToast: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentScreen: (screen: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  loading: false,
  activeModal: null,
  toast: null,
  sidebarOpen: false,
  currentScreen: 'home',

  // Actions
  setLoading: (loading) => set({ loading }),

  showModal: (modal) => set({ activeModal: modal }),

  showToast: (message, type = 'info') =>
    set({
      toast: {
        show: true,
        message,
        type,
      },
    }),

  hideToast: () => set({ toast: null }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  setCurrentScreen: (screen) => set({ currentScreen: screen }),
}));

// Selectors
export const useLoading = () => useUIStore((state) => state.loading);
export const useActiveModal = () => useUIStore((state) => state.activeModal);
export const useToast = () => useUIStore((state) => state.toast);
export const useSidebarOpen = () => useUIStore((state) => state.sidebarOpen);
export const useCurrentScreen = () => useUIStore((state) => state.currentScreen);

// Utility hooks
export const useShowToast = () => {
  const showToast = useUIStore((state) => state.showToast);
  const hideToast = useUIStore((state) => state.hideToast);

  return (message: string, type?: 'success' | 'error' | 'info' | 'warning', duration = 3000) => {
    showToast(message, type);
    setTimeout(hideToast, duration);
  };
};

export const useShowModal = () => {
  const showModal = useUIStore((state) => state.showModal);
  const hideToast = useUIStore((state) => state.hideToast);

  return (modal: string | null) => {
    showModal(modal);
    if (modal) {
      hideToast(); // Hide toast when showing modal
    }
  };
};