import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { useLoading } from "../../context/LoadingProvider";
import { initialFX } from "../utils/initialFX";
import "./LampIntro.css";

/* ─── Procedural Desk-Lamp ─── */
function createLamp() {
  const group = new THREE.Group();

  const metalMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.3, metalness: 0.9 });
  const darkMat  = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.6, metalness: 0.7 });

  // Base
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 0.08, 48), metalMat);
  base.position.y = 0.04;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  // Base accent ring
  const baseRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.47, 0.015, 16, 48),
    new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.2, metalness: 0.95 })
  );
  baseRing.position.y = 0.08;
  baseRing.rotation.x = Math.PI / 2;
  group.add(baseRing);

  // Lower arm
  const lowerArm = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 1.2, 16), metalMat);
  lowerArm.position.set(0, 0.68, 0);
  lowerArm.castShadow = true;
  group.add(lowerArm);

  // Joint 1
  group.add(Object.assign(new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), darkMat), { position: new THREE.Vector3(0, 1.28, 0) }));

  // Upper arm (angled)
  const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 1.0, 16), metalMat);
  upperArm.position.set(0.25, 1.75, 0);
  upperArm.rotation.z = -0.5;
  upperArm.castShadow = true;
  group.add(upperArm);

  // Joint 2
  group.add(Object.assign(new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), darkMat), { position: new THREE.Vector3(0.5, 2.18, 0) }));

  // Shade
  const shadeMat = new THREE.MeshStandardMaterial({ color: 0x12121a, roughness: 0.5, metalness: 0.8, side: THREE.DoubleSide });
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.35, 32, 1, true), shadeMat);
  shade.position.set(0.5, 2.05, 0);
  shade.rotation.z = 0.15;
  shade.castShadow = true;
  group.add(shade);

  // Shade inner ring
  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.34, 0.01, 12, 32),
    new THREE.MeshBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.3 })
  );
  innerRing.position.set(0.5, 1.88, 0);
  innerRing.rotation.x = Math.PI / 2;
  group.add(innerRing);

  // Bulb
  const bulbMat = new THREE.MeshStandardMaterial({
    color: 0xfff8e7,
    emissive: 0xc084fc,
    emissiveIntensity: 0.15,
    transparent: true,
    opacity: 0.9,
    roughness: 0.1,
    metalness: 0.0,
  });
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 24), bulbMat);
  bulb.name = "lamp_bulb";
  bulb.position.set(0.5, 1.92, 0);
  group.add(bulb);

  // Bulb point light (idle)
  const bulbLight = new THREE.PointLight(0xc084fc, 0.08, 8, 2);
  bulbLight.position.copy(bulb.position);
  bulbLight.castShadow = true;
  bulbLight.shadow.mapSize.set(512, 512);
  group.add(bulbLight);

  return { group, bulb, bulbLight, bulbMat };
}

