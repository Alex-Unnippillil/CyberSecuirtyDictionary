import { ReactNode } from "react";
import { appWithTranslation } from "next-i18next";
import i18nextConfig from "../../next-i18next.config";

type LangLayoutProps = {
  children: ReactNode;
  params: { lang: string };
};

export function generateStaticParams() {
  return i18nextConfig.i18n.locales.map((lang: string) => ({ lang }));
}

function LangLayout({ children, params: { lang } }: LangLayoutProps) {
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}

export default appWithTranslation(LangLayout);
