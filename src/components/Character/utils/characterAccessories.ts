import * as THREE from "three";

/** Create a canvas texture for labels/branding */
function makeText(text: string, color: string, bg: string = "transparent", width: number = 512, height: number = 128, fontSize: number = 60) {
  const c = document.createElement("canvas");
  c.width = width; c.height = height;
  const ctx = c.getContext("2d")!;
  if (bg !== "transparent") { ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height); }
  ctx.fillStyle = color; ctx.font = `bold ${fontSize}px Geist,Impact,sans-serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);
  const t = new THREE.CanvasTexture(c); t.needsUpdate = true; return t;
}

/** Robust bone/mesh search */
function bone(ch: THREE.Object3D, ...n: string[]) {
  for (const s of n) {
    const b = ch.getObjectByName(s);
    if (b) return b;
  }
  let found: THREE.Object3D | null = null;
  ch.traverse((obj) => {
    if (found) return;
    const objName = (obj.name || "").toLowerCase();
    for (const s of n) {
      if (objName.includes(s.toLowerCase())) {
        found = obj;
        return;
      }
    }
  });
  return found;
}

export function addCharacterAccessories(character: THREE.Object3D) {
  const head = bone(character, "Head", "head", "spine006");
  const torso = bone(character, "Torso", "torso", "spine003", "Spine");
  const fArmL = bone(character, "forearmL", "forearm.L");
  const desk = bone(character, "Desk", "Plane001", "Plane002", "Table");
  
  // Monitor detection
  let monitor: THREE.Object3D | null = null;
  character.traverse((obj) => {
    if (monitor) return;
    const n = obj.name.toLowerCase();
    if (n.includes("monitor") || n.includes("screen") || n.includes("display")) {
      monitor = obj;
    }
  });

  const scale = (v: number) => v * 1.0;
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9, metalness: 0.1 });
  const glowPurple = new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.8 });

  // 1. CAP
  if (head) {
    const cap = new THREE.Group();
    const capMesh = new THREE.Mesh(new THREE.SphereGeometry(scale(0.12), 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), darkMat);
    const brim = new THREE.Mesh(new THREE.BoxGeometry(scale(0.18), scale(0.01), scale(0.12)), darkMat);
    brim.position.set(0, scale(-0.02), scale(0.1));
    cap.add(capMesh, brim);
    
    const shaniTex = makeText("SHANI", "#a78bfa", "transparent", 512, 128, 80);
    const shaniLogo = new THREE.Mesh(new THREE.PlaneGeometry(scale(0.14), scale(0.04)), new THREE.MeshBasicMaterial({ map: shaniTex, transparent: true }));
    shaniLogo.name = "SHANI_logo";
    shaniLogo.position.set(0, scale(0.06), scale(0.12));
    cap.add(shaniLogo);

    cap.position.set(0, scale(0.1), scale(0.02));
    cap.rotation.x = -0.1;
    cap.rotation.z = 0.1;
    head.add(cap);
  }

  // 2. HOODIE
  if (torso) {
    const hoodie = new THREE.Group();
    const hoodieMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.8, side: THREE.DoubleSide });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(scale(0.32), scale(0.34), scale(0.5), 32, 1, true), hoodieMat);
    body.position.set(0, scale(0.05), 0);
    hoodie.add(body);
    
    const backNameTex = makeText("MUHAMMAD SALMAN", "#a78bfa", "transparent", 1024, 256, 90);
    const backName = new THREE.Mesh(new THREE.PlaneGeometry(scale(0.45), scale(0.12)), new THREE.MeshBasicMaterial({ map: backNameTex, transparent: true, side: THREE.DoubleSide }));
    backName.name = "MUHAMMAD_SALMAN_back";
    backName.position.set(0, scale(0.1), scale(-0.35));
    backName.rotation.y = Math.PI;
    hoodie.add(backName);

    torso.add(hoodie);
  }

  // 3. MONITOR BRANDING
  if (monitor) {
    const m = monitor as THREE.Object3D;
    // Front Screen Branding
    const fTex = makeText("MUHAMMAD SALMAN", "#c084fc", "#000000", 1024, 600, 100);
    const frontScreen = new THREE.Mesh(new THREE.PlaneGeometry(scale(1.2), scale(0.75)), new THREE.MeshBasicMaterial({ map: fTex, transparent: true }));
    frontScreen.name = "screen_branding";
    frontScreen.position.set(0, 0, scale(0.02));
    m.add(frontScreen);

    // Back Branding
    const bTex = makeText("MUHAMMAD SALMAN", "#ffffff", "#7c3aed", 1024, 256, 140);
    const backBranding = new THREE.Mesh(new THREE.PlaneGeometry(scale(1.6), scale(0.5)), new THREE.MeshBasicMaterial({ map: bTex, transparent: true, side: THREE.DoubleSide }));
    backBranding.name = "monitor_back_branding";
    backBranding.position.set(0, 0, scale(-0.05));
    backBranding.rotation.y = Math.PI;
    m.add(backBranding);
  }

  // 4. HEADPHONES ON TABLE
  if (desk || character) {
    const hp = new THREE.Group();
    hp.name = "headphones_table";
    const hband = new THREE.Mesh(new THREE.TorusGeometry(scale(0.2), scale(0.015), 12, 32, Math.PI), darkMat);
    hband.rotation.z = Math.PI;
    hp.add(hband);
    [-1, 1].forEach(side => {
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(scale(0.07), scale(0.07), scale(0.04), 20), darkMat);
      cup.rotation.z = Math.PI / 2;
      cup.position.set(side * scale(0.2), 0, 0);
      hp.add(cup);
      
      const neon = new THREE.Mesh(new THREE.RingGeometry(scale(0.04), scale(0.05), 32), glowPurple);
      neon.name = "headphone_neon";
      neon.position.set(side * scale(0.22), 0, 0);
      neon.rotation.y = Math.PI / 2;
      hp.add(neon);
    });
    hp.position.set(scale(0.4), scale(0.05), scale(0.4));
    hp.rotation.x = -Math.PI / 2.2;
    if (desk) desk.add(hp);
    else character.add(hp);
  }

  // 5. SMARTWATCH
  if (fArmL) {
    const watch = new THREE.Group();
    const band = new THREE.Mesh(new THREE.CylinderGeometry(scale(0.045), scale(0.047), scale(0.07), 16), darkMat);
    const face = new THREE.Mesh(new THREE.BoxGeometry(scale(0.055), scale(0.055), scale(0.015)), new THREE.MeshBasicMaterial({ color: 0x7c3aed }));
    face.name = "smartwatch_face";
    face.position.set(0, 0, scale(0.045));
    watch.add(band, face);
    watch.rotation.z = Math.PI / 2;
    watch.position.set(0, scale(-0.1), 0);
    fArmL.add(watch);
  }
}
