import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useCallback } from "react";
import Tilt from "react-parallax-tilt";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Work = () => {
  const initScrollAnimation = useCallback(() => {
    // Kill any previous work scroll triggers to prevent stale state on re-render/refresh
    ScrollTrigger.getById("work")?.kill(true);

    const boxes = document.getElementsByClassName("work-box");
    const container = document.querySelector(".work-container");
    const flex = document.querySelector(".work-flex");
    if (!boxes.length || !container || !flex) return;

    const rectLeft = container.getBoundingClientRect().left;
    const boxRect = boxes[0].getBoundingClientRect();
    const parentWidth = boxes[0].parentElement!.getBoundingClientRect().width;
    let padding: number =
      parseInt(window.getComputedStyle(boxes[0]).padding) / 2;
    const translateX =
      boxRect.width * boxes.length - (rectLeft + parentWidth) + padding;

    // Ensure we have a valid positive scroll distance
    const scrollDistance = Math.max(translateX, window.innerWidth);

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${scrollDistance}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        id: "work",
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    timeline.to(".work-flex", {
      x: -translateX,
      ease: "none",
    });

    return timeline;
  }, []);

  useGSAP(() => {
    // Small delay to ensure DOM is fully rendered before measuring
    const raf = requestAnimationFrame(() => {
      const timeline = initScrollAnimation();

      // Refresh all ScrollTrigger instances after setup
      ScrollTrigger.refresh(true);

      return () => {
        timeline?.kill();
        ScrollTrigger.getById("work")?.kill(true);
      };
    });

    return () => {
      cancelAnimationFrame(raf);
      ScrollTrigger.getById("work")?.kill(true);
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {[
            {
              title: "FlexCut Studio",
              category: "AI Video Editor App",
              tools: "Flutter, Firebase, Dart, UI Design",
              image: "/images/project_flexcut.png",
            },
            {
              title: "Business Portfolio",
              category: "Website Development",
              tools: "React, GSAP, Responsive Design",
              image: "/images/project_portfolio.png",
            },
            {
              title: "Meta Ads Campaign",
              category: "Lead Generation",
              tools: "Facebook Ads, Instagram Ads, Targeting",
              image: "/images/project_metaads.png",
            },
            {
              title: "Social Media Editing",
              category: "Reels & Shorts",
              tools: "Premiere Pro, After Effects, CapCut Pro",
              image: "/images/project_reels.png",
            },
            {
              title: "E-Commerce Store",
              category: "Web & Marketing",
              tools: "WordPress, Elementor, Meta Ads",
              image: "/images/project_ecommerce.png",
            },
          ].map((project, index) => (
            <Tilt 
              key={index} 
              tiltMaxAngleX={15} 
              tiltMaxAngleY={15} 
              perspective={1200} 
              scale={1.05} 
              transitionSpeed={2000}
              gyroscope={true}
              className="work-tilt-wrapper"
            >
              <div className="work-box glass-card">
                <div className="work-info">
                  <div className="work-title">
                    <h3 className="project-number">0{index + 1}</h3>
                    <div>
                      <h4 className="project-name">{project.title}</h4>
                      <p className="project-category">{project.category}</p>
                    </div>
                  </div>
                  <div className="project-details">
                    <h4>Tech Stack</h4>
                    <p>{project.tools}</p>
                  </div>
                </div>
                <div className="work-image-wrapper">
                  <WorkImage image={project.image} alt={project.title} />
                  <div className="image-overlay-glow"></div>
                </div>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
