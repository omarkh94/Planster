import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import "../style/scroll.css"

const ContactSupport: React.FC = () => {
  return (
    <div className="contact-support-container">
      <div className="header">
        <h1 className="header-title">Get in Touch</h1>
        <p className="header-description">
          We're here to help you with any questions, concerns, or feedback. Let us know how we can assist you!
        </p>
      </div>

      <div className="content">
        {/* Contact Form */}
        <div className="card contact-form">
          <div className="card-content">
            <h2 className="card-title">Contact Us</h2>
            <form className="form">
              <input type="text" placeholder="Full Name" className="form-input" />
              <input type="email" placeholder="Email Address" className="form-input" />
              <input type="text" placeholder="Subject" className="form-input" />
              <textarea placeholder="Your Message" className="form-textarea" rows={5}></textarea>
              <button type="submit" className="form-button">
                Send Message <Send className="button-icon" size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Support Information */}
        <div className="card support-info">
          <div className="card-content">
            <h2 className="card-title">Support Info</h2>
            <div className="info-list">
              <div className="info-item">
                <Mail className="info-icon" size={20} />
                <div>
                  <p className="info-title">Email</p>
                  <p className="info-text">support@planster.com</p>
                </div>
              </div>
              <div className="info-item">
                <Phone className="info-icon" size={20} />
                <div>
                  <p className="info-title">Phone</p>
                  <p className="info-text">+962 (79) 1329-474</p>
                </div>
              </div>
              <div className="info-item">
                <MapPin className="info-icon" size={20} />
                <div>
                  <p className="info-title">Address</p>
                  <p className="info-text">123 Planster Street, Tech City, 45678</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
