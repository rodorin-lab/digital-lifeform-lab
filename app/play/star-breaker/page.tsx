"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { useLang, bi } from "@/lib/i18n";
import { PageShell } from "@/components/article";

// ─────────────────────────────────────────────────────────────────
// HOLOVERSE: STAR BREAKER 3D — NEURO-OVERDRIVE EDITION
// Full Three.js 3D WebGL Space Combat + Procedural WebAudio Synthwave
// + 4 Weapon Tiers + 3D Boss Battles + Nova Supernova Ultimate Skill
// ─────────────────────────────────────────────────────────────────

type Enemy3D = {
  mesh: THREE.Group;
  kind: "drone" | "cruiser" | "crystal" | "boss";
  hp: number;
  maxHp: number;
  vx: number;
  vy: number;
  vz: number;
  shootTimer: number;
  phase: number;
};

type Bullet3D = {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
  fromPlayer: boolean;
  homing?: boolean;
  dmg: number;
};

type Particle3D = {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
};

export default function StarBreakerPage() {
  const { t, unlockStamp } = useLang();
  const mountRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [hull, setHull] = useState(100);
  const [overdrive, setOverdrive] = useState(100);
  const [weaponLv, setWeaponLv] = useState(1);
  const [combo, setCombo] = useState(0);
  const [wave, setWave] = useState(1);
  const [bossHp, setBossHp] = useState<{ cur: number; max: number } | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [speaker, setSpeaker] = useState<"NOVA" | "SYNCHRO">("NOVA");
  const [commText, setCommText] = useState({
    en: "All 3D weapons & thrusters online! Press LAUNCH to dive into the Stargate Trench! 🌟🚀",
    ja: "3Dウェポン＆スラスター全開！LAUNCHを押してスターゲイト防衛戦へ出撃しましょうっ！🌟🚀",
  });

  // Mutable refs for 60/90/120fps game loop
  const stateRef = useRef({
    playing: false,
    score: 0,
    hull: 100,
    overdrive: 100,
    weaponLv: 1,
    combo: 0,
    wave: 1,
    targetX: 0,
    targetY: 0,
    rollTimer: 0,
    shockwaveTimer: 0,
    soundOn: true,
    triggerUltimate: false,
    triggerRoll: false,
  });

  useEffect(() => {
    stateRef.current.soundOn = soundOn;
  }, [soundOn]);

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem("holoverse-starbreaker-best") || "0");
      if (saved > 0) setBest(saved);
    } catch {
      /* ignore */
    }
  }, []);

  // WebAudio procedural sound generator
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playSfx = useCallback(
    (type: "laser" | "hit" | "boom" | "powerup" | "ultimate" | "bossAlert") => {
      if (!stateRef.current.soundOn || typeof window === "undefined") return;
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

        if (type === "laser") {
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(780, now);
          osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        } else if (type === "hit") {
          osc.type = "square";
          osc.frequency.setValueAtTime(240, now);
          osc.frequency.exponentialRampToValueAtTime(70, now + 0.07);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
          osc.start(now);
          osc.stop(now + 0.07);
        } else if (type === "boom") {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.exponentialRampToValueAtTime(28, now + 0.32);
          gain.gain.setValueAtTime(0.22, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
          osc.start(now);
          osc.stop(now + 0.32);
        } else if (type === "powerup") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.setValueAtTime(660, now + 0.06);
          osc.frequency.setValueAtTime(880, now + 0.12);
          osc.frequency.setValueAtTime(1320, now + 0.18);
          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
          osc.start(now);
          osc.stop(now + 0.28);
        } else if (type === "ultimate") {
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.55);
          gain.gain.setValueAtTime(0.24, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
          osc.start(now);
          osc.stop(now + 0.6);
          // Also play Nova voice clip if available
          const v = new Audio("/media/nova_hello.wav");
          v.volume = 0.55;
          v.play().catch(() => {});
        } else if (type === "bossAlert") {
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.setValueAtTime(260, now + 0.18);
          osc.frequency.setValueAtTime(180, now + 0.36);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
          osc.start(now);
          osc.stop(now + 0.55);
        }
      } catch {
        /* ignore audio errors */
      }
    },
    [],
  );

  const startGame = () => {
    unlockStamp("hangar");
    stateRef.current = {
      ...stateRef.current,
      playing: true,
      score: 0,
      hull: 100,
      overdrive: 100,
      weaponLv: 1,
      combo: 0,
      wave: 1,
      targetX: 0,
      targetY: 0,
      rollTimer: 0,
      shockwaveTimer: 0,
      triggerUltimate: false,
      triggerRoll: false,
    };
    setScore(0);
    setHull(100);
    setOverdrive(100);
    setWeaponLv(1);
    setCombo(0);
    setWave(1);
    setBossHp(null);
    setPhase("playing");
    setSpeaker("NOVA");
    setCommText({
      en: "STRIKER-NOVA launched! Collect Violet Crystals to upgrade weapons to LV.4! Press SPACE for Supernova Overdrive! 🌟",
      ja: "ストライカー・ノヴァ発進！紫のクリスタルを集めると武器がLV.4まで超進化します！SPACEキーで超新星必殺技ですっ！🌟",
    });
    playSfx("powerup");
  };

  const fireUltimate = () => {
    if (stateRef.current.overdrive >= 100 && stateRef.current.playing) {
      stateRef.current.triggerUltimate = true;
    }
  };

  const fireBarrelRoll = () => {
    if (stateRef.current.rollTimer <= 0 && stateRef.current.playing) {
      stateRef.current.triggerRoll = true;
    }
  };

  // Three.js 3D Engine & Combat Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 540;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040612, 0.012);

    const camera = new THREE.PerspectiveCamera(62, width / height, 0.1, 220);
    camera.position.set(0, 3.8, 13.5);
    camera.lookAt(0, 0.5, -20);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x03040c, 1);
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0x6688ff, 1.1);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0x00fff0, 2.2);
    dirLight.position.set(8, 18, 12);
    scene.add(dirLight);

    const shipLight = new THREE.PointLight(0xb46aff, 3.5, 25);
    scene.add(shipLight);

    // ── Cyber Trench Grid & Speed Stars ──
    const gridHelper = new THREE.GridHelper(180, 60, 0x00fff0, 0x3b1d7a);
    gridHelper.position.y = -4.2;
    gridHelper.position.z = -40;
    scene.add(gridHelper);

    const topGrid = new THREE.GridHelper(180, 40, 0xff3ae0, 0x1a103c);
    topGrid.position.y = 11.5;
    topGrid.position.z = -40;
    scene.add(topGrid);

    // Starfield particles
    const starGeo = new THREE.BufferGeometry();
    const starCount = 450;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 90;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 45;
      starPos[i * 3 + 2] = -Math.random() * 140;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x00fff0, size: 0.35, transparent: true, opacity: 0.85 });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // ── Build Detailed 3D Player Starfighter (STRIKER-NOVA X-01) ──
    const playerGroup = new THREE.Group();

    // Fuselage core
    const bodyGeo = new THREE.ConeGeometry(0.75, 3.4, 6);
    bodyGeo.rotateX(Math.PI / 2);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0e1830,
      emissive: 0x005577,
      metalness: 0.85,
      roughness: 0.2,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    playerGroup.add(bodyMesh);

    // Cockpit canopy
    const canopyGeo = new THREE.OctahedronGeometry(0.45, 1);
    canopyGeo.scale(0.85, 0.55, 1.8);
    const canopyMat = new THREE.MeshBasicMaterial({ color: 0x00fff0, wireframe: false });
    const canopyMesh = new THREE.Mesh(canopyGeo, canopyMat);
    canopyMesh.position.set(0, 0.32, 0.2);
    playerGroup.add(canopyMesh);

    // Swept Cyber Wings
    const wingGeo = new THREE.BoxGeometry(3.8, 0.12, 1.3);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x1e1040,
      emissive: 0x6b21a8,
      metalness: 0.7,
      roughness: 0.3,
    });
    const wingMesh = new THREE.Mesh(wingGeo, wingMat);
    wingMesh.position.set(0, -0.05, 0.4);
    playerGroup.add(wingMesh);

    // Wingtip Laser Pods
    const podGeo = new THREE.CylinderGeometry(0.14, 0.14, 1.8, 8);
    podGeo.rotateX(Math.PI / 2);
    const podMat = new THREE.MeshBasicMaterial({ color: 0x00fff0 });
    const leftPod = new THREE.Mesh(podGeo, podMat);
    leftPod.position.set(-1.85, 0, 0.2);
    const rightPod = new THREE.Mesh(podGeo, podMat);
    rightPod.position.set(1.85, 0, 0.2);
    playerGroup.add(leftPod, rightPod);

    // Glowing Thruster Flame
    const thrusterGeo = new THREE.ConeGeometry(0.45, 1.5, 8);
    thrusterGeo.rotateX(-Math.PI / 2);
    const thrusterMat = new THREE.MeshBasicMaterial({ color: 0xff3ae0 });
    const thrusterMesh = new THREE.Mesh(thrusterGeo, thrusterMat);
    thrusterMesh.position.set(0, 0, 2.2);
    playerGroup.add(thrusterMesh);

    // Barrel-Roll Energy Shield Sphere
    const shieldGeo = new THREE.SphereGeometry(2.3, 16, 16);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x00fff0,
      wireframe: true,
      transparent: true,
      opacity: 0.0,
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    playerGroup.add(shieldMesh);

    // Supernova Ultimate Shockwave Ring
    const shockGeo = new THREE.RingGeometry(1, 2.4, 32);
    shockGeo.rotateX(-Math.PI / 2);
    const shockMat = new THREE.MeshBasicMaterial({
      color: 0xb46aff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    const shockMesh = new THREE.Mesh(shockGeo, shockMat);
    scene.add(shockMesh);

    playerGroup.position.set(0, 0, 6);
    scene.add(playerGroup);

    // Collections
    let enemies: Enemy3D[] = [];
    let bullets: Bullet3D[] = [];
    let particles: Particle3D[] = [];
    let frame = 0;
    let nextBossScore = 450;

    // Helper: spawn 3D explosion particles
    const spawnExplosion = (pos: THREE.Vector3, color: number, count = 16, scale = 1) => {
      const geo = new THREE.OctahedronGeometry(0.22 * scale, 0);
      for (let i = 0; i < count; i++) {
        const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 });
        const m = new THREE.Mesh(geo, mat);
        m.position.copy(pos);
        scene.add(m);
        const speed = (0.15 + Math.random() * 0.45) * scale;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;
        particles.push({
          mesh: m,
          vx: Math.cos(theta) * Math.cos(phi) * speed,
          vy: Math.sin(phi) * speed,
          vz: Math.sin(theta) * Math.cos(phi) * speed,
          life: 28,
          maxLife: 28,
        });
      }
    };

    // Helper: build Enemy 3D Mesh
    const createEnemy = (kind: Enemy3D["kind"], zPos = -75) => {
      const g = new THREE.Group();
      if (kind === "drone") {
        const m = new THREE.Mesh(
          new THREE.OctahedronGeometry(1.15, 0),
          new THREE.MeshStandardMaterial({ color: 0x220828, emissive: 0xff3ae0, metalness: 0.7, roughness: 0.2 }),
        );
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(1.45, 0.08, 8, 20),
          new THREE.MeshBasicMaterial({ color: 0x00fff0 }),
        );
        g.add(m, ring);
        g.position.set((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 6, zPos);
        scene.add(g);
        enemies.push({
          mesh: g,
          kind,
          hp: 2 + Math.floor(stateRef.current.wave * 0.5),
          maxHp: 2 + Math.floor(stateRef.current.wave * 0.5),
          vx: (Math.random() - 0.5) * 0.14,
          vy: (Math.random() - 0.5) * 0.08,
          vz: 0.48 + Math.min(0.45, stateRef.current.wave * 0.05),
          shootTimer: 40 + Math.floor(Math.random() * 50),
          phase: Math.random() * Math.PI * 2,
        });
      } else if (kind === "cruiser") {
        const core = new THREE.Mesh(
          new THREE.DodecahedronGeometry(1.75, 0),
          new THREE.MeshStandardMaterial({ color: 0x281008, emissive: 0xff8a2a, metalness: 0.8, roughness: 0.2 }),
        );
        const halo = new THREE.Mesh(
          new THREE.TorusGeometry(2.3, 0.15, 8, 24),
          new THREE.MeshBasicMaterial({ color: 0xff3ae0 }),
        );
        halo.rotation.x = Math.PI / 3;
        g.add(core, halo);
        g.position.set((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 5, zPos);
        scene.add(g);
        const hp = 8 + stateRef.current.wave * 2;
        enemies.push({
          mesh: g,
          kind,
          hp,
          maxHp: hp,
          vx: (Math.random() - 0.5) * 0.08,
          vy: 0,
          vz: 0.32,
          shootTimer: 55,
          phase: 0,
        });
      } else if (kind === "crystal") {
        const crys = new THREE.Mesh(
          new THREE.IcosahedronGeometry(1.1, 0),
          new THREE.MeshBasicMaterial({ color: 0x00ff66, wireframe: false }),
        );
        const wire = new THREE.Mesh(
          new THREE.IcosahedronGeometry(1.4, 0),
          new THREE.MeshBasicMaterial({ color: 0xb46aff, wireframe: true }),
        );
        g.add(crys, wire);
        g.position.set((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 5, zPos);
        scene.add(g);
        enemies.push({
          mesh: g,
          kind,
          hp: 1,
          maxHp: 1,
          vx: 0,
          vy: 0,
          vz: 0.38,
          shootTimer: 9999,
          phase: 0,
        });
      } else if (kind === "boss") {
        // Giant 3D Boss Titan!
        const core = new THREE.Mesh(
          new THREE.IcosahedronGeometry(3.2, 1),
          new THREE.MeshStandardMaterial({ color: 0x1a0525, emissive: 0xff3ae0, metalness: 0.9, roughness: 0.15 }),
        );
        const ring1 = new THREE.Mesh(
          new THREE.TorusGeometry(4.6, 0.25, 12, 36),
          new THREE.MeshBasicMaterial({ color: 0x00fff0 }),
        );
        const ring2 = new THREE.Mesh(
          new THREE.TorusGeometry(5.6, 0.2, 12, 36),
          new THREE.MeshBasicMaterial({ color: 0xff8a2a }),
        );
        ring2.rotation.y = Math.PI / 2;
        g.add(core, ring1, ring2);
        g.position.set(0, 1.2, -65);
        scene.add(g);
        const hp = 65 + stateRef.current.wave * 25;
        enemies.push({
          mesh: g,
          kind: "boss",
          hp,
          maxHp: hp,
          vx: 0.14,
          vy: 0.06,
          vz: 0.25,
          shootTimer: 35,
          phase: 0,
        });
        setBossHp({ cur: hp, max: hp });
        playSfx("bossAlert");
        setSpeaker("SYNCHRO");
        setCommText({
          en: `⚠️ WARNING! BOSS TITAN [LEVIATHAN-0${stateRef.current.wave}] DETECTED! Aim for its core or unleash NOVA OVERDRIVE!`,
          ja: `⚠️ 警報！巨大ボス『リヴァイアサン-0${stateRef.current.wave}』出現！コアを集中砲火するか超新星必殺技を撃って！`,
        });
      }
    };

    // Keyboard controls
    const keys: Record<string, boolean> = {};
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keys[k] = true;
      if (k === " " && stateRef.current.playing) {
        e.preventDefault();
        stateRef.current.triggerUltimate = true;
      } else if (k === "shift" && stateRef.current.playing) {
        e.preventDefault();
        stateRef.current.triggerRoll = true;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    let raf = 0;

    const animate = () => {
      frame++;
      const st = stateRef.current;

      // Scroll grids & starfield for high-speed trench feel
      gridHelper.position.z = ((frame * 0.65) % 6) - 40;
      topGrid.position.z = ((frame * 0.65) % 9) - 40;

      const posAttr = starGeo.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < starCount; i++) {
        let z = posAttr.getZ(i) + (st.playing ? 1.35 : 0.4);
        if (z > 15) z = -135;
        posAttr.setZ(i, z);
      }
      posAttr.needsUpdate = true;

      if (st.playing) {
        // Keyboard steering assist
        if (keys["arrowleft"] || keys["a"]) st.targetX = Math.max(-9.5, st.targetX - 0.28);
        if (keys["arrowright"] || keys["d"]) st.targetX = Math.min(9.5, st.targetX + 0.28);
        if (keys["arrowup"] || keys["w"]) st.targetY = Math.min(4.2, st.targetY + 0.22);
        if (keys["arrowdown"] || keys["s"]) st.targetY = Math.max(-2.6, st.targetY - 0.22);

        // Smooth ship interpolation & banking
        const dx = st.targetX - playerGroup.position.x;
        const dy = st.targetY - playerGroup.position.y;
        playerGroup.position.x += dx * 0.18;
        playerGroup.position.y += dy * 0.18;

        // Barrel roll evasion
        if (st.triggerRoll) {
          st.triggerRoll = false;
          st.rollTimer = 28;
          playSfx("powerup");
        }
        if (st.rollTimer > 0) {
          st.rollTimer--;
          playerGroup.rotation.z += 0.45;
          shieldMat.opacity = 0.45;
        } else {
          playerGroup.rotation.z = -dx * 0.35;
          playerGroup.rotation.x = dy * 0.18;
          shieldMat.opacity = 0.0;
        }

        // Thruster pulse
        thrusterMesh.scale.setScalar(0.85 + Math.sin(frame * 0.6) * 0.25);
        shipLight.position.copy(playerGroup.position);

        // Supernova Ultimate Skill
        if (st.triggerUltimate && st.overdrive >= 100) {
          st.triggerUltimate = false;
          st.overdrive = 0;
          setOverdrive(0);
          st.shockwaveTimer = 40;
          shockMesh.position.copy(playerGroup.position);
          shockMesh.scale.setScalar(1);
          playSfx("ultimate");
          setSpeaker("NOVA");
          setCommText({
            en: "🌟 SUPERNOVA OVERDRIVE UNLEASHED!! All enemy fire neutralized & massive damage dealt!! 💖✨",
            ja: "🌟 超新星オーバードライブ発動っ！！敵弾を全消去＆全ターゲットに超特大ダメージですっ！！💖✨",
          });

          // Clear all enemy bullets & damage all enemies
          bullets.forEach((b) => {
            if (!b.fromPlayer) scene.remove(b.mesh);
          });
          bullets = bullets.filter((b) => b.fromPlayer);

          enemies.forEach((en) => {
            en.hp -= 35;
            spawnExplosion(en.mesh.position, 0xb46aff, 14, 1.5);
          });
        }

        if (st.shockwaveTimer > 0) {
          st.shockwaveTimer--;
          const s = (40 - st.shockwaveTimer) * 2.2;
          shockMesh.scale.setScalar(s);
          shockMat.opacity = st.shockwaveTimer / 40;
        } else {
          shockMat.opacity = 0;
        }

        // Auto-fire player weapons based on Weapon Level (1..4)
        const fireRate = st.weaponLv >= 4 ? 5 : st.weaponLv === 3 ? 6 : 7;
        if (frame % fireRate === 0) {
          playSfx("laser");
          const px = playerGroup.position.x;
          const py = playerGroup.position.y;
          const pz = playerGroup.position.z - 1.5;

          const spawnPlayerBullet = (ox: number, oy: number, vx: number, col: number, homing = false, dmg = 1) => {
            const bGeo = new THREE.BoxGeometry(0.18, 0.18, 1.6);
            const bMat = new THREE.MeshBasicMaterial({ color: col });
            const m = new THREE.Mesh(bGeo, bMat);
            m.position.set(px + ox, py + oy, pz);
            scene.add(m);
            bullets.push({ mesh: m, vx, vy: 0, vz: -2.1, fromPlayer: true, homing, dmg });
          };

          // Lv 1: Twin Cyan Lasers
          spawnPlayerBullet(-0.8, 0, 0, 0x00fff0, false, 1);
          spawnPlayerBullet(0.8, 0, 0, 0x00fff0, false, 1);

          // Lv 2+: Wide Wing Plasma
          if (st.weaponLv >= 2) {
            spawnPlayerBullet(-1.8, 0, -0.08, 0xff3ae0, false, 1);
            spawnPlayerBullet(1.8, 0, 0.08, 0xff3ae0, false, 1);
          }
          // Lv 3+: Homing Neuro-Seekers
          if (st.weaponLv >= 3) {
            spawnPlayerBullet(0, 0.4, 0, 0xb46aff, true, 1.5);
          }
          // Lv 4: Hyper Center Beam Lance
          if (st.weaponLv >= 4) {
            spawnPlayerBullet(-0.3, 0.2, -0.03, 0x00ff66, true, 2);
            spawnPlayerBullet(0.3, 0.2, 0.03, 0x00ff66, true, 2);
          }
        }

        // Spawn Enemies & Bosses
        const hasBoss = enemies.some((e) => e.kind === "boss");
        if (st.score >= nextBossScore && !hasBoss) {
          createEnemy("boss");
          nextBossScore += 650 + st.wave * 200;
        } else if (!hasBoss) {
          if (frame % Math.max(18, 38 - st.wave * 3) === 0) {
            createEnemy("drone");
          }
          if (frame % 115 === 0) {
            createEnemy("cruiser");
          }
          if (frame % 140 === 0) {
            createEnemy("crystal");
          }
        }

        // Update Bullets
        const nextBullets: Bullet3D[] = [];
        for (const b of bullets) {
          if (b.homing && b.fromPlayer && enemies.length > 0) {
            const target = enemies[0];
            b.vx += Math.sign(target.mesh.position.x - b.mesh.position.x) * 0.035;
            b.vy += Math.sign(target.mesh.position.y - b.mesh.position.y) * 0.035;
          }
          b.mesh.position.x += b.vx;
          b.mesh.position.y += b.vy;
          b.mesh.position.z += b.vz;

          // Enemy bullet hitting player
          if (!b.fromPlayer) {
            const dPlayer = b.mesh.position.distanceTo(playerGroup.position);
            if (dPlayer < 1.5) {
              scene.remove(b.mesh);
              if (st.rollTimer <= 0) {
                st.hull = Math.max(0, st.hull - 12);
                st.combo = 0;
                setHull(st.hull);
                setCombo(0);
                playSfx("hit");
                spawnExplosion(playerGroup.position, 0xff3ae0, 10, 0.8);
                if (st.hull <= 0) {
                  st.playing = false;
                  setPhase("over");
                  setBest((prev) => {
                    const nb = Math.max(prev, st.score);
                    try {
                      localStorage.setItem("holoverse-starbreaker-best", String(nb));
                    } catch {
                      /* ignore */
                    }
                    return nb;
                  });
                }
              }
              continue;
            }
          }

          if (b.mesh.position.z < -95 || b.mesh.position.z > 18) {
            scene.remove(b.mesh);
            continue;
          }
          nextBullets.push(b);
        }
        bullets = nextBullets;

        // Update Enemies
        const nextEnemies: Enemy3D[] = [];
        for (const en of enemies) {
          en.phase += 0.04;
          en.mesh.rotation.y += 0.03;
          en.mesh.rotation.x += 0.015;

          if (en.kind === "boss") {
            // Boss hovers at z = -26 and weaves side to side
            if (en.mesh.position.z < -26) {
              en.mesh.position.z += en.vz;
            } else {
              en.mesh.position.x = Math.sin(en.phase * 0.8) * 7.5;
              en.mesh.position.y = 1.2 + Math.cos(en.phase * 1.1) * 2.2;
            }
            // Boss radial barrage
            en.shootTimer--;
            if (en.shootTimer <= 0) {
              en.shootTimer = 42;
              for (let a = -2; a <= 2; a++) {
                const ebGeo = new THREE.SphereGeometry(0.32, 8, 8);
                const ebMat = new THREE.MeshBasicMaterial({ color: 0xff8a2a });
                const eb = new THREE.Mesh(ebGeo, ebMat);
                eb.position.copy(en.mesh.position);
                scene.add(eb);
                bullets.push({
                  mesh: eb,
                  vx: a * 0.14,
                  vy: (playerGroup.position.y - en.mesh.position.y) * 0.02,
                  vz: 0.65,
                  fromPlayer: false,
                  dmg: 12,
                });
              }
            }
          } else {
            en.mesh.position.x += en.vx + Math.sin(en.phase) * 0.05;
            en.mesh.position.y += en.vy;
            en.mesh.position.z += en.vz;

            // Cruiser / Drone shoots back
            en.shootTimer--;
            if (en.shootTimer <= 0 && en.mesh.position.z < -8) {
              en.shootTimer = en.kind === "cruiser" ? 55 : 85;
              const ebGeo = new THREE.SphereGeometry(0.24, 6, 6);
              const ebMat = new THREE.MeshBasicMaterial({ color: 0xff3ae0 });
              const eb = new THREE.Mesh(ebGeo, ebMat);
              eb.position.copy(en.mesh.position);
              scene.add(eb);
              const dxP = (playerGroup.position.x - en.mesh.position.x) * 0.018;
              const dyP = (playerGroup.position.y - en.mesh.position.y) * 0.018;
              bullets.push({
                mesh: eb,
                vx: dxP,
                vy: dyP,
                vz: 0.62,
                fromPlayer: false,
                dmg: 10,
              });
            }
          }

          // Check player bullet hits on enemy
          const hitRadius = en.kind === "boss" ? 4.2 : en.kind === "cruiser" ? 2.1 : 1.5;
          for (const b of bullets) {
            if (!b.fromPlayer) continue;
            if (b.mesh.position.distanceTo(en.mesh.position) < hitRadius) {
              en.hp -= b.dmg;
              b.mesh.position.z = -999; // mark for removal
              playSfx("hit");
              spawnExplosion(en.mesh.position, 0x00fff0, 4, 0.5);
              if (en.kind === "boss") {
                setBossHp({ cur: Math.max(0, Math.ceil(en.hp)), max: en.maxHp });
              }
              break;
            }
          }

          // Check collision with player ship
          if (en.mesh.position.distanceTo(playerGroup.position) < hitRadius + 1.1) {
            if (en.kind === "crystal") {
              en.hp = 0; // collect crystal!
            } else if (st.rollTimer <= 0) {
              st.hull = Math.max(0, st.hull - 18);
              setHull(st.hull);
              en.hp = 0;
              playSfx("boom");
              if (st.hull <= 0) {
                st.playing = false;
                setPhase("over");
              }
            }
          }

          // Destroyed or collected!
          if (en.hp <= 0) {
            scene.remove(en.mesh);
            if (en.kind === "crystal") {
              playSfx("powerup");
              spawnExplosion(en.mesh.position, 0x00ff66, 18, 1.1);
              st.weaponLv = Math.min(4, st.weaponLv + 1);
              st.hull = Math.min(100, st.hull + 15);
              st.overdrive = Math.min(100, st.overdrive + 35);
              st.score += 50;
              setWeaponLv(st.weaponLv);
              setHull(st.hull);
              setOverdrive(st.overdrive);
              setScore(st.score);
              setSpeaker("NOVA");
              setCommText({
                en: `✨ NEURO-CRYSTAL ABSORBED! Weapon upgraded to LV.${st.weaponLv} & Hull repaired! 🌟💖`,
                ja: `✨ ニューロ・クリスタル吸収！武器が【LV.${st.weaponLv}】にパワーアップ＆シールド回復ですっ！🌟💖`,
              });
            } else if (en.kind === "boss") {
              playSfx("boom");
              spawnExplosion(en.mesh.position, 0xff8a2a, 55, 2.5);
              spawnExplosion(en.mesh.position, 0x00fff0, 40, 2.0);
              st.score += 500;
              st.wave += 1;
              st.overdrive = 100;
              setScore(st.score);
              setWave(st.wave);
              setOverdrive(100);
              setBossHp(null);
              setSpeaker("NOVA");
              setCommText({
                en: `🎉 BOSS TITAN DESTROYED!! +500 PTS! Advancing to Sector Wave 0${st.wave}! 🚀✨`,
                ja: `🎉 巨大ボス撃破ぁぁっ！！+500点！ウェーブ 0${st.wave} へ突入しますっ！🚀✨`,
              });
            } else {
              playSfx("boom");
              spawnExplosion(
                en.mesh.position,
                en.kind === "cruiser" ? 0xff8a2a : 0xff3ae0,
                en.kind === "cruiser" ? 22 : 12,
                en.kind === "cruiser" ? 1.4 : 1.0,
              );
              st.combo += 1;
              const mult = Math.min(5, 1 + Math.floor(st.combo / 5));
              st.score += (en.kind === "cruiser" ? 60 : 20) * mult;
              st.overdrive = Math.min(100, st.overdrive + (en.kind === "cruiser" ? 14 : 6));
              setCombo(st.combo);
              setScore(st.score);
              setOverdrive(st.overdrive);
            }
            continue;
          }

          if (en.mesh.position.z > 14) {
            scene.remove(en.mesh);
            continue;
          }

          nextEnemies.push(en);
        }
        enemies = nextEnemies;
      } else {
        // Idle showcase rotation
        playerGroup.rotation.y = Math.sin(frame * 0.02) * 0.35;
        playerGroup.position.y = Math.sin(frame * 0.04) * 0.3;
      }

      // Update 3D explosion particles
      const nextParticles: Particle3D[] = [];
      for (const p of particles) {
        p.life--;
        p.mesh.position.x += p.vx;
        p.mesh.position.y += p.vy;
        p.mesh.position.z += p.vz;
        p.mesh.rotation.x += 0.12;
        p.mesh.rotation.y += 0.12;
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = p.life / p.maxLife;
        if (p.life <= 0) {
          scene.remove(p.mesh);
          continue;
        }
        nextParticles.push(p);
      }
      particles = nextParticles;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 960;
      const h = container.clientHeight || 540;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, [playSfx]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    stateRef.current.targetX = nx * 9.5;
    stateRef.current.targetY = Math.max(-2.6, Math.min(4.2, ny * 4.2));
  };

  return (
    <PageShell accent="violet">
      <div
        className="wrap"
        style={{
          padding: "clamp(1.2rem, 3vw, 2.2rem) clamp(1rem, 3vw, 2rem) 4rem",
          maxWidth: 1180,
        }}
      >
        {/* Top Bar */}
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
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <Link
              href="/"
              className="font-mono"
              style={{ fontSize: "0.75rem", color: "var(--text-dim)", textDecoration: "none" }}
            >
              ← {t(bi("PORTAL HOME", "ポータルへ戻る"))}
            </Link>
            <span className="chip ac-violet">THREE.JS 3D WEBGL // 60-120FPS</span>
            <Link href="/webxr" className="chip ac-cyan" style={{ textDecoration: "none" }}>
              🥽 {t(bi("Switch to Official 3D WebXR World →", "公式3D WebXR空間へ移動 →"))}
            </Link>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
              {soundOn ? "🔊 SYNTH AUDIO: ON" : "🔇 AUDIO: MUTED"}
            </button>
          </div>
        </div>

        {/* Cockpit Telemetry Header */}
        <div
          className="holo ac-cyan"
          style={{
            padding: "0.85rem 1.2rem",
            marginBottom: 12,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div>
            <div className="font-mono" style={{ fontSize: "0.62rem", color: "var(--text-faint)" }}>
              SCORE / BEST
            </div>
            <div className="font-display neon" style={{ fontSize: "1.25rem", fontWeight: 900 }}>
              {score.toLocaleString()}{" "}
              <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                / {Math.max(best, score).toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <div className="font-mono" style={{ fontSize: "0.62rem", color: "var(--text-faint)" }}>
              SECTOR WAVE & COMBO
            </div>
            <div className="font-display" style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--violet)" }}>
              WAVE 0{wave} · <span style={{ color: "var(--green)" }}>{combo}x COMBO</span>
            </div>
          </div>

          <div>
            <div className="font-mono" style={{ fontSize: "0.62rem", color: "var(--text-faint)" }}>
              WEAPON SYSTEM
            </div>
            <div className="font-display" style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--cyan)" }}>
              LV.{weaponLv}{" "}
              {weaponLv === 1
                ? "TWIN PULSE"
                : weaponLv === 2
                  ? "QUAD SPREAD"
                  : weaponLv === 3
                    ? "NEURO SEEKER"
                    : "HYPER NOVA MAX"}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem" }} className="font-mono">
              <span style={{ color: "var(--text-faint)" }}>HULL SHIELD</span>
              <span style={{ color: hull > 35 ? "var(--green)" : "var(--orange)" }}>{hull}%</span>
            </div>
            <div className="meter ac-green" style={{ marginTop: 4 }}>
              <i style={{ width: `${hull}%` }} />
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem" }} className="font-mono">
              <span style={{ color: "var(--violet)" }}>NOVA OVERDRIVE</span>
              <span style={{ color: "var(--violet)" }}>{overdrive}%</span>
            </div>
            <div className="meter ac-violet" style={{ marginTop: 4 }}>
              <i style={{ width: `${overdrive}%` }} />
            </div>
          </div>
        </div>

        {/* Boss HP Bar (Appears during 3D Boss Encounter!) */}
        {bossHp && (
          <div
            className="holo ac-orange"
            style={{
              padding: "0.65rem 1.2rem",
              marginBottom: 12,
              background: "rgba(40, 10, 18, 0.9)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: 4 }} className="font-mono">
              <span style={{ color: "var(--orange)", fontWeight: 800 }}>
                ⚠️ BOSS TITAN // ENTROPY LEVIATHAN-0{wave}
              </span>
              <span style={{ color: "var(--text)" }}>
                HP: {bossHp.cur} / {bossHp.max}
              </span>
            </div>
            <div className="meter ac-orange" style={{ height: 9 }}>
              <i style={{ width: `${(bossHp.cur / bossHp.max) * 100}%` }} />
            </div>
          </div>
        )}

        {/* 3D WebGL Viewport */}
        <div
          className="holo ac-violet"
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            minHeight: 420,
            overflow: "hidden",
          }}
          onPointerMove={handlePointerMove}
          onContextMenu={(e) => {
            e.preventDefault();
            fireBarrelRoll();
          }}
        >
          <div
            ref={mountRef}
            style={{
              width: "100%",
              height: "100%",
              touchAction: "none",
              cursor: phase === "playing" ? "crosshair" : "default",
            }}
          />

          {/* Live Companion Cut-In Overlay inside Cockpit */}
          <div
            style={{
              position: "absolute",
              left: 14,
              bottom: 14,
              right: 14,
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
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(4, 7, 18, 0.84)",
                border: "1px solid rgba(180,106,255,0.45)",
                padding: "8px 12px",
                borderRadius: 6,
                maxWidth: 620,
              }}
            >
              <img
                src={speaker === "NOVA" ? "/media/nova_portrait.jpg" : "/media/bio-sync.png"}
                alt={speaker}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid var(--violet)",
                }}
              />
              <div>
                <div className="font-mono" style={{ fontSize: "0.62rem", color: "var(--violet)", letterSpacing: "0.14em" }}>
                  LIVE COCKPIT LINK // {speaker}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text)", lineHeight: 1.4 }}>
                  {t(commText)}
                </div>
              </div>
            </div>

            {/* Active Skill Buttons (Clickable with Mouse / Touch / Quest 3 Pointer!) */}
            {phase === "playing" && (
              <div style={{ display: "flex", gap: 8, pointerEvents: "auto" }}>
                <button
                  onClick={fireBarrelRoll}
                  className="btn ac-cyan"
                  style={{ padding: "0.6em 1em", fontSize: "0.74rem", background: "rgba(3,6,16,0.9)" }}
                >
                  ⚡ {t(bi("BARREL ROLL [SHIFT]", "緊急回避ロール [SHIFT]"))}
                </button>
                <button
                  onClick={fireUltimate}
                  disabled={overdrive < 100}
                  className={`btn ${overdrive >= 100 ? "btn-solid ac-violet" : "ac-violet"}`}
                  style={{
                    padding: "0.6em 1.1em",
                    fontSize: "0.74rem",
                    opacity: overdrive >= 100 ? 1 : 0.5,
                  }}
                >
                  🌟 {t(bi("SUPERNOVA ULTIMATE [SPACE]", "超新星必殺技 [SPACE]"))} ({overdrive}%)
                </button>
              </div>
            )}
          </div>

          {/* Start / Game Over Overlay */}
          {phase !== "playing" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle, rgba(8,10,26,0.78) 0%, rgba(3,4,10,0.92) 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                textAlign: "center",
                gap: 14,
              }}
            >
              <div className="kicker ac-violet">
                THREE.JS 3D SPATIAL COMBAT SIMULATOR
              </div>
              <h1
                className="font-display chrome"
                style={{ fontSize: "clamp(1.8rem, 4.8vw, 3.2rem)", fontWeight: 900, margin: 0 }}
              >
                {phase === "over"
                  ? t(bi("MISSION COMPLETE // STARGATE DEFENDED", "ミッション完了 // スターゲイト防衛記録"))
                  : "HOLOVERSE: STAR BREAKER 3D"}
              </h1>
              <p style={{ color: "var(--text-dim)", maxWidth: 560, fontSize: "0.95rem", margin: 0 }}>
                {t(
                  bi(
                    "Pilot the 3D STRIKER-NOVA X-01 through the Cyber Trench! Destroy Swarm Drones & Cruisers, absorb green Neuro-Crystals to evolve weapons up to LV.4, defeat Giant 3D Boss Titans, and unleash Nova's Supernova Shockwave!",
                    "3D戦闘機『STRIKER-NOVA X-01』でサイバー空間へ出撃！ドローン編隊や重巡洋艦を撃破し、緑のクリスタルで武器を最大LV.4まで進化させ、巨大3Dボス『リヴァイアサン』を超新星必殺技で打ち破ろう！",
                  ),
                )}
              </p>

              {phase === "over" && (
                <div className="font-mono neon" style={{ fontSize: "1.2rem", color: "var(--cyan)" }}>
                  FINAL SCORE: {score.toLocaleString()} PTS · WAVE 0{wave}
                </div>
              )}

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 6 }}>
                <button onClick={startGame} className="btn btn-solid ac-violet" style={{ fontSize: "0.95rem", padding: "0.95em 2.1em" }}>
                  🚀 {phase === "over" ? t(bi("LAUNCH SORTIE AGAIN", "もう一度3D出撃する")) : t(bi("LAUNCH 3D INTERCEPTOR", "3Dインターセプター出撃！"))}
                </button>
                <Link href="/webxr" className="btn ac-cyan" style={{ fontSize: "0.85rem" }}>
                  🥽 {t(bi("Enter Full 3D WebXR Sanctuary →", "公式WebXR 3Dワールドへ入る →"))}
                </Link>
              </div>

              <div className="font-mono" style={{ fontSize: "0.72rem", color: "var(--text-faint)", marginTop: 4 }}>
                {t(
                  bi(
                    "Controls: Move Mouse / Touch / Quest 3 Pointer or WASD · [SPACE] Supernova Ultimate · [SHIFT / Right-Click] Barrel Roll",
                    "操作：マウス移動／タッチ／Quest 3ポインター または WASDキー · [SPACE] 超新星必殺技 · [SHIFT / 右クリック] 緊急回避ロール",
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
