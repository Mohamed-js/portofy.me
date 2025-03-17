import { MdArrowRight } from "react-icons/md";

const Experience = ({ portfolio }) => {
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const sortingFunc = (a, b) => {
    // If a job is ongoing (isPresent), it should come first
    if (a.isPresent && !b.isPresent) return -1;
    if (!a.isPresent && b.isPresent) return 1;

    // Use endDate or startDate for sorting
    const dateA = a.endDate || a.startDate;
    const dateB = b.endDate || b.startDate;

    // Handle null dates (place them at the end)
    if (!dateA && dateB) return 1;
    if (dateA && !dateB) return -1;
    if (!dateA && !dateB) return 0;

    // Sort in reverse chronological order
    return new Date(dateB) - new Date(dateA);
  };

  return (
    <div className="container py-16  mx-auto p-4" id="work">
      <div className="bg-gradient-to-r from-[#171717] via-[#242424] to-[#171717] h-1 rounded-[50%] opacity-90 w-full md:w-[50%] mx-auto" />
      <br />
      <br />
      <br />
      <h2 className="text-center font-header text-4xl font-semibold capitalize text-[white] sm:text-5xl lg:text-6xl">
        {portfolio.experienceTitle || "My work experience"}
      </h2>
      <div className="relative mx-auto mt-12 flex w-full flex-col lg:w-2/3 px-4 gap-10">
        <span className="left-2/5 absolute inset-y-0 ml-10 hidden w-0.5 bg-grey-40 md:block"></span>

        {portfolio.experience.sort(sortingFunc).map((exp, index) => (
          <div key={index} className="mt-8 flex flex-col md:flex-row md:gap-8">
            <div className="md:w-2/5">
              <div className="flex justify-start ml-2">
                <p className="font-header text-xl font-bold text-[white]">
                  {exp.company}
                </p>
              </div>
            </div>

            <div className="md:w-3/5">
              <div className="relative flex">
                <MdArrowRight size={24} className="mt-1 md:mt-0" />
                <div className="mt-1 flex">
                  <span className="absolute left-8 top-1 hidden h-4 w-4 rounded-full border-2 bg-white text-gray-100 md:block"></span>
                  <div className="md:-mt-1 md:pl-8 ml-2">
                    <span className="block font-body text-gray-300">
                      {formatDate(exp.startDate)}{" "}
                      {exp.isPresent
                        ? "- Present"
                        : exp.endDate
                        ? "- " + formatDate(exp.endDate)
                        : ""}
                    </span>
                    <span className="block pt-2 font-header text-xl font-bold uppercase text-[white]">
                      {exp.role}
                    </span>

                    <ul className="list-disc list-inside pt-2 font-body text-white">
                      {exp.description.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
