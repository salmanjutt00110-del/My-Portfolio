import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { addCharacterAccessories } from "./characterAccessories";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        let character: THREE.Object3D;
        loader.load(
          "/models/character.glb",
          async (gltf) => {
            character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            // Skin-tone HSL hue range (roughly 15-45 degrees, warm tones)
            const isSkinColor = (color: THREE.Color) => {
              const hsl = { h: 0, s: 0, l: 0 };
              color.getHSL(hsl);
              // Skin is warm-hued with moderate saturation
              return hsl.h > 0.02 && hsl.h < 0.15 && hsl.s > 0.15 && hsl.l > 0.2;
            };

            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;

                // Change clothing materials to dark developer-style colors
                const name = (child.name || "").toLowerCase();
                const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                mats.forEach((mat: any) => {
                  if (mat && mat.color && !isSkinColor(mat.color)) {
                    // Skip eyes, teeth, hair-specific parts
                    if (name.includes("eye") || name.includes("teeth") || name.includes("hair") || name.includes("screen") || name.includes("light")) return;
                    // Clothing → dark navy / charcoal hoodie developer look
                    const lum = mat.color.getHSL({ h: 0, s: 0, l: 0 }).l;
                    if (lum > 0.1 && lum < 0.95) {
                      mat.color.setHSL(0.62, 0.25, 0.13); // dark navy
                      if (mat.emissive) mat.emissive.setHSL(0.62, 0.1, 0.02);
                    }
                  }
                });
              }
            });
            // Add cap, glasses, boots, shirt text, screen text
            try {
              addCharacterAccessories(character);
            } catch (accErr) {
              console.error("Error adding accessories:", accErr);
            }
            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            const footR = character!.getObjectByName("footR");
            if (footR) footR.position.y = 3.36;
            const footL = character!.getObjectByName("footL");
            if (footL) footL.position.y = 3.36;
            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
