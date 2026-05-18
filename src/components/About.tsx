import "./styles/About.css";
import FloatingShapes from "./FloatingShapes";

const About = () => {
  return (
    <div className="about-section" id="about" style={{ position: 'relative' }}>
      <FloatingShapes />
      <div className="about-me" style={{ position: 'relative', zIndex: 1 }}>
        <h3 className="title">About Muhammad Salman</h3>
        <p className="para">
          I’m Muhammad Salman, a passionate self-taught digital creator from Pakistan specializing in web development, mobile app development, professional video editing, and Meta advertising. 
          Over the years, I’ve worked on building modern websites, creating Flutter mobile applications, editing engaging video content, and managing successful Facebook & Instagram ad campaigns for businesses and personal brands.
          My goal is simple: To help brands look professional, grow faster, and reach the right audience through smart digital solutions.
        </p>
      </div>
    </div>
  );
};

export default About;
