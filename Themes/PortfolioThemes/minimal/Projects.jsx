import Project from "./ProjectCard";

const Projects = ({ portfolio }) => {
  return (
    <section
      className="container py-16  mx-auto text-black max-w-7xl"
      id="portfolio"
    >
      <h2 className="text-center font-header text-4xl font-semibold uppercase text-[#3f51b5] sm:text-5xl lg:text-6xl mb-4">
        {portfolio.projectsTitle || "Check out my Projects"}
      </h2>

      <div className="mx-auto grid w-full grid-cols-1 gap-8 pt-12 sm:w-3/4 md:gap-10 lg:w-full lg:grid-cols-2 px-4">
        {portfolio.projects.map((project, index) => (
          <Project project={project} key={index} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
