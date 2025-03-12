import AppLayout from "@/components/AppLayout";
import { Pricing } from "@/components/Pricing";
import Portfolio from "@/models/Portfolio";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const headersList = await headers();
  const host = headersList.get("host");
  const defaultDomain =
    process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || "portofyme.vercel.app";
  if (host === defaultDomain) {
    return <LandingPage />;
  }
  await dbConnect();

  const portfolio = await Portfolio.findOne({
    customDomain: host,
    domainVerified: true,
  }).lean();

  if (!portfolio) {
    // If no portfolio matches the custom domain, show an error or redirect
    return (
      <div>
        <h1>Domain Not Found</h1>
        <p>No portfolio is associated with this domain.</p>
      </div>
    );
  }
  redirect(`/${portfolio.slug}`);
}

export function LandingPage() {
  return (
    <AppLayout>
      <div className="">
        <div className="relative isolate px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-32 sm:py-36">
            <div className="text-center">
              <h1 className="text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
                Showcase Your Brilliance Online
              </h1>
              <p className="mt-8 text-lg font-medium text-pretty text-gray-300 sm:text-xl/8">
                Create a stunning portfolio in minutes. Highlight your skills,
                projects, and experience with ease—no coding required.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/signup"
                  className="capitalize w-full max-w-[300px] rounded-full bg-linear-to-bl from-[#e45053] to-[#fd9c46] px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started for free
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Pricing />
        <ContactUs />
      </div>
    </AppLayout>
  );
}

export function ContactUs() {
  return (
    <section className="py-16 md:py-32" id="contact">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Get in Touch</h2>
        <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
          Have questions or need support? We’re here to help you showcase your
          brilliance online. Reach out via WhatsApp or email!
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {/* WhatsApp */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 w-full">
            <h3 className="text-xl font-semibold text-white mb-4">WhatsApp</h3>
            <p className="text-gray-300 mb-4">+201100086711</p>
            <Link
              href="https://wa.me/201100086711"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2.5 text-sm font-semibold text-white bg-linear-to-bl from-[#e45053] to-[#fd9c46] rounded-md hover:bg-blue-700 transition-all duration-200"
            >
              Chat Now
            </Link>
          </div>

          {/* Email */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 w-full">
            <h3 className="text-xl font-semibold text-white mb-4">Email</h3>
            <p className="text-gray-300 mb-4">portofy.me@gmail.com</p>
            <Link
              href="mailto:portofy.me@gmail.com"
              className="inline-block px-6 py-2.5 text-sm font-semibold text-white bg-linear-to-bl from-[#e45053] to-[#fd9c46] rounded-md hover:bg-blue-700 transition-all duration-200"
            >
              Send Email
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
