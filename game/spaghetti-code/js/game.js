import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { LEVEL_ORDER, LEVELS, WORLD, createCableDefinitions } from "./config.js";
import { RopeWorld } from "./rope-physics.js?v=2";
import { readLocalRankings, saveLocalScore } from "./score-storage.js";
import { SURFACE_THEMES, createSurfaceTexture } from "./surface-themes.js";

const CONTACT_FREE_STABLE_MS = 650;
const PROGRESS_STORAGE_KEY = "spaghetti-code:progress:v1";
const DEFAULT_UNLOCKED_INDEX = LEVEL_ORDER.indexOf("hard");
const AUTHOR_SKIT_MESSAGES = Object.freeze({
  easy: "ハヤク コード カタヅケロ。セッショク シテイタラ アカンデ。",
  normal: "コード カタヅケル ノ タノシイダロ",
  hard: "コード タチ ナイテイマス。ハヤク スクッテ アゲロ。",
  extream: "ズポッ コレハ スパゲッティ コード",
  ultimate: "モウ ナニガ ナンダカ ワカラナイ ヨ",
  unknown: "ウワー ムジュウリョク デ コード カタヅケル ノ ユメミタイダ",
});

class SoundDesign {
  constructor() {
    this.context = null;
  }

  enable() {
    if (!this.context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.context = new AudioContext();
    }
    if (this.context?.state === "suspended") this.context.resume();
  }

