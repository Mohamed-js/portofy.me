import "./globals.css";

export const metadata = {
  title: "Portofy.me",
  description: "Generating portfolios by us for you!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
