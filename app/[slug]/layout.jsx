import Animator from "./animator";

export default async function PortfolioLayout({ children, params }) {
  return (
    <html lang="en">
      <body>
        <Animator />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}

export const dynamic = "force-dynamic";
