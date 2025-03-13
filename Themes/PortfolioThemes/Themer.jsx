import Minimal from "./minimal";
import Flames from "./flames";
import Modern from "./modern";

const themes = {
  minimal: Minimal,
  flames: Flames,
  modern: Modern,
};

const Themer = ({ portfolio, user }) => {
  const SelectedTheme = themes[portfolio.theme] || themes.minimal;
  return <SelectedTheme portfolio={portfolio} user={user} />;
};

export default Themer;
