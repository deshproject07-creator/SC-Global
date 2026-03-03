import React from "react";
import Navbar from "../components/common/Navbar";
import ContactForm from "../components/home/ContactForm"; // Adjust path if needed
import Footer from "../components/common/Footer";
import ScrollToTop from "../components/common/ScrollToTop";

const Contact = () => {
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
              Get In Touch
            </h1>
            <p style={{ opacity: 0.8, maxWidth: "600px", margin: "1rem auto 0" }}>
              We're here to help and answer any question you might have. We look forward to hearing from you.
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