import { create } from 'zustand';

export const LANGUAGES = [
  { code: 'en',  label: 'English',    native: 'English'  },
  { code: 'hi',  label: 'Hindi',      native: 'हिंदी'     },
  { code: 'gu',  label: 'Gujarati',   native: 'ગુજરાતી'   },
  { code: 'ur',  label: 'Urdu',       native: 'اردو'      },
  { code: 'mr',  label: 'Marathi',    native: 'मराठी'     },
];

const useAppStore = create((set, get) => ({
  // Auth
  currentUser: null,
  currentRole: null,

  login: (user, role) => set({ currentUser: user, currentRole: role }),
  logout: () => set({ currentUser: null, currentRole: null }),

  // Language
  language: 'en',
  setLanguage: (code) => set({ language: code }),

  // Toast notifications
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Date.now();
    set(s => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), 4000);
  },
  removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}));

export default useAppStore;
