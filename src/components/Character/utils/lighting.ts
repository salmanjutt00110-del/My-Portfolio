import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";

const setLighting = (scene: THREE.Scene) => {
  const directionalLight = new THREE.DirectionalLight(0xc7a9ff, 0);
  directionalLight.position.set(-0.47, -0.32, -1);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(1024, 1024);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xc2a4ff, 0, 100, 3);
  pointLight.position.set(3, 12, 4);
  pointLight.castShadow = true;
  scene.add(pointLight);

  new RGBELoader()
    .setPath("/models/")
    .load("char_enviorment.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0;
      scene.environmentRotation.set(5.76, 85.85, 1);
    });

  function setPointLight(screenLight: any) {
    if (screenLight && screenLight.material && screenLight.material.opacity > 0.9) {
      pointLight.intensity = screenLight.material.emissiveIntensity * 20;
    } else {
      pointLight.intensity = 0;
    }
  }

  function setPower(on: boolean) {
    const duration = 2;
    const ease = "power2.inOut";
    
    gsap.to(scene, {
      environmentIntensity: on ? 0.64 : 0.05,
      duration: duration,
      ease: ease,
    });
    gsap.to(directionalLight, {
      intensity: on ? 2.0 : 0.1,
      duration: duration,
      ease: ease,
    });
    gsap.to(".character-rim", {
      y: on ? "55%" : "100%",
      opacity: on ? 1 : 0,
      duration: 1.5,
      ease: "power3.out"
    });
  }

  // Legacy for compatibility
  function turnOnLights() { setPower(true); }

  return { setPointLight, turnOnLights, setPower };
};

export default setLighting;
