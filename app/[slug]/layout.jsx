import Animator from "./animator";

export default async function PortfolioLayout({ children }) {
  return (
    <>
      <Animator />
      <main className="min-h-screen">{children}</main>
    </>
  );
}

export const dynamic = "force-dynamic";