  tone(frequency, duration, volume = 0.025, type = "sine", delay = 0) {
    if (!this.context) return;
    const start = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  grab() {
    this.tone(92, 0.08, 0.018, "triangle");
  }

  release() {
    this.tone(68, 0.06, 0.012, "triangle");
  }

  start() {
    this.tone(110, 0.12, 0.02, "square");
    this.tone(164, 0.14, 0.016, "square", 0.075);
  }

  countdown(value) {
    if (value === "GO") {
      this.start();
      return;
    }
    this.tone(250 + Number(value) * 28, 0.09, 0.016, "square");
  }

  clear() {
    [196, 247, 294, 392].forEach((frequency, index) => {
      this.tone(frequency, 0.34, 0.025, "triangle", index * 0.11);
    });
  }
}

class SpaghettiGame {
  constructor() {
    this.canvas = document.querySelector("#game-canvas");
    this.shell = document.querySelector("#game-shell");
    this.startScreen = document.querySelector("#start-screen");
    this.pauseScreen = document.querySelector("#pause-screen");
    this.retryScreen = document.querySelector("#retry-confirm-screen");
    this.clearScreen = document.querySelector("#clear-screen");
    this.helpScreen = document.querySelector("#help-screen");
    this.fatalMessage = document.querySelector("#fatal-message");
    this.levelKey = "easy";
    this.status = "menu";
    this.menuPhase = "difficulty";
    this.resumeStatus = null;
    this.helpReturnStatus = null;
    this.helpOpener = null;
    this.retryReturnStatus = null;
    this.retryOpener = null;
    this.debugMode = false;
    this.debugPressCount = 0;
    this.countdownTimer = 0;
    this.countdownToken = 0;
    this.startTime = 0;
    this.elapsedBeforePause = 0;
    this.grabCount = 0;
    this.lastFrame = performance.now();
    this.lastMetricCheck = 0;
    this.stableSince = 0;
    this.seed = crypto.getRandomValues(new Uint32Array(1))[0];
    this.activeSeed = null;
    this.pointer = new THREE.Vector2();
    this.pointerClient = { x: 0, y: 0 };
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Line.threshold = 0.2;
    this.grabPlane = new THREE.Plane();
    this.grabPlanePoint = new THREE.Vector3();
    this.grabIntersection = new THREE.Vector3();
    this.cameraDirection = new THREE.Vector3();
    this.sound = new SoundDesign();
    this.toastTimer = 0;
    this.skitTimer = 0;

    try {
      this.setupScene();
      this.setupInterface();
      this.bindEvents();
      this.resize();
      this.animate(performance.now());
    } catch (error) {
      console.error("3D renderer initialization failed", error);
      this.fatalMessage.hidden = false;
    }
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xc8cbc8);
    this.scene.fog = new THREE.Fog(0xc8cbc8, 38, 110);

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.05, 140);
    this.camera.position.set(0, 13, 15);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.075;
    this.controls.minDistance = 5.2;
    this.controls.maxDistance = 82;
    this.controls.maxPolarAngle = Math.PI * 0.49;
    this.controls.minPolarAngle = 0.14;
    this.controls.target.set(0, 0.25, 0);
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    };
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
    this.controls.enablePan = true;

    const hemisphere = new THREE.HemisphereLight(0xfffdf5, 0x65625b, 1.55);
    this.scene.add(hemisphere);

    const keyLight = new THREE.DirectionalLight(0xfff5dc, 5.4);
    keyLight.position.set(-10, 17, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -18;
    keyLight.shadow.camera.right = 18;
    keyLight.shadow.camera.top = 12;
    keyLight.shadow.camera.bottom = -12;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 48;
    keyLight.shadow.bias = -0.00018;
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd8efff, 3.4);
    rimLight.position.set(14, 7, -12);
    this.scene.add(rimLight);

    const crossLight = new THREE.DirectionalLight(0xffd4ae, 2.3);
    crossLight.position.set(-13, 6, -10);
    this.scene.add(crossLight);

    this.surfaceTextures = new Map();
    this.floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 1,
      metalness: 0,
    });
    this.tabletop = new THREE.Mesh(
      new THREE.PlaneGeometry(WORLD.halfWidth * 2, WORLD.halfDepth * 2),
      this.floorMaterial,
    );
    this.tabletop.rotation.x = -Math.PI / 2;
    this.tabletop.receiveShadow = true;
    this.scene.add(this.tabletop);

    this.borderMaterial = new THREE.LineBasicMaterial({ color: 0x252925, transparent: true, opacity: 0.42 });
    const border = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(WORLD.halfWidth * 2, 0.02, WORLD.halfDepth * 2)),
      this.borderMaterial,
    );
    border.position.y = -0.01;
    this.scene.add(border);

    this.setupCyberBackdrop();
    this.ropeWorld = new RopeWorld(this.scene);
    this.applySurfaceTheme(this.levelKey);
  }

  setupCyberBackdrop() {
    this.cyberBackdrop = new THREE.Group();
    this.cyberBackdrop.visible = false;
    const randomAt = (index) => {
      const value = Math.sin(index * 91.713 + 17.41) * 43758.5453;
      return value - Math.floor(value);
    };
    const positions = new Float32Array(900 * 3);
    for (let index = 0; index < 900; index += 1) {
      const radius = 24 + randomAt(index * 3) * 52;
      const angle = randomAt(index * 3 + 1) * Math.PI * 2;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = -5 + randomAt(index * 3 + 2) * 32;
      positions[index * 3 + 2] = Math.sin(angle) * radius;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xaef8ff,
      size: 0.13,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
    });
    this.cyberStars = new THREE.Points(starGeometry, starMaterial);
    this.cyberBackdrop.add(this.cyberStars);

    this.cyberRings = [
      { radius: 28, color: 0xbaff2a, x: Math.PI * 0.54, y: 0.18 },
      { radius: 36, color: 0x6be7ff, x: Math.PI * 0.42, y: -0.3 },
      { radius: 45, color: 0xda63ff, x: Math.PI * 0.62, y: 0.42 },
    ].map((options, index) => {
      const material = new THREE.MeshBasicMaterial({
        color: options.color,
        transparent: true,
        opacity: 0.2,
        wireframe: true,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(options.radius, 0.045, 4, 180), material);
      ring.rotation.set(options.x, options.y, index * 0.34);
      ring.position.y = 7 + index * 2.4;
      this.cyberBackdrop.add(ring);
      return ring;
    });
    this.scene.add(this.cyberBackdrop);
  }

  applySurfaceTheme(levelKey) {
    const theme = SURFACE_THEMES[levelKey] ?? SURFACE_THEMES.easy;
    this.shell.dataset.level = levelKey;
    this.scene.background.setHex(theme.background);
    this.scene.fog.color.setHex(theme.fog);
    this.scene.fog.near = theme.fogNear ?? 38;
    this.scene.fog.far = theme.fogFar ?? 110;
    this.renderer.toneMappingExposure = theme.exposure;
    this.ropeWorld?.setGravity(theme.gravityY ?? -15);
    if (this.cyberBackdrop) this.cyberBackdrop.visible = levelKey === "unknown";
    if (!this.surfaceTextures.has(levelKey)) {
      this.surfaceTextures.set(levelKey, createSurfaceTexture(levelKey, this.renderer));
    }
    this.floorMaterial.map = this.surfaceTextures.get(levelKey);
    this.floorMaterial.roughness = theme.roughness;
    this.floorMaterial.metalness = theme.metalness;
    this.floorMaterial.needsUpdate = true;
    const isDigitalSurface = ["ultimate", "unknown"].includes(levelKey);
    this.borderMaterial.color.setHex(isDigitalSurface ? 0xbaff2a : 0x252925);
    this.borderMaterial.opacity = isDigitalSurface ? 0.58 : 0.42;
    this.canvas.setAttribute(
      "aria-label",
      `${theme.name}に置かれた、さまざまな種類の絡まったケーブル`,
    );
    const red = theme.background >> 16 & 255;
    const green = theme.background >> 8 & 255;
    const blue = theme.background & 255;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      `#${[red, green, blue].map((value) => value.toString(16).padStart(2, "0")).join("")}`,
    );
  }

  setupInterface() {
    this.hudLevel = document.querySelector("#hud-level");
    this.hudCables = document.querySelector("#hud-cables");
    this.hudTime = document.querySelector("#hud-time");
    this.grabReadout = document.querySelector("#grab-readout");
    this.grabLabel = document.querySelector("#grab-label");
    this.toast = document.querySelector("#toast");
    this.countdownOverlay = document.querySelector("#countdown-overlay");
    this.countdownLabel = document.querySelector("#countdown-label");
    this.authorSkit = document.querySelector("#author-skit");
    this.authorSkitMessage = document.querySelector("#author-skit-message");
    this.clearLevel = document.querySelector("#clear-level");
    this.clearTime = document.querySelector("#clear-time");
    this.shareButton = document.querySelector("#share-button");
    this.nextLevelButton = document.querySelector("#next-level-button");
    this.debugIndicator = document.querySelector("#debug-indicator");
    this.fullscreenButton = document.querySelector("#hud-fullscreen-button");
    this.fullscreenIcon = this.fullscreenButton.querySelector("i");
    this.hudActionButtons = [...document.querySelectorAll(".hud-action")];
    this.difficultyPhase = document.querySelector("#difficulty-phase");
    this.rankingPhase = document.querySelector("#ranking-phase");
    this.rankingTitle = document.querySelector("#ranking-title");
    this.rankingLevel = document.querySelector("#ranking-level");
    this.rankingCables = document.querySelector("#ranking-cables");
    this.rankingList = document.querySelector("#ranking-list");
    this.rankingEmpty = document.querySelector("#ranking-empty");
    this.difficultyButtons = [...document.querySelectorAll(".difficulty-option")];
    this.highestUnlockedIndex = this.readProgress();
    this.gameChromeElements = [
      this.canvas,
      document.querySelector(".game-hud-stack"),
      document.querySelector(".controls-card"),
    ];
    this.updateProgressUi();
    this.selectLevel(this.levelKey);
    this.showDifficultySelection(false);
    this.updateFullscreenUi();
    this.setHudActionsEnabled(false);
    this.setGameChromeInert(true);
  }

  bindEvents() {
    window.addEventListener("resize", () => this.resize());
    document.addEventListener("keydown", (event) => this.onKeyDown(event));
    document.addEventListener("fullscreenchange", () => this.updateFullscreenUi());
    document.addEventListener("webkitfullscreenchange", () => this.updateFullscreenUi());

    this.canvas.addEventListener("pointerdown", (event) => this.onPointerDown(event), { capture: true });
    this.canvas.addEventListener("pointermove", (event) => this.onPointerMove(event), { capture: true });
    this.canvas.addEventListener("pointerup", (event) => this.onPointerUp(event), { capture: true });
    this.canvas.addEventListener("pointercancel", (event) => this.onPointerUp(event), { capture: true });
    this.shell.addEventListener("wheel", (event) => this.onWheel(event), { capture: true, passive: false });
    this.canvas.addEventListener("contextmenu", (event) => event.preventDefault());

    this.difficultyButtons.forEach((button) => {
      button.addEventListener("click", () => this.showRanking(button.dataset.level));
    });
    document.querySelector("#start-button").addEventListener("click", () => this.startGame(this.levelKey));
    document.querySelector("#ranking-back-button").addEventListener("click", () => this.showDifficultySelection());
    this.nextLevelButton.addEventListener("click", () => this.startNextLevel());
    document.querySelector("#replay-button").addEventListener("click", () => this.startGame(this.levelKey, true));
    document.querySelector("#clear-menu-button").addEventListener("click", () => this.returnToMenu());
    document.querySelector("#resume-button").addEventListener("click", () => this.resumeGame());
    document.querySelector("#retry-button").addEventListener("click", () => this.requestRetry());
    document.querySelector("#pause-menu-button").addEventListener("click", () => this.returnToMenu());
    document.querySelector("#help-close-button").addEventListener("click", () => this.closeHelp());
    document.querySelector("#hud-help-button").addEventListener("click", () => this.openHelp());
    document.querySelector("#hud-retry-button").addEventListener("click", () => this.requestRetry());
    document.querySelector("#hud-pause-button").addEventListener("click", () => this.pauseGame());
    this.fullscreenButton.addEventListener("click", () => this.toggleFullscreen());
    document.querySelector("#retry-confirm-button").addEventListener("click", () => this.confirmRetry());
    document.querySelector("#retry-cancel-button").addEventListener("click", () => this.cancelRetry());
    this.clearScreen.addEventListener("cancel", (event) => event.preventDefault());
    this.pauseScreen.addEventListener("cancel", (event) => {
      event.preventDefault();
      this.resumeGame();
    });
    this.helpScreen.addEventListener("cancel", (event) => {
      event.preventDefault();
      this.closeHelp();
    });
    this.retryScreen.addEventListener("cancel", (event) => {
      event.preventDefault();
      this.cancelRetry();
    });
  }

  selectLevel(levelKey) {
    const levelIndex = LEVEL_ORDER.indexOf(levelKey);
    if (!LEVELS[levelKey] || !this.isLevelUnlocked(levelIndex)) return;
    this.levelKey = levelKey;
    this.difficultyButtons.forEach((button) => {
      const selected = button.dataset.level === levelKey;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    this.applySurfaceTheme(levelKey);
  }

  setMenuPhase(phase) {
    const showRanking = phase === "ranking";
    this.menuPhase = showRanking ? "ranking" : "difficulty";
    this.startScreen.dataset.phase = this.menuPhase;
    this.difficultyPhase.hidden = showRanking;
    this.difficultyPhase.inert = showRanking;
    this.difficultyPhase.setAttribute("aria-hidden", String(showRanking));
    this.rankingPhase.hidden = !showRanking;
    this.rankingPhase.inert = !showRanking;
    this.rankingPhase.setAttribute("aria-hidden", String(!showRanking));
  }

  showRanking(levelKey) {
    const levelIndex = LEVEL_ORDER.indexOf(levelKey);
    if (!LEVELS[levelKey] || !this.isLevelUnlocked(levelIndex)) return;
    this.selectLevel(levelKey);
    this.renderRanking(levelKey);
    this.setMenuPhase("ranking");
    window.setTimeout(() => this.rankingTitle.focus({ preventScroll: true }), 0);
  }

  showDifficultySelection(focus = true) {
    this.setMenuPhase("difficulty");
    if (!focus) return;
    window.setTimeout(() => {
      this.difficultyButtons.find((button) => button.dataset.level === this.levelKey)?.focus({ preventScroll: true });
    }, 0);
  }

  renderRanking(levelKey) {
    const level = LEVELS[levelKey];
    const records = readLocalRankings()[levelKey];
    this.rankingLevel.textContent = level.name;
    this.rankingCables.textContent = `${level.count} CABLES`;
    this.rankingList.replaceChildren();
    records.forEach((record, index) => {
      const item = document.createElement("li");
      const rank = document.createElement("span");
      const time = document.createElement("time");
      const status = document.createElement("span");
      rank.className = "ranking-rank";
      rank.textContent = String(index + 1).padStart(2, "0");
      time.textContent = this.formatTime(record.elapsedMs);
      status.className = "ranking-status";
      status.textContent = index === 0 ? "BEST" : "LOCAL";
      item.setAttribute("aria-label", `${index + 1}位 ${time.textContent}`);
      item.append(rank, time, status);
      this.rankingList.append(item);
    });
    this.rankingEmpty.hidden = records.length > 0;
  }

  readProgress() {
    try {
      const stored = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) ?? "null");
      const storedIndex = LEVEL_ORDER.indexOf(stored?.highestUnlocked);
      return THREE.MathUtils.clamp(
        storedIndex >= DEFAULT_UNLOCKED_INDEX ? storedIndex : DEFAULT_UNLOCKED_INDEX,
        DEFAULT_UNLOCKED_INDEX,
        LEVEL_ORDER.length - 1,
      );
    } catch {
      return DEFAULT_UNLOCKED_INDEX;
    }
  }

  updateProgressUi() {
    this.difficultyButtons.forEach((button) => {
      const levelIndex = LEVEL_ORDER.indexOf(button.dataset.level);
      const locked = !this.isLevelUnlocked(levelIndex);
      const prerequisite = LEVELS[LEVEL_ORDER[levelIndex - 1]]?.name;
      button.disabled = locked;
      button.classList.toggle("is-locked", locked);
      button.setAttribute(
        "aria-label",
        locked
          ? `${LEVELS[button.dataset.level].name}、${prerequisite}クリアで解禁`
          : `${LEVELS[button.dataset.level].name}を選択`,
      );
    });
  }

  isLevelUnlocked(levelIndex) {
    return this.debugMode || levelIndex <= this.highestUnlockedIndex;
  }

  activateDebugMode() {
    if (this.debugMode) return;
    this.debugMode = true;
    this.debugIndicator.hidden = false;
    this.shell.classList.add("is-debug-mode");
    this.updateProgressUi();
    this.showToast("DEBUG MODE / ALL LEVELS UNLOCKED");
  }

  unlockNextLevel() {
    if (this.debugMode) return;
    const currentIndex = LEVEL_ORDER.indexOf(this.levelKey);
    if (currentIndex < DEFAULT_UNLOCKED_INDEX || currentIndex >= LEVEL_ORDER.length - 1) return;
    const unlockedIndex = Math.max(this.highestUnlockedIndex, currentIndex + 1);
    if (unlockedIndex === this.highestUnlockedIndex) return;
    this.highestUnlockedIndex = unlockedIndex;
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
        highestUnlocked: LEVEL_ORDER[unlockedIndex],
      }));
    } catch {
      // 保存できない環境でも、現在のセッション内では解禁状態を維持する。
    }
    this.updateProgressUi();
  }

  startGame(levelKey, reuseCase = false) {
    const level = LEVELS[levelKey];
    const levelIndex = LEVEL_ORDER.indexOf(levelKey);
    if (!level || !this.isLevelUnlocked(levelIndex)) return;
    this.cancelCountdown();
    this.sound.enable();
    this.levelKey = levelKey;
    this.applySurfaceTheme(levelKey);
    if (!reuseCase || this.activeSeed === null) {
      this.activeSeed = this.seed;
      this.seed = (this.seed + 0x9e3779b9) >>> 0;
    }
    const sceneDefinition = createCableDefinitions(
      levelKey,
      this.activeSeed + LEVEL_ORDER.indexOf(levelKey) * 100003,
    );
    this.ropeWorld.load(sceneDefinition);
    this.status = "countdown";
    this.resumeStatus = null;
    this.startTime = 0;
    this.elapsedBeforePause = 0;
    this.grabCount = 0;
    this.lastMetricCheck = 0;
    this.stableSince = 0;
    this.hudLevel.textContent = level.name;
    this.hudCables.textContent = `${level.count} CABLES`;
    this.hudTime.textContent = "00:00:00.00";
    this.closeModal(this.startScreen);
    this.closeModal(this.pauseScreen);
    this.closeModal(this.retryScreen);
    this.closeModal(this.clearScreen);
    this.closeModal(this.helpScreen);
    this.retryReturnStatus = null;
    this.retryOpener = null;
    this.hideAuthorSkit();
    this.setHudActionsEnabled(false);
    this.setGameChromeInert(false);
    this.controls.enabled = true;
    this.renderer.shadowMap.enabled = level.count <= 24;
    const isPortrait = window.innerWidth / window.innerHeight < 0.72;
    const crowdScale = Math.log2(level.count / 6);
    if (isPortrait) {
      this.camera.position.set(0, 19 + crowdScale * 4.2, 27 + crowdScale * 7.2);
    } else {
      this.camera.position.set(0, 13 + crowdScale * 3.8, 15 + crowdScale * 5.8);
    }
    this.controls.target.set(0, 1, 0);
    this.controls.update();
    this.resize();
    this.beginCountdown();
  }

  beginCountdown() {
    this.cancelCountdown();
    this.status = "countdown";
    this.setHudActionsEnabled(false);
    const token = this.countdownToken;
    const steps = ["3", "2", "1", "GO"];
    let stepIndex = 0;
    this.countdownOverlay.hidden = false;

    const showStep = () => {
      if (token !== this.countdownToken || this.status !== "countdown") return;
      const value = steps[stepIndex];
      this.countdownLabel.textContent = value;
      this.countdownOverlay.classList.toggle("is-go", value === "GO");
      this.countdownOverlay.classList.remove("is-pulse");
      void this.countdownOverlay.offsetWidth;
      this.countdownOverlay.classList.add("is-pulse");
      this.sound.countdown(value);
      const isLastStep = stepIndex === steps.length - 1;
      if (isLastStep) {
        this.countdownTimer = window.setTimeout(() => {
          if (token !== this.countdownToken || this.status !== "countdown") return;
          this.countdownOverlay.hidden = true;
          this.countdownOverlay.classList.remove("is-go", "is-pulse");
          this.status = "playing";
          this.startTime = performance.now();
          this.lastFrame = this.startTime;
          this.setHudActionsEnabled(true);
          this.showAuthorSkit(this.levelKey);
          this.canvas.focus({ preventScroll: true });
        }, 620);
        return;
      }
      stepIndex += 1;
      this.countdownTimer = window.setTimeout(showStep, 720);
    };
    showStep();
  }

  cancelCountdown() {
    window.clearTimeout(this.countdownTimer);
    this.countdownTimer = 0;
    this.countdownToken += 1;
    if (this.countdownOverlay) {
      this.countdownOverlay.hidden = true;
      this.countdownOverlay.classList.remove("is-go", "is-pulse");
    }
  }

  showAuthorSkit(levelKey) {
    window.clearTimeout(this.skitTimer);
    this.authorSkit.classList.remove("is-visible");
    this.authorSkitMessage.textContent = AUTHOR_SKIT_MESSAGES[levelKey] ?? "";
    this.authorSkit.setAttribute("aria-hidden", "false");
    void this.authorSkit.offsetWidth;
    this.authorSkit.classList.add("is-visible");
    this.skitTimer = window.setTimeout(() => this.hideAuthorSkit(), 5200);
  }

  hideAuthorSkit() {
    window.clearTimeout(this.skitTimer);
    this.skitTimer = 0;
    this.authorSkit.classList.remove("is-visible");
    this.authorSkit.setAttribute("aria-hidden", "true");
  }

  pauseGame() {
    if (!["playing", "countdown"].includes(this.status)) return;
    if (this.status === "playing") {
      this.elapsedBeforePause = performance.now() - this.startTime;
      this.resumeStatus = "playing";
    } else {
      this.resumeStatus = "countdown";
      this.cancelCountdown();
    }
    this.status = "paused";
    this.setHudActionsEnabled(false);
    this.ropeWorld.release();
    this.endGrabUi();
    this.controls.enabled = false;
    this.openModal(this.pauseScreen);
    this.setGameChromeInert(true);
    window.setTimeout(() => {
      document.querySelector("#resume-button")?.focus({ preventScroll: true });
    }, 50);
  }

  resumeGame() {
    if (this.status !== "paused" || !this.resumeStatus) return;
    const resumeStatus = this.resumeStatus;
    this.resumeStatus = null;
    this.closeModal(this.pauseScreen);
    this.setGameChromeInert(false);
    this.controls.enabled = true;
    if (resumeStatus === "countdown") {
      this.beginCountdown();
      return;
    }
    this.status = "playing";
    this.startTime = performance.now() - this.elapsedBeforePause;
    this.setHudActionsEnabled(true);
    this.canvas.focus({ preventScroll: true });
  }

  requestRetry() {
    if (!["playing", "countdown", "paused"].includes(this.status)) return;
    this.retryOpener = document.activeElement;
    this.retryReturnStatus = this.status;
    if (this.status === "playing") {
      this.elapsedBeforePause = performance.now() - this.startTime;
      this.ropeWorld.release();
      this.endGrabUi();
    } else if (this.status === "countdown") {
      this.cancelCountdown();
    } else {
      this.closeModal(this.pauseScreen);
    }
    this.status = "retry-confirm";
    this.setHudActionsEnabled(false);
    this.controls.enabled = false;
    this.setGameChromeInert(true);
    this.openModal(this.retryScreen);
    window.setTimeout(() => {
      document.querySelector("#retry-confirm-button")?.focus({ preventScroll: true });
    }, 50);
  }

  cancelRetry() {
    if (this.status !== "retry-confirm" || !this.retryReturnStatus) return;
    const returnStatus = this.retryReturnStatus;
    const opener = this.retryOpener;
    this.retryReturnStatus = null;
    this.retryOpener = null;
    this.closeModal(this.retryScreen);
    if (returnStatus === "playing") {
      this.status = "playing";
      this.startTime = performance.now() - this.elapsedBeforePause;
      this.controls.enabled = true;
      this.setGameChromeInert(false);
      this.setHudActionsEnabled(true);
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
      else this.canvas.focus({ preventScroll: true });
      return;
    }
    if (returnStatus === "countdown") {
      this.controls.enabled = true;
      this.setGameChromeInert(false);
      this.beginCountdown();
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
      return;
    }
    this.status = "paused";
    this.controls.enabled = false;
    this.openModal(this.pauseScreen);
    window.setTimeout(() => {
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
      else document.querySelector("#retry-button")?.focus({ preventScroll: true });
    }, 50);
  }

  confirmRetry() {
    if (this.status !== "retry-confirm") return;
    this.closeModal(this.retryScreen);
    this.retryReturnStatus = null;
    this.retryOpener = null;
    this.startGame(this.levelKey, true);
  }

  async toggleFullscreen() {
    try {
      if (this.getFullscreenElement()) {
        const exitFullscreen = document.exitFullscreen ?? document.webkitExitFullscreen;
        if (!exitFullscreen) throw new Error("Fullscreen exit is unavailable");
        await exitFullscreen.call(document);
        return;
      }

      const requestFullscreen = this.shell.requestFullscreen ?? this.shell.webkitRequestFullscreen;
      if (!requestFullscreen) {
        this.showToast("ホーム画面に追加すると全画面で遊べます");
        return;
      }
      await requestFullscreen.call(this.shell);
    } catch {
      this.showToast("この環境ではフルスクリーンを開始できません");
    }
  }

  getFullscreenElement() {
    return document.fullscreenElement ?? document.webkitFullscreenElement ?? null;
  }

  updateFullscreenUi() {
    const isFullscreen = this.getFullscreenElement() === this.shell;
    this.fullscreenButton.setAttribute("aria-pressed", String(isFullscreen));
    this.fullscreenButton.setAttribute(
      "aria-label",
      isFullscreen ? "フルスクリーンを終了" : "フルスクリーン",
    );
    this.fullscreenIcon.classList.toggle("fa-expand", !isFullscreen);
    this.fullscreenIcon.classList.toggle("fa-compress", isFullscreen);
  }

  returnToMenu() {
    this.cancelCountdown();
    this.hideAuthorSkit();
    this.ropeWorld.release();
    this.endGrabUi();
    this.status = "menu";
    this.setHudActionsEnabled(false);
    this.resumeStatus = null;
    this.helpReturnStatus = null;
    this.retryReturnStatus = null;
    this.retryOpener = null;
    this.closeModal(this.pauseScreen);
    this.closeModal(this.retryScreen);
    this.closeModal(this.clearScreen);
    this.closeModal(this.helpScreen);
    this.showDifficultySelection(false);
    this.openModal(this.startScreen);
    this.setGameChromeInert(true);
    this.updateProgressUi();
    this.applySurfaceTheme(this.levelKey);
    window.setTimeout(() => {
      this.difficultyButtons.find((button) => button.dataset.level === this.levelKey)?.focus({ preventScroll: true });
    }, 50);
  }

  onKeyDown(event) {
    if (!event.repeat && event.key.toLowerCase() === "d") {
      this.debugPressCount += 1;
      if (this.debugPressCount >= 11) this.activateDebugMode();
    } else if (!event.repeat && event.key.length === 1) {
      this.debugPressCount = 0;
    }

    const isHelpKey = event.key === "?" || (event.code === "Slash" && event.shiftKey);
    if (isHelpKey) {
      event.preventDefault();
      if (event.repeat) return;
      if (this.status === "help") this.closeHelp();
      else if (this.status === "retry-confirm") return;
      else this.openHelp();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      if (event.repeat) return;
      if (this.status === "help") this.closeHelp();
      else if (this.status === "retry-confirm") this.cancelRetry();
      else if (this.status === "paused") this.resumeGame();
      else if (["playing", "countdown"].includes(this.status)) this.pauseGame();
      else if (this.status === "menu" && this.menuPhase === "ranking") this.showDifficultySelection();
      return;
    }
    if (this.status === "playing" && ["+", "="].includes(event.key)) {
      event.preventDefault();
      this.zoomCamera(0.84);
      return;
    }
    if (this.status === "playing" && ["-", "_"].includes(event.key)) {
      event.preventDefault();
      this.zoomCamera(1.18);
    }
  }

  openHelp() {
    if (this.status === "help" || this.status === "retry-confirm") return;
    this.helpOpener = document.activeElement;
    this.helpReturnStatus = this.status;
    if (this.status === "playing") {
      this.elapsedBeforePause = performance.now() - this.startTime;
      this.ropeWorld.release();
      this.endGrabUi();
    } else if (this.status === "countdown") {
      this.cancelCountdown();
    } else if (this.status === "paused") {
      this.closeModal(this.pauseScreen);
    } else if (this.status === "cleared") {
      this.closeModal(this.clearScreen);
    }
    this.status = "help";
    this.setHudActionsEnabled(false);
    this.controls.enabled = false;
    this.setGameChromeInert(true);
    this.openModal(this.helpScreen);
    window.setTimeout(() => {
      document.querySelector("#help-close-button")?.focus({ preventScroll: true });
    }, 50);
  }

  closeHelp() {
    if (this.status !== "help" || !this.helpReturnStatus) return;
    const returnStatus = this.helpReturnStatus;
    const opener = this.helpOpener;
    this.helpReturnStatus = null;
    this.helpOpener = null;
    this.closeModal(this.helpScreen);
    if (returnStatus === "playing") {
      this.status = "playing";
      this.startTime = performance.now() - this.elapsedBeforePause;
      this.controls.enabled = true;
      this.setGameChromeInert(false);
      this.setHudActionsEnabled(true);
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
      else this.canvas.focus({ preventScroll: true });
      return;
    }
    if (returnStatus === "countdown") {
      this.controls.enabled = true;
      this.setGameChromeInert(false);
      this.beginCountdown();
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
      return;
    }
    if (returnStatus === "paused") {
      this.status = "paused";
      this.openModal(this.pauseScreen);
      window.setTimeout(() => {
        document.querySelector("#resume-button")?.focus({ preventScroll: true });
      }, 50);
      return;
    }
    if (returnStatus === "cleared") {
      this.status = "cleared";
      this.openModal(this.clearScreen);
      window.setTimeout(() => {
        const focusTarget = this.nextLevelButton.hidden
          ? document.querySelector("#replay-button")
          : this.nextLevelButton;
        focusTarget?.focus({ preventScroll: true });
      }, 50);
      return;
    }
    this.status = "menu";
    if (opener instanceof HTMLElement && opener.isConnected) {
      opener.focus({ preventScroll: true });
    }
  }

  zoomCamera(scale) {
    const offset = this.camera.position.clone().sub(this.controls.target);
    const distance = THREE.MathUtils.clamp(
      offset.length() * scale,
      this.controls.minDistance,
      this.controls.maxDistance,
    );
    offset.setLength(distance);
    this.camera.position.copy(this.controls.target).add(offset);
    this.controls.update();
  }

  updatePointer(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    this.pointer.y = -(event.clientY - rect.top) / rect.height * 2 + 1;
    this.pointerClient.x = event.clientX;
    this.pointerClient.y = event.clientY;
    this.raycaster.setFromCamera(this.pointer, this.camera);
  }

  onPointerDown(event) {
    if (this.status !== "playing" || event.button !== 0) return;
    this.updatePointer(event);
    const hit = this.raycaster.intersectObjects(this.ropeWorld.pickables, false)[0];
    if (!hit) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    const rope = hit.object.userData.rope;
    const particleIndex = Number.isInteger(hit.object.userData.particleIndex)
      ? hit.object.userData.particleIndex
      : rope.closestParticle(hit.point);
    this.camera.getWorldDirection(this.cameraDirection);
    this.grabPlanePoint.copy(hit.point);
    this.grabPlane.setFromNormalAndCoplanarPoint(this.cameraDirection, this.grabPlanePoint);
    this.ropeWorld.grab(rope, particleIndex, hit.point);
    this.controls.enabled = false;
    this.canvas.setPointerCapture(event.pointerId);
    this.canvas.classList.add("is-holding");
    this.grabCount += 1;
    this.grabLabel.textContent = rope.typeLabel;
    this.grabReadout.classList.add("is-visible");
    this.moveGrabReadout(event.clientX, event.clientY);
    this.sound.grab();
  }

  onPointerMove(event) {
    if (!this.ropeWorld.held) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    this.updatePointer(event);
    if (this.raycaster.ray.intersectPlane(this.grabPlane, this.grabIntersection)) {
      this.grabIntersection.x = THREE.MathUtils.clamp(this.grabIntersection.x, -WORLD.halfWidth, WORLD.halfWidth);
      this.grabIntersection.y = THREE.MathUtils.clamp(this.grabIntersection.y, 0.06, WORLD.maxHeight);
      this.grabIntersection.z = THREE.MathUtils.clamp(this.grabIntersection.z, -WORLD.halfDepth, WORLD.halfDepth);
      this.ropeWorld.moveGrab(this.grabIntersection);
    }
    this.moveGrabReadout(event.clientX, event.clientY);
  }

  onPointerUp(event) {
    if (!this.ropeWorld.held) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    this.ropeWorld.release();
    if (this.canvas.hasPointerCapture(event.pointerId)) this.canvas.releasePointerCapture(event.pointerId);
    this.controls.enabled = true;
    this.endGrabUi();
    this.sound.release();
  }

  onWheel(event) {
    if (this.status !== "playing") return;
    if (event.shiftKey && !this.ropeWorld.held) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.panCameraFromWheel(event);
      return;
    }
    if (!this.ropeWorld.held) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const amount = THREE.MathUtils.clamp(event.deltaY, -120, 120) * 0.006;
    this.grabPlanePoint.addScaledVector(this.cameraDirection, amount);
    this.grabPlane.setFromNormalAndCoplanarPoint(this.cameraDirection, this.grabPlanePoint);
    this.updatePointer(event);
    if (this.raycaster.ray.intersectPlane(this.grabPlane, this.grabIntersection)) {
      this.ropeWorld.moveGrab(this.grabIntersection);
    }
  }

  panCameraFromWheel(event) {
    const modeScale = event.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? 40
      : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
        ? Math.min(window.innerWidth, window.innerHeight) * 0.8
        : 1;
    let screenX = THREE.MathUtils.clamp(event.deltaX * modeScale, -160, 160);
    let screenY = THREE.MathUtils.clamp(event.deltaY * modeScale, -160, 160);

    // Chrome系で Shift + 縦ホイールが deltaX に変換された場合だけ、
    // テーブル前後の移動へ戻す。2軸トラックパッドは両成分を維持する。
    if (event.shiftKey && Math.abs(screenX) >= 0.01 && Math.abs(screenY) < 0.01) {
      screenY = screenX;
      screenX = 0;
    }

    if (Math.abs(screenX) < 0.01 && Math.abs(screenY) < 0.01) return;
    const distance = this.camera.position.distanceTo(this.controls.target);
    const speed = THREE.MathUtils.clamp(distance * 0.0016, 0.01, 0.065);
    this.camera.updateMatrixWorld();
    const cameraRight = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 0);
    cameraRight.y = 0;
    cameraRight.normalize();
    this.camera.getWorldDirection(this.cameraDirection);
    const cameraForward = this.cameraDirection.clone();
    cameraForward.y = 0;
    cameraForward.normalize();
    const move = new THREE.Vector3()
      .addScaledVector(cameraRight, -screenX * speed)
      .addScaledVector(cameraForward, screenY * speed);
    const nextTarget = this.controls.target.clone().add(move);
    nextTarget.x = THREE.MathUtils.clamp(nextTarget.x, -WORLD.halfWidth * 0.72, WORLD.halfWidth * 0.72);
    nextTarget.z = THREE.MathUtils.clamp(nextTarget.z, -WORLD.halfDepth * 0.72, WORLD.halfDepth * 0.72);
    move.copy(nextTarget).sub(this.controls.target);
    this.controls.target.copy(nextTarget);
    this.camera.position.add(move);
    this.controls.update();
  }

  moveGrabReadout(x, y) {
    const left = THREE.MathUtils.clamp(x + 16, 8, window.innerWidth - this.grabReadout.offsetWidth - 8);
    const top = THREE.MathUtils.clamp(y + 16, 8, window.innerHeight - this.grabReadout.offsetHeight - 8);
    this.grabReadout.style.left = `${left}px`;
    this.grabReadout.style.top = `${top}px`;
  }

  endGrabUi() {
    this.canvas.classList.remove("is-holding");
    this.grabReadout.classList.remove("is-visible");
    this.controls.enabled = true;
  }

  checkClear(now) {
    if (this.ropeWorld.held || now - this.lastMetricCheck < 220) return;
    this.lastMetricCheck = now;
    const result = this.ropeWorld.clearMetrics();
    if (!result.cleared) {
      this.stableSince = 0;
      return;
    }
    if (!this.stableSince) this.stableSince = now;
    if (now - this.stableSince >= CONTACT_FREE_STABLE_MS) this.completeLevel();
  }

  completeLevel() {
    if (this.status !== "playing") return;
    const elapsed = performance.now() - this.startTime;
    this.status = "cleared";
    this.ropeWorld.release();
    this.endGrabUi();
    this.sound.clear();
    this.unlockNextLevel();
    this.setHudActionsEnabled(false);
    const level = LEVELS[this.levelKey];
    const formattedTime = this.formatTime(elapsed);
    saveLocalScore({
      difficulty: this.levelKey,
      cableCount: level.count,
      elapsedMs: elapsed,
      completedAt: new Date().toISOString(),
    });
    this.clearLevel.textContent = `${level.name} / ${level.count} CABLES`;
    this.clearTime.textContent = formattedTime;
    this.clearTime.value = formattedTime;
    const shareUrl = new URL("https://twitter.com/intent/tweet");
    shareUrl.searchParams.set("text", `SPAGHETTI CODE / ${level.name} を ${formattedTime} でほどいた！\n#spaghetti_code`);
    shareUrl.searchParams.set("url", window.location.href);
    this.shareButton.href = shareUrl.href;
    const nextLevelKey = LEVEL_ORDER[LEVEL_ORDER.indexOf(this.levelKey) + 1];
    this.nextLevelButton.hidden = !nextLevelKey;
    this.openModal(this.clearScreen);
    this.setGameChromeInert(true);
    const focusTarget = nextLevelKey ? this.nextLevelButton : document.querySelector("#replay-button");
    focusTarget?.focus({ preventScroll: true });
  }

  startNextLevel() {
    if (this.status !== "cleared") return;
    const currentIndex = LEVEL_ORDER.indexOf(this.levelKey);
    const nextLevelKey = LEVEL_ORDER[currentIndex + 1];
    if (!nextLevelKey || !this.isLevelUnlocked(currentIndex + 1)) return;
    this.startGame(nextLevelKey);
  }

  openModal(element) {
    element.inert = false;
    if (element instanceof HTMLDialogElement && !element.open) element.showModal();
    element.classList.add("is-visible");
    element.setAttribute("aria-hidden", "false");
  }

  closeModal(element) {
    element.classList.remove("is-visible");
    element.setAttribute("aria-hidden", "true");
    element.inert = true;
    if (element instanceof HTMLDialogElement && element.open) element.close();
  }

  setGameChromeInert(inert) {
    for (const element of this.gameChromeElements) {
      element.inert = inert;
      element.setAttribute("aria-hidden", String(inert));
    }
  }

  setHudActionsEnabled(enabled) {
    for (const button of this.hudActionButtons) button.disabled = !enabled;
  }

  showToast(message) {
    window.clearTimeout(this.toastTimer);
    this.toast.textContent = message;
    this.toast.classList.add("is-visible");
    this.toastTimer = window.setTimeout(() => this.toast.classList.remove("is-visible"), 2300);
  }

  formatTime(milliseconds) {
    const totalCentiseconds = Math.max(0, Math.floor(milliseconds / 10));
    const hours = Math.floor(totalCentiseconds / 360000);
    const minutes = Math.floor(totalCentiseconds / 6000) % 60;
    const seconds = Math.floor(totalCentiseconds / 100) % 60;
    const centiseconds = totalCentiseconds % 100;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
  }

  resize() {
    if (!this.renderer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / Math.max(height, 1);
    this.camera.updateProjectionMatrix();
    const cableCount = LEVELS[this.levelKey]?.count ?? 6;
    const maxRatio = cableCount >= 48 ? 1 : cableCount >= 24 ? 1.2 : 1.55;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxRatio));
    this.renderer.setSize(width, height, false);
  }

  animateCyberBackdrop(now) {
    if (!this.cyberBackdrop?.visible) return;
    this.cyberStars.rotation.y = now * 0.000018;
    this.cyberStars.rotation.x = Math.sin(now * 0.00011) * 0.035;
    this.cyberStars.material.opacity = 0.68 + Math.sin(now * 0.0011) * 0.12;
    this.cyberRings.forEach((ring, index) => {
      ring.rotation.z += 0.00018 * (index % 2 ? -1 : 1);
      ring.material.opacity = 0.14 + (Math.sin(now * 0.0007 + index * 1.7) + 1) * 0.055;
    });
  }

  animate(now) {
    requestAnimationFrame((time) => this.animate(time));
    const dt = Math.min((now - this.lastFrame) / 1000, 0.04);
    this.lastFrame = now;
    this.controls.update();
    this.animateCyberBackdrop(now);

    if (this.status === "playing") {
      this.ropeWorld.step(dt);
      this.hudTime.textContent = this.formatTime(now - this.startTime);
      this.checkClear(now);
    }
    this.renderer.render(this.scene, this.camera);
  }
}

const game = new SpaghettiGame();

if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
  Object.defineProperty(window, "__SPAGHETTI_GAME__", {
    value: game,
    enumerable: false,
    configurable: false,
    writable: false,
  });
}
