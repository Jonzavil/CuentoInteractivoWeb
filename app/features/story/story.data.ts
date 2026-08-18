import type { StoryScene } from "./story.types";

export const STORY_TITLE = "Lola y Mario: Guardianes del bosque";

export const STORY_SCENES = [
  {
    id: "una-mision-especial",
    title: "Una misión especial",
    narration:
      "Lola y Mario llegaron al sendero con una pregunta: ¿cómo podían ayudar a cuidar aquel bosque lleno de vida?",
    videoSrc: "/assets/ANIMACIONES/P1.mp4",
  },
  {
    id: "una-pluma-verde",
    title: "Una pluma verde",
    narration:
      "Entre las hojas encontraron una pluma brillante. Era la primera pista de una aventura que apenas comenzaba.",
    videoSrc: "/assets/ANIMACIONES/P2.mp4",
  },
  {
    id: "el-guacamayo",
    title: "El guacamayo",
    narration:
      "Un guacamayo verde apareció entre las ramas. Con sus alas abiertas, los invitó a seguirlo por el bosque.",
    videoSrc: "/assets/ANIMACIONES/P3.mp4",
  },
  {
    id: "el-mensaje-del-bosque",
    title: "El mensaje del bosque",
    narration:
      "El guacamayo tenía algo importante que contar: muchos animales necesitaban un lugar seguro para vivir.",
    videoSrc: "/assets/ANIMACIONES/P4.mp4",
  },
  {
    id: "huellas-en-el-camino",
    title: "Huellas en el camino",
    narration:
      "Mario descubrió unas huellas redondas sobre la tierra húmeda. Todos avanzaron despacio para no asustar a su dueño.",
    videoSrc: "/assets/ANIMACIONES/P5.mp4",
  },
  {
    id: "un-nuevo-amigo",
    title: "Un nuevo amigo",
    narration:
      "Las huellas pertenecían a un oso de anteojos. Parecía tímido, pero pronto comprendió que Lola y Mario querían ayudar.",
    videoSrc: "/assets/ANIMACIONES/P6.mp4",
  },
  {
    id: "un-hogar-que-cuidar",
    title: "Un hogar que cuidar",
    narration:
      "El oso les mostró los árboles, las flores y el agua que daban alimento y refugio a todos los habitantes del bosque.",
    videoSrc: "/assets/ANIMACIONES/P7.mp4",
  },
  {
    id: "la-idea-de-lola",
    title: "La idea de Lola",
    narration:
      "Lola observó cada detalle y tuvo una idea: podían recuperar el sendero sin molestar a los animales.",
    videoSrc: "/assets/ANIMACIONES/P8.mp4",
  },
  {
    id: "semillas-para-el-futuro",
    title: "Semillas para el futuro",
    narration:
      "Juntos reunieron semillas de plantas nativas. Cada una guardaba la promesa de una nueva hoja, una flor o un fruto.",
    videoSrc: "/assets/ANIMACIONES/P9.mp4",
  },
  {
    id: "manos-a-la-obra",
    title: "Manos a la obra",
    narration:
      "Mario preparó la tierra mientras Lola cuidaba las semillas. El guacamayo y el oso también encontraron una forma de colaborar.",
    videoSrc: "/assets/ANIMACIONES/P10.mp4",
  },
  {
    id: "cada-gota-cuenta",
    title: "Cada gota cuenta",
    narration:
      "El agua era valiosa, así que aprendieron a usar solo la necesaria. Cada gota ayudó a despertar una pequeña semilla.",
    videoSrc: "/assets/ANIMACIONES/P11.mp4",
  },
  {
    id: "una-lluvia-oportuna",
    title: "Una lluvia oportuna",
    narration:
      "Las nubes cubrieron el cielo y llegó una lluvia suave. El bosque parecía cantar con el sonido de las gotas.",
    videoSrc: "/assets/ANIMACIONES/P12.mp4",
  },
  {
    id: "el-bosque-responde",
    title: "El bosque responde",
    narration:
      "Pasaron los días y aparecieron los primeros brotes. Eran pequeños, pero estaban fuertes y llenos de color.",
    videoSrc: "/assets/ANIMACIONES/P13.mp4",
  },
  {
    id: "todos-tienen-un-lugar",
    title: "Todos tienen un lugar",
    narration:
      "Con nuevas plantas, regresaron insectos y aves. El sendero volvía a ser un hogar compartido.",
    videoSrc: "/assets/ANIMACIONES/P14.mp4",
  },
  {
    id: "la-promesa",
    title: "La promesa",
    narration:
      "Lola y Mario prometieron visitar el bosque y enseñar a otros que hasta las acciones pequeñas pueden proteger la naturaleza.",
    videoSrc: "/assets/ANIMACIONES/P15.mp4",
  },
  {
    id: "una-gran-celebracion",
    title: "Una gran celebración",
    narration:
      "El guacamayo voló sobre los árboles y el oso dio un alegre salto. Habían conseguido algo importante trabajando juntos.",
    videoSrc: "/assets/ANIMACIONES/P16.mp4",
  },
  {
    id: "el-bosque-sigue-hablando",
    title: "El bosque sigue hablando",
    narration:
      "La aventura terminó, pero el bosque siguió contando historias. Solo hacía falta escuchar y recordar que también es nuestro hogar.",
    videoSrc: "/assets/ANIMACIONES/P17.mp4",
  },
] as const satisfies readonly StoryScene[];