/* ─── Component ─── */
const LampIntro = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hintVisible, setHintVisible] = useState(true);
  const [visible, setVisible] = useState(false); // fade-in after loading
  const { isLoadingDone, isActivated, setIsActivated } = useLoading();
  const activatedRef = useRef(false);

  // Show lamp only once loading screen has exited
  useEffect(() => {
    if (isLoadingDone && !isActivated) {
      setVisible(true);
    }
  }, [isLoadingDone]);

  useEffect(() => {
    if (!visible || !containerRef.current) return;
    let disposed = false;

    const container = containerRef.current;
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.15);

    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0.6, 2.4, 3.2);
    camera.lookAt(0.4, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    container.appendChild(renderer.domElement);

    // Bloom post-processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 0.6, 0.4, 0.85);
    composer.addPass(bloomPass);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0a0a1a, 0.15);
    scene.add(ambientLight);

    // Ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: 0x050508, roughness: 0.95 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // SpotLight (activated on click)
    const spotLight = new THREE.SpotLight(0xf0e6ff, 0, 12, Math.PI / 5, 0.6, 2);
    spotLight.position.set(0.5, 2.0, 0);
    spotLight.target.position.set(0.5, 0, 0);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.set(1024, 1024);
    scene.add(spotLight);
    scene.add(spotLight.target);

    // Build lamp
    const { group: lampGroup, bulb, bulbLight, bulbMat } = createLamp();
    scene.add(lampGroup);

    // Idle pulse
    const idlePulse = gsap.to(bulbMat, { emissiveIntensity: 0.4, duration: 1.8, yoyo: true, repeat: -1, ease: "sine.inOut" });
    const lightPulse = gsap.to(bulbLight, { intensity: 0.25, duration: 1.8, yoyo: true, repeat: -1, ease: "sine.inOut" });

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse2d = new THREE.Vector2();

    function onPointerDown(event: PointerEvent) {
      if (activatedRef.current) return;
      mouse2d.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse2d.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse2d, camera);
      const hits = raycaster.intersectObjects(lampGroup.children, true);
      if (hits.length > 0) triggerActivation();
    }

    container.addEventListener("pointerdown", onPointerDown);

    function triggerActivation() {
      if (activatedRef.current) return;
      activatedRef.current = true;
      idlePulse.kill();
      lightPulse.kill();
      setHintVisible(false);

      // Click sound
      const click = new Audio("/sounds/scroll.ogg");
      click.volume = 0.6;
      click.play().catch(() => {});

      // Flicker sequence
      const tl = gsap.timeline();
      tl.to(bulbLight, { intensity: 3.0, duration: 0.05 })
        .to(bulbMat, { emissiveIntensity: 2.5, duration: 0.05 }, "<")
        .to(bulbLight, { intensity: 0.3, duration: 0.08 })
        .to(bulbMat, { emissiveIntensity: 0.2, duration: 0.08 }, "<")
        .to(bulbLight, { intensity: 1.0, duration: 0.06 })
        .to(bulbMat, { emissiveIntensity: 1.5, duration: 0.06 }, "<")
        .to(bulbLight, { intensity: 0.1, duration: 0.1 })
        .to(bulbMat, { emissiveIntensity: 0.1, duration: 0.1 }, "<")
        .to(bulbLight, { intensity: 5.0, duration: 0.15 })
        .to(bulbMat, { emissiveIntensity: 3.0, duration: 0.15 }, "<")
        .call(() => {
          // Cinematic lights ON
          gsap.to(bulbLight, { intensity: 8, duration: 1.5, ease: "power2.out" });
          gsap.to(bulbMat, { emissiveIntensity: 4.0, duration: 1.5, ease: "power2.out" });
          gsap.to(spotLight, { intensity: 6, duration: 2, ease: "power2.out" });
          gsap.to(bloomPass, { strength: 1.5, duration: 2, ease: "power2.out" });
          gsap.to(ambientLight, { intensity: 0.8, duration: 2.5, ease: "power2.out" });
          gsap.to(scene.fog!, { density: 0.03, duration: 3, ease: "power2.out" });

          // Camera orbit
          gsap.to(camera.position, {
            x: 1.5, y: 3.2, z: 5.5,
            duration: 3, ease: "power3.inOut",
            onUpdate: () => camera.lookAt(0.4, 1.2, 0),
          });

          // Background music
          const bgMusic = new Audio("/sounds/bg.mp3");
          bgMusic.loop = true;
          bgMusic.volume = 0;
          bgMusic.play().catch(() => {});
          gsap.to(bgMusic, { volume: 0.35, duration: 3 });

          // After camera settles → reveal portfolio
          setTimeout(() => {
            setIsActivated(true);
            try { initialFX(); } catch (_) {}

            // Fade out overlay
            if (container) container.classList.add("lamp-hidden");

            setTimeout(() => {
              if (!disposed) {
                disposed = true;
                composer.dispose();
                renderer.dispose();
                scene.clear();
                if (container && container.contains(renderer.domElement)) {
                  container.removeChild(renderer.domElement);
                }
                setVisible(false);
              }
            }, 2200);
          }, 2800);
        });
    }

    // Render loop
    const clock = new THREE.Clock();
    function animate() {
      if (disposed) return;
      requestAnimationFrame(animate);
      lampGroup.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.03;
      composer.render();
    }
    animate();

    // Resize
    function onResize() {
      const nw = window.innerWidth, nh = window.innerHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      composer.setSize(nw, nh);
    }
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onResize);
      composer.dispose();
      renderer.dispose();
      scene.clear();
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [visible]);

  // Don't render if not yet needed
  if (!visible) return null;

  return (
    <div className="lamp-overlay" ref={containerRef}>
      {hintVisible && <div className="lamp-hint">Click the lamp to begin</div>}
    </div>
  );
};

export default LampIntro;
