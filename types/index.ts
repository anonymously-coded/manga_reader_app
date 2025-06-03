// Shortcut types
export interface ShortcutStatus {
  lastChecked: string;
  hasNextPage: boolean;
  hasError: boolean;
}

export interface ShortcutType {
  id: string;
  name: string;
  url: string;
  icon: string; // Index of the icon to use
  createdAt: string;
  status?: ShortcutStatus;
}

export interface ShortcutFormData {
  name: string;
  url: string;
  icon: string;
}