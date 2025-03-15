import { ToastContainer } from "react-toastify";
import "./globals.css";

export const metadata = {
  title: "Portofy.me",
  description: "Generating portfolios by us for you!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {children}
        <ToastContainer position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
