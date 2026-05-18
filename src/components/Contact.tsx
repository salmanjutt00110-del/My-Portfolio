import { FiArrowUpRight, FiSend } from "react-icons/fi";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <div className="contact-header">
          <h4>Get In Touch</h4>
          <h1 className="contact-title">
            LET'S CREATE
            <span>SOMETHING BIG.</span>
          </h1>
        </div>

        <div className="contact-content">
          <div className="contact-form-wrapper">
            <form className="contact-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="e.g. John Doe" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="e.g. john@example.com" />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input type="text" placeholder="How can I help you?" />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea placeholder="Tell me about your project..."></textarea>
              </div>
              <button type="submit" className="submit-btn" data-cursor="disable">
                SEND MESSAGE <FiSend />
              </button>
            </form>
          </div>

          <div className="contact-info">
            <div className="info-item">
              <h4>Direct Contact</h4>
              <a href="mailto:salman@example.com" className="info-link">
                salman@example.com
              </a>
            </div>

            <div className="info-item">
              <h4>Social Channels</h4>
              <div className="social-grid">
                <div className="social-item">
                  <span>LinkedIn</span>
                  <a href="#">Profile <FiArrowUpRight /></a>
                </div>
                <div className="social-item">
                  <span>Instagram</span>
                  <a href="https://www.instagram.com/devnexa.official0?igsh=ZnIwbnVheHc5aDho" target="_blank" rel="noopener noreferrer">@devnexa.official0 <FiArrowUpRight /></a>
                </div>
                <div className="social-item">
                  <span>WhatsApp</span>
                  <a href="https://wa.me/923100128702" target="_blank" rel="noopener noreferrer">03100128702 <FiArrowUpRight /></a>
                </div>
                <div className="social-item">
                  <span>Facebook</span>
                  <a href="https://www.facebook.com/share/18ThSYqctv/" target="_blank" rel="noopener noreferrer">Connect <FiArrowUpRight /></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="footer">
          <div className="footer-line"></div>
          <div className="footer-bottom">
            <p>© 2024 MUHAMMAD SALMAN. ALL RIGHTS RESERVED.</p>
            <p>DESIGNED & DEVELOPED WITH PASSION</p>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Contact;
