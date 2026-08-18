import type { Metadata } from "next";
import { StoryExperience } from "./components/story/StoryExperience";
import { StoryProvider } from "./features/story/StoryProvider";

export const metadata: Metadata = {
  title: "Lola y Mario: Guardianes del bosque",
  description:
    "Un cuento interactivo para explorar, escuchar y cuidar el bosque junto a Lola y Mario.",
};

export default function Home() {
  return (
    <StoryProvider>
      <StoryExperience />
    </StoryProvider>
  );
}
