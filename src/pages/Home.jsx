import Navbar            from "../components/common/Navbar";
import HeroBanner        from "../components/home/HeroBanner";
import FeaturedCategories from "../components/home/FeaturedCategories";
import WhyChooseUs       from "../components/home/WhyChooseUs";
import Testimonials      from "../components/home/Testimonials";
import ContactForm       from "../components/home/ContactForm";
import Footer            from "../components/common/Footer";
import ScrollToTop       from "../components/common/ScrollToTop";

const Home = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroBanner />
        <FeaturedCategories />
        <WhyChooseUs />
        <Testimonials />
        <ContactForm />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default Home;