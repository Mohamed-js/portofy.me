import About from "./About";
import Contact from "./Contact";
import Cover from "./Cover";
import Experience from "./Experience";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Projects from "./Projects";
import Services from "./Services";

const Modern = ({ portfolio, user }) => {
  return (
    <>
      <Navbar portfolio={portfolio} user={user} />
      <Cover portfolio={portfolio} />
      {portfolio.projectsActivatedInPortfolio && (
        <Projects portfolio={portfolio} />
      )}
      <About portfolio={portfolio} />
      {portfolio.skillsActivatedInPortfolio && (
        <Services portfolio={portfolio} />
      )}
      {portfolio.experienceActivatedInPortfolio && (
        <Experience portfolio={portfolio} />
      )}
      <Contact portfolio={portfolio} />
      <Footer portfolio={portfolio} user={user} />
    </>
  );
};

export default Modern;
