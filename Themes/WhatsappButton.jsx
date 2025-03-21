import { FaWhatsapp } from "react-icons/fa6";

const WhatsappButton = ({ whatsapp }) => {
  return (
    <a
      className={`fixed bottom-2 right-2 bg-green-500 p-2 rounded-full z-50 ${
        !whatsapp && "hidden"
      }`}
      href={`https://wa.me/${whatsapp}`}
      target="_blank"
    >
      <FaWhatsapp className="text-3xl md:text-4xl" />
    </a>
  );
};

export default WhatsappButton;
