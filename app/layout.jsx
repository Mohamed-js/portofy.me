import { Poppins } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Navbar from "@/components/Navbar";

const poppins = Poppins({
  variable: "--font-poppins-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Portofy.me",
  description: "Generating portfolios by us for you!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <Navbar />
        <div className="mt-24">{children}</div>
        <ToastContainer />
      </body>
    </html>
  );
}
