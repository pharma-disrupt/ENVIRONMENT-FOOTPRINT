import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  theme: 'light' | 'dark';
  activeModal: string | null;
  toasts: Toast[];
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isMobileMenuOpen: false,
  theme: 'light',
  activeModal: null,
  toasts: [],

  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  toggleMobileMenu: () => {
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
  },

  setTheme: (theme) => {
    set({ theme });
    // Apply theme to document
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  },

  openModal: (modalId: string) => {
    set({ activeModal: modalId });
  },

  closeModal: () => {
    set({ activeModal: null });
  },

  addToast: (toast) => {
    const id = crypto.randomUUID();
    const newToast: Toast = { id, duration: 5000, ...toast };
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    // Auto-remove after duration
    if (newToast.duration) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, newToast.duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));
