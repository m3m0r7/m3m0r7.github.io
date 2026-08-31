import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  LEVEL_ORDER,
  LEVELS,
  calculateBundleLoad,
  createDeskWastePlan,
  createDocumentPlan,
  getLevelTotalCount,
  SPECIAL_LEVEL_KEY,
} from "./config.js";
import { readLocalRankings, saveLocalScore } from "./score-storage.js";
import { buildXShareUrl } from "./share.js";
import {
  createRoom,
  DeskWasteVisual,
  DocumentVisual,
  ShredderVisual,
  WastebasketVisual,
} from "./scene-objects.js";

const REVERSE_HOLD_MS = 1150;
const FEED_APPROACH_MS = 520;
const FOREIGN_FEED_MS = 680;
const BIN_DUMP_MS = 2600;
const SLOT_POSITION = new THREE.Vector3(0, 3.48, -3.1);
const SLOT_HALF_WIDTH = 1.34;
const HEAT_MAX = 100;
const HEAT_RESUME = 35;
const HEAT_IDLE_COOLING = 8.5;
const HEAT_OVERHEAT_COOLING = 4;
const HEAT_APPROACH_BASE = 1.8;
const HEAT_SHREDDING_BASE = 5;
const HEAT_APPROACH_LOAD = 1;
const HEAT_SHREDDING_LOAD = 3.2;
const OVERHEAT_FEED_DELAY_BASE_MS = 1600;
const OVERHEAT_FEED_DELAY_PER_LOAD_MS = 550;
const OVERHEAT_FEED_HEAT_PER_LOAD = 3.4;
const PROGRESS_STORAGE_KEY = "shredder:progress:v1";
const DEFAULT_UNLOCKED_INDEX = LEVEL_ORDER.indexOf("hard");
const SPECIAL_TRIGGER_COUNT = 8;
const DEBUG_TRIGGER_COUNT = 11;
const STATUS_LABELS = Object.freeze({
  ready: "READY",
  processing: "SHREDDING",
  jammed: "PAPER JAM",
  full: "BIN FULL",
  binRemoved: "BIN REMOVED",
  emptying: "EMPTYING BIN",
  overheated: "OVERHEAT",
  paused: "PAUSED",
  complete: "COMPLETE",
});

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function easeInOutCubic(value) {
  return value < 0.5 ? 4 * value ** 3 : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function formatTime(milliseconds) {
  const safeMilliseconds = Math.max(0, Math.floor(milliseconds));
  const centiseconds = Math.floor((safeMilliseconds % 1000) / 10);
  const seconds = Math.floor(safeMilliseconds / 1000) % 60;
  const minutes = Math.floor(safeMilliseconds / 60000) % 60;
  const hours = Math.floor(safeMilliseconds / 3600000);
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":")
    + `.${String(centiseconds).padStart(2, "0")}`;
}

class SoundDesign {
  constructor() {
    this.context = null;
    this.motor = null;
  }

  enable() {
    if (!this.context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.context = new AudioContext();
    }
    if (this.context?.state === "suspended") this.context.resume();
  }

  tone(frequency, duration, volume = 0.022, type = "sine", delay = 0) {
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
    oscillator.stop(start + duration + 0.03);
  }

  countdown(value) {
    if (value === "GO") {
      this.tone(170, 0.13, 0.027, "square");
      this.tone(250, 0.16, 0.02, "square", 0.08);
      return;
    }
    this.tone(230 + Number(value) * 25, 0.09, 0.018, "square");
  }

  select() {
    this.tone(390, 0.04, 0.009, "triangle");
  }

  drop() {
    this.tone(96, 0.06, 0.013, "triangle");
  }

  discardObject() {
    this.tone(142, 0.07, 0.018, "triangle");
    this.tone(88, 0.1, 0.016, "square", 0.07);
  }

  prepare(action, completed) {
    if (action === "unstaple") {
      this.tone(720, 0.045, 0.018, "square");
      this.tone(410, 0.07, 0.012, "triangle", 0.035);
      return;
    }
    this.tone(completed ? 185 : 142, 0.08, 0.018, "sawtooth");
    this.tone(completed ? 285 : 104, 0.1, 0.012, "triangle", 0.055);
  }

  startMotor(reverse = false) {
    this.stopMotor();
    if (!this.context) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const filter = this.context.createBiquadFilter();
    oscillator.type = "sawtooth";
    oscillator.frequency.value = reverse ? 54 : 68;
    filter.type = "lowpass";
    filter.frequency.value = reverse ? 310 : 520;
    gain.gain.value = 0.0001;
    oscillator.connect(filter).connect(gain).connect(this.context.destination);
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(reverse ? 0.026 : 0.032, this.context.currentTime + 0.06);
    this.motor = { oscillator, gain };
  }

  stopMotor() {
    if (!this.motor || !this.context) return;
    const { oscillator, gain } = this.motor;
    gain.gain.cancelScheduledValues(this.context.currentTime);
    gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value), this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + 0.07);
    oscillator.stop(this.context.currentTime + 0.09);
    this.motor = null;
  }

  jam() {
    this.stopMotor();
    this.tone(82, 0.22, 0.04, "sawtooth");
    this.tone(61, 0.3, 0.025, "square", 0.12);
  }

  empty() {
    this.tone(152, 0.08, 0.018, "triangle");
    this.tone(115, 0.1, 0.014, "triangle", 0.16);
  }

  overheat() {
    this.stopMotor();
    this.tone(118, 0.18, 0.032, "square");
    this.tone(82, 0.32, 0.025, "sawtooth", 0.14);
  }

  cooled() {
    this.tone(196, 0.08, 0.018, "triangle");
    this.tone(294, 0.13, 0.018, "triangle", 0.08);
  }

  clear() {
    [196, 247, 294, 392].forEach((frequency, index) => this.tone(frequency, 0.34, 0.025, "triangle", index * 0.1));
  }
}

