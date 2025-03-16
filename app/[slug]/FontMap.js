import {
  Almarai,
  Cairo,
  Changa,
  Lato,
  Merriweather_Sans,
  Open_Sans,
  Poppins,
  Roboto_Slab,
  Roboto,
  Tajawal,
} from "@next/font/google";

const almarai = Almarai({ subsets: ["arabic"], weight: ["300", "400", "700"] });
const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "700"] });
const changa = Changa({ subsets: ["arabic"], weight: ["400", "700"] });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"] });
const merriweatherSans = Merriweather_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});
const openSans = Open_Sans({ subsets: ["latin"], weight: ["400", "700"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });
const robotoSlab = Roboto_Slab({ subsets: ["latin"], weight: ["400", "700"] });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });
const tajawal = Tajawal({ subsets: ["arabic"], weight: ["400", "700"] });

const fontMap = {
  openSans,
  poppins,
  robotoSlab,
  roboto,
  almarai,
  changa,
  tajawal,
  merriweatherSans,
  cairo,
  lato,
};

export default fontMap;
