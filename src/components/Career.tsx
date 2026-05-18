import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Meta Ads Expert</h4>
                <h5>Freelance / Self-Employed</h5>
              </div>
              <h3>4+ Years</h3>
            </div>
            <p>
              I manage Facebook and Instagram advertising campaigns focused on generating sales, leads, engagement, and business growth. From audience research to scaling campaigns.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Professional Video Editor</h4>
                <h5>Content Creation</h5>
              </div>
              <h3>2+ Years</h3>
            </div>
            <p>
              I create professional video content for social media, YouTube, brands, and advertising campaigns. My editing style focuses on storytelling, retention, and cinematic visuals.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Web & App Developer</h4>
                <h5>Digital Solutions</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              I build responsive websites using WordPress & React, and develop cross-platform Android applications using Flutter with Firebase integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
