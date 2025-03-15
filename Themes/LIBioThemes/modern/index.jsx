import BgChanger from "./BgChanger";
import Cover from "./Cover";

const Modern = ({ portfolio, user }) => {
  return (
    <div className="relative">
      <BgChanger />
      <Cover portfolio={portfolio} />
    </div>
  );
};

export default Modern;
