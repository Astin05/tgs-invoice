import { create } from 'zustand';

interface DashboardStore {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  dateRange: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'last90days' | 'thisMonth' | 'lastMonth' | 'thisYear';
  setDateRange: (range: DashboardStore['dateRange']) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  dateRange: 'last30days',
  setDateRange: (range) => set({ dateRange: range }),
}));
