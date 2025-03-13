import Cover from "./Cover";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Minimal = ({ portfolio, user }) => {
  return (
    <>
      <Navbar portfolio={portfolio} user={user} />
      <Cover portfolio={portfolio} />
      <Footer portfolio={portfolio} user={user} />
    </>
  );
};

export default Minimal;
