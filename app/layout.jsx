import "./globals.css";

export const metadata = {
  title: {
    template: "%s | Portofy.me",
    default: "Portofy.me", // Default title when no specific title is provided
  },
  description: "Generating portfolios by us for you!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
