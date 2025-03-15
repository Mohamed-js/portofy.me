import About from "./About";
import Contact from "./Contact";
import Cover from "./Cover";
import Experience from "./Experience";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Projects from "./Projects";
import Services from "./Services";

const Minimal = ({ portfolio, user }) => {
  return (
    <div className="bg-white text-black">
      <Navbar portfolio={portfolio} user={user} />
      <Cover portfolio={portfolio} />
      {portfolio.projectsActivatedInPortfolio && (
        <>
          <TopLine />
          <Projects portfolio={portfolio} />
          <BottomLine2 />
        </>
      )}
      <TopLine2 />
      <About portfolio={portfolio} />
      <BottomLine2 />

      {portfolio.skillsActivatedInPortfolio && (
        <>
          <TopLine2 />
          <Services portfolio={portfolio} />
          <BottomLine2 />
        </>
      )}

      {portfolio.experienceActivatedInPortfolio && (
        <>
          <TopLine2 />
          <Experience portfolio={portfolio} />
          <BottomLine />
        </>
      )}
      <Contact portfolio={portfolio} />
      <Footer portfolio={portfolio} user={user} />
    </div>
  );
};

export default Minimal;

const BottomLine = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
      className="top-2 relative"
    >
      <path
        fill="#3f51b5"
        fillOpacity="1"
        d="M0,192L48,208C96,224,192,256,288,240C384,224,480,160,576,128C672,96,768,96,864,128C960,160,1056,224,1152,213.3C1248,203,1344,117,1392,74.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      ></path>
    </svg>
  );
};

const TopLine = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
      className="rotate-180 -top-1 relative"
    >
      <path
        fill="#3f51b5"
        fillOpacity="1"
        d="M0,192L48,208C96,224,192,256,288,240C384,224,480,160,576,128C672,96,768,96,864,128C960,160,1056,224,1152,213.3C1248,203,1344,117,1392,74.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      ></path>
    </svg>
  );
};

const BottomLine2 = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <path
        fill="#3f51b5"
        d="M0,160L60,165.3C120,171,240,181,360,197.3C480,213,600,235,720,245.3C840,256,960,256,1080,245.3C1200,235,1320,213,1380,202.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
      ></path>
    </svg>
  );
};

const TopLine2 = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
      className="-top-1 relative rotate-180"
    >
      <path
        fill="#3f51b5"
        d="M0,160L60,165.3C120,171,240,181,360,197.3C480,213,600,235,720,245.3C840,256,960,256,1080,245.3C1200,235,1320,213,1380,202.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
      ></path>
    </svg>
  );
};
