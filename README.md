# Lola y Mario: Guardianes del bosque

Base en React para un cuento interactivo infantil de 17 escenas. La experiencia
usa las animaciones y personajes entregados, funciona con teclado y pantalla
táctil, y conserva el progreso únicamente en el navegador del dispositivo.

## Entorno verificado

- Node.js 24.16.0 (el proyecto requiere 22.13.0 o superior)
- npm 11.13.0
- React 19.2.8 y React DOM 19.2.8
- Next.js 16.3.1 sobre vinext 1.0.0-beta.6 y Vite 8.2.1
- TypeScript 5.9.3 con modo estricto
- Lucide React para los iconos de interfaz

## Ejecutar el proyecto

```bash
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:3000`.

Comprobaciones disponibles:

```bash
npm run typecheck
npm run lint
npm test
```

## Despliegue

El proyecto mantiene dos salidas de compilación:

```bash
npm run build:sites   # vinext/Cloudflare, genera dist/
npm run build:vercel # Next.js nativo, genera .next/
```

`vercel.json` configura automáticamente Vercel para utilizar el build nativo
de Next.js. En el panel de Vercel, el Framework Preset debe ser `Next.js` y el
Output Directory debe permanecer sin override para que use `.next`.

## Arquitectura

```text
app/
  components/story/
    StoryExperience.tsx    # lector, video, navegación y ajustes
  features/story/
    story.data.ts          # guion y relación escena/animación
    story.reducer.ts       # transiciones de estado predecibles
    story.types.ts         # contrato del dominio
    StoryProvider.tsx      # estado compartido y progreso local
  globals.css              # sistema visual y comportamiento responsive
  layout.tsx               # idioma, metadatos e iconos
  page.tsx                 # composición de la experiencia
public/assets/             # videos, personajes e iconos entregados
tests/                     # verificación del render y de los 17 medios
```

El contenido está separado de la interfaz. Para ajustar el guion, los títulos o
el orden de los videos, se edita `app/features/story/story.data.ts`. Los cambios
de navegación se concentran en `story.reducer.ts`; así se evita repartir reglas
de negocio entre componentes visuales.

## Principios aplicados

- Una escena y una acción principal a la vez, con navegación consistente y
  reversible.
- Controles táctiles grandes, foco visible, navegación por teclado y estructura
  semántica.
- Sonido apagado al entrar, pausa siempre disponible y respeto por la preferencia
  del sistema para reducir movimiento.
- Texto equivalente junto a cada animación, tamaño ajustable y modo de mayor
  contraste.
- Sin cuentas, publicidad, analítica, geolocalización ni recolección de datos.
  El avance y las preferencias solo se guardan en `localStorage`.
- Autonomía sin presión: se puede volver, pausar o reiniciar y no hay recompensas
  manipulativas ni límites de tiempo.

Estas decisiones siguen WCAG 2.2 para controles y movimiento, el enfoque de
bienestar infantil RITEC de UNICEF, el código de diseño apropiado para niños del
ICO y el patrón oficial de React de reducer más contexto.

## Próximos pasos recomendados

1. Confirmar la edad objetivo y validar el vocabulario con docentes o familias.
2. Revisar el guion preliminar y comprobar que cada texto corresponde a su video.
3. Incorporar narración final y subtítulos WebVTT sincronizados.
4. Definir si el cuento será lineal o tendrá decisiones que cambien la ruta.
5. Crear imágenes de portada para los videos y una versión WebM cuando aporte
   una reducción real de peso.
6. Probar la experiencia con niños y adultos responsables en móvil, tableta y
   escritorio antes de publicar.

## Referencias

- [UNICEF RITEC Design Toolbox](https://www.unicef.org/childrightsandbusiness/workstreams/responsible-technology/online-gaming/ritec-design-toolbox)
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C: tamaño mínimo de objetivos](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [ICO: Age Appropriate Design Code](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/)
- [React: reducer y contexto](https://react.dev/learn/scaling-up-with-reducer-and-context)
