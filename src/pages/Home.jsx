import Navbar             from "../components/common/Navbar";
import HeroBanner         from "../components/home/HeroBanner";
import AboutPreview       from "../components/home/AboutPreview";
import FeaturedCategories from "../components/home/FeaturedCategories";
import GalleryPreview     from "../components/home/GalleryPreview";
import BlogPreview        from "../components/home/BlogPreview";
import Testimonials       from "../components/home/Testimonials";
import ContactForm        from "../components/home/ContactForm";
import Footer             from "../components/common/Footer";
import ScrollToTop        from "../components/common/ScrollToTop";

const Home = () => {
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

        {/* 7. Contact Form */}
        <ContactForm />
      </main>

      <Footer />
      <ScrollToTop />
    </>
  );
};

export default Home;