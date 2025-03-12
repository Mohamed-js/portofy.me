import Animator from "./animator";

// app/[slug]/layout.js
export default async function PortfolioLayout({ children, params }) {
  return (
    <html lang="en" style={{ padding: "0px !important" }}>
      <body>
        <Animator />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}

export const dynamic = "force-dynamic";
