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
  | { type: "choice"; prompt: string; options: readonly string[] }
  | {
      type: "click-word";
      word: "SIERRA";
      suffix: "ECUATORIANA";
      clickGoals: readonly [1, 2, 3, 4, 5, 6, 5];
    }
  | { type: "ending"; word: "SIERRA" };

export interface StoryCopyBlock {
  text: string;
  top: number;
  left: number;
  width: number;
  align: "left" | "center" | "right";
  tone: "light" | "dark";
}

export interface StoryScene {
  id: string;
  title: string;
  videoSrc: string;
  toneSrc?: string;
  posterSrc?: string;
  copyBlocks: readonly StoryCopyBlock[];
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
