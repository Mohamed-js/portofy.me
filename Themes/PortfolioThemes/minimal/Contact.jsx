import { FaEnvelope, FaPhone } from "react-icons/fa6";

const Contact = ({ portfolio }) => {
  return (
    <div
      className="w-full py-16 md:py-20 mx-auto bg-[#3f51b5] translate-y-1"
      id="contact"
    >
      <h2 className="text-center font-header text-4xl font-semibold uppercase text-white sm:text-5xl lg:text-6xl">
        Have Any Questions?
      </h2>
      <h4 className="pt-6 text-center font-header text-xl font-medium text-black sm:text-2xl lg:text-3xl"></h4>
      <div className="mx-auto w-full pt-2 text-center sm:w-2/3 lg:pt-3">
        <p className="font-body text-gray-100">
          Feel Free To Get My Consultation Any Time!
        </p>
      </div>

      <div className="flex flex-col pt-16 lg:flex-row items-center justify-center gap-8 px-4">
        <div>
          <div className="flex items-center">
            <FaPhone color="white" />
            <p className="pl-2 font-body font-bold uppercase text-white lg:text-lg">
              Phone
            </p>
          </div>
          <p className="pt-2 text-left font-body font-bold text-white lg:text-lg">
            {portfolio.phone}
          </p>
        </div>
        <div>
          <div className="flex items-center">
            <FaEnvelope color="white" />
            <p className="pl-2 font-body font-bold uppercase text-white lg:text-lg">
              Email
            </p>
          </div>
          <p className="pt-2 text-left font-body font-bold text-white lg:text-lg">
            {portfolio.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
