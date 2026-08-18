"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import { createInitialStoryState, storyReducer } from "./story.reducer";
import type {
  StoryAction,
  StoryPreferences,
  StoryState,
} from "./story.types";

const STORAGE_KEY = "guardianes-del-bosque:progress:v1";

interface PersistedStoryState {
  currentSceneIndex: number;
  preferences: StoryPreferences;
}

interface StoryContextValue {
  state: StoryState;
  dispatch: Dispatch<StoryAction>;
}

const StoryContext = createContext<StoryContextValue | null>(null);

function readStoredState(): Partial<PersistedStoryState> | null {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) return null;

    const value = JSON.parse(rawValue) as Partial<PersistedStoryState>;
    if (
      value.currentSceneIndex !== undefined &&
      !Number.isInteger(value.currentSceneIndex)
    ) {
      return null;
    }

    return value;
  } catch {
    return null;
  }
}

export function StoryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    storyReducer,
    undefined,
    createInitialStoryState,
  );

  useEffect(() => {
    const storedState = readStoredState();
    const systemPrefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    dispatch({
      type: "HYDRATE",
      payload: {
        ...storedState,
        preferences: {
          ...storedState?.preferences,
          reducedMotion:
            storedState?.preferences?.reducedMotion ??
            systemPrefersReducedMotion,
        },
      },
    });
  }, []);

  useEffect(() => {
    if (!state.hasHydrated) return;

    const persistedState: PersistedStoryState = {
      currentSceneIndex: state.currentSceneIndex,
      preferences: state.preferences,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState));
  }, [state.currentSceneIndex, state.hasHydrated, state.preferences]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <StoryContext.Provider value={value}>{children}</StoryContext.Provider>
  );
}

export function useStory() {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("useStory must be used inside StoryProvider");
  }

  return context;
}
