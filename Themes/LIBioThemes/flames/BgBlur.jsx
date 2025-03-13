const TopBlur = ({ colors }) => {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className={`relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[${
            colors[0] || "#e45053"
          }] to-[${
            colors[1] || "#fd9c46"
          }] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]`}
        />
      </div>
    </div>
  );
};

const BottomBlur = ({ colors }) => {
  return (
    <div className="">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-50rem)]"
      >
        <img
          src="https://media.tenor.com/I1uKTqRLFyEAAAAM/%CF%86%CF%89%CF%84%CE%B9%CE%AC-%CE%BC.gif"
          className="w-screen md:w-[50%] h-screen md:h-[50%] blur-2 absolute bottom-0 right-0 opacity-40 sm:opacity-30"
        />
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className={`relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[${
            colors[0] || "#e45053"
          }] to-[${
            colors[1] || "#fd9c46"
          }] opacity-30 sm:right-[calc(50%+16rem)] sm:w-[72.1875rem]`}
        />
      </div>
      <span className="hidden from-[#fd9c46] to-[#e45053]"></span>
    </div>
  );
};

export { BottomBlur, TopBlur };
