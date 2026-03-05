import { React, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import ContactForm from "../components/home/ContactForm"; // Adjust path if needed
import Footer from "../components/common/Footer";
import ScrollToTop from "../components/common/ScrollToTop";

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Navbar />
      <main>
        {/* ── Page Header / Spacer ── */}
        {/* This creates a dark blue background at the top so your transparent navbar text is visible */}
        <div
          style={{
            background: "linear-gradient(135deg, #0d6efd 0%, #084298 100%)",
            paddingTop: "140px",
            paddingBottom: "60px",
            textAlign: "center",
            color: "white"
          }}
        >
          <div className="container">
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                fontSize: "2.5rem"
              }}
            >
              Contact Us
            </h1>
            <p style={{ opacity: 0.8, maxWidth: "600px", margin: "1rem auto 0" }}>
              Interested in our products? Send us an inquiry and <br />
               our team will respond within 24 hours.
            </p>
          </div>
        </div>

        {/* ── Your Existing Contact Form ── */}
        <ContactForm />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default Contact;