import { STORY_SCENES } from "./story.data";
import type { StoryAction, StoryState } from "./story.types";

const DEFAULT_PREFERENCES: StoryState["preferences"] = {
  muted: true,
  reducedMotion: false,
  highContrast: false,
  textScale: "normal",
};

export function createInitialStoryState(): StoryState {
  return {
    currentView: "cuento",
    currentSceneIndex: 0,
    isPlaying: false,
    hasHydrated: false,
    preferences: DEFAULT_PREFERENCES,
  };
}

function clampSceneIndex(index: number) {
  return Math.min(Math.max(0, index), STORY_SCENES.length - 1);
}

export function storyReducer(
  state: StoryState,
  action: StoryAction,
): StoryState {
  switch (action.type) {
    case "HYDRATE": {
      const preferences = {
        ...state.preferences,
        ...action.payload.preferences,
      };

      return {
        ...state,
        currentSceneIndex: clampSceneIndex(
          action.payload.currentSceneIndex ?? state.currentSceneIndex,
        ),
        isPlaying: false,
        hasHydrated: true,
        preferences,
      };
    }
    case "SET_VIEW":
      return {
        ...state,
        currentView: action.payload,
        isPlaying: action.payload === "cuento" ? state.isPlaying : false,
      };
    case "NEXT_SCENE":
      return {
        ...state,
        currentSceneIndex: clampSceneIndex(state.currentSceneIndex + 1),
        isPlaying: false,
      };
    case "PREVIOUS_SCENE":
      return {
        ...state,
        currentSceneIndex: clampSceneIndex(state.currentSceneIndex - 1),
        isPlaying: false,
      };
    case "SET_PLAYING":
      return { ...state, isPlaying: action.payload };
    case "TOGGLE_MUTED":
      return {
        ...state,
        preferences: {
          ...state.preferences,
          muted: !state.preferences.muted,
        },
      };
    case "SET_REDUCED_MOTION":
      return {
        ...state,
        isPlaying: action.payload ? false : state.isPlaying,
        preferences: {
          ...state.preferences,
          reducedMotion: action.payload,
        },
      };
    case "SET_HIGH_CONTRAST":
      return {
        ...state,
        preferences: {
          ...state.preferences,
          highContrast: action.payload,
        },
      };
    case "SET_TEXT_SCALE":
      return {
        ...state,
        preferences: {
          ...state.preferences,
          textScale: action.payload,
        },
      };
    case "RESTART":
      return {
        ...state,
        currentView: "cuento",
        currentSceneIndex: 0,
        isPlaying: false,
      };
    default:
      return state;
  }
}
