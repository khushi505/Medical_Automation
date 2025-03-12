import React from "react";
import "./Contactsrm.css";

function Contact() {
  return (
    <div className="contact-page">
      {/* Top section with contact info */}
      <section className="contact-info-top">
        <h2>Contact Information</h2>
        <p className="address-line">
          <strong>Address:</strong> SRM University AP, Amaravati, Andhra
          Pradesh, India
        </p>
        <p className="phone-line">
          <strong>Phone:</strong> <a href="tel:+918662429299">0863-2343052</a>
        </p>
        <p className="email-line">
          <strong>Email:</strong>{" "}
          <a href="mailto:info@srmap.edu.in">medicalcare@srmap.edu.in</a>
        </p>
      </section>

      {/* Map section with overlay card */}
      <section className="map-section">
        <div className="map-wrapper">
          <iframe
            title="SRM University AP Pinned Location"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3806.283392953162!2d80.538548!3d16.441983!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35ecba13ae18df%3A0x87fcd240e6f2712!2sSRM%20University%20AP!5e0!3m2!1sen!2sin!4v1696360109874!5m2!1sen!2sin"
            width="100%"
            height="600"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>

          <div className="overlay-card">
            <img
              src="/assets/3dsrm.jpg"
              alt="SRM University AP"
              className="overlay-image"
            />
            <h3>SRM University AP</h3>
            <p>
              Neerukonda, Mangalagiri Mandal, Guntur District,
              <br />
              Andhra Pradesh 522240, India
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              <a href="tel:+918662429299"> 0863-2343052</a>
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:info@srmap.edu.in">info@srmap.edu.in</a>
            </p>
            <div className="overlay-actions">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=SRM+University+AP"
                target="_blank"
                rel="noopener noreferrer"
                className="action-btn"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
