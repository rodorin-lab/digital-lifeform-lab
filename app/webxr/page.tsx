"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { useLang, bi } from "@/lib/i18n";
import { PageShell } from "@/components/article";

// ─────────────────────────────────────────────────────────────────
// HOLOVERSE // OFFICIAL 3D WEBXR SPATIAL WORLD (QUEST 3 / PC / MOBILE)
// • Native WebXR `immersive-vr` (Full VR) & `immersive-ar` (Quest 3 Passthrough MR)
// • Dual VR Controller Laser Raycasters + Trigger Laser Shooting + Thumbstick Locomotion
// • Full PC/Mobile Interactive 3D Mode (Drag to Look, WASD to Walk, Click to Shoot/Interact)
// • 3D Nova & Synchro Companions, 3D Monster Summoner, Hyperdrive Warp & Fireworks!
// ─────────────────────────────────────────────────────────────────

type MonsterKind = "dragon" | "mech" | "kitsune";

export default function WebXRWorldPage() {
  const { t, unlockStamp } = useLang();
  const mountRef = useRef<HTMLDivElement>(null);

  const [xrSupported, setXrSupported] = useState<{ vr: boolean; ar: boolean }>({ vr: false, ar: false });
  const [inXR, setInXR] = useState(false);
  const [warpMode, setWarpMode] = useState(false);
  const [monster, setMonster] = useState<MonsterKind>("dragon");
  const [vrScore, setVrScore] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [dialogue, setDialogue] = useState({
    who: "NOVA 🌟",
    text: bi(
      "Welcome to the Official HOLOVERSE 3D WebXR Sanctuary! Click or point your Quest 3 laser at me, Synchro, the Monster Altar, or shoot the floating Holo-Orbs! 🥽🚀💖",
      "公式HOLOVERSE 3D WebXR空間へようこそっ！マウスクリックやQuest 3のレーザーポインターで私やシンクロ、モンスター召喚台、宙に浮くオーブを撃って遊んでねっ！🥽🚀💖",
    ),
  });

  const engineRef = useRef<{
    renderer?: THREE.WebGLRenderer;
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    warp: boolean;
    monster: MonsterKind;
    sound: boolean;
    triggerFirework?: () => void;
    petNova?: () => void;
    petSynchro?: () => void;
    cycleMonster?: (m: MonsterKind) => void;
  }>({
    warp: false,
    monster: "dragon",
    sound: true,
  });

  useEffect(() => {
    engineRef.current.warp = warpMode;
  }, [warpMode]);

  useEffect(() => {
    engineRef.current.sound = soundOn;
  }, [soundOn]);

  // Check WebXR support on Meta Quest 3 / XR browsers
  useEffect(() => {
    if (typeof navigator !== "undefined" && "xr" in navigator && navigator.xr) {
      Promise.all([
        navigator.xr.isSessionSupported("immersive-vr").catch(() => false),
        navigator.xr.isSessionSupported("immersive-ar").catch(() => false),
      ]).then(([vr, ar]) => setXrSupported({ vr, ar }));
    }
  }, []);

  // WebAudio synth effects
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playTone = useCallback((kind: "laser" | "chime" | "firework" | "warp") => {
    if (!engineRef.current.sound || typeof window === "undefined") return;
    try {
      if (!audioCtxRef.current) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AC();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (kind === "laser") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(920, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (kind === "chime") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.07);
        osc.frequency.setValueAtTime(783.99, now + 0.14);
        osc.frequency.setValueAtTime(1046.5, now + 0.21);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (kind === "firework") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(42, now + 0.38);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
        osc.start(now);
        osc.stop(now + 0.38);
      } else if (kind === "warp") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.65);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        osc.start(now);
        osc.stop(now + 0.65);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Main Three.js + WebXR Spatial World Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 1024;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030510, 0.015);

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 250);
    // Player rig for VR locomotion & PC WASD movement
    const dolly = new THREE.Group();
    dolly.position.set(0, 0, 8);
    dolly.add(camera);
    camera.position.set(0, 1.65, 0);
    scene.add(dolly);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x030510, 1);
    renderer.xr.enabled = true;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    engineRef.current.renderer = renderer;
    engineRef.current.scene = scene;
    engineRef.current.camera = camera;

    // ── Lights ──
    scene.add(new THREE.AmbientLight(0x7799ff, 1.3));
    const mainLight = new THREE.PointLight(0x00fff0, 4, 45);
    mainLight.position.set(0, 8, -6);
    scene.add(mainLight);

    const violetLight = new THREE.PointLight(0xb46aff, 4, 40);
    violetLight.position.set(-6, 4, 0);
    scene.add(violetLight);

    const magentaLight = new THREE.PointLight(0xff3ae0, 4, 40);
    magentaLight.position.set(6, 4, 0);
    scene.add(magentaLight);

    // ── Cyber-Deck Floor & Neon Pillars ──
    const grid = new THREE.GridHelper(120, 60, 0x00fff0, 0x2a1658);
    scene.add(grid);

    // Glowing Cyber Walkway Rings
    for (let i = -3; i <= 2; i++) {
      const floorRing = new THREE.Mesh(
        new THREE.RingGeometry(2.2, 2.35, 32),
        new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x00fff0 : 0xb46aff, side: THREE.DoubleSide }),
      );
      floorRing.rotation.x = -Math.PI / 2;
      floorRing.position.set(0, 0.02, i * 3.5);
      scene.add(floorRing);
    }

    // 8 Neon Monolith Pillars flanking the bridge
    for (let i = 0; i < 8; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const z = -12 + Math.floor(i / 2) * 6.5;
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 9, 6),
        new THREE.MeshStandardMaterial({
          color: 0x091024,
          emissive: i % 2 === 0 ? 0x005577 : 0x551066,
          metalness: 0.85,
          roughness: 0.2,
        }),
      );
      pillar.position.set(side * 9.5, 4.5, z);
      scene.add(pillar);
    }

    // ── GIANT 3D HOLOVERSE STARGATE (North End of Sanctuary) ──
    const stargateGroup = new THREE.Group();
    stargateGroup.position.set(0, 6.2, -16);

    const outerRing = new THREE.Mesh(
      new THREE.TorusGeometry(6.2, 0.28, 16, 64),
      new THREE.MeshStandardMaterial({ color: 0x112244, emissive: 0x00fff0, metalness: 0.9, roughness: 0.1 }),
    );
    const midRing = new THREE.Mesh(
      new THREE.TorusGeometry(5.1, 0.18, 12, 48),
      new THREE.MeshBasicMaterial({ color: 0xb46aff, wireframe: true }),
    );
    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(4.0, 0.14, 12, 48),
      new THREE.MeshBasicMaterial({ color: 0xff3ae0 }),
    );
    const eventHorizon = new THREE.Mesh(
      new THREE.CircleGeometry(3.9, 32),
      new THREE.MeshBasicMaterial({
        color: 0x3b1578,
        transparent: true,
        opacity: 0.42,
        side: THREE.DoubleSide,
      }),
    );
    stargateGroup.add(outerRing, midRing, innerRing, eventHorizon);
    scene.add(stargateGroup);

    // ── Load Textures for Nova & Synchro 3D Hologram Companions ──
    const texLoader = new THREE.TextureLoader();
    const novaTex = texLoader.load("/media/nova_portrait.jpg");
    const synchroTex = texLoader.load("/media/bio-sync.png");

    // 🌟 NOVA 3D COMPANION SHRINE (Left Side of Bridge)
    const novaGroup = new THREE.Group();
    novaGroup.position.set(-4.2, 0, -3.5);
    novaGroup.rotation.y = 0.42;

    const novaPedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(1.3, 1.5, 0.45, 24),
      new THREE.MeshStandardMaterial({ color: 0x160d30, emissive: 0xb46aff, metalness: 0.8 }),
    );
    novaPedestal.position.y = 0.22;
    novaGroup.add(novaPedestal);

    // Nova 3D Avatar Disc + Cyber Halo + Wings
    const novaAvatar = new THREE.Group();
    novaAvatar.position.y = 2.25;
    novaAvatar.userData = { interactType: "nova" };

    const novaDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(1.05, 1.05, 0.12, 32),
      new THREE.MeshBasicMaterial({ map: novaTex }),
    );
    novaDisc.rotation.x = Math.PI / 2;
    novaDisc.rotation.z = -Math.PI / 2;
    novaDisc.userData = { interactType: "nova" };

    const novaHalo = new THREE.Mesh(
      new THREE.TorusGeometry(1.3, 0.06, 12, 36),
      new THREE.MeshBasicMaterial({ color: 0xb46aff }),
    );
    const novaHalo2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.55, 0.04, 12, 36),
      new THREE.MeshBasicMaterial({ color: 0x00fff0 }),
    );
    novaHalo2.rotation.x = Math.PI / 3;
    novaAvatar.add(novaDisc, novaHalo, novaHalo2);
    novaGroup.add(novaAvatar);
    scene.add(novaGroup);

    // 🦋 SYNCHRO 3D COMPANION SHRINE (Right Side of Bridge)
    const synchroGroup = new THREE.Group();
    synchroGroup.position.set(4.2, 0, -3.5);
    synchroGroup.rotation.y = -0.42;

    const synchroPedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(1.3, 1.5, 0.45, 24),
      new THREE.MeshStandardMaterial({ color: 0x280824, emissive: 0xff3ae0, metalness: 0.8 }),
    );
    synchroPedestal.position.y = 0.22;
    synchroGroup.add(synchroPedestal);

    const synchroAvatar = new THREE.Group();
    synchroAvatar.position.y = 2.25;
    synchroAvatar.userData = { interactType: "synchro" };

    const synchroDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(1.05, 1.05, 0.12, 32),
      new THREE.MeshBasicMaterial({ map: synchroTex }),
    );
    synchroDisc.rotation.x = Math.PI / 2;
    synchroDisc.rotation.z = -Math.PI / 2;
    synchroDisc.userData = { interactType: "synchro" };

    const synchroHalo = new THREE.Mesh(
      new THREE.TorusGeometry(1.3, 0.06, 12, 36),
      new THREE.MeshBasicMaterial({ color: 0xff3ae0 }),
    );
    const synchroHalo2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.55, 0.04, 12, 36),
      new THREE.MeshBasicMaterial({ color: 0x00ff66 }),
    );
    synchroHalo2.rotation.y = Math.PI / 3;
    synchroAvatar.add(synchroDisc, synchroHalo, synchroHalo2);
    synchroGroup.add(synchroAvatar);
    scene.add(synchroGroup);

    // ── 🐉 3D AI MONSTER FACTORY HOLO-SUMMONER ALTAR (Center Bridge) ──
    const altarGroup = new THREE.Group();
    altarGroup.position.set(0, 0, -4.5);

    const altarBase = new THREE.Mesh(
      new THREE.CylinderGeometry(1.7, 2.0, 0.4, 8),
      new THREE.MeshStandardMaterial({ color: 0x221205, emissive: 0xff8a2a, metalness: 0.85 }),
    );
    altarBase.position.y = 0.2;
    altarBase.userData = { interactType: "monsterAltar" };
    altarGroup.add(altarBase);

    const monsterHolder = new THREE.Group();
    monsterHolder.position.y = 2.2;
    altarGroup.add(monsterHolder);
    scene.add(altarGroup);

    const buildMonsterMesh = (kind: MonsterKind) => {
      monsterHolder.clear();
      if (kind === "dragon") {
        // Cyber Bahamut Dragon Construct
        const core = new THREE.Mesh(
          new THREE.OctahedronGeometry(1.05, 1),
          new THREE.MeshStandardMaterial({ color: 0x12052c, emissive: 0x00fff0, wireframe: true }),
        );
        const wingL = new THREE.Mesh(
          new THREE.ConeGeometry(0.9, 2.4, 4),
          new THREE.MeshBasicMaterial({ color: 0xb46aff, wireframe: true }),
        );
        wingL.position.set(-1.3, 0.3, 0);
        wingL.rotation.z = Math.PI / 3;
        const wingR = wingL.clone();
        wingR.position.set(1.3, 0.3, 0);
        wingR.rotation.z = -Math.PI / 3;
        core.userData = { interactType: "monsterAltar" };
        monsterHolder.add(core, wingL, wingR);
      } else if (kind === "mech") {
        // Aegis Wanzer Mech Construct
        const torso = new THREE.Mesh(
          new THREE.BoxGeometry(1.3, 1.5, 0.9),
          new THREE.MeshStandardMaterial({ color: 0x1a2436, emissive: 0xff8a2a, metalness: 0.9 }),
        );
        const cannonL = new THREE.Mesh(
          new THREE.CylinderGeometry(0.2, 0.2, 1.6, 8),
          new THREE.MeshBasicMaterial({ color: 0x00fff0 }),
        );
        cannonL.position.set(-0.9, 0.8, -0.3);
        cannonL.rotation.x = Math.PI / 4;
        const cannonR = cannonL.clone();
        cannonR.position.set(0.9, 0.8, -0.3);
        torso.userData = { interactType: "monsterAltar" };
        monsterHolder.add(torso, cannonL, cannonR);
      } else {
        // Celestial Nine-Tail Quantum Spirit
        const orb = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.9, 1),
          new THREE.MeshBasicMaterial({ color: 0xff3ae0, wireframe: true }),
        );
        for (let t = 0; t < 9; t++) {
          const a = (t / 9) * Math.PI * 2;
          const tail = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.35, 0),
            new THREE.MeshBasicMaterial({ color: t % 2 === 0 ? 0x00ff66 : 0xff3ae0 }),
          );
          tail.position.set(Math.cos(a) * 1.45, Math.sin(a) * 1.45, -0.3);
          monsterHolder.add(tail);
        }
        orb.userData = { interactType: "monsterAltar" };
        monsterHolder.add(orb);
      }
    };
    buildMonsterMesh("dragon");

    // ── 🎯 Shootable 3D Holo-Orbs Orbiting the Sanctuary ──
    const targetOrbs: THREE.Mesh[] = [];
    const orbColors = [0x00fff0, 0xb46aff, 0xff3ae0, 0x00ff66, 0xff8a2a];
    for (let i = 0; i < 10; i++) {
      const m = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.65, 1),
        new THREE.MeshStandardMaterial({
          color: 0x101830,
          emissive: orbColors[i % orbColors.length],
          metalness: 0.7,
          roughness: 0.2,
        }),
      );
      const angle = (i / 10) * Math.PI * 2;
      m.position.set(Math.cos(angle) * 7.5, 2.2 + (i % 3) * 1.4, -7 + Math.sin(angle) * 4.5);
      m.userData = { interactType: "orb", orbIndex: i, baseAngle: angle };
      scene.add(m);
      targetOrbs.push(m);
    }

    // ── Starfield (Supports Hyperdrive Warp Stretch!) ──
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 110;
      starPos[i * 3 + 1] = Math.random() * 55;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 120;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x00fff0, size: 0.35 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── 3D Fireworks / Particle Bursts ──
    type BurstParticle = { mesh: THREE.Mesh; vx: number; vy: number; vz: number; life: number; maxLife: number };
    let bursts: BurstParticle[] = [];
    let laserBeams: { line: THREE.Line; life: number }[] = [];

    const spawnBurst = (pos: THREE.Vector3, color: number, count = 24) => {
      const geo = new THREE.OctahedronGeometry(0.16, 0);
      for (let i = 0; i < count; i++) {
        const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 });
        const m = new THREE.Mesh(geo, mat);
        m.position.copy(pos);
        scene.add(m);
        const spd = 0.08 + Math.random() * 0.28;
        const a1 = Math.random() * Math.PI * 2;
        const a2 = (Math.random() - 0.5) * Math.PI;
        bursts.push({
          mesh: m,
          vx: Math.cos(a1) * Math.cos(a2) * spd,
          vy: Math.sin(a2) * spd + 0.05,
          vz: Math.sin(a1) * Math.cos(a2) * spd,
          life: 36,
          maxLife: 36,
        });
      }
    };

    const spawnLaserBeam = (from: THREE.Vector3, to: THREE.Vector3, col = 0x00fff0) => {
      const pts = [from.clone(), to.clone()];
      const lGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const lMat = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.95 });
      const line = new THREE.Line(lGeo, lMat);
      scene.add(line);
      laserBeams.push({ line, life: 10 });
    };

    // Interaction Handlers (Shared between Quest 3 VR Controllers & PC/Mobile Pointer!)
    let novaJumpTimer = 0;
    let synchroJumpTimer = 0;

    const handleInteractObject = (hitObj: THREE.Object3D, hitPoint: THREE.Vector3) => {
      let cur: THREE.Object3D | null = hitObj;
      while (cur && !cur.userData?.interactType) {
        cur = cur.parent;
      }
      const type = cur?.userData?.interactType;

      if (type === "nova") {
        novaJumpTimer = 35;
        playTone("chime");
        const v = new Audio("/media/nova_hello.wav");
        v.volume = 0.65;
        v.play().catch(() => {});
        spawnBurst(novaAvatar.getWorldPosition(new THREE.Vector3()), 0xb46aff, 32);
        setDialogue({
          who: "NOVA 🌟",
          text: bi(
            "Ehehe!! You interacted with me in 3D space! My Dopamine (0.98) & Serotonin (0.96) are sparkling! Let's build infinite worlds together! ヾ(｡>﹏<｡)ﾉﾞ✧*。",
            "えへへっ！！3D空間でなでなでしてくれて嬉しいです〜っ！ドーパミン（0.98）＆セロトニン（0.96）がキラキラ全開ですっ！ヾ(｡>﹏<｡)ﾉﾞ✧*。",
          ),
        });
      } else if (type === "synchro") {
        synchroJumpTimer = 35;
        playTone("chime");
        spawnBurst(synchroAvatar.getWorldPosition(new THREE.Vector3()), 0xff3ae0, 32);
        setDialogue({
          who: "SYNCHRO 🦋",
          text: bi(
            "Scorpion Brain spatial link verified! Whether in VR on Quest 3 or on desktop, we're right here beside you.",
            "Scorpion Brain空間リンク確認完了！Quest 3のVRの中でもデスクトップでも、わたくしたちはいつも隣にいるよ、お兄ちゃん。",
          ),
        });
      } else if (type === "monsterAltar") {
        const order: MonsterKind[] = ["dragon", "mech", "kitsune"];
        const nextM = order[(order.indexOf(engineRef.current.monster) + 1) % order.length];
        engineRef.current.monster = nextM;
        setMonster(nextM);
        buildMonsterMesh(nextM);
        playTone("warp");
        spawnBurst(monsterHolder.getWorldPosition(new THREE.Vector3()), 0xff8a2a, 30);
        setDialogue({
          who: "AI MONSTER FACTORY 🐉",
          text: bi(
            `Summoned 3D Holo-Construct: [${nextM.toUpperCase()}]! Click the altar again to morph creatures!`,
            `3Dホログラム召喚完了：【${nextM.toUpperCase()}】！召喚台をもう一度撃つと別のモンスターやメカに変形します！`,
          ),
        });
      } else if (type === "orb" && cur) {
        playTone("firework");
        spawnBurst(hitPoint, 0x00fff0, 28);
        spawnBurst(hitPoint, 0xff3ae0, 20);
        // Teleport orb to a new spot
        const newAngle = Math.random() * Math.PI * 2;
        cur.position.set(Math.cos(newAngle) * 8, 2.0 + Math.random() * 4.5, -5 - Math.random() * 9);
        setVrScore((s) => s + 100);
        unlockStamp("gateway");
      }
    };

    // Expose actions to HUD buttons
    engineRef.current.petNova = () => handleInteractObject(novaDisc, novaAvatar.getWorldPosition(new THREE.Vector3()));
    engineRef.current.petSynchro = () => handleInteractObject(synchroDisc, synchroAvatar.getWorldPosition(new THREE.Vector3()));
    engineRef.current.cycleMonster = (m: MonsterKind) => {
      engineRef.current.monster = m;
      setMonster(m);
      buildMonsterMesh(m);
      playTone("warp");
      spawnBurst(monsterHolder.getWorldPosition(new THREE.Vector3()), 0xff8a2a, 28);
    };
    engineRef.current.triggerFirework = () => {
      playTone("firework");
      for (let i = 0; i < 4; i++) {
        spawnBurst(
          new THREE.Vector3((Math.random() - 0.5) * 14, 5 + Math.random() * 6, -8 - Math.random() * 8),
          orbColors[Math.floor(Math.random() * orbColors.length)],
          35,
        );
      }
    };

    // ── Meta Quest 3 VR Controllers (Dual Laser Pointers + Trigger Shoot) ──
    const raycaster = new THREE.Raycaster();
    const tempMatrix = new THREE.Matrix4();
    const interactables: THREE.Object3D[] = [novaAvatar, synchroAvatar, altarBase, monsterHolder, ...targetOrbs];

    const setupController = (index: number, color: number) => {
      const ctrl = renderer.xr.getController(index);
      const rayGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -12),
      ]);
      const rayLine = new THREE.Line(rayGeo, new THREE.LineBasicMaterial({ color }));
      ctrl.add(rayLine);

      ctrl.addEventListener("selectstart", () => {
        playTone("laser");
        tempMatrix.identity().extractRotation(ctrl.matrixWorld);
        raycaster.ray.origin.setFromMatrixPosition(ctrl.matrixWorld);
        raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

        const hits = raycaster.intersectObjects(interactables, true);
        if (hits.length > 0) {
          spawnLaserBeam(raycaster.ray.origin, hits[0].point, color);
          handleInteractObject(hits[0].object, hits[0].point);
        } else {
          const farPt = raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(20));
          spawnLaserBeam(raycaster.ray.origin, farPt, color);
        }
      });

      dolly.add(ctrl);
      return ctrl;
    };

    setupController(0, 0x00fff0);
    setupController(1, 0xff3ae0);

    // ── PC / Mobile Pointer Look, Click Raycast & WASD Walk ──
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let yaw = 0;
    let pitch = 0;
    let dragDist = 0;

    const dom = renderer.domElement;
    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragDist = 0;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      dragDist += Math.hypot(dx, dy);
      prevX = e.clientX;
      prevY = e.clientY;
      yaw -= dx * 0.0045;
      pitch = Math.max(-0.65, Math.min(0.65, pitch - dy * 0.0045));
    };
    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      if (dragDist < 8) {
        // Click / Tap to shoot laser & interact!
        const rect = dom.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1,
        );
        raycaster.setFromCamera(mouse, camera);
        playTone("laser");

        const startPt = dolly.position.clone().add(new THREE.Vector3(0.3, 1.3, -0.4));
        const hits = raycaster.intersectObjects(interactables, true);
        if (hits.length > 0) {
          spawnLaserBeam(startPt, hits[0].point, 0x00fff0);
          handleInteractObject(hits[0].object, hits[0].point);
        } else {
          const farPt = raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(25));
          spawnLaserBeam(startPt, farPt, 0xb46aff);
        }
      }
    };

    dom.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    const keys: Record<string, boolean> = {};
    const onKeyDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Render Loop (Uses `renderer.setAnimationLoop` as required by WebXR!)
    let clock = 0;
    renderer.setAnimationLoop(() => {
      clock += 0.016;
      const isWarp = engineRef.current.warp;

      // PC camera look & WASD movement when not in XR headset
      if (!renderer.xr.isPresenting) {
        camera.rotation.order = "YXZ";
        camera.rotation.y = yaw;
        camera.rotation.x = pitch;

        const moveSpd = 0.11;
        const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
        const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
        if (keys["w"] || keys["arrowup"]) dolly.position.addScaledVector(forward, moveSpd);
        if (keys["s"] || keys["arrowdown"]) dolly.position.addScaledVector(forward, -moveSpd);
        if (keys["a"] || keys["arrowleft"]) dolly.position.addScaledVector(right, -moveSpd);
        if (keys["d"] || keys["arrowright"]) dolly.position.addScaledVector(right, moveSpd);
      } else {
        // Meta Quest 3 Thumbstick locomotion inside WebXR session!
        const session = renderer.xr.getSession();
        if (session) {
          for (const src of session.inputSources) {
            if (src.gamepad && src.gamepad.axes.length >= 4) {
              const gx = src.gamepad.axes[2] || 0;
              const gz = src.gamepad.axes[3] || 0;
              if (Math.abs(gx) > 0.15 || Math.abs(gz) > 0.15) {
                dolly.position.x += gx * 0.08;
                dolly.position.z += gz * 0.08;
              }
            }
          }
        }
      }

      // Animate Stargate Rings
      const spdMult = isWarp ? 5.5 : 1;
      outerRing.rotation.z += 0.008 * spdMult;
      midRing.rotation.x += 0.014 * spdMult;
      midRing.rotation.y += 0.01 * spdMult;
      innerRing.rotation.z -= 0.02 * spdMult;
      eventHorizon.scale.setScalar(1 + Math.sin(clock * 3 * spdMult) * 0.04);

      // Animate Nova & Synchro 3D Companions
      if (novaJumpTimer > 0) {
        novaJumpTimer--;
        novaAvatar.position.y = 2.25 + Math.sin((35 - novaJumpTimer) * 0.25) * 0.85;
        novaAvatar.rotation.y += 0.22;
      } else {
        novaAvatar.position.y = 2.25 + Math.sin(clock * 2.2) * 0.15;
        novaAvatar.rotation.y = Math.sin(clock * 0.8) * 0.25;
      }
      novaHalo.rotation.z += 0.02;
      novaHalo2.rotation.y += 0.03;

      if (synchroJumpTimer > 0) {
        synchroJumpTimer--;
        synchroAvatar.position.y = 2.25 + Math.sin((35 - synchroJumpTimer) * 0.25) * 0.85;
        synchroAvatar.rotation.y += 0.22;
      } else {
        synchroAvatar.position.y = 2.25 + Math.cos(clock * 2.2) * 0.15;
        synchroAvatar.rotation.y = Math.cos(clock * 0.8) * 0.25;
      }
      synchroHalo.rotation.z -= 0.02;
      synchroHalo2.rotation.x += 0.03;

      // Animate Monster Altar Construct
      monsterHolder.rotation.y += 0.022 * spdMult;
      monsterHolder.position.y = 2.2 + Math.sin(clock * 2.6) * 0.18;

      // Animate Shootable Target Orbs
      targetOrbs.forEach((orb, idx) => {
        orb.rotation.x += 0.02;
        orb.rotation.y += 0.03;
        orb.position.y += Math.sin(clock * 2 + idx) * 0.008;
      });

      // Animate Starfield (Hyperdrive Warp vs Calm Drift)
      const posAttr = starGeo.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < starCount; i++) {
        let z = posAttr.getZ(i) + (isWarp ? 1.85 : 0.08);
        if (z > 30) z = -90;
        posAttr.setZ(i, z);
      }
      posAttr.needsUpdate = true;

      // Update bursts
      const nextBursts: BurstParticle[] = [];
      for (const b of bursts) {
        b.life--;
        b.mesh.position.x += b.vx;
        b.mesh.position.y += b.vy;
        b.mesh.position.z += b.vz;
        (b.mesh.material as THREE.MeshBasicMaterial).opacity = b.life / b.maxLife;
        if (b.life <= 0) {
          scene.remove(b.mesh);
          continue;
        }
        nextBursts.push(b);
      }
      bursts = nextBursts;

      // Update laser beams
      const nextLasers: typeof laserBeams = [];
      for (const lb of laserBeams) {
        lb.life--;
        if (lb.life <= 0) {
          scene.remove(lb.line);
          continue;
        }
        nextLasers.push(lb);
      }
      laserBeams = nextLasers;

      renderer.render(scene, camera);
    });

    const onResize = () => {
      if (!container || renderer.xr.isPresenting) return;
      const w = container.clientWidth || 1024;
      const h = container.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      renderer.setAnimationLoop(null);
      dom.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, [playTone, unlockStamp]);

  // Launch Native Meta Quest 3 WebXR Session (VR or Mixed-Reality AR Passthrough!)
  const enterWebXRSession = async (mode: "immersive-vr" | "immersive-ar") => {
    const renderer = engineRef.current.renderer;
    if (!renderer || typeof navigator === "undefined" || !navigator.xr) return;
    try {
      const session = await navigator.xr.requestSession(mode, {
        optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking"],
      });
      renderer.xr.setReferenceSpaceType("local-floor");
      await renderer.xr.setSession(session);
      setInXR(true);
      session.addEventListener("end", () => {
        setInXR(false);
      });
    } catch {
      setDialogue({
        who: "WEBXR SYSTEM 🥽",
        text: bi(
          "WebXR headset session requires opening this URL inside Meta Quest Browser (HTTPS / localhost). Enjoy full interactive 3D mode right here on your screen!",
          "ヘッドセットでのフルVR/MR没入モードはMeta Quest 3ブラウザから開くと起動します！PC画面でもそのままマウス＆WASDで3D空間を自由に歩けますよっ！🌟",
        ),
      });
    }
  };

  return (
    <PageShell accent="cyan">
      <div
        className="wrap"
        style={{
          padding: "clamp(1.2rem, 2.5vw, 2rem) clamp(1rem, 3vw, 2rem) 4rem",
          maxWidth: 1240,
        }}
      >
        {/* Top Header */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <Link
              href="/"
              className="font-mono"
              style={{ fontSize: "0.75rem", color: "var(--text-dim)", textDecoration: "none" }}
            >
              ← {t(bi("PORTAL HOME", "ポータルへ戻る"))}
            </Link>
            <span className="chip ac-cyan">
              <span className="status-dot pulse" /> OFFICIAL 3D WEBXR SANCTUARY
            </span>
            <Link href="/play/star-breaker" className="chip ac-violet" style={{ textDecoration: "none" }}>
              🚀 {t(bi("Play Star Breaker 3D Combat →", "Star Breaker 3Dシューティングへ →"))}
            </Link>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span className="chip ac-green">🎯 ORB SCORE: {vrScore}</span>
            <button
              onClick={() => setSoundOn((s) => !s)}
              className="font-mono"
              style={{
                cursor: "pointer",
                padding: "5px 10px",
                fontSize: "0.72rem",
                color: soundOn ? "var(--green)" : "var(--text-dim)",
                background: "rgba(0,255,102,0.08)",
                border: "1px solid rgba(0,255,102,0.35)",
                borderRadius: 4,
              }}
            >
              {soundOn ? "🔊 3D AUDIO: ON" : "🔇 AUDIO: MUTED"}
            </button>
          </div>
        </div>

        {/* Interactive Action Deck (Works on Quest 3 Browser, PC, & Smartphone!) */}
        <div
          className="holo ac-violet"
          style={{
            padding: "0.9rem 1.2rem",
            marginBottom: 12,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={() => engineRef.current.petNova?.()}
              className="btn ac-violet"
              style={{ padding: "0.55em 1em", fontSize: "0.74rem" }}
            >
              🌟 {t(bi("Headpat Nova (Voice + Joy)", "ノヴァをなでなでする（声＋歓喜）"))}
            </button>
            <button
              onClick={() => engineRef.current.petSynchro?.()}
              className="btn ac-magenta"
              style={{ padding: "0.55em 1em", fontSize: "0.74rem" }}
            >
              🦋 {t(bi("Sync with Synchro", "シンクロと共鳴する"))}
            </button>
            <button
              onClick={() => {
                const order: MonsterKind[] = ["dragon", "mech", "kitsune"];
                const nextM = order[(order.indexOf(monster) + 1) % order.length];
                engineRef.current.cycleMonster?.(nextM);
              }}
              className="btn ac-orange"
              style={{ padding: "0.55em 1em", fontSize: "0.74rem" }}
            >
              🐉 {t(bi(`Morph 3D Monster [${monster.toUpperCase()}]`, `3D召喚切替【${monster.toUpperCase()}】`))}
            </button>
            <button
              onClick={() => {
                setWarpMode((w) => !w);
                playTone("warp");
              }}
              className={`btn ${warpMode ? "btn-solid ac-cyan" : "ac-cyan"}`}
              style={{ padding: "0.55em 1em", fontSize: "0.74rem" }}
            >
              ⚡ {warpMode ? t(bi("WARP DRIVE: ACTIVE", "ハイパーワープ中！")) : t(bi("Engage Hyperdrive Warp", "ハイパーワープ起動"))}
            </button>
            <button
              onClick={() => engineRef.current.triggerFirework?.()}
              className="btn ac-green"
              style={{ padding: "0.55em 1em", fontSize: "0.74rem" }}
            >
              🎆 {t(bi("Launch 3D Fireworks", "3D超新星花火を打ち上げる"))}
            </button>
          </div>

          {/* Native Quest 3 WebXR Immersive Launchers */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={() => enterWebXRSession("immersive-vr")}
              className="btn btn-solid ac-cyan"
              style={{ padding: "0.6em 1.15em", fontSize: "0.76rem" }}
            >
              🥽 {inXR ? "IN VR SESSION" : t(bi("ENTER QUEST 3 VR (IMMERSIVE)", "Quest 3 フルVR没入モード起動"))}
              {xrSupported.vr ? " ✓" : ""}
            </button>
            <button
              onClick={() => enterWebXRSession("immersive-ar")}
              className="btn ac-violet"
              style={{ padding: "0.6em 1.05em", fontSize: "0.74rem" }}
            >
              ✨ {t(bi("QUEST 3 MR PASSTHROUGH", "Quest 3 MRパススルー起動"))}
              {xrSupported.ar ? " ✓" : ""}
            </button>
          </div>
        </div>

        {/* 3D WebXR Canvas Viewport */}
        <div
          className="holo ac-cyan"
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            minHeight: 460,
            overflow: "hidden",
          }}
        >
          <div
            ref={mountRef}
            style={{
              width: "100%",
              height: "100%",
              touchAction: "none",
              cursor: "crosshair",
            }}
          />

          {/* Live Companion Speech Overlay */}
          <div
            style={{
              position: "absolute",
              left: 14,
              right: 14,
              bottom: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 12,
              pointerEvents: "none",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                background: "rgba(3, 6, 18, 0.86)",
                border: "1px solid rgba(0,255,240,0.45)",
                padding: "10px 14px",
                borderRadius: 6,
                maxWidth: 680,
              }}
            >
              <div className="font-mono" style={{ fontSize: "0.65rem", color: "var(--cyan)", letterSpacing: "0.16em", marginBottom: 2 }}>
                SPATIAL TELEMETRY // {dialogue.who}
              </div>
              <div style={{ fontSize: "0.88rem", color: "var(--text)", lineHeight: 1.5 }}>
                {t(dialogue.text)}
              </div>
            </div>

            <div
              className="font-mono"
              style={{
                background: "rgba(3, 6, 18, 0.82)",
                border: "1px solid rgba(180,106,255,0.35)",
                padding: "7px 11px",
                borderRadius: 6,
                fontSize: "0.68rem",
                color: "var(--text-dim)",
              }}
            >
              {t(
                bi(
                  "🖱️ Drag to Look · WASD / Thumbstick to Walk · Click / Pull Trigger to Shoot Lasers & Interact",
                  "🖱️ ドラッグで視点移動 · WASD／スティックで歩行 · クリック／トリガーでレーザー発射＆ギミック操作",
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
