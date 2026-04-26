// AppStore is a tiny global state container that wraps mock data and persists
// favorites/history/preferences to AsyncStorage. Screens consume it through the
// `useAppStore` hook.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SEED_CONTACTS,
  SEED_MEETINGS,
  SEED_RECORDINGS,
  SEED_NOTIFICATIONS,
  SEED_CHAT,
  SEED_PROFILE,
  SEED_PREFERENCES,
  SEED_FAVORITE_ROOMS,
  SEED_RECENT_ROOMS,
  SEED_INTEGRATIONS,
  SEED_ANNOUNCEMENTS,
  SEED_TIPS,
} from '@/mock/seedData';
import type { Contact, Meeting, Recording, ChatMessage, Notification, UserProfile, UserPreferences, ID } from '@/types';

interface FavoriteRoom { id: string; code: string; label: string; color: string }
interface RecentRoom extends FavoriteRoom { joinedAt: string }
interface Integration { id: string; name: string; description: string; enabled: boolean }
interface Announcement { id: string; title: string; body: string }
interface Tip { id: string; title: string; body: string }

interface AppState {
  hydrated: boolean;
  profile: UserProfile;
  preferences: UserPreferences;
  contacts: Contact[];
  meetings: Meeting[];
  recordings: Recording[];
  notifications: Notification[];
  chat: Record<string, ChatMessage[]>;
  favorites: FavoriteRoom[];
  recentRooms: RecentRoom[];
  integrations: Integration[];
  announcements: Announcement[];
  tips: Tip[];
  searchHistory: string[];
}

type Action =
  | { type: 'HYDRATE'; payload: Partial<AppState> }
  | { type: 'TOGGLE_FAVORITE_CONTACT'; id: ID }
  | { type: 'TOGGLE_BLOCKED_CONTACT'; id: ID }
  | { type: 'UPDATE_PROFILE'; patch: Partial<UserProfile> }
  | { type: 'UPDATE_PREFERENCES'; patch: Partial<UserPreferences> }
  | { type: 'PUSH_RECENT_ROOM'; room: RecentRoom }
  | { type: 'TOGGLE_FAVORITE_ROOM'; room: FavoriteRoom }
  | { type: 'TOGGLE_INTEGRATION'; id: string }
  | { type: 'MARK_NOTIFICATION_READ'; id: ID }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'ADD_SEARCH_QUERY'; query: string };

const initialState: AppState = {
  hydrated: false,
  profile: SEED_PROFILE,
  preferences: SEED_PREFERENCES,
  contacts: SEED_CONTACTS,
  meetings: SEED_MEETINGS,
  recordings: SEED_RECORDINGS,
  notifications: SEED_NOTIFICATIONS,
  chat: SEED_CHAT,
  favorites: SEED_FAVORITE_ROOMS,
  recentRooms: SEED_RECENT_ROOMS,
  integrations: SEED_INTEGRATIONS,
  announcements: SEED_ANNOUNCEMENTS,
  tips: SEED_TIPS,
  searchHistory: [],
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload, hydrated: true };
    case 'TOGGLE_FAVORITE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map((c) => (c.id === action.id ? { ...c, favorite: !c.favorite } : c)),
      };
    case 'TOGGLE_BLOCKED_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map((c) => (c.id === action.id ? { ...c, blocked: !c.blocked } : c)),
      };
    case 'UPDATE_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.patch } };
    case 'UPDATE_PREFERENCES':
      return { ...state, preferences: { ...state.preferences, ...action.patch } };
    case 'PUSH_RECENT_ROOM': {
      const next = [action.room, ...state.recentRooms.filter((r) => r.code !== action.room.code)].slice(0, 25);
      return { ...state, recentRooms: next };
    }
    case 'TOGGLE_FAVORITE_ROOM': {
      const exists = state.favorites.some((f) => f.code === action.room.code);
      return {
        ...state,
        favorites: exists ? state.favorites.filter((f) => f.code !== action.room.code) : [action.room, ...state.favorites],
      };
    }
    case 'TOGGLE_INTEGRATION':
      return {
        ...state,
        integrations: state.integrations.map((i) => (i.id === action.id ? { ...i, enabled: !i.enabled } : i)),
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => (n.id === action.id ? { ...n, read: true } : n)),
      };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) };
    case 'ADD_SEARCH_QUERY':
      return {
        ...state,
        searchHistory: [action.query, ...state.searchHistory.filter((s) => s !== action.query)].slice(0, 10),
      };
    default:
      return state;
  }
}

