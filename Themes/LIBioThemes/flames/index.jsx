import Cover from "./Cover";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Flames = ({ portfolio, user }) => {
  return (
    <div className=" max-w-[1280px] mx-auto">
      <Navbar portfolio={portfolio} user={user} />
      <Cover portfolio={portfolio} />
      <Footer portfolio={portfolio} user={user} />
    </div>
  );
};

export default Flames;
