import HeroSection from "@/components/public/home/HeroSection";
import EventBanner from "@/components/public/home/EventBanner";
import MenuPreview from "@/components/public/home/MenuPreview";
import AboutSection from "@/components/public/home/AboutSection";
import GalleryPreview from "@/components/public/home/GalleryPreview";

export default function Home() {
  return (
    <>
      <HeroSection />
      <EventBanner />
      <MenuPreview />
      <AboutSection />
      <GalleryPreview />
    </>
  );
}
