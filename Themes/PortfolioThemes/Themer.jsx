import Minimal from "./minimal";
import Flames from "./flames";
import Modern from "./modern";
import fontMap from "@/app/[slug]/FontMap";
import PortfolioTracker from "@/components/PortfolioTracker";

const themes = {
  minimal: Minimal,
  flames: Flames,
  modern: Modern,
};

const Themer = ({ portfolio, user }) => {
  const SelectedTheme = themes[portfolio.theme] || themes.minimal;
  const selectedFont = fontMap[portfolio.font] || fontMap.openSans;

  return (
    <div className={selectedFont.className}>
      <PortfolioTracker portfolioId={portfolio._id} />
      <SelectedTheme portfolio={portfolio} user={user} />
    </div>
  );
};

export default Themer;
