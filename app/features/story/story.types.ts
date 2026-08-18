export type TextScale = "normal" | "large";

export type StoryView = "cuento" | "sinopsis" | "creditos" | "galeria";

export type CharacterId = "lola" | "mario" | "guacamayo" | "oso";

export type StoryInteraction =
  | { type: "characters" }
  | { type: "reveal"; label: string }
  | { type: "cipher"; word: "AYUDA" | "COSTA" | "SIERRA" }
  | { type: "character"; characterId: CharacterId; label: string }
  | { type: "papers" }
  | { type: "bear" }
  | { type: "ending"; word: "SIERRA" };

export interface StoryScene {
  id: string;
  title: string;
  narration: string;
  secondaryNarration?: string;
  videoSrc: string;
  posterSrc: string;
  copyPosition:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  copyTone: "light" | "dark";
  interaction?: StoryInteraction;
}

export interface StoryPreferences {
  muted: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  textScale: TextScale;
}

export interface StoryState {
  currentView: StoryView;
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
  | { type: "SET_VIEW"; payload: StoryView }
  | { type: "NEXT_SCENE" }
  | { type: "PREVIOUS_SCENE" }
  | { type: "SET_PLAYING"; payload: boolean }
  | { type: "TOGGLE_MUTED" }
  | { type: "SET_REDUCED_MOTION"; payload: boolean }
  | { type: "SET_HIGH_CONTRAST"; payload: boolean }
  | { type: "SET_TEXT_SCALE"; payload: TextScale }
  | { type: "RESTART" };
