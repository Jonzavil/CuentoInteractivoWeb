import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";
import "@fontsource/nunito/800.css";
import "@fontsource/open-sans/400.css";
import "./globals.css";

const SITE_TITLE = "Lola y Mario: Guardianes del bosque";
const SITE_DESCRIPTION =
  "Un cuento interactivo para explorar, escuchar y cuidar el bosque junto a Lola y Mario.";

function getRequestOrigin(requestHeaders: Headers) {
  const forwardedHost = requestHeaders
    .get("x-forwarded-host")
    ?.split(",")[0]
    .trim();
  const host = forwardedHost || requestHeaders.get("host") || "localhost:3000";
  const forwardedProtocol = requestHeaders
    .get("x-forwarded-proto")
    ?.split(",")[0]
    .trim();
  const protocol =
    forwardedProtocol === "http" || forwardedProtocol === "https"
      ? forwardedProtocol
      : host.startsWith("localhost")
        ? "http"
        : "https";

  try {
    return new URL(`${protocol}://${host}`);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const metadataBase = getRequestOrigin(requestHeaders);
  const socialImage = new URL("/og.png", metadataBase).toString();

  return {
    metadataBase,
    title: {
      default: SITE_TITLE,
      template: "%s | Guardianes del bosque",
    },
    description: SITE_DESCRIPTION,
    icons: {
      icon: "/assets/Iconos/Recurso 2@450x.png",
      shortcut: "/assets/Iconos/Recurso 2@450x.png",
    },
    openGraph: {
      type: "website",
      locale: "es_EC",
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: [{ url: socialImage, alt: SITE_TITLE }],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: [socialImage],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#4b8b58",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
