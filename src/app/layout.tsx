"use client";
import { CustomizationProvider } from "@twilio-paste/customization";
import { JSX } from "react";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html>
      <head>
        <link
          rel="preconnect"
          href="https://assets.twilio.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://assets.twilio.com/public_assets/paste-fonts/1.5.2/fonts.css"
        />
        <link rel="stylesheet" href="/styles.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <main>
          <CustomizationProvider
            baseTheme="dark"
            theme={{
              backgroundColors: {
                colorBackgroundBody: "#000D27",
              },
            }}
          >
            {children}
          </CustomizationProvider>
        </main>
      </body>
    </html>
  );
}
