import WeOffer from "@/components/layout/home/WeOffer";
import HomeBanner from "@/components/layout/home/HomeBanner";
import HeroSection from "@/components/layout/home/HeroSection";
import Testimonial from "@/components/layout/home/Testimonial";
import MostBookedProduct from "@/components/layout/home/MostBookedProduct";
import CategoriesYouMayLike from "@/components/layout/home/CategoriesYouMayLike";
import YoutubeVideo from "@/components/layout/home/YoutubeVideoSection";
import OwnerImageSection from "@/components/layout/home/OwnerImageSection";

export default function Page() {
  return (
    <main>
      <HeroSection />
      <CategoriesYouMayLike />
      <MostBookedProduct />
      <WeOffer />
      <HomeBanner />
      <OwnerImageSection />
      <Testimonial />
      <YoutubeVideo />
    </main>
  );
}
