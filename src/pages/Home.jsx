import { useEffect } from "react";
import Navbar             from "../components/common/Navbar";
import HeroBanner         from "../components/home/HeroBanner";
import AboutPreview       from "../components/home/AboutPreview";
import FeaturedCategories from "../components/home/FeaturedCategories";
import GalleryPreview     from "../components/home/GalleryPreview";
import BlogPreview        from "../components/home/BlogPreview";
import Testimonials       from "../components/home/Testimonials";
import Certifications     from "../components/home/Certifications";
import Footer             from "../components/common/Footer";

const Home = () => {

  // ── Scroll to top ──────────────────────────
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Navbar />
      <main>
        {/* 1. Hero Slider */}
        <HeroBanner />

        {/* 2. About Preview */}
        <AboutPreview />

        {/* 3. What We Export - Categories */}
        <FeaturedCategories />

        {/* 4. Gallery Preview */}
        <GalleryPreview />

        {/* 5. Blog Preview */}
        <BlogPreview />

        {/* 6. Testimonials */}
        <Testimonials />

        {/* 7. Certifications */}
        <Certifications />

      </main>

      <Footer />

    </>
  );
};

export default Home;