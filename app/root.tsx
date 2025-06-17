import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { MetaFunction } from "@remix-run/node";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const meta: MetaFunction = () => {
  return [
    { title: "티비넷 요금 계산기" },
    { name: "description", content: "TV 수만 입력하면 인터넷 요금 자동 계산" },
    { property: "og:title", content: "티비넷 요금 계산기" },
    { property: "og:description", content: "모텔, 호텔 객실 수만 입력하세요. 인터넷 요금 자동 계산기" },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "https://tv-plus-calculator-ljd8.vercel.app/og-image.jpg" },
    { property: "og:url", content: "https://tv-plus-calculator-ljd8.vercel.app/" },
    { name: "twitter:card", content: "summary" }
  ];
};


export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