interface StoreContextValue {
  state: AppState;
  toggleFavoriteContact: (id: ID) => void;
  toggleBlockedContact: (id: ID) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  updatePreferences: (patch: Partial<UserPreferences>) => void;
  pushRecentRoom: (room: RecentRoom) => void;
  toggleFavoriteRoom: (room: FavoriteRoom) => void;
  toggleIntegration: (id: string) => void;
  markNotificationRead: (id: ID) => void;
  clearNotifications: () => void;
  addSearchQuery: (query: string) => void;
  meetingById: (id: ID) => Meeting | undefined;
  contactById: (id: ID) => Contact | undefined;
  recordingById: (id: ID) => Recording | undefined;
  participantsForMeeting: (id: ID) => Contact[];
  upcomingMeetings: () => Meeting[];
  pastMeetings: () => Meeting[];
}

const StoreContext = createContext<StoreContextValue | null>(null);
const STORAGE_PREFIX = '@meetx/store/';

const PERSIST_KEYS: Array<keyof AppState> = [
  'profile',
  'preferences',
  'favorites',
  'recentRooms',
  'integrations',
  'searchHistory',
];

interface ProviderProps {
  children: React.ReactNode;
}

export const AppStoreProvider: React.FC<ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const hydratedRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const entries = await Promise.all(
          PERSIST_KEYS.map((key) =>
            AsyncStorage.getItem(STORAGE_PREFIX + key).then((value) => [key, value] as const)
          )
        );
        const payload: Partial<AppState> = {};
        for (const [key, raw] of entries) {
          if (raw == null) continue;
          try {
            (payload as Record<string, unknown>)[key as string] = JSON.parse(raw);
          } catch {
            // ignore corrupt values
          }
        }
        dispatch({ type: 'HYDRATE', payload });
      } catch {
        dispatch({ type: 'HYDRATE', payload: {} });
      }
      hydratedRef.current = true;
    })();
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    PERSIST_KEYS.forEach((key) => {
      const value = (state as unknown as Record<string, unknown>)[key as string];
      AsyncStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value)).catch(() => {});
    });
  }, [state]);

  const meetingById = useCallback(
    (id: ID) => state.meetings.find((m) => m.id === id),
    [state.meetings]
  );
  const contactById = useCallback(
    (id: ID) => state.contacts.find((c) => c.id === id),
    [state.contacts]
  );
  const recordingById = useCallback(
    (id: ID) => state.recordings.find((r) => r.id === id),
    [state.recordings]
  );
  const participantsForMeeting = useCallback(
    (id: ID) => {
      const m = state.meetings.find((m) => m.id === id);
      if (!m) return [];
      return m.participantIds
        .map((pid) => state.contacts.find((c) => c.id === pid))
        .filter((c): c is Contact => Boolean(c));
    },
    [state.meetings, state.contacts]
  );
  const upcomingMeetings = useCallback(
    () => state.meetings.filter((m) => Date.parse(m.startsAt) >= Date.now()),
    [state.meetings]
  );
  const pastMeetings = useCallback(
    () => state.meetings.filter((m) => Date.parse(m.startsAt) < Date.now()),
    [state.meetings]
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      state,
      toggleFavoriteContact: (id) => dispatch({ type: 'TOGGLE_FAVORITE_CONTACT', id }),
      toggleBlockedContact: (id) => dispatch({ type: 'TOGGLE_BLOCKED_CONTACT', id }),
      updateProfile: (patch) => dispatch({ type: 'UPDATE_PROFILE', patch }),
      updatePreferences: (patch) => dispatch({ type: 'UPDATE_PREFERENCES', patch }),
      pushRecentRoom: (room) => dispatch({ type: 'PUSH_RECENT_ROOM', room }),
      toggleFavoriteRoom: (room) => dispatch({ type: 'TOGGLE_FAVORITE_ROOM', room }),
      toggleIntegration: (id) => dispatch({ type: 'TOGGLE_INTEGRATION', id }),
      markNotificationRead: (id) => dispatch({ type: 'MARK_NOTIFICATION_READ', id }),
      clearNotifications: () => dispatch({ type: 'CLEAR_NOTIFICATIONS' }),
      addSearchQuery: (query) => dispatch({ type: 'ADD_SEARCH_QUERY', query }),
      meetingById,
      contactById,
      recordingById,
      participantsForMeeting,
      upcomingMeetings,
      pastMeetings,
    }),
    [state, meetingById, contactById, recordingById, participantsForMeeting, upcomingMeetings, pastMeetings]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export function useAppStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useAppStore must be used within AppStoreProvider');
  }
  return ctx;
}