class ShredderGame {
  constructor() {
    this.canvas = document.querySelector("#game-canvas");
    this.shell = document.querySelector("#game-shell");
    this.startScreen = document.querySelector("#start-screen");
    this.pauseScreen = document.querySelector("#pause-screen");
    this.retryScreen = document.querySelector("#retry-screen");
    this.clearScreen = document.querySelector("#clear-screen");
    this.helpScreen = document.querySelector("#help-screen");
    this.fatalMessage = document.querySelector("#fatal-message");
    this.debugMode = new URLSearchParams(window.location.search).get("debug") === "1";
    this.debugPressCount = 0;
    this.specialTriggerPressCount = 0;
    const progress = this.readProgress();
    this.highestUnlockedIndex = progress.highestUnlockedIndex;
    this.unknownCleared = progress.unknownCleared;

    this.levelKey = "easy";
    this.status = "menu";
    this.machineState = "ready";
    this.documents = [];
    this.deskWaste = [];
    this.selected = new Set();
    this.keyboardFocus = null;
    this.keyboardIndex = -1;
    this.dragging = false;
    this.dragPointerId = null;
    this.dragOffsets = new Map();
    this.dragGrabOffsets = new Map();
    this.dragEntryRotations = new Map();
    this.dragAnchor = new THREE.Vector3();
    this.dragLastPoint = new THREE.Vector3();
    this.dragMotion = 0;
    this.dragLastClientY = 0;
    this.feedArmed = false;
    this.insertionMode = false;
    this.pointer = new THREE.Vector2();
    this.pointerClient = { x: 0, y: 0 };
    this.raycaster = new THREE.Raycaster();
    this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.45);
    this.dragIntersection = new THREE.Vector3();
    this.dropPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.065);
    this.dropIntersection = new THREE.Vector3();
    this.slotPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -SLOT_POSITION.z);
    this.slotIntersection = new THREE.Vector3();
    this.activeFeeds = [];
    this.activeJam = null;
    this.activeForeignJam = null;
    this.activeForeignFeed = null;
    this.activeBinDump = null;
    this.deskWasteDragging = null;
    this.deskWastePointerId = null;
    this.deskWasteDragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.15);
    this.deskWasteDragIntersection = new THREE.Vector3();
    this.deskWasteDragOffset = new THREE.Vector3();
    this.deskWasteDragLastClientY = 0;
    this.foreignFeedArmed = false;
    this.binDragging = false;
    this.binPointerId = null;
    this.binDragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.55);
    this.binDragIntersection = new THREE.Vector3();
    this.binDragOffset = new THREE.Vector3();
    this.reverseStart = 0;
    this.reversing = false;
    this.reversePointerId = null;
    this.countdownToken = 0;
    this.countdownTimer = 0;
    this.startTime = 0;
    this.elapsedBeforePause = 0;
    this.pausedAt = 0;
    this.retryOrigin = "playing";
    this.binFill = 0;
    this.processedCount = 0;
    this.stats = { maxBundle: 0, jams: 0, empties: 0 };
    this.heat = 0;
    this.overheatStartedAt = 0;
    this.overheatPenaltyUntil = 0;
    this.lastFrame = performance.now();
    this.seed = 0;
    this.toastTimer = 0;
    this.managerTimer = 0;
    this.gameOverTimer = 0;
    this.sound = new SoundDesign();

    try {
      this.setupScene();
      this.setupInterface();
      this.bindEvents();
      this.resize();
      this.updateMenu();
      this.startScreen.inert = false;
      this.startScreen.setAttribute("aria-hidden", "false");
      this.animate(performance.now());
    } catch (error) {
      console.error("3D renderer initialization failed", error);
      this.fatalMessage.hidden = false;
    }
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xdcebf2);
    this.scene.fog = new THREE.Fog(0xdcebf2, 26, 62);

    this.camera = new THREE.PerspectiveCamera(41, 1, 0.05, 80);
    this.camera.position.set(0, 9.2, 11.8);

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
    this.controls.minDistance = 8;
    this.controls.maxDistance = 25;
    this.controls.minPolarAngle = 0.42;
    this.controls.maxPolarAngle = 1.28;
    this.controls.target.set(0, 1.2, -0.6);
    this.controls.enablePan = true;
    this.controls.screenSpacePanning = false;
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    };
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
    this.controls.update();

    const hemisphere = new THREE.HemisphereLight(0xffffff, 0x7893a3, 1.95);
    this.scene.add(hemisphere);

    const keyLight = new THREE.DirectionalLight(0xfffdf7, 4.6);
    keyLight.position.set(-8, 14, 9);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -12;
    keyLight.shadow.camera.right = 12;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -10;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 36;
    keyLight.shadow.bias = -0.00018;
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xbfe5ff, 2.2);
    fillLight.position.set(10, 8, 2);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xd7f2ff, 1.5);
    rimLight.position.set(-5, 5, -9);
    this.scene.add(rimLight);

    createRoom(this.scene);
    this.shredder = new ShredderVisual(this.scene);
    this.wastebasket = new WastebasketVisual(this.scene);
  }

  setupInterface() {
    this.hudLevel = document.querySelector("#hud-level");
    this.hudRemaining = document.querySelector("#hud-remaining");
    this.hudTime = document.querySelector("#hud-time");
    this.hudBundleCount = document.querySelector("#hud-bundle-count");
    this.bundleDebugPanel = document.querySelector("#bundle-debug");
    this.hudBinLabel = document.querySelector("#hud-bin-label");
    this.bundleMeter = document.querySelector("#bundle-meter");
    this.binMeter = document.querySelector("#bin-meter");
    this.machineStatus = document.querySelector("#machine-status");
    this.machineInstruction = document.querySelector("#machine-instruction");
    this.machineHeat = document.querySelector("#machine-heat");
    this.heatMeter = document.querySelector("#heat-meter");
    this.selectionReadout = document.querySelector("#selection-readout");
    this.selectionLabel = document.querySelector("#selection-label");
    this.selectionCount = document.querySelector("#selection-count");
    this.feedGuide = document.querySelector("#feed-guide");
    this.feedGuideLabel = document.querySelector("#feed-guide-label");
    this.toast = document.querySelector("#toast");
    this.managerSkit = document.querySelector("#manager-skit");
    this.managerLine = document.querySelector("#manager-line");
    this.managerHint = document.querySelector("#manager-hint");
    this.wasteMarker = document.querySelector("#waste-marker");
    this.countdownOverlay = document.querySelector("#countdown-overlay");
    this.countdownLabel = document.querySelector("#countdown-label");
    this.startButton = document.querySelector("#start-button");
    this.rankingList = document.querySelector("#ranking-list");
    this.rankingEmpty = document.querySelector("#ranking-empty");
    this.difficultyButtons = [...document.querySelectorAll(".difficulty-option")];
    this.specialTrigger = document.querySelector("#special-trigger");
    this.specialProgressDots = [...document.querySelectorAll("#special-progress i")];
    this.mascotPanel = document.querySelector("#mascot-panel");
    this.mascotSpeech = document.querySelector("#mascot-speech");
    this.mascotStatus = document.querySelector("#mascot-status");
    this.debugIndicator = document.querySelector("#debug-indicator");
    this.gameOverScreen = document.querySelector("#game-over-screen");
    this.gameOverDescription = document.querySelector("#game-over-description");
    this.fullscreenButton = document.querySelector("#hud-fullscreen-button");
    this.prepActionButton = document.querySelector("#prep-action");
    this.bundleDebugPanel.hidden = !this.debugMode;
    this.debugIndicator.hidden = !this.debugMode;
    this.shell.classList.toggle("is-debug-mode", this.debugMode);
    this.hudButtons = [
      document.querySelector("#hud-help-button"),
      document.querySelector("#hud-retry-button"),
      document.querySelector("#hud-pause-button"),
      this.fullscreenButton,
    ];
    this.updateProgressUi();
  }

  bindEvents() {
    window.addEventListener("resize", () => this.resize());
    document.addEventListener("keydown", (event) => this.onKeyDown(event));
    window.addEventListener("blur", () => {
      if (this.status === "playing") this.pauseGame();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.status === "playing") this.pauseGame();
    });
    document.addEventListener("fullscreenchange", () => this.updateFullscreenUi());
    document.addEventListener("webkitfullscreenchange", () => this.updateFullscreenUi());

    this.canvas.addEventListener("pointerdown", (event) => this.onPointerDown(event), { capture: true });
    this.canvas.addEventListener("pointermove", (event) => this.onPointerMove(event), { capture: true });
    this.canvas.addEventListener("pointerup", (event) => this.onPointerUp(event), { capture: true });
    this.canvas.addEventListener("pointercancel", (event) => this.onPointerUp(event), { capture: true });
    this.canvas.addEventListener("wheel", (event) => this.onWheel(event), { passive: false });

    this.difficultyButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (!this.canAccessLevel(button.dataset.level)) return;
        this.sound.enable();
        this.levelKey = button.dataset.level;
        this.updateMenu();
      });
    });
    this.specialTrigger.addEventListener("click", () => this.activateSpecialTrigger());
    this.startButton.addEventListener("click", () => {
      this.sound.enable();
      this.startGame(this.levelKey);
    });

    document.querySelector("#hud-help-button").addEventListener("click", () => this.openHelp());
    document.querySelector("#hud-retry-button").addEventListener("click", () => this.requestRetry());
    document.querySelector("#hud-pause-button").addEventListener("click", () => this.pauseGame());
    this.fullscreenButton.addEventListener("click", () => this.toggleFullscreen());
    this.prepActionButton.addEventListener("click", () => this.prepareSelected());
    document.querySelector("#resume-button").addEventListener("click", () => this.resumeGame());
    document.querySelector("#retry-button").addEventListener("click", () => this.requestRetry());
    document.querySelector("#pause-menu-button").addEventListener("click", () => this.returnToMenu());
    document.querySelector("#retry-confirm-button").addEventListener("click", () => this.confirmRetry());
    document.querySelector("#retry-cancel-button").addEventListener("click", () => this.cancelRetry());
    document.querySelector("#replay-button").addEventListener("click", () => this.startGame(this.levelKey));
    document.querySelector("#next-level-button").addEventListener("click", () => this.startNextLevel());
    document.querySelector("#clear-menu-button").addEventListener("click", () => this.returnToMenu());
    document.querySelector("#help-close-button").addEventListener("click", () => this.closeHelp());
    document.querySelector("#game-over-retry-button").addEventListener("click", () => this.startGame(SPECIAL_LEVEL_KEY));
    document.querySelector("#game-over-menu-button").addEventListener("click", () => this.returnToMenu());

    [this.pauseScreen, this.retryScreen, this.clearScreen, this.helpScreen, this.gameOverScreen].forEach((dialog) => {
      dialog.addEventListener("cancel", (event) => event.preventDefault());
    });
  }

  updateMenu() {
    const level = LEVELS[this.levelKey];
    const levelIndex = LEVEL_ORDER.indexOf(this.levelKey);
    const isSpecial = this.levelKey === SPECIAL_LEVEL_KEY;
    this.shell.dataset.level = this.levelKey;
    this.difficultyButtons.forEach((button) => {
      const selected = button.dataset.level === this.levelKey;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
      button.querySelector("small").textContent = `${getLevelTotalCount(button.dataset.level)} ITEMS`;
    });
    document.querySelector("#case-index").textContent = isSpecial ? "SP" : String(levelIndex + 1).padStart(2, "0");
    document.querySelector("#case-total").textContent = isSpecial ? "/SECRET" : `/${String(LEVEL_ORDER.length).padStart(2, "0")}`;
    document.querySelector("#case-access").textContent = isSpecial ? "PERFECT RUN" : "UNLOCKED";
    document.querySelector("#case-title").textContent = level.caseLabel;
    document.querySelector("#case-count").textContent = getLevelTotalCount(this.levelKey);
    document.querySelector("#case-load").textContent = level.feedLimit.toFixed(1);
    document.querySelector("#case-bin").textContent = level.binCapacity;
    this.startButton.querySelector("span").textContent = isSpecial ? "START SPECIAL" : "BECOME A SHREDDER OFFICER";
    this.mascotPanel.classList.toggle("is-secret-active", isSpecial);
    this.updateSpecialTrigger();
    this.renderRanking();
  }

  renderRanking() {
    const records = readLocalRankings()[this.levelKey].slice(0, 3);
    this.rankingList.replaceChildren();
    records.forEach((record) => {
      const item = document.createElement("li");
      const value = document.createElement("span");
      value.textContent = formatTime(record.elapsedMs);
      item.append(value);
      this.rankingList.append(item);
    });
    this.rankingEmpty.hidden = records.length > 0;
  }

  readProgress() {
    let stored = null;
    try {
      stored = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) ?? "null");
    } catch {
      stored = null;
    }
    const storedIndex = LEVEL_ORDER.indexOf(stored?.highestUnlocked);
    const unknownCleared = stored?.unknownCleared === true || readLocalRankings().unknown.length > 0;
    return {
      highestUnlockedIndex: unknownCleared
        ? LEVEL_ORDER.length - 1
        : clamp(
          storedIndex >= DEFAULT_UNLOCKED_INDEX ? storedIndex : DEFAULT_UNLOCKED_INDEX,
          DEFAULT_UNLOCKED_INDEX,
          LEVEL_ORDER.length - 1,
        ),
      unknownCleared,
    };
  }

  saveProgress() {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
        highestUnlocked: LEVEL_ORDER[this.highestUnlockedIndex],
        unknownCleared: this.unknownCleared,
      }));
    } catch {
      // 保存できない環境でも、現在のセッション内では解禁状態を維持する。
    }
  }

  updateProgressUi() {
    this.difficultyButtons.forEach((button) => {
      const levelIndex = LEVEL_ORDER.indexOf(button.dataset.level);
      const locked = !this.isLevelUnlocked(levelIndex);
      const prerequisite = LEVELS[LEVEL_ORDER[levelIndex - 1]]?.name;
      button.disabled = locked;
      button.classList.toggle("is-locked", locked);
      button.querySelector(".difficulty-status").textContent = locked ? "LOCKED" : "READY";
      button.setAttribute(
        "aria-label",
        locked
          ? `${LEVELS[button.dataset.level].name}、${prerequisite}クリアで解禁`
          : `${LEVELS[button.dataset.level].name}を選択`,
      );
    });
    this.updateSpecialTrigger();
  }

  updateSpecialTrigger() {
    if (!this.specialTrigger) return;
    const available = this.canAccessSpecial();
    const isSpecial = this.levelKey === SPECIAL_LEVEL_KEY;
    this.specialTrigger.disabled = !available;
    this.specialTrigger.setAttribute(
      "aria-label",
      available ? "シュレッダーくん。何度か押すと反応しそうだ" : "シュレッダーくん",
    );
    this.mascotPanel.classList.toggle("is-secret-ready", available && !isSpecial);
    this.mascotPanel.classList.toggle("is-secret-active", isSpecial);
    this.mascotSpeech.hidden = !isSpecial;
    if (isSpecial) {
      this.mascotSpeech.textContent = "SPECIAL!";
      this.mascotStatus.textContent = "PERFECT OPERATOR EXAM / NO MISTAKES";
    } else if (available) {
      this.mascotStatus.textContent = "CLASSIFIED SIGNAL DETECTED";
    } else {
      this.mascotStatus.textContent = "GENERAL AFFAIRS SUPPORT MACHINE";
    }
    this.specialProgressDots.forEach((dot, index) => {
      dot.classList.toggle("is-lit", isSpecial || index < this.specialTriggerPressCount);
    });
  }

  activateSpecialTrigger() {
    if (this.status !== "menu" || !this.canAccessSpecial()) return;
    this.specialTriggerPressCount += 1;
    this.specialTrigger.classList.remove("is-secret-tapped");
    void this.specialTrigger.offsetWidth;
    this.specialTrigger.classList.add("is-secret-tapped");
    this.sound.enable();
    this.sound.tone(150 + this.specialTriggerPressCount * 24, 0.055, 0.012, "triangle");
    this.updateSpecialTrigger();
    if (this.specialTriggerPressCount < SPECIAL_TRIGGER_COUNT) return;
    this.specialTriggerPressCount = 0;
    this.levelKey = SPECIAL_LEVEL_KEY;
    this.updateMenu();
    this.showToast("SPECIAL CASE FOUND", 2400);
    this.startButton.focus({ preventScroll: true });
  }

  isLevelUnlocked(levelIndex) {
    return levelIndex >= 0 && (this.debugMode || levelIndex <= this.highestUnlockedIndex);
  }

  canAccessLevel(levelKey) {
    if (!LEVELS[levelKey]) return false;
    if (levelKey === SPECIAL_LEVEL_KEY) return this.canAccessSpecial();
    return this.isLevelUnlocked(LEVEL_ORDER.indexOf(levelKey));
  }

  canAccessSpecial() {
    return this.unknownCleared || this.debugMode;
  }

  activateDebugMode() {
    if (this.debugMode) return;
    this.debugMode = true;
    this.debugIndicator.hidden = false;
    this.bundleDebugPanel.hidden = false;
    this.shell.classList.add("is-debug-mode");
    this.updateProgressUi();
    this.showToast("DEBUG MODE / ALL CASES UNLOCKED", 2600);
  }

  unlockNextLevel() {
    if (this.debugMode || this.levelKey === SPECIAL_LEVEL_KEY) return;
    const currentIndex = LEVEL_ORDER.indexOf(this.levelKey);
    if (currentIndex < DEFAULT_UNLOCKED_INDEX || currentIndex >= LEVEL_ORDER.length - 1) return;
    const unlockedIndex = Math.max(this.highestUnlockedIndex, currentIndex + 1);
    if (unlockedIndex === this.highestUnlockedIndex) return;
    this.highestUnlockedIndex = unlockedIndex;
    this.saveProgress();
    this.updateProgressUi();
  }

  markUnknownCleared() {
    if (this.levelKey !== "unknown" || this.unknownCleared) return;
    this.unknownCleared = true;
    this.saveProgress();
    this.updateProgressUi();
  }

  startGame(levelKey) {
    const level = LEVELS[levelKey];
    if (!level || !this.canAccessLevel(levelKey)) return;
    window.clearTimeout(this.gameOverTimer);
    this.gameOverTimer = 0;
    this.cancelCountdown();
    this.specialTriggerPressCount = 0;
    this.closeAllDialogs();
    this.disposeDocuments();
    this.disposeDeskWaste();
    this.shredder.attachBin();
    this.shredder.clearShreds();
    this.wastebasket.clear();
    this.levelKey = levelKey;
    this.shell.dataset.level = levelKey;
    this.seed = globalThis.crypto?.getRandomValues
      ? globalThis.crypto.getRandomValues(new Uint32Array(1))[0]
      : Date.now() >>> 0;
    this.documents = createDocumentPlan(levelKey, this.seed).map((definition) => {
      const visual = new DocumentVisual(definition, this.scene);
      visual.status = "table";
      return visual;
    });
    this.deskWaste = createDeskWastePlan(levelKey, this.seed).map((definition) => (
      new DeskWasteVisual(definition, this.scene)
    ));
    this.selected.clear();
    this.keyboardFocus = null;
    this.keyboardIndex = -1;
    this.activeFeeds = [];
    this.activeJam = null;
    this.activeForeignJam = null;
    this.activeForeignFeed = null;
    this.activeBinDump = null;
    this.deskWasteDragging = null;
    this.deskWastePointerId = null;
    this.foreignFeedArmed = false;
    this.binDragging = false;
    this.binPointerId = null;
    this.feedArmed = false;
    this.insertionMode = false;
    this.binFill = 0;
    this.processedCount = 0;
    this.stats = { maxBundle: 0, jams: 0, empties: 0 };
    this.heat = 0;
    this.overheatStartedAt = 0;
    this.overheatPenaltyUntil = 0;
    this.elapsedBeforePause = 0;
    this.startTime = 0;
    this.reversing = false;
    this.reversePointerId = null;
    this.hideManager();
    this.shredder.setReverseProgress(0);
    this.shredder.setHeat(0);
    this.shredder.setFill(0, level.binCapacity);
    this.setMachineState("ready");
    this.hudLevel.textContent = level.name;
    this.hudTime.textContent = "00:00:00.00";
    this.startScreen.classList.remove("is-visible");
    this.startScreen.inert = true;
    this.startScreen.setAttribute("aria-hidden", "true");
    this.setHudEnabled(false);
    this.controls.enabled = true;
    const crowd = Math.max(0, Math.log2(level.count / 30));
    const portrait = window.innerWidth / window.innerHeight < 0.76;
    if (portrait) {
      this.camera.position.set(0, 15.4 + crowd * 2.4, 18.2 + crowd * 2.2);
    } else {
      this.camera.position.set(0, 9.2 + crowd * 2.5, 11.8 + crowd * 3.2);
    }
    this.controls.target.set(0, 1.05, -0.55);
    this.controls.update();
    this.updateHud();
    this.beginCountdown();
  }

  beginCountdown() {
    this.status = "countdown";
    const token = ++this.countdownToken;
    const values = ["3", "2", "1", "GO"];
    let index = 0;
    this.countdownOverlay.hidden = false;
    const show = () => {
      if (token !== this.countdownToken || this.status !== "countdown") return;
      const value = values[index];
      this.countdownLabel.textContent = value;
      this.countdownOverlay.classList.toggle("is-go", value === "GO");
      this.countdownOverlay.classList.remove("is-pulse");
      void this.countdownOverlay.offsetWidth;
      this.countdownOverlay.classList.add("is-pulse");
      this.sound.countdown(value);
      if (value === "GO") {
        this.countdownTimer = window.setTimeout(() => {
          if (token !== this.countdownToken || this.status !== "countdown") return;
          this.countdownOverlay.hidden = true;
          this.countdownOverlay.classList.remove("is-go", "is-pulse");
          this.status = "playing";
          this.startTime = performance.now();
          this.setHudEnabled(true);
          this.updateMachineControls();
          this.canvas.focus({ preventScroll: true });
          this.showToast("本・辞書・針はX。異物はゴミ箱。", 2600);
        }, 580);
        return;
      }
      index += 1;
      this.countdownTimer = window.setTimeout(show, 690);
    };
    show();
  }

  cancelCountdown() {
    window.clearTimeout(this.countdownTimer);
    this.countdownTimer = 0;
    this.countdownToken += 1;
    this.countdownOverlay.hidden = true;
    this.countdownOverlay.classList.remove("is-go", "is-pulse");
  }

  disposeDocuments() {
    this.documents.forEach((documentVisual) => documentVisual.dispose());
    this.documents = [];
    this.selected.clear();
  }

  disposeDeskWaste() {
    this.deskWaste.forEach((deskWaste) => deskWaste.dispose());
    this.deskWaste = [];
    this.deskWasteDragging = null;
    this.deskWastePointerId = null;
  }

  updatePointer(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.pointerClient.x = event.clientX;
    this.pointerClient.y = event.clientY;
    this.raycaster.setFromCamera(this.pointer, this.camera);
  }

  onPointerDown(event) {
    if (this.status !== "playing") return;
    this.sound.enable();
    this.updatePointer(event);

    const reverseHit = this.raycaster.intersectObject(this.shredder.reverseButton, false)[0];
    if (reverseHit && this.machineState === "jammed") {
      event.preventDefault();
      event.stopPropagation();
      this.reversePointerId = event.pointerId;
      this.canvas.setPointerCapture(event.pointerId);
      this.startReverse();
      return;
    }

    const binHit = this.raycaster.intersectObjects([this.shredder.binFront, this.shredder.handle], false)[0];
    if (binHit && this.binFill > 0 && ["ready", "full", "binRemoved"].includes(this.machineState)) {
      event.preventDefault();
      event.stopPropagation();
      this.beginBinDrag(event);
      return;
    }

    const deskWasteMeshes = this.deskWaste
      .filter((deskWaste) => deskWaste.status === "table")
      .flatMap((deskWaste) => deskWaste.meshes);
    const deskWasteHit = this.raycaster.intersectObjects(deskWasteMeshes, false)[0];
    const deskWaste = deskWasteHit?.object.userData.deskWaste;
    if (deskWaste && !this.activeBinDump) {
      this.beginDeskWasteDrag(event, deskWaste);
      return;
    }

    if (!["ready", "processing", "full", "overheated"].includes(this.machineState)) return;
    const targets = this.documents.filter((documentVisual) => documentVisual.status === "table").map((documentVisual) => documentVisual.mesh);
    const hit = this.raycaster.intersectObjects(targets, false)[0];
    const documentVisual = hit?.object.userData.document;
    if (!documentVisual) return;

    event.preventDefault();
    event.stopPropagation();
    const additive = event.shiftKey || (event.pointerType === "touch" && this.selected.size > 0);
    if (!additive && !this.selected.has(documentVisual)) this.clearSelection();
    if (additive && this.selected.has(documentVisual) && event.pointerType !== "touch") {
      this.removeSelection(documentVisual);
      return;
    }
    this.addSelection(documentVisual);
    this.setKeyboardFocus(documentVisual);
    const grabLocal = documentVisual.mesh.worldToLocal(hit.point.clone());
    this.beginDrag(event, documentVisual, grabLocal);
  }

  beginDeskWasteDrag(event, deskWaste) {
    event.preventDefault();
    event.stopPropagation();
    this.clearSelection();
    this.setKeyboardFocus(null);
    this.deskWasteDragging = deskWaste;
    this.deskWastePointerId = event.pointerId;
    this.canvas.setPointerCapture(event.pointerId);
    this.controls.enabled = false;
    this.raycaster.ray.intersectPlane(this.deskWasteDragPlane, this.deskWasteDragIntersection);
    this.deskWasteDragOffset.copy(deskWaste.root.position).sub(this.deskWasteDragIntersection);
    this.deskWasteDragOffset.y = 0;
    this.deskWasteDragLastClientY = event.clientY;
    this.foreignFeedArmed = false;
    deskWaste.status = "held";
    deskWaste.setHeld(true);
    deskWaste.root.position.y = 1.15;
    this.canvas.classList.add("is-holding");
    this.selectionLabel.textContent = deskWaste.definition.label;
    this.selectionCount.textContent = "1";
    this.selectionReadout.style.left = `${clamp(this.pointerClient.x + 18, 12, window.innerWidth - 170)}px`;
    this.selectionReadout.style.top = `${clamp(this.pointerClient.y + 18, 12, window.innerHeight - 62)}px`;
    this.selectionReadout.classList.add("is-visible");
  }

  updateDeskWasteDrag(event) {
    event.preventDefault();
    event.stopPropagation();
    const pointerDeltaY = event.clientY - this.deskWasteDragLastClientY;
    this.deskWasteDragLastClientY = event.clientY;
    this.updatePointer(event);
    const deskWaste = this.deskWasteDragging;
    deskWaste.root.rotation.y += (event.movementX ?? 0) * 0.003;
    const slot = this.getSlotScreenPosition();
    const insertionPath = Math.abs(this.pointerClient.x - slot.x) <= clamp(window.innerWidth * 0.09, 82, 132)
      && this.pointerClient.y >= slot.y - 180
      && this.pointerClient.y <= slot.y + 92;
    const slotPoint = insertionPath
      ? this.raycaster.ray.intersectPlane(this.slotPlane, this.slotIntersection)
      : null;
    const overlapsSlot = Boolean(slotPoint) && Math.abs(slotPoint.x) <= SLOT_HALF_WIDTH + 0.28;

    if (slotPoint) {
      deskWaste.root.position.set(
        slotPoint.x,
        clamp(slotPoint.y, SLOT_POSITION.y - 0.38, SLOT_POSITION.y + 2.5),
        SLOT_POSITION.z + 0.025,
      );
      if (overlapsSlot && this.pointerClient.y < slot.y - 24) this.foreignFeedArmed = true;
      this.updateFeedGuide(true);
      if (this.machineState !== "ready") {
        this.setFeedGuideState(
          this.machineState === "processing" ? "HOLD OBJECT — SLOT BUSY" : "MACHINE NOT READY",
          "warning",
        );
      } else if (!overlapsSlot) {
        this.setFeedGuideState("MISS SLOT", "warning");
      } else if (!this.foreignFeedArmed) {
        this.setFeedGuideState("LIFT ABOVE SLOT", "warning");
      } else if (this.pointerClient.y < slot.y - 4) {
        this.setFeedGuideState("PUSH OBJECT DOWN", "ready");
      } else {
        this.setFeedGuideState("OBJECT CAUGHT", "ready");
      }

      const crossedSensor = this.foreignFeedArmed
        && overlapsSlot
        && this.machineState === "ready"
        && this.pointerClient.y >= slot.y - 4
        && pointerDeltaY > 0.5;
      if (crossedSensor) {
        this.finishDeskWastePointerCapture();
        this.beginForeignObjectFeed(deskWaste);
        return;
      }
    } else {
      if (!this.raycaster.ray.intersectPlane(this.deskWasteDragPlane, this.deskWasteDragIntersection)) return;
      deskWaste.root.position.set(
        clamp(this.deskWasteDragIntersection.x + this.deskWasteDragOffset.x, -8.2, 8.2),
        1.15,
        clamp(this.deskWasteDragIntersection.z + this.deskWasteDragOffset.z, -5.9, 5.7),
      );
      this.foreignFeedArmed = false;
      this.updateFeedGuide(false);
    }

    const overWastebasket = this.isPointerOverWastebasket();
    this.wastebasket.setHighlight(overWastebasket);
    this.selectionReadout.style.left = `${clamp(this.pointerClient.x + 18, 12, window.innerWidth - 170)}px`;
    this.selectionReadout.style.top = `${clamp(this.pointerClient.y + 18, 12, window.innerHeight - 62)}px`;
  }

  finishDeskWasteDrag(event) {
    event.preventDefault();
    event.stopPropagation();
    this.updatePointer(event);
    const deskWaste = this.deskWasteDragging;
    const overWastebasket = this.isPointerOverWastebasket();
    const nearSlot = this.isPointerNearShredderSlot();
    const feedArmed = this.foreignFeedArmed;
    const hasDropPoint = this.raycaster.ray.intersectPlane(this.dropPlane, this.dropIntersection);
    this.finishDeskWastePointerCapture();
    if (overWastebasket) {
      deskWaste.startDiscard(this.wastebasket.getDeskWasteTarget(deskWaste.definition.index), performance.now());
      this.showToast(`${deskWaste.definition.label}をゴミ箱へ捨てています。`, 1500);
      return;
    }
    if (nearSlot && feedArmed && this.machineState === "ready") {
      this.beginForeignObjectFeed(deskWaste);
      return;
    }
    const landingPosition = hasDropPoint
      ? { x: clamp(this.dropIntersection.x, -8.1, 8.1), z: clamp(this.dropIntersection.z, -1.1, 5.65) }
      : null;
    deskWaste.returnToDesk(landingPosition);
    this.sound.drop();
    if (nearSlot) {
      if (this.machineState === "processing") {
        this.showManager(
          "まだ前のものを処理中だ！",
          `${deskWaste.definition.label}は持ったまま待ち、モーターが止まってから投入口へ差し込みなさい。`,
          4200,
        );
      } else if (this.machineState !== "ready") {
        this.showManager(
          "今はシュレッダーへ投入できんぞ！",
          "先に詰まり・満杯・オーバーヒートを解消してから、投入口の上から差し込みなさい。",
          4400,
        );
      } else {
        this.showManager(
          `入れるなら${deskWaste.definition.label}を投入口の上まで持ち上げろ！`,
          "上から下へ差し込めばモーターは回る。ただし異物だから、途中で必ず詰まるぞ。",
          4800,
        );
      }
    }
  }

  finishDeskWastePointerCapture() {
    const pointerId = this.deskWastePointerId;
    if (pointerId !== null && this.canvas.hasPointerCapture(pointerId)) this.canvas.releasePointerCapture(pointerId);
    this.deskWasteDragging?.setHeld(false);
    this.deskWasteDragging = null;
    this.deskWastePointerId = null;
    this.foreignFeedArmed = false;
    this.canvas.classList.remove("is-holding");
    this.controls.enabled = true;
    this.wastebasket.setHighlight(false);
    this.selectionReadout.classList.remove("is-visible");
    this.updateFeedGuide(false);
  }

  isPointerNearShredderSlot() {
    const slot = this.getSlotScreenPosition();
    const toleranceX = clamp(window.innerWidth * 0.075, 72, 118);
    const toleranceY = clamp(window.innerHeight * 0.12, 68, 104);
    return Math.abs(this.pointerClient.x - slot.x) <= toleranceX
      && Math.abs(this.pointerClient.y - slot.y) <= toleranceY;
  }

  beginForeignObjectFeed(deskWaste) {
    deskWaste.status = "feeding";
    deskWaste.setHeld(false);
    const startPosition = deskWaste.root.position.clone();
    const targetPosition = startPosition.clone();
    const biteDepth = {
      pen: 0.14,
      ruler: 0.08,
      stamp: 0.52,
      stapler: 0.3,
      "hole-punch": 0.36,
    }[deskWaste.definition.kind] ?? 0.28;
    targetPosition.y = Math.min(startPosition.y, SLOT_POSITION.y + 0.16) - biteDepth;
    targetPosition.z = SLOT_POSITION.z + 0.025;
    this.activeForeignFeed = {
      deskWaste,
      load: deskWaste.definition.jamLoad ?? 4,
      startAt: performance.now(),
      duration: FOREIGN_FEED_MS,
      startPosition,
      targetPosition,
      startRotation: deskWaste.root.rotation.clone(),
    };
    this.setMachineState("processing");
    this.sound.startMotor(false);
    this.showToast(`${deskWaste.definition.label}をシュレッダーが噛み込み始めました。`, 1600);
  }

  triggerForeignObjectJam(deskWaste) {
    const paperLoad = this.getActivePaperLoad();
    const jammedDocuments = [...new Set(this.activeFeeds.flatMap((feed) => feed.documents))];
    jammedDocuments.forEach((documentVisual, index) => {
      documentVisual.status = "jammed";
      documentVisual.root.scale.set(1, 0.72 + (index % 3) * 0.04, 1);
      documentVisual.root.position.y -= documentVisual.definition.size[1] * 0.18;
    });
    this.activeJam = jammedDocuments.length > 0 ? jammedDocuments : null;
    this.activeFeeds = [];
    deskWaste.status = "jammed";
    deskWaste.root.position.z = SLOT_POSITION.z + 0.025;
    deskWaste.root.scale.setScalar(deskWaste.baseScale);
    this.activeForeignFeed = null;
    this.activeForeignJam = deskWaste;
    this.heat = clamp(this.heat + 14 + Math.min(8, paperLoad * 1.8), 0, HEAT_MAX);
    this.shredder.setHeat(this.heat);
    this.stats.jams += 1;
    this.setMachineState("jammed");
    this.machineStatus.textContent = "FOREIGN OBJECT JAM";
    this.sound.jam();
    if (this.levelKey === SPECIAL_LEVEL_KEY) {
      this.failSpecial(`${deskWaste.definition.label}をシュレッダーへ投入しました。`);
      return;
    }
    this.showManager(
      `コラッ！！${deskWaste.definition.label}を突っ込むな！刃が壊れるだろう！`,
      "本体の赤い逆回転ボタンを長押しして取り出し、右側の『ゴミ箱』へ直接捨てなさい。",
      6200,
    );
    this.updateHud();
  }

  beginDrag(event, primaryDocument, primaryGrabLocal) {
    if (this.selected.size === 0) return;
    const unavailable = [...this.selected].filter((documentVisual) => !["table", "falling"].includes(documentVisual.status));
    unavailable.forEach((documentVisual) => this.removeSelection(documentVisual));
    if (this.selected.size === 0) return;
    this.dragging = true;
    this.dragPointerId = event.pointerId;
    this.canvas.classList.add("is-holding");
    this.canvas.setPointerCapture(event.pointerId);
    this.controls.enabled = false;
    this.raycaster.ray.intersectPlane(this.dragPlane, this.dragAnchor);
    this.dragLastPoint.copy(this.dragAnchor);
    this.dragMotion = 0;
    this.dragLastClientY = event.clientY;
    this.feedArmed = false;
    this.insertionMode = false;
    this.setFeedGuideState("MOVE ABOVE SLOT");
    this.dragOffsets.clear();
    this.dragGrabOffsets.clear();
    this.dragEntryRotations.clear();
    const normalizedGrab = {
      x: clamp(primaryGrabLocal.x / primaryDocument.definition.size[0], -0.5, 0.5),
      y: clamp(primaryGrabLocal.y / primaryDocument.definition.size[1], -0.5, 0.5),
    };
    [...this.selected].forEach((documentVisual, index) => {
      documentVisual.cancelFall();
      this.dragOffsets.set(documentVisual, documentVisual.root.position.clone().sub(this.dragAnchor));
      this.dragGrabOffsets.set(documentVisual, new THREE.Vector2(
        normalizedGrab.x * documentVisual.definition.size[0],
        normalizedGrab.y * documentVisual.definition.size[1],
      ));
      this.dragEntryRotations.set(documentVisual, documentVisual.root.rotation.z);
      documentVisual.setHeld(true);
      documentVisual.root.position.y = 1.45 + index * 0.04;
      documentVisual.root.renderOrder = 10 + index;
    });
    this.updateSelectionReadout();
    this.updateFeedGuide(true);
  }

  onPointerMove(event) {
    if (this.deskWasteDragging && event.pointerId === this.deskWastePointerId) {
      this.updateDeskWasteDrag(event);
      return;
    }
    if (this.binDragging && event.pointerId === this.binPointerId) {
      this.onBinPointerMove(event);
      return;
    }
    if (!this.dragging || event.pointerId !== this.dragPointerId || this.status !== "playing") return;
    event.preventDefault();
    event.stopPropagation();
    const pointerDeltaY = event.clientY - this.dragLastClientY;
    this.dragLastClientY = event.clientY;
    this.updatePointer(event);
    if (!this.raycaster.ray.intersectPlane(this.dragPlane, this.dragIntersection)) return;
    this.dragIntersection.x = clamp(this.dragIntersection.x, -8.7, 8.7);
    this.dragIntersection.z = clamp(this.dragIntersection.z, -6.6, 6.2);
    this.dragMotion = THREE.MathUtils.lerp(this.dragMotion, this.dragIntersection.distanceTo(this.dragLastPoint) * 7, 0.34);
    this.dragLastPoint.copy(this.dragIntersection);
    const metrics = this.getInsertionMetrics();
    const slotPoint = this.raycaster.ray.intersectPlane(this.slotPlane, this.slotIntersection);
    const nearInsertionPath = Boolean(slotPoint)
      && Math.abs(slotPoint.x) < SLOT_HALF_WIDTH + 2.2
      && metrics.offsetY > -300
      && metrics.offsetY < 120;

    if (nearInsertionPath) {
      this.insertionMode = true;
      const documents = [...this.selected];
      documents.forEach((documentVisual, index) => {
        const grabOffset = this.dragGrabOffsets.get(documentVisual) ?? new THREE.Vector2();
        const angle = this.dragEntryRotations.get(documentVisual) ?? documentVisual.root.rotation.z;
        const cosine = Math.cos(angle);
        const sine = Math.sin(angle);
        const rotatedGrabX = grabOffset.x * cosine - grabOffset.y * sine;
        const rotatedGrabY = grabOffset.x * sine + grabOffset.y * cosine;
        documentVisual.root.position.set(
          slotPoint.x - rotatedGrabX,
          slotPoint.y - rotatedGrabY,
          SLOT_POSITION.z + index * 0.008,
        );
        documentVisual.root.rotation.set(0, 0, angle);
      });

      const entryGeometry = documents.map((documentVisual) => this.getDocumentEntryGeometry(documentVisual));
      const canReachSlot = entryGeometry.every((geometry) => geometry.overlapsSlotWidth);
      const fullyAboveSlot = entryGeometry.every((geometry) => geometry.minY > SLOT_POSITION.y + 0.18);
      const caughtBySlot = entryGeometry.every((geometry) => geometry.overlapsSlotAtSensor);
      if (fullyAboveSlot) this.feedArmed = true;

      if (this.machineState === "overheated") {
        this.setFeedGuideState("OVERHEAT — COOLING DELAY", "warning");
      } else if (this.machineState === "full") {
        this.setFeedGuideState("BIN FULL — WILL WAIT", "warning");
      } else if (!canReachSlot) {
        this.setFeedGuideState("MISS SLOT", "warning");
      } else if (!this.feedArmed) {
        this.setFeedGuideState("MOVE ABOVE SLOT", "warning");
      } else if (!caughtBySlot) {
        this.setFeedGuideState("PUSH DOWN", "ready");
      } else {
        this.setFeedGuideState("EDGE CAUGHT", "ready");
      }

      const crossedSensor = this.feedArmed
        && ["ready", "processing", "full", "overheated"].includes(this.machineState)
        && caughtBySlot
        && pointerDeltaY > 0.5;
      if (crossedSensor) {
        this.finishDocumentPointerCapture();
        this.feedSelected({ insertionDuration: 120, preserveEntry: true });
        return;
      }
    } else {
      if (this.insertionMode) this.feedArmed = false;
      this.insertionMode = false;
      [...this.selected].forEach((documentVisual, index) => {
        const offset = this.dragOffsets.get(documentVisual);
        documentVisual.root.position.x = this.dragIntersection.x + offset.x;
        documentVisual.root.position.y = 1.45 + index * 0.04;
        documentVisual.root.position.z = this.dragIntersection.z + offset.z;
        documentVisual.root.rotation.x = -Math.PI / 2;
        documentVisual.root.rotation.y = 0;
        documentVisual.root.rotation.z = this.dragEntryRotations.get(documentVisual) ?? documentVisual.root.rotation.z;
      });
      this.setFeedGuideState("MOVE ABOVE SLOT");
    }
    this.updateSelectionReadout();
    this.updateFeedGuide(true);
  }

  onPointerUp(event) {
    if (event.pointerId === this.reversePointerId) {
      event.preventDefault();
      this.reversePointerId = null;
      if (this.canvas.hasPointerCapture(event.pointerId)) this.canvas.releasePointerCapture(event.pointerId);
      this.stopReverse(true);
      return;
    }
    if (this.deskWasteDragging && event.pointerId === this.deskWastePointerId) {
      this.finishDeskWasteDrag(event);
      return;
    }
    if (this.binDragging && event.pointerId === this.binPointerId) {
      this.finishBinDrag(event);
      return;
    }
    if (!this.dragging || event.pointerId !== this.dragPointerId) return;
    event.preventDefault();
    event.stopPropagation();
    this.updatePointer(event);
    const metrics = this.getInsertionMetrics();
    const attemptedInsertion = this.insertionMode || (Math.abs(metrics.offsetX) < metrics.tolerance * 2.4 && metrics.offsetY < 80);
    const hasDropPoint = this.raycaster.ray.intersectPlane(this.dropPlane, this.dropIntersection);
    this.finishDocumentPointerCapture();
    const selectedDocuments = [...this.selected];
    selectedDocuments.forEach((documentVisual, index) => {
      documentVisual.setHeld(false);
      const landingPosition = documentVisual.root.position.clone();
      landingPosition.y = 0.065 + index * 0.006;
      if (attemptedInsertion) {
        const column = index - (selectedDocuments.length - 1) / 2;
        landingPosition.x = clamp((hasDropPoint ? this.dropIntersection.x : documentVisual.root.position.x) + column * 0.42, -7.6, 7.6);
        landingPosition.z = clamp((hasDropPoint ? this.dropIntersection.z : -1.2) + (index % 2) * 0.3, -1.25, 5.4);
      }
      documentVisual.status = "falling";
      documentVisual.startFall(landingPosition, this.dragMotion);
    });
    if (attemptedInsertion) {
      if (!this.feedArmed) {
        this.showManager(
          "コラッ！横から押しつけても入らんぞ！",
          "紙をいったん投入口より上へ持ち上げて、黒いスリットへ下向きに差し込みなさい。",
        );
      } else {
        this.showManager(
          "惜しいが、紙が入口に触れていない！",
          "紙の角か辺を黒いスリットへ重ねて、さらに下へ押し込みなさい。",
        );
      }
    }
    this.feedArmed = false;
    this.insertionMode = false;
    this.sound.drop();
  }

  getSlotScreenPosition() {
    const projected = SLOT_POSITION.clone().project(this.camera);
    return {
      x: (projected.x * 0.5 + 0.5) * window.innerWidth,
      y: (-projected.y * 0.5 + 0.5) * window.innerHeight,
    };
  }

  getInsertionMetrics() {
    const slot = this.getSlotScreenPosition();
    const bundlePenalty = Math.max(0, this.selected.size - 1) * 2.8;
    const tolerance = clamp(window.innerWidth * 0.035 - bundlePenalty, 24, 46);
    return {
      offsetX: this.pointerClient.x - slot.x,
      offsetY: this.pointerClient.y - slot.y,
      tolerance,
    };
  }

  getDocumentEntryGeometry(documentVisual) {
    const [width, height] = documentVisual.definition.size;
    const angle = documentVisual.root.rotation.z;
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    const corners = [
      [-width * 0.5, -height * 0.5],
      [width * 0.5, -height * 0.5],
      [width * 0.5, height * 0.5],
      [-width * 0.5, height * 0.5],
    ].map(([localX, localY]) => ({
      x: documentVisual.root.position.x + localX * cosine - localY * sine,
      y: documentVisual.root.position.y + localX * sine + localY * cosine,
    }));
    const xValues = corners.map((corner) => corner.x);
    const yValues = corners.map((corner) => corner.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    const contactXs = [];

    corners.forEach((start, index) => {
      const end = corners[(index + 1) % corners.length];
      const deltaY = end.y - start.y;
      if (Math.abs(deltaY) < 0.0001) {
        if (Math.abs(start.y - SLOT_POSITION.y) < 0.025) contactXs.push(start.x, end.x);
        return;
      }
      const progress = (SLOT_POSITION.y - start.y) / deltaY;
      if (progress >= -0.001 && progress <= 1.001) {
        contactXs.push(start.x + (end.x - start.x) * progress);
      }
    });

    const contactMinX = contactXs.length ? Math.min(...contactXs) : Infinity;
    const contactMaxX = contactXs.length ? Math.max(...contactXs) : -Infinity;
    const touchingSensor = minY <= SLOT_POSITION.y + 0.025 && maxY >= SLOT_POSITION.y - 0.025;
    return {
      minY,
      maxY,
      overlapsSlotWidth: maxX >= -SLOT_HALF_WIDTH && minX <= SLOT_HALF_WIDTH,
      overlapsSlotAtSensor: touchingSensor
        && contactMaxX >= -SLOT_HALF_WIDTH
        && contactMinX <= SLOT_HALF_WIDTH,
    };
  }

  rotateHeldDocuments(delta) {
    if (!this.dragging) return;
    this.selected.forEach((documentVisual) => {
      const rawAngle = (this.dragEntryRotations.get(documentVisual) ?? documentVisual.root.rotation.z) + delta;
      const nextAngle = Math.atan2(Math.sin(rawAngle), Math.cos(rawAngle));
      this.dragEntryRotations.set(documentVisual, nextAngle);
      documentVisual.root.rotation.z = nextAngle;
    });
    this.setFeedGuideState("ANGLE HELD", "ready");
    this.updateHud();
  }

  onWheel(event) {
    if (!this.dragging || this.status !== "playing") return;
    event.preventDefault();
    event.stopPropagation();
    this.rotateHeldDocuments(clamp(event.deltaY * 0.0012, -0.18, 0.18));
  }

  finishDocumentPointerCapture() {
    const pointerId = this.dragPointerId;
    if (pointerId !== null && this.canvas.hasPointerCapture(pointerId)) this.canvas.releasePointerCapture(pointerId);
    this.dragging = false;
    this.dragPointerId = null;
    this.canvas.classList.remove("is-holding");
    this.controls.enabled = true;
    this.selectionReadout.classList.remove("is-visible");
    this.feedGuide.classList.remove("is-visible", "is-warning", "is-ready");
  }

  updateSelectionReadout() {
    if (!this.dragging || this.selected.size === 0) return;
    const documents = [...this.selected];
    this.selectionLabel.textContent = documents.length === 1 ? documents[0].getDisplayLabel() : `${documents[0].getDisplayLabel()} ほか`;
    this.selectionCount.textContent = documents.length;
    this.selectionReadout.style.left = `${clamp(this.pointerClient.x + 18, 12, window.innerWidth - 170)}px`;
    this.selectionReadout.style.top = `${clamp(this.pointerClient.y + 18, 12, window.innerHeight - 62)}px`;
    this.selectionReadout.classList.add("is-visible");
  }

  updateFeedGuide(visible) {
    if (!visible) {
      this.feedGuide.classList.remove("is-visible");
      return;
    }
    const slot = this.getSlotScreenPosition();
    this.feedGuide.style.left = `${slot.x}px`;
    this.feedGuide.style.top = `${slot.y}px`;
    this.feedGuide.classList.add("is-visible");
  }

  setFeedGuideState(label, state = "") {
    this.feedGuideLabel.textContent = label;
    this.feedGuide.classList.toggle("is-warning", state === "warning");
    this.feedGuide.classList.toggle("is-ready", state === "ready");
  }

  addSelection(documentVisual) {
    if (documentVisual.status !== "table") return;
    this.selected.add(documentVisual);
    documentVisual.setSelected(true);
    this.stats.maxBundle = Math.max(this.stats.maxBundle, this.selected.size);
    this.sound.select();
    this.updateHud();
  }

  removeSelection(documentVisual) {
    this.selected.delete(documentVisual);
    documentVisual.setSelected(false);
    documentVisual.setHeld(false);
    this.updateHud();
  }

  clearSelection() {
    this.selected.forEach((documentVisual) => {
      documentVisual.setSelected(false);
      documentVisual.setHeld(false);
    });
    this.selected.clear();
    this.updateHud();
  }

  setKeyboardFocus(documentVisual) {
    if (this.keyboardFocus === documentVisual) return;
    this.keyboardFocus?.setFocused(false);
    this.keyboardFocus = documentVisual;
    this.keyboardFocus?.setFocused(true);
    this.updatePreparationAction();
  }

  cycleKeyboardFocus(direction) {
    const available = this.documents.filter((documentVisual) => documentVisual.status === "table");
    if (available.length === 0) return;
    const currentIndex = available.indexOf(this.keyboardFocus);
    this.keyboardIndex = currentIndex < 0
      ? direction > 0 ? 0 : available.length - 1
      : (currentIndex + direction + available.length) % available.length;
    const next = available[this.keyboardIndex];
    this.setKeyboardFocus(next);
    this.showToast(`${next.getDisplayLabel()} — SPACEで追加`, 1200);
  }

  getPreparationTarget() {
    return [...this.selected].find((documentVisual) => documentVisual.needsPreparation())
      ?? (this.keyboardFocus?.needsPreparation() ? this.keyboardFocus : null);
  }

  updatePreparationAction() {
    const target = this.getPreparationTarget();
    this.prepActionButton.hidden = !target || target.status !== "table" || this.status !== "playing";
    if (!target) return;
    this.prepActionButton.querySelector("span").textContent = target.getPreparationLabel();
    const progress = `${target.prepProgress} / ${target.definition.prepSteps}`;
    this.prepActionButton.querySelector("small").textContent = `${progress} — X キー`;
  }

  prepareSelected() {
    if (this.status !== "playing" || !["ready", "processing", "full", "overheated"].includes(this.machineState)) return;
    const target = this.getPreparationTarget();
    if (!target || target.status !== "table") {
      this.showManager("何を処理するつもりだ！", "本・辞書・ホッチキス書類を先に選びなさい。", 3200);
      return;
    }
    if (!this.selected.has(target)) this.addSelection(target);
    const result = target.prepare();
    if (!result.changed) return;
    if (result.releasedPage) {
      const releasedDocument = new DocumentVisual(result.releasedPage.definition, this.scene);
      releasedDocument.status = "falling";
      releasedDocument.root.position.copy(result.releasedPage.startPosition);
      releasedDocument.root.rotation.set(-Math.PI / 2, 0, result.releasedPage.definition.rotation);
      releasedDocument.startFall(result.releasedPage.landingPosition, 1.8);
      this.documents.push(releasedDocument);
    }
    this.sound.enable();
    this.sound.prepare(target.definition.prepAction, result.completed);
    if (result.completed) {
      const message = target.definition.prepAction === "unstaple"
        ? "針を外しました。これで安全に投入できます。"
        : `${target.definition.label}を分解しました。落とした書類もすべて処分してください。`;
      this.showToast(message, 2200);
    } else {
      this.showToast(`${target.definition.label}から、投入できる書類を1束外しました。あと${result.remaining}回。`, 1700);
    }
    this.updateSelectionReadout();
    this.updateHud();
  }

  getBundleLoad(documents) {
    const definitions = documents.map((documentVisual) => ({ feedUnits: documentVisual.getFeedUnits() }));
    const angles = documents.map((documentVisual) => (
      this.dragEntryRotations.get(documentVisual) ?? documentVisual.root.rotation.z
    ));
    return {
      base: calculateBundleLoad(definitions),
      effective: calculateBundleLoad(definitions, angles),
    };
  }

  feedSelected({ insertionDuration = FEED_APPROACH_MS, preserveEntry = false } = {}) {
    if (this.status !== "playing" || !["ready", "processing", "full", "overheated"].includes(this.machineState)) return;
    const selectedDocuments = [...this.selected];
    const documents = selectedDocuments.filter((documentVisual) => ["table", "falling"].includes(documentVisual.status));
    if (documents.length === 0) {
      this.showManager("手ぶらで何を投入するんだ！", "机の書類を選んでから、投入口へ持ってきなさい。", 3000);
      return;
    }
    if (documents.length !== selectedDocuments.length) {
      this.showManager("束の一部がまだ手元にないぞ！", "選んだ書類が全部机へ戻ってから、束ごと投入しなさい。", 3200);
      return;
    }
    documents.forEach((documentVisual) => documentVisual.cancelFall());
    const level = LEVELS[this.levelKey];
    const load = this.getBundleLoad(documents);
    const boundDocument = documents.find((documentVisual) => (
      documentVisual.needsPreparation() && documentVisual.definition.prepAction === "tear"
    ));
    const stapledDocument = documents.find((documentVisual) => (
      documentVisual.needsPreparation() && documentVisual.definition.prepAction === "unstaple"
    ));
    const willJam = Boolean(boundDocument) || Boolean(stapledDocument);
    const jamReason = boundDocument
      ? "BOUND OBJECT"
      : stapledDocument
        ? "STAPLE"
        : "";
    const spread = Math.min(0.12, 0.56 / Math.max(1, documents.length - 1));
    const targets = documents.map((documentVisual, index) => preserveEntry
      ? documentVisual.root.position.clone()
      : new THREE.Vector3(
        (index - (documents.length - 1) / 2) * spread,
        SLOT_POSITION.y + documentVisual.definition.size[1] * 0.48,
        SLOT_POSITION.z + index * 0.008,
      ));
    const targetRotations = documents.map((documentVisual) => preserveEntry
      ? documentVisual.root.rotation.clone()
      : new THREE.Euler(0, 0, documentVisual.root.rotation.z));
    documents.forEach((documentVisual) => {
      documentVisual.status = "feeding";
      documentVisual.setSelected(false);
      documentVisual.setFocused(false);
      documentVisual.setHeld(false);
      documentVisual.resetGeometry();
    });
    this.selected.clear();
    this.keyboardFocus = null;
    const blockedByFull = this.machineState === "full" || this.binFill >= level.binCapacity;
    const blockedByOverheat = this.machineState === "overheated";
    const feed = {
      documents,
      load: load.effective,
      baseLoad: load.base,
      jamReason,
      willJam,
      phase: "approach",
      emittedRows: 0,
      startAt: performance.now(),
      approachDuration: insertionDuration,
      startPositions: documents.map((documentVisual) => documentVisual.root.position.clone()),
      startRotations: documents.map((documentVisual) => documentVisual.root.rotation.clone()),
      targets,
      targetRotations,
      blockedByFull,
      blockedByOverheat,
    };
    const wasProcessing = this.machineState === "processing";
    this.activeFeeds.push(feed);
    const activeDocumentCount = this.activeFeeds.reduce((total, activeFeed) => total + activeFeed.documents.length, 0);
    this.stats.maxBundle = Math.max(this.stats.maxBundle, activeDocumentCount);
    if (blockedByOverheat) {
      const now = performance.now();
      const delay = OVERHEAT_FEED_DELAY_BASE_MS + load.effective * OVERHEAT_FEED_DELAY_PER_LOAD_MS;
      this.overheatPenaltyUntil = Math.max(now, this.overheatPenaltyUntil) + delay;
      this.heat = clamp(this.heat + load.effective * OVERHEAT_FEED_HEAT_PER_LOAD, 0, HEAT_MAX);
      this.shredder.setHeat(this.heat);
      this.showManager(
        "コラッ！！オーバーヒート中に紙を押し込むな！",
        `その束は入口で待機だ。無理に入れたせいで冷却が${(delay / 1000).toFixed(1)}秒余計にかかるぞ！`,
        5200,
      );
    } else if (blockedByFull) {
      this.setMachineState("full");
      this.showManager(
        "コラッ！！ゴミが満杯なのに、まだ紙を入れたな！",
        "このままでは処理できん。前面ケースを右の『ゴミ箱』へ運び、中身を捨てて戻しなさい。",
        5600,
      );
    } else {
      this.setMachineState("processing");
      if (!wasProcessing) this.sound.startMotor(false);
    }
    this.updateHud();
  }

  getActivePaperLoad() {
    return this.activeFeeds.reduce((total, feed) => total + feed.load, 0);
  }

  startFeedShredding(feed, now) {
    feed.phase = "shredding";
    feed.processStart = now;
    feed.duration = Math.max(...feed.documents.map((documentVisual) => documentVisual.definition.duration))
      * LEVELS[this.levelKey].processSpeed
      * (1 + Math.max(0, feed.documents.length - 1) * 0.19);
    feed.documents.forEach((documentVisual) => {
      documentVisual.status = "processing";
    });
  }

  updateFeedApproach(feed, now) {
    if (feed.phase === "approach") {
      const progress = clamp((now - feed.startAt) / feed.approachDuration, 0, 1);
      const eased = easeInOutCubic(progress);
      feed.documents.forEach((documentVisual, index) => {
        documentVisual.root.position.lerpVectors(feed.startPositions[index], feed.targets[index], eased);
        documentVisual.root.rotation.x = THREE.MathUtils.lerp(feed.startRotations[index].x, feed.targetRotations[index].x, eased);
        documentVisual.root.rotation.y = THREE.MathUtils.lerp(feed.startRotations[index].y, feed.targetRotations[index].y, eased);
        documentVisual.root.rotation.z = THREE.MathUtils.lerp(feed.startRotations[index].z, feed.targetRotations[index].z, eased);
      });
      if (progress < 1) return false;
      if (feed.blockedByFull || this.binFill >= LEVELS[this.levelKey].binCapacity) {
        feed.phase = "blocked-full";
        feed.resumePhase = "shredding";
        feed.blockedAt = now;
        return false;
      }
      if (feed.blockedByOverheat && this.machineState === "overheated") {
        feed.phase = "blocked-overheat";
        feed.resumePhase = "shredding";
        feed.blockedAt = now;
        return false;
      }
      feed.combinedLoad = this.getActivePaperLoad();
      if (feed.willJam || feed.combinedLoad > LEVELS[this.levelKey].feedLimit + 0.001) {
        if (!feed.jamReason) feed.jamReason = "THICKNESS / ANGLE";
        this.triggerJam(feed);
        return true;
      }
      this.startFeedShredding(feed, now);
    }
    return false;
  }

  updateFeeds(now) {
    if (this.activeFeeds.length === 0 || this.machineState === "jammed") return;
    if (this.machineState === "overheated") {
      for (const feed of this.activeFeeds) {
        if (feed.phase === "approach" && feed.blockedByOverheat) this.updateFeedApproach(feed, now);
      }
      return;
    }
    if (["full", "binRemoved", "emptying"].includes(this.machineState)) {
      for (const feed of this.activeFeeds) {
        if (feed.phase === "approach" && feed.blockedByFull) this.updateFeedApproach(feed, now);
      }
      return;
    }

    for (const feed of [...this.activeFeeds]) {
      if (!this.activeFeeds.includes(feed)) continue;
      if (feed.phase === "approach" && this.updateFeedApproach(feed, now)) return;
      if (feed.phase !== "shredding") continue;

      const progress = clamp((now - feed.processStart) / feed.duration, 0, 1);
      const eased = easeOutCubic(progress);
      feed.documents.forEach((documentVisual, index) => {
        const height = documentVisual.definition.size[1];
        documentVisual.root.position.y = feed.targets[index].y - eased * height * 0.98;
        documentVisual.root.position.z = feed.targets[index].z + Math.sin(progress * Math.PI * 12 + index) * 0.018;
      });
      const cutProgress = clamp((progress - 0.12) / 0.84, 0, 1);
      const emittedRowTarget = Math.min(8, Math.floor(cutProgress * 8 + 0.001));
      while (feed.emittedRows < emittedRowTarget) {
        feed.documents.forEach((documentVisual) => {
          const binUnits = documentVisual.definition.binUnits ?? 1;
          this.shredder.spawnShreds(documentVisual.definition, Math.min(12, 2 + binUnits * 2));
        });
        feed.emittedRows += 1;
      }
      if (progress >= 1) this.finishFeed(feed, now);
      if (["full", "jammed", "overheated", "complete"].includes(this.machineState)) return;
    }
  }

  updateForeignFeed(now) {
    const feed = this.activeForeignFeed;
    if (!feed || ["overheated", "full", "binRemoved", "emptying"].includes(this.machineState)) return;
    const progress = clamp((now - feed.startAt) / feed.duration, 0, 1);
    const eased = easeInOutCubic(progress);
    feed.deskWaste.root.position.lerpVectors(feed.startPosition, feed.targetPosition, eased);
    feed.deskWaste.root.position.x += Math.sin(progress * Math.PI * 12) * 0.018;
    feed.deskWaste.root.rotation.x = feed.startRotation.x + Math.sin(progress * Math.PI * 8) * 0.035;
    feed.deskWaste.root.rotation.y = feed.startRotation.y;
    feed.deskWaste.root.rotation.z = feed.startRotation.z + Math.sin(progress * Math.PI * 10) * 0.028;
    if (progress >= 1) this.triggerForeignObjectJam(feed.deskWaste);
  }

  triggerJam(feed) {
    const jammedDocuments = [...new Set(this.activeFeeds.flatMap((activeFeed) => activeFeed.documents))];
    const combinedLoad = feed.combinedLoad ?? this.getActivePaperLoad();
    jammedDocuments.forEach((documentVisual, index) => {
      documentVisual.status = "jammed";
      documentVisual.root.scale.set(1, 0.72 + (index % 3) * 0.04, 1);
      documentVisual.root.position.y -= documentVisual.definition.size[1] * 0.18;
    });
    this.activeJam = jammedDocuments;
    this.activeFeeds = [];
    if (this.activeForeignFeed) {
      const foreignObject = this.activeForeignFeed.deskWaste;
      foreignObject.status = "jammed";
      foreignObject.root.position.z = SLOT_POSITION.z + 0.025;
      foreignObject.root.scale.setScalar(foreignObject.baseScale);
      this.activeForeignJam = foreignObject;
      this.activeForeignFeed = null;
    }
    this.heat = clamp(this.heat + Math.min(12, combinedLoad * 2.2), 0, HEAT_MAX);
    this.shredder.setHeat(this.heat);
    this.stats.jams += 1;
    this.setMachineState("jammed");
    this.sound.jam();
    if (this.levelKey === SPECIAL_LEVEL_KEY) {
      const reason = feed.jamReason === "BOUND OBJECT"
        ? "製本されたものを未処理で投入しました。"
        : feed.jamReason === "STAPLE"
          ? "ホッチキスの針を外さず投入しました。"
          : "定格を超える厚み、または無理な角度で投入しました。";
      this.failSpecial(reason);
      return;
    }
    const level = LEVELS[this.levelKey];
    if (feed.jamReason === "BOUND OBJECT") {
      this.showManager(
        "コラッ！！製本されたまま突っ込むな！シュレッダーが詰まったじゃないか！",
        "本体の赤いボタンを長押しして戻し、Xか青いボタンでページをむしってから入れなさい。",
        6200,
      );
    } else if (feed.jamReason === "STAPLE") {
      this.showManager(
        "コラッ！！ホッチキスの針まで入れたな！",
        "本体の赤いボタンを長押しして戻し、Xか青いボタンで針を外しなさい。",
        5600,
      );
    } else {
      this.showManager(
        "コラッ！！シュレッダーが詰まったじゃないか！ちゃんとまっすぐに回転して差し込みなさい！",
        `同時投入で${combinedLoad.toFixed(1)}枚相当、上限は${level.feedLimit.toFixed(1)}枚だ。本体の赤いボタンで戻し、束と角度を見直しなさい。`,
        6200,
      );
    }
    this.updateHud();
  }

  blockFeedsForFull(now = performance.now()) {
    this.activeFeeds.forEach((feed) => {
      feed.blockedByFull = true;
      if (feed.phase !== "shredding") return;
      feed.phase = "blocked-full";
      feed.resumePhase = "shredding";
      feed.blockedAt = now;
    });
    if (this.activeForeignFeed && !this.activeForeignFeed.blockedAt) this.activeForeignFeed.blockedAt = now;
  }

  resumeFeedsAfterBinEmpty(now = performance.now()) {
    if (this.activeFeeds.length > 0) {
      const combinedLoad = this.getActivePaperLoad();
      const preparationJam = this.activeFeeds.find((feed) => feed.willJam);
      if (preparationJam || combinedLoad > LEVELS[this.levelKey].feedLimit + 0.001) {
        const jamFeed = preparationJam ?? this.activeFeeds[0];
        jamFeed.combinedLoad = combinedLoad;
        if (!jamFeed.jamReason) jamFeed.jamReason = "THICKNESS / ANGLE";
        this.triggerJam(jamFeed);
        return false;
      }
      this.activeFeeds.forEach((feed) => {
        feed.blockedByFull = false;
        if (feed.phase !== "blocked-full") return;
        if (feed.processStart) {
          feed.processStart += Math.max(0, now - feed.blockedAt);
          feed.phase = feed.resumePhase;
        } else {
          this.startFeedShredding(feed, now);
        }
        feed.blockedAt = 0;
      });
    }
    if (this.activeForeignFeed?.blockedAt) {
      this.activeForeignFeed.startAt += Math.max(0, now - this.activeForeignFeed.blockedAt);
      this.activeForeignFeed.blockedAt = 0;
    }
    if (this.activeFeeds.length > 0 || this.activeForeignFeed) {
      this.setMachineState("processing");
      this.sound.startMotor(false);
    } else {
      this.setMachineState("ready");
    }
    return true;
  }

  finishFeed(feed, now = performance.now()) {
    feed.documents.forEach((documentVisual) => {
      documentVisual.status = "shredded";
      documentVisual.root.visible = false;
      documentVisual.root.scale.set(1, 1, 1);
    });
    this.processedCount += feed.documents.length;
    this.binFill += feed.documents.reduce((total, documentVisual) => total + (documentVisual.definition.binUnits ?? 1), 0);
    this.shredder.setFill(this.binFill, LEVELS[this.levelKey].binCapacity);
    this.activeFeeds = this.activeFeeds.filter((activeFeed) => activeFeed !== feed);
    this.updateHud();
    if (this.getRemainingItemCount() === 0) {
      this.completeGame();
      return;
    }
    if (this.binFill >= LEVELS[this.levelKey].binCapacity) {
      this.blockFeedsForFull(now);
      this.setMachineState("full");
      this.sound.stopMotor();
      this.showManager(
        "おい！ゴミが満杯じゃないか！",
        "前面ケースを掴み、画面の『ゴミ箱』表示まで運んで中身を捨てなさい。",
        5000,
      );
      return;
    }
    if (this.activeFeeds.length > 0 || this.activeForeignFeed) {
      this.setMachineState("processing");
    } else {
      this.sound.stopMotor();
      this.setMachineState("ready");
    }
  }

  updateThermal(now, delta) {
    const motorFeeds = this.activeFeeds.filter((feed) => ["approach", "shredding"].includes(feed.phase));
    const processing = this.machineState === "processing" && Boolean(motorFeeds.length || this.activeForeignFeed);
    if (processing) {
      const shredding = motorFeeds.some((feed) => feed.phase === "shredding") || Boolean(this.activeForeignFeed);
      const load = motorFeeds.reduce((total, feed) => total + feed.load, this.activeForeignFeed?.load ?? 0);
      const simultaneousFeeds = motorFeeds.length + (this.activeForeignFeed ? 1 : 0);
      const speedCorrection = shredding ? 1 / LEVELS[this.levelKey].processSpeed : 1;
      const baseHeat = shredding ? HEAT_SHREDDING_BASE : HEAT_APPROACH_BASE;
      const loadHeat = Math.pow(load, 1.45) * (shredding ? HEAT_SHREDDING_LOAD : HEAT_APPROACH_LOAD);
      const concurrencyHeat = 1 + Math.max(0, simultaneousFeeds - 1) * 0.28;
      this.heat += delta * (baseHeat * concurrencyHeat + loadHeat) * speedCorrection;
    } else if (this.reversing) {
      this.heat += delta * 6;
    } else if (this.machineState === "overheated" && now < this.overheatPenaltyUntil) {
      // 無理な追加投入の直後は冷却ファンも止まり、再開までの時間が確実に延びる。
    } else {
      const coolingRate = this.machineState === "overheated" ? HEAT_OVERHEAT_COOLING : HEAT_IDLE_COOLING;
      this.heat -= delta * coolingRate;
    }
    this.heat = clamp(this.heat, 0, HEAT_MAX);
    this.shredder.setHeat(this.heat);

    if (this.heat >= HEAT_MAX && this.machineState === "processing") {
      this.startOverheat(now);
      return;
    }
    if (this.machineState === "overheated" && now >= this.overheatPenaltyUntil && this.heat <= HEAT_RESUME) {
      this.finishOverheat(now);
    }
  }

  startOverheat(now = performance.now()) {
    if (this.machineState === "overheated") return;
    this.overheatStartedAt = now;
    this.overheatPenaltyUntil = Math.max(this.overheatPenaltyUntil, now);
    this.activeFeeds.forEach((feed) => {
      feed.overheatBlockedAt = now;
    });
    this.setMachineState("overheated");
    this.sound.overheat();
    if (this.levelKey === SPECIAL_LEVEL_KEY) {
      this.failSpecial("シュレッダーをオーバーヒートさせました。");
      return;
    }
    this.showManager(
      "機械を焼く気か！オーバーヒートだ！",
      "文房具を捨てたり紙を選ぶのは構わん。ただし紙を押し込むたびに冷却が余計に長引くぞ！",
      5600,
    );
  }

  failSpecial(reason) {
    if (this.status !== "playing" || this.levelKey !== SPECIAL_LEVEL_KEY) return;
    this.status = "failed";
    this.sound.stopMotor();
    this.controls.enabled = false;
    this.setHudEnabled(false);
    this.gameOverDescription.textContent = reason;
    this.showManager(
      "君は一体何年シュレッダー係をやっているのだ！間違えるなんてけしからん！",
      `SPECIAL失格 — ${reason}`,
      7200,
    );
    window.clearTimeout(this.gameOverTimer);
    this.gameOverTimer = window.setTimeout(() => {
      if (this.status !== "failed") return;
      this.openDialog(this.gameOverScreen);
      document.querySelector("#game-over-retry-button")?.focus({ preventScroll: true });
    }, 900);
  }

  finishOverheat(now = performance.now()) {
    if (this.machineState !== "overheated") return;
    const coolingDuration = Math.max(0, now - this.overheatStartedAt);
    if (this.activeFeeds.length > 0 || this.activeForeignFeed) {
      const combinedLoad = this.getActivePaperLoad();
      const preparationJam = this.activeFeeds.find((feed) => feed.willJam);
      if (preparationJam || combinedLoad > LEVELS[this.levelKey].feedLimit + 0.001) {
        const jamFeed = preparationJam ?? this.activeFeeds[0];
        jamFeed.combinedLoad = combinedLoad;
        if (!jamFeed.jamReason) jamFeed.jamReason = "THICKNESS / ANGLE";
        this.overheatStartedAt = 0;
        this.overheatPenaltyUntil = 0;
        this.triggerJam(jamFeed);
        return;
      }
      this.activeFeeds.forEach((feed) => {
        if (feed.phase === "blocked-overheat") {
          this.startFeedShredding(feed, now);
        } else {
          const blockedDuration = Math.max(0, now - (feed.overheatBlockedAt ?? this.overheatStartedAt));
          feed.startAt += blockedDuration;
          if (feed.processStart) feed.processStart += blockedDuration;
        }
        feed.blockedByOverheat = false;
        feed.overheatBlockedAt = 0;
        feed.blockedAt = 0;
      });
      if (this.activeForeignFeed) this.activeForeignFeed.startAt += coolingDuration;
      this.setMachineState("processing");
      this.sound.startMotor(false);
      this.showToast("冷却完了 — 入っていたものを位置と角度のまま処理します。", 2400);
    } else {
      this.setMachineState("ready");
      this.showToast("冷却完了 — 次の紙を投入できます。", 2100);
    }
    this.overheatStartedAt = 0;
    this.overheatPenaltyUntil = 0;
    this.sound.cooled();
  }

  startReverse() {
    if (this.status !== "playing" || this.machineState !== "jammed" || this.reversing) return;
    this.sound.enable();
    this.reversing = true;
    this.reverseStart = performance.now();
    this.shredder.setReverseProgress(0);
    this.sound.startMotor(true);
  }

  stopReverse(interrupted = false) {
    if (!this.reversing) return;
    this.reversing = false;
    this.reverseStart = 0;
    this.shredder.setReverseProgress(0);
    this.sound.stopMotor();
    if (interrupted && this.machineState === "jammed") {
      this.showManager(
        "途中でボタンを離すな！まだ紙か異物が噛んでいるぞ！",
        "本体上面の赤い逆回転ボタンを、ランプが全部点くまで長押ししなさい。",
        4200,
      );
    }
  }

  updateReverse(now) {
    if (!this.reversing || this.machineState !== "jammed") return;
    const progress = clamp((now - this.reverseStart) / REVERSE_HOLD_MS, 0, 1);
    this.shredder.setReverseProgress(progress);
    if (progress >= 1) this.finishReverse();
  }

  finishReverse() {
    const foreignObject = this.activeForeignJam;
    if (foreignObject) {
      foreignObject.returnToDesk({ x: 0, z: -1.08 });
      this.activeForeignJam = null;
    }
    const jammedDocuments = this.activeJam ?? [];
    jammedDocuments.forEach((documentVisual, index) => {
      const column = index - (jammedDocuments.length - 1) / 2;
      documentVisual.status = "table";
      documentVisual.root.visible = true;
      documentVisual.root.scale.set(1, 1, 1);
      documentVisual.root.rotation.set(-Math.PI / 2, 0, column * 0.035);
      documentVisual.root.position.set(
        clamp(column * 0.46, -3.2, 3.2),
        0.07 + index * 0.002,
        -1.18 + (index % 2) * 0.35,
      );
    });
    this.activeJam = null;
    this.stopReverse();
    if (this.heat >= HEAT_MAX) {
      this.startOverheat();
      return;
    }
    this.setMachineState("ready");
    this.showToast(
      foreignObject
        ? `${foreignObject.definition.label}を取り出しました。机上のゴミ箱へ直接捨ててください。`
        : "詰まりを解除しました。前処理・束の厚み・投入角度を確認してください。",
      2600,
    );
    this.updateHud();
  }

  beginBinDrag(event) {
    if (this.status !== "playing" || this.binFill <= 0 || !["ready", "full", "binRemoved"].includes(this.machineState)) return;
    this.clearSelection();
    this.shredder.detachBin(this.scene);
    this.setMachineState("binRemoved");
    this.binDragging = true;
    this.binPointerId = event.pointerId;
    this.canvas.setPointerCapture(event.pointerId);
    this.controls.enabled = false;
    this.raycaster.ray.intersectPlane(this.binDragPlane, this.binDragIntersection);
    this.binDragOffset.copy(this.shredder.bin.position).sub(this.binDragIntersection);
    this.shredder.bin.position.y = 0.45;
    this.shredder.bin.rotation.set(0, 0, 0);
    this.wastebasket.setHighlight(false);
    this.showToast("ケースを外しました。『ゴミ箱』表示まで運びます。", 2200);
  }

  onBinPointerMove(event) {
    event.preventDefault();
    event.stopPropagation();
    this.updatePointer(event);
    if (!this.raycaster.ray.intersectPlane(this.binDragPlane, this.binDragIntersection)) return;
    this.shredder.bin.position.set(
      clamp(this.binDragIntersection.x + this.binDragOffset.x, -7.6, 7.6),
      0.45,
      clamp(this.binDragIntersection.z + this.binDragOffset.z, -6, 5.4),
    );
    const overWastebasket = this.isPointerOverWastebasket();
    this.shredder.bin.rotation.z = THREE.MathUtils.lerp(this.shredder.bin.rotation.z, overWastebasket ? -0.22 : 0, 0.22);
    this.wastebasket.setHighlight(overWastebasket);
  }

  finishBinDrag(event) {
    event.preventDefault();
    event.stopPropagation();
    this.updatePointer(event);
    if (this.canvas.hasPointerCapture(event.pointerId)) this.canvas.releasePointerCapture(event.pointerId);
    this.binDragging = false;
    this.binPointerId = null;
    this.controls.enabled = true;
    const canDump = this.isPointerOverWastebasket();
    this.wastebasket.setHighlight(false);
    if (canDump) {
      this.startBinDump();
      return;
    }
    this.shredder.bin.position.y = 0;
    this.shredder.bin.rotation.z = 0;
    this.setMachineState("binRemoved");
    this.showManager(
      "そこへ捨てるんじゃない！机がゴミだらけになるだろう！",
      "青い『ゴミ箱 / WASTE』表示までケースを運んでから離しなさい。",
      4200,
    );
  }

  getWastebasketScreenPosition() {
    const opening = this.wastebasket.group.position.clone().add(new THREE.Vector3(0, 1.52, 0)).project(this.camera);
    return {
      x: (opening.x * 0.5 + 0.5) * window.innerWidth,
      y: (-opening.y * 0.5 + 0.5) * window.innerHeight,
    };
  }

  isPointerOverWastebasket() {
    const opening = this.getWastebasketScreenPosition();
    const toleranceX = clamp(window.innerWidth * 0.085, 72, 118);
    const toleranceY = clamp(window.innerHeight * 0.13, 72, 108);
    return Math.abs(this.pointerClient.x - opening.x) <= toleranceX
      && Math.abs(this.pointerClient.y - opening.y) <= toleranceY;
  }

  startBinDump() {
    if (this.binFill <= 0 || this.activeBinDump) return;
    this.shredder.detachBin(this.scene);
    this.activeBinDump = {
      startAt: performance.now(),
      startPosition: this.shredder.bin.position.clone(),
      colors: this.shredder.shredPieces.slice(0, 32).map((piece) => piece.material.color.clone()),
      dumped: false,
    };
    this.setMachineState("emptying");
    this.showToast("ケースを傾け、ゴミ箱へ中身を捨てています。", 2400);
    this.sound.empty();
  }

  updateBinDump(now) {
    const dump = this.activeBinDump;
    if (!dump) return;
    const progress = clamp((now - dump.startAt) / BIN_DUMP_MS, 0, 1);
    const target = this.wastebasket.group.position.clone().add(new THREE.Vector3(0, 1.72, 0));
    const home = this.shredder.group.position.clone().add(new THREE.Vector3(0, 0, 0.03));
    if (progress < 0.28) {
      this.shredder.bin.position.lerpVectors(dump.startPosition, target, easeInOutCubic(progress / 0.28));
      this.shredder.bin.rotation.z = 0;
    } else if (progress < 0.58) {
      this.shredder.bin.position.copy(target);
      this.shredder.bin.rotation.z = THREE.MathUtils.lerp(0, -1.95, easeInOutCubic((progress - 0.28) / 0.3));
    } else {
      if (!dump.dumped) {
        this.wastebasket.receiveShreds(dump.colors.length ? dump.colors : [new THREE.Color(0xe5e0d5)]);
        this.shredder.clearShreds();
        this.binFill = 0;
        this.shredder.setFill(0, LEVELS[this.levelKey].binCapacity);
        dump.dumped = true;
        this.updateHud();
      }
      if (progress < 0.72) {
        this.shredder.bin.position.copy(target);
        this.shredder.bin.rotation.z = THREE.MathUtils.lerp(-1.95, 0, easeInOutCubic((progress - 0.58) / 0.14));
      } else {
        this.shredder.bin.rotation.z = 0;
        this.shredder.bin.position.lerpVectors(target, home, easeInOutCubic((progress - 0.72) / 0.28));
      }
    }
    if (progress < 1) return;
    this.shredder.attachBin();
    this.activeBinDump = null;
    this.stats.empties += 1;
    const resumed = this.resumeFeedsAfterBinEmpty(now);
    if (resumed) {
      this.showToast(
        this.activeFeeds.length > 0 || this.activeForeignFeed
          ? "ゴミを捨て、待っていた投入物の処理を再開しました。"
          : "ゴミを捨て、ケースを本体へ戻しました。",
        2300,
      );
    }
    this.updateHud();
  }

  setMachineState(state) {
    this.machineState = state;
    this.shell.dataset.machine = state;
    this.machineStatus.textContent = STATUS_LABELS[state] ?? state.toUpperCase();
    this.shredder.setState(state);
    this.updateMachineControls();
  }

  updateMachineControls() {
    const instructions = {
      ready: "紙を入口の上から差し込む",
      processing: "投入されたものを処理しています",
      jammed: "本体上面の赤い逆回転ボタンを長押し",
      full: "前面ケースを外して右のゴミ箱へ",
      binRemoved: "ケースを『ゴミ箱』表示まで運ぶ",
      emptying: "ゴミを捨ててケースを戻しています",
      overheated: "操作可能 — 紙を入れると冷却延長 / 35%で再開",
      paused: "ゲームを一時停止しています",
      complete: "すべての処理が完了しました",
    };
    this.machineInstruction.textContent = instructions[this.machineState] ?? "本体を確認してください";
  }

  updateHud(now = performance.now()) {
    const level = LEVELS[this.levelKey];
    if (!level) return;
    const remaining = this.getRemainingItemCount();
    const selectedDocuments = [...this.selected];
    const load = this.getBundleLoad(selectedDocuments);
    const activeDocumentCount = this.activeFeeds.reduce((total, feed) => total + feed.documents.length, 0);
    const concurrentLoad = this.getActivePaperLoad() + load.effective;
    this.hudRemaining.textContent = `${remaining} LEFT`;
    this.hudBundleCount.textContent = `${activeDocumentCount + this.selected.size} / ${concurrentLoad.toFixed(1)} EQ`;
    this.hudBinLabel.textContent = `${this.binFill} / ${level.binCapacity}`;
    this.bundleMeter.style.width = `${clamp(concurrentLoad / level.feedLimit, 0, 1) * 100}%`;
    this.bundleMeter.style.background = concurrentLoad > level.feedLimit ? "var(--red)" : "var(--lime)";
    this.binMeter.style.width = `${clamp(this.binFill / level.binCapacity, 0, 1) * 100}%`;
    this.binMeter.style.background = this.binFill >= level.binCapacity ? "var(--amber)" : "#d7ded8";
    const heatLabel = `${Math.round(this.heat)}%`;
    if (this.machineHeat.textContent !== heatLabel) this.machineHeat.textContent = heatLabel;
    this.heatMeter.style.width = `${this.heat}%`;
    this.heatMeter.style.background = this.heat >= 82 ? "var(--red)" : this.heat >= 58 ? "var(--amber)" : "var(--lime)";
    this.updatePreparationAction();
    if (this.status === "playing") this.hudTime.textContent = formatTime(this.currentElapsed(now));
  }

  getRemainingItemCount() {
    const documents = this.documents.reduce((total, documentVisual) => (
      documentVisual.status === "shredded" ? total : total + 1
    ), 0);
    const deskWaste = this.deskWaste.reduce((total, deskWasteVisual) => (
      deskWasteVisual.status === "discarded" ? total : total + 1
    ), 0);
    return documents + deskWaste;
  }

  currentElapsed(now = performance.now()) {
    return this.elapsedBeforePause + (this.startTime ? now - this.startTime : 0);
  }

  completeGame() {
    if (this.status !== "playing") return;
    const elapsedMs = this.currentElapsed();
    this.elapsedBeforePause = elapsedMs;
    this.startTime = 0;
    this.status = "cleared";
    this.setMachineState("complete");
    this.setHudEnabled(false);
    this.updateMachineControls();
    this.sound.stopMotor();
    this.sound.clear();
    const level = LEVELS[this.levelKey];
    this.markUnknownCleared();
    this.unlockNextLevel();
    saveLocalScore({
      difficulty: this.levelKey,
      elapsedMs,
      completedAt: new Date().toISOString(),
    });
    const totalCount = getLevelTotalCount(this.levelKey);
    document.querySelector("#clear-level").textContent = `${level.name} / ${totalCount} ITEMS`;
    const formattedTime = formatTime(elapsedMs);
    const clearTime = document.querySelector("#clear-time");
    clearTime.textContent = formattedTime;
    clearTime.value = formattedTime;
    document.querySelector("#clear-max-bundle").textContent = this.stats.maxBundle;
    document.querySelector("#clear-jams").textContent = this.stats.jams;
    document.querySelector("#clear-empties").textContent = this.stats.empties;
    const currentIndex = LEVEL_ORDER.indexOf(this.levelKey);
    const nextIndex = currentIndex + 1;
    const nextButton = document.querySelector("#next-level-button");
    nextButton.querySelector("span").textContent = currentIndex >= 0 && nextIndex < LEVEL_ORDER.length
      ? "次の難易度"
      : "スタート画面へ";
    document.querySelector("#share-button").href = buildXShareUrl({
      levelName: level.name,
      totalCount,
      formattedTime,
      pageUrl: window.location.href,
    });
    this.openDialog(this.clearScreen);
  }

  pauseGame() {
    if (this.status !== "playing") return;
    this.freezeGame();
    this.status = "paused";
    this.openDialog(this.pauseScreen);
  }

  freezeGame() {
    const now = performance.now();
    if (this.deskWasteDragging) {
      const deskWaste = this.deskWasteDragging;
      this.finishDeskWastePointerCapture();
      deskWaste.returnToDesk();
    }
    if (this.binDragging) {
      if (this.binPointerId !== null && this.canvas.hasPointerCapture(this.binPointerId)) {
        this.canvas.releasePointerCapture(this.binPointerId);
      }
      this.binDragging = false;
      this.binPointerId = null;
      this.shredder.bin.position.y = 0;
      this.shredder.bin.rotation.z = 0;
      this.wastebasket.setHighlight(false);
      this.controls.enabled = true;
    }
    if (this.reversePointerId !== null && this.canvas.hasPointerCapture(this.reversePointerId)) {
      this.canvas.releasePointerCapture(this.reversePointerId);
    }
    this.reversePointerId = null;
    if (this.reversing) this.stopReverse();
    this.elapsedBeforePause = this.currentElapsed(now);
    this.startTime = 0;
    this.pausedAt = now;
    this.sound.stopMotor();
    this.shredder.setState("paused");
    this.setHudEnabled(false);
    this.updateMachineControls();
  }

  resumeGame() {
    if (!['paused', 'help', 'retry'].includes(this.status)) return;
    this.closeAllDialogs();
    const now = performance.now();
    const pausedDuration = now - this.pausedAt;
    this.activeFeeds.forEach((feed) => {
      feed.startAt += pausedDuration;
      if (feed.processStart) feed.processStart += pausedDuration;
      if (feed.blockedAt) feed.blockedAt += pausedDuration;
      if (feed.overheatBlockedAt) feed.overheatBlockedAt += pausedDuration;
    });
    if (this.activeForeignFeed) this.activeForeignFeed.startAt += pausedDuration;
    if (this.activeBinDump) this.activeBinDump.startAt += pausedDuration;
    this.deskWaste.forEach((deskWasteVisual) => {
      if (deskWasteVisual.discardAnimation) deskWasteVisual.discardAnimation.startAt += pausedDuration;
    });
    if (this.reverseStart) this.reverseStart += pausedDuration;
    if (this.overheatStartedAt) this.overheatStartedAt += pausedDuration;
    if (this.overheatPenaltyUntil) this.overheatPenaltyUntil += pausedDuration;
    this.startTime = now;
    this.status = "playing";
    this.shredder.setState(this.machineState);
    this.setHudEnabled(true);
    this.updateMachineControls();
    if (this.machineState === "processing") this.sound.startMotor(false);
    if (this.reversing) this.sound.startMotor(true);
    this.canvas.focus({ preventScroll: true });
  }

  requestRetry() {
    if (!['playing', 'paused'].includes(this.status)) return;
    this.retryOrigin = this.status;
    if (this.status === "playing") this.freezeGame();
    this.closeDialog(this.pauseScreen);
    this.status = "retry";
    this.openDialog(this.retryScreen);
  }

  cancelRetry() {
    this.closeDialog(this.retryScreen);
    if (this.retryOrigin === "paused") {
      this.status = "paused";
      this.openDialog(this.pauseScreen);
      return;
    }
    this.resumeGame();
  }

  confirmRetry() {
    this.closeDialog(this.retryScreen);
    this.startGame(this.levelKey);
  }

  openHelp() {
    if (this.status !== "playing") return;
    this.freezeGame();
    this.status = "help";
    this.openDialog(this.helpScreen);
  }

  closeHelp() {
    if (this.status !== "help") return;
    this.closeDialog(this.helpScreen);
    this.resumeGame();
  }

  returnToMenu() {
    window.clearTimeout(this.gameOverTimer);
    this.gameOverTimer = 0;
    this.cancelCountdown();
    this.sound.stopMotor();
    this.stopReverse();
    this.closeAllDialogs();
    this.disposeDocuments();
    this.disposeDeskWaste();
    this.shredder.attachBin();
    this.shredder.clearShreds();
    this.wastebasket.clear();
    this.binFill = 0;
    this.activeFeeds = [];
    this.activeJam = null;
    this.activeForeignJam = null;
    this.activeForeignFeed = null;
    this.activeBinDump = null;
    this.foreignFeedArmed = false;
    this.binDragging = false;
    this.heat = 0;
    this.overheatStartedAt = 0;
    this.overheatPenaltyUntil = 0;
    this.shredder.setHeat(0);
    this.status = "menu";
    if (this.levelKey === SPECIAL_LEVEL_KEY) this.levelKey = "unknown";
    this.specialTriggerPressCount = 0;
    this.setMachineState("ready");
    this.setHudEnabled(false);
    this.startScreen.classList.add("is-visible");
    this.startScreen.inert = false;
    this.startScreen.setAttribute("aria-hidden", "false");
    this.updateProgressUi();
    this.updateMenu();
  }

  startNextLevel() {
    if (this.levelKey === SPECIAL_LEVEL_KEY) {
      this.returnToMenu();
      return;
    }
    const nextIndex = LEVEL_ORDER.indexOf(this.levelKey) + 1;
    if (nextIndex >= LEVEL_ORDER.length) {
      this.returnToMenu();
      return;
    }
    this.startGame(LEVEL_ORDER[nextIndex]);
  }

  openDialog(dialog) {
    if (!dialog.open) dialog.showModal();
  }

  closeDialog(dialog) {
    if (dialog.open) dialog.close();
  }

  closeAllDialogs() {
    [this.pauseScreen, this.retryScreen, this.clearScreen, this.helpScreen, this.gameOverScreen].forEach((dialog) => this.closeDialog(dialog));
  }

  setHudEnabled(enabled) {
    this.hudButtons.forEach((button) => {
      button.disabled = !enabled;
    });
    if (!enabled) this.prepActionButton.hidden = true;
  }

  onKeyDown(event) {
    if (!event.repeat && event.key.toLowerCase() === "d") {
      this.debugPressCount += 1;
      if (this.debugPressCount >= DEBUG_TRIGGER_COUNT) this.activateDebugMode();
    } else if (!event.repeat && event.key.length === 1) {
      this.debugPressCount = 0;
    }

    const tagName = event.target?.tagName;
    const interactiveTarget = ["BUTTON", "A", "INPUT", "TEXTAREA", "SELECT"].includes(tagName);
    if (event.key === "Escape") {
      event.preventDefault();
      if (this.status === "playing") this.pauseGame();
      else if (this.status === "paused") this.resumeGame();
      else if (this.status === "help") this.closeHelp();
      else if (this.status === "retry") this.cancelRetry();
      return;
    }
    if (this.status !== "playing" || interactiveTarget) return;
    if (this.dragging && ["q", "Q", "e", "E"].includes(event.key)) {
      event.preventDefault();
      this.rotateHeldDocuments(event.key.toLowerCase() === "q" ? -0.11 : 0.11);
      return;
    }
    if (event.key === "x" || event.key === "X") {
      event.preventDefault();
      this.prepareSelected();
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      this.cycleKeyboardFocus(event.key === "ArrowRight" ? 1 : -1);
      return;
    }
    if (event.code === "Space" && this.keyboardFocus) {
      event.preventDefault();
      if (this.selected.has(this.keyboardFocus)) this.removeSelection(this.keyboardFocus);
      else this.addSelection(this.keyboardFocus);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      this.feedSelected();
      return;
    }
    if (event.key === "?" || (event.key === "/" && event.shiftKey)) {
      event.preventDefault();
      this.openHelp();
    }
  }

  showToast(message, duration = 1800) {
    window.clearTimeout(this.toastTimer);
    this.toast.textContent = message;
    this.toast.classList.add("is-visible");
    this.toastTimer = window.setTimeout(() => this.toast.classList.remove("is-visible"), duration);
  }

  showManager(line, hint, duration = 4600) {
    window.clearTimeout(this.managerTimer);
    this.managerSkit.classList.remove("is-visible");
    this.managerLine.textContent = line;
    this.managerHint.textContent = hint;
    this.managerSkit.setAttribute("aria-hidden", "false");
    void this.managerSkit.offsetWidth;
    this.managerSkit.classList.add("is-visible");
    this.managerTimer = window.setTimeout(() => this.hideManager(), duration);
  }

  hideManager() {
    window.clearTimeout(this.managerTimer);
    this.managerTimer = 0;
    this.managerSkit?.classList.remove("is-visible");
    if (!this.managerSkit) return;
    this.managerSkit.setAttribute("aria-hidden", "true");
  }

  updateWasteMarker() {
    if (!this.wasteMarker) return;
    const position = this.wastebasket.group.position.clone().add(new THREE.Vector3(0, 2.02, 0)).project(this.camera);
    const left = (position.x * 0.5 + 0.5) * window.innerWidth;
    const top = (-position.y * 0.5 + 0.5) * window.innerHeight;
    this.wasteMarker.style.left = `${clamp(left, 52, window.innerWidth - 52)}px`;
    this.wasteMarker.style.top = `${clamp(top, 86, window.innerHeight - 110)}px`;
    this.wasteMarker.style.transform = "translate(-50%, -100%)";
    this.wasteMarker.hidden = this.status === "menu" || this.status === "countdown";
  }

  getFullscreenElement() {
    return document.fullscreenElement ?? document.webkitFullscreenElement ?? null;
  }

  async toggleFullscreen() {
    try {
      if (this.getFullscreenElement()) {
        const exit = document.exitFullscreen ?? document.webkitExitFullscreen;
        await exit?.call(document);
      } else {
        const request = this.shell.requestFullscreen ?? this.shell.webkitRequestFullscreen;
        await request?.call(this.shell);
      }
    } catch {
      this.showManager("全画面に切り替えられんぞ！", "ブラウザの権限設定を確認するか、このままの画面で続けなさい。", 3600);
    }
  }

  updateFullscreenUi() {
    const fullscreen = Boolean(this.getFullscreenElement());
    this.fullscreenButton.setAttribute("aria-pressed", String(fullscreen));
    const icon = this.fullscreenButton.querySelector("i");
    icon.classList.toggle("fa-expand", !fullscreen);
    icon.classList.toggle("fa-compress", fullscreen);
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const portrait = width / height < 0.76;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.setSize(width, height, false);
    this.wastebasket.group.position.set(portrait ? 2.65 : 5.35, 0, portrait ? -1.75 : -1.2);
    if (this.dragging) this.updateFeedGuide(true);
    this.updateWasteMarker();
  }

  animate(now) {
    requestAnimationFrame((time) => this.animate(time));
    const delta = Math.min(0.034, Math.max(0.001, (now - this.lastFrame) / 1000));
    this.lastFrame = now;
    this.controls.update();
    if (this.status === "playing") {
      this.updateThermal(now, delta);
      this.updateFeeds(now);
      this.updateForeignFeed(now);
      this.updateReverse(now);
      this.updateBinDump(now);
      this.updateDeskWasteDisposal(now);
      this.updateHud(now);
      this.documents.forEach((documentVisual) => {
        if (["table", "falling", "feeding"].includes(documentVisual.status)) {
          documentVisual.update(now, this.dragging ? this.dragMotion : 0, delta);
        }
      });
    }
    this.shredder.update(delta, now);
    this.updateWasteMarker();
    this.renderer.render(this.scene, this.camera);
  }

  updateDeskWasteDisposal(now) {
    this.deskWaste.forEach((deskWasteVisual) => {
      if (!deskWasteVisual.update(now)) return;
      this.wastebasket.receiveDeskWaste(deskWasteVisual);
      this.sound.discardObject();
      this.showToast(`${deskWasteVisual.definition.label}をゴミ箱へ捨てました。`, 1800);
    });
    if (this.getRemainingItemCount() === 0) this.completeGame();
  }
}

new ShredderGame();
