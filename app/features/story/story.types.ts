export type TextScale = "normal" | "large";

export interface StoryScene {
  id: string;
  title: string;
  narration: string;
  videoSrc: string;
}

export interface StoryPreferences {
  muted: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  textScale: TextScale;
}

export interface StoryState {
  currentSceneIndex: number;
  isPlaying: boolean;
  hasHydrated: boolean;
  preferences: StoryPreferences;
}

export type StoryAction =
  | {
      type: "HYDRATE";
      payload: Partial<Pick<StoryState, "currentSceneIndex">> & {
        preferences?: Partial<StoryPreferences>;
      };
    }
  | { type: "NEXT_SCENE" }
  | { type: "PREVIOUS_SCENE" }
  | { type: "SET_PLAYING"; payload: boolean }
  | { type: "TOGGLE_MUTED" }
  | { type: "SET_REDUCED_MOTION"; payload: boolean }
  | { type: "SET_HIGH_CONTRAST"; payload: boolean }
  | { type: "SET_TEXT_SCALE"; payload: TextScale }
  | { type: "RESTART" };
