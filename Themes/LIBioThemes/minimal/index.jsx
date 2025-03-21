import BgChanger from "./BgChanger";
import Cover from "./Cover";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Minimal = ({ portfolio, user }) => {
  return (
    <div className="bg-[#242424]">
      <BgChanger />
      <Navbar portfolio={portfolio} user={user} />
      <Cover portfolio={portfolio} />
      <Footer portfolio={portfolio} user={user} />
    </div>
  );
};

export default Minimal;
