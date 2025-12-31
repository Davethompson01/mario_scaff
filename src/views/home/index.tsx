// Next, React
import { FC, useState } from "react";
import pkg from "../../../package.json";

// ❌ DO NOT EDIT ANYTHING ABOVE THIS LINE

export const HomeView: FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* HEADER – fake Scrolly feed tabs */}
      <header className="flex items-center justify-center border-b border-white/10 py-3">
        <div className="flex items-center gap-2 rounded-full bg-white/5 px-2 py-1 text-[11px]">
          <button className="rounded-full bg-slate-900 px-3 py-1 font-semibold text-white">
            Feed
          </button>
          <button className="rounded-full px-3 py-1 text-slate-400">
            Casino
          </button>
          <button className="rounded-full px-3 py-1 text-slate-400">
            Kids
          </button>
        </div>
      </header>

      {/* MAIN – central game area (phone frame) */}
      <main className="flex flex-1 items-center justify-center px-4 py-3">
        <div className="relative aspect-auto w-full min-w-[350px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 shadow-[0_0_40px_rgba(56,189,248,0.35)]">
          {/* Fake “feed card” top bar inside the phone */}
          <div className="flex items-center justify-between px-3 py-2 text-[10px] text-slate-400">
            <span className="rounded-full bg-white/5 px-2 py-1 text-[9px] uppercase tracking-wide">
              Scrolly Game
            </span>
            <span className="text-[9px] opacity-70">#NoCodeJam</span>
          </div>

          {/* The game lives INSIDE this phone frame */}
          <div className="flex h-[calc(100%-26px)] flex-col items-center justify-start px-3 pb-3 pt-1">
            <GameSandbox />
          </div>
        </div>
      </main>

      {/* FOOTER – tiny version text */}
      <footer className="flex h-5 items-center justify-center border-t border-white/10 px-2 text-[9px] text-slate-500">
        <span>Scrolly · v{pkg.version}</span>
      </footer>
    </div>
  );
};

// ✅ THIS IS THE ONLY PART YOU EDIT FOR THE JAM
// Replace this entire GameSandbox component with the one AI generates.
// Keep the name `GameSandbox` and the `FC` type.

import { useEffect, useRef } from "react";

// assets
import block from "./assets/block.png";
import brick from "./assets/brick.png";
import coin from "./assets/coin.png";
import evilShroom from "./assets/evil-shroom.png";
import pipeTopLeft from "./assets/pipe-top-left.png";
import pipeTopRight from "./assets/pipe-top-right.png";
import pipeBottomLeft from "./assets/pipe-bottom-left.png";
import pipeBottomRight from "./assets/pipe-bottom-right.png";
import blueBlock from "./assets/blueblock.png";
import blueBrick from "./assets/bluebrick.png";
import blueSteel from "./assets/bluesteel.png";
import blueEvilShroom from "./assets/blue-evil-shroom.png";
import blueSuprise from "./assets/blue-suprise.png";
import mario from "./assets/mario.png";
import mushroom from "./assets/mushroom.png";
import surprise from "./assets/suprise.png";
import unboxed from "./assets/unboxed.png";

const GameSandbox = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || startedRef.current) return;
    startedRef.current = true;

    const el = containerRef.current;

    // 🔑 Make container focusable & capture arrow keys
    el.tabIndex = 0;
    el.focus();

    // Global variables for touch controls
    let keyLeft = false;
    let keyRight = false;
    let keyA = false;
    let keyD = false;
    let moveDir = 0;
    let jumpRequested = false;

    const updateMoveDir = () => {
      if (keyLeft || keyA) {
        moveDir = -1;
      } else if (keyRight || keyD) {
        moveDir = 1;
      } else {
        moveDir = 0;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      ) {
        e.preventDefault();
      }
    };

    el.addEventListener("keydown", handleKeyDown);

    // Add touch controls for mobile
    el.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const width = rect.width;
      if (x < width / 3) {
        // Left third - move left
        keyLeft = true;
        updateMoveDir();
      } else if (x > (2 * width) / 3) {
        // Right third - move right
        keyRight = true;
        updateMoveDir();
      } else {
        // Center - jump
        jumpRequested = true;
      }
    });

    el.addEventListener("touchend", (e) => {
      e.preventDefault();
      // Reset movement
      keyLeft = false;
      keyRight = false;
      updateMoveDir();
    });

    // Store keyup handler reference for cleanup
    let keyUpHandler: ((e: KeyboardEvent) => void) | null = null;

    // @ts-ignore – provided by CDN
    kaboom({
      global: true,
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      // Slightly less zoom so we can see more of the level, especially on mobile
      scale: containerRef.current.clientWidth < 480 ? 1 : 1.5,
      debug: true,
      clearColor: [0, 0, 0, 1],
      root: containerRef.current,
    });

    /* ---------------- CONSTANTS ---------------- */
    const MOVE_SPEED = 120;
    const JUMP_FORCE = 360;
    const BIG_JUMP_FORCE = 550;
    const FALL_DEATH = 400;
    const ENEMY_SPEED = 20;

    let CURRENT_JUMP_FORCE = JUMP_FORCE;
    let isJumping = true;

    /* ---------------- ASSETS ---------------- */
    loadSprite("coin", coin.src);
    loadSprite("evil-shroom", evilShroom.src);
    loadSprite("brick", brick.src);
    loadSprite("block", block.src);
    loadSprite("mario", mario.src);
    loadSprite("mushroom", mushroom.src);
    loadSprite("surprise", surprise.src);
    loadSprite("unboxed", unboxed.src);

    loadSprite("pipe-top-left", pipeTopLeft.src);
    loadSprite("pipe-top-right", pipeTopRight.src);
    loadSprite("pipe-bottom-left", pipeBottomLeft.src);
    loadSprite("pipe-bottom-right", pipeBottomRight.src);

    loadSprite("blue-block", blueBlock.src);
    loadSprite("blue-brick", blueBrick.src);
    loadSprite("blue-steel", blueSteel.src);
    loadSprite("blue-evil-shroom", blueEvilShroom.src);
    loadSprite("blue-surprise", blueSuprise.src);

    /* ---------------- SCENES ---------------- */

    scene("game", ({ level, score }: any) => {
      // Reference to global origin function to avoid window.origin conflict
      const originFn = (globalThis as any).origin;
      layers(["bg", "obj", "ui"], "obj");

      const maps = [
        // =========================
        // MAP 1 – Tutorial / Easy Start
        // =========================
        // Simple horizontal progression with coins and one enemy
        [
          "                                      ",
          "                                      ",
          "                                      ",
          "                                      ",
          "                                      ",
          "        $    $    $                   ",
          "                                      ",
          "                          -+          ",
          "            ^       ^                  ",
          "======================================",
        ],

        // =========================
        // MAP 2 – Platforms Introduced
        // =========================
        // Introduces jumping mechanics with platforms
        [
          "                                      ",
          "                                      ",
          "         *     *                      ",
          "                                      ",
          "     %====%            $              ",
          "                                      ",
          "        ===              ===          ",
          "                    =*=%              ",
          "                ^   ^        -+      ",
          "======================================",
        ],

        // =========================
        // MAP 3 – Enemies & Challenges
        // =========================
        // More enemies, more coins, requires strategy
        [
          "£                                      £",
          "£                                      £",
          "£        *         *         $         £",
          "£                                      £",
          "£     %====%        z     %====%       £",
          "£                                      £",
          "£        ===              ===          £",
          "£                     x x        -+   £",
          "£            z   z  x x x x   ^   ()   £",
          "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
        ],

        // =========================
        // MAP 4 – Vertical Challenge
        // =========================
        // Vertical platforming with multiple paths
        [
          "£      *                               £",
          "£          %===%        $             £",
          "£                    *                £",
          "£       z        %===%                £",
          "£          ===        ===              £",
          "£              x x x                   £",
          "£           x x x x x                  £",
          "£        x x x x x x         -+        £",
          "£    z   x x x x x x   ^ ^   ()        £",
          "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
        ],

        // =========================
        // MAP 5 – Final Challenge
        // =========================
        // Hardest level with all mechanics combined
        [
          "£    *        *        *        $      £",
          "£        %====%        %====%         £",
          "£          ===            ===         £",
          "£    z        x x x x        z         £",
          "£              x x x                   £",
          "£    %====%              %====%       £",
          "£          ===            ===         £",
          "£       x x x x x x         -+        £",
          "£   z   x x x x x x   ^ ^   ()        £",
          "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
        ],
      ];

      const levelCfg: any = {
        // Slightly smaller tiles so more world fits on screen
        width: 16,
        height: 16,
        "=": [sprite("block"), solid()],
        $: [sprite("coin"), "coin"],
        "%": [sprite("surprise"), solid(), "coin-surprise"],
        "*": [sprite("surprise"), solid(), "mushroom-surprise"],
        "}": [sprite("unboxed"), solid()],
        "(": [sprite("pipe-bottom-left"), solid(), scale(0.5)],
        ")": [sprite("pipe-bottom-right"), solid(), scale(0.5)],
        "-": [sprite("pipe-top-left"), solid(), scale(0.5), "pipe"],
        "+": [sprite("pipe-top-right"), solid(), scale(0.5), "pipe"],
        "^": [sprite("evil-shroom"), solid(), "dangerous"],
        "#": [sprite("mushroom"), solid(), "mushroom", body()],
        "!": [sprite("blue-block"), solid(), scale(0.5)],
        "£": [sprite("blue-brick"), solid(), scale(0.5)],
        z: [sprite("blue-evil-shroom"), solid(), scale(0.5), "dangerous"],
        "@": [sprite("blue-surprise"), solid(), scale(0.5), "coin-surprise"],
        x: [sprite("blue-steel"), solid(), scale(0.5)],
      };

      const gameLevel = addLevel(maps[level], levelCfg);

      const scoreLabel: any = add([
        text(String(score)),
        pos(30, 6),
        layer("ui"),
        { value: score },
      ]);

      add([text(`level ${level + 1}`), pos(120, 6), layer("ui")]);

      /* -------- POWER -------- */
      function big() {
        let timer = 0;
        let isBig = false;

        return {
          update() {
            if (isBig) {
              CURRENT_JUMP_FORCE = BIG_JUMP_FORCE;
              timer -= dt();
              if (timer <= 0) this.smallify();
            }
          },
          smallify() {
            this.scale = vec2(1);
            CURRENT_JUMP_FORCE = JUMP_FORCE;
            isBig = false;
          },
          biggify(t: number) {
            this.scale = vec2(2);
            timer = t;
            isBig = true;
          },
        };
      }

      /* -------- PLAYER -------- */
      const player: any = add([
        sprite("mario"),
        pos(30, 0),
        solid(),
        body(),
        big(),
        originFn("bot"),
      ]);

      action("mushroom", (m: any) => m.move(20, 0));
      action("dangerous", (d: any) => d.move(-ENEMY_SPEED, 0));

      player.on("headbump", (obj: any) => {
        if (obj.is("coin-surprise")) {
          gameLevel.spawn("$", obj.gridPos.sub(0, 1));
          destroy(obj);
          gameLevel.spawn("}", obj.gridPos);
        }

        if (obj.is("mushroom-surprise")) {
          gameLevel.spawn("#", obj.gridPos.sub(0, 1));
          destroy(obj);
          gameLevel.spawn("}", obj.gridPos);
        }
      });

      player.collides("coin", (c: any) => {
        destroy(c);
        scoreLabel.value++;
        scoreLabel.text = scoreLabel.value;
      });

      player.collides("mushroom", (m: any) => {
        destroy(m);
        player.biggify(6);
      });

      player.collides("dangerous", (d: any) => {
        isJumping ? destroy(d) : go("lose", { score: scoreLabel.value });
      });

      // Track keyboard input state (shared with touch)
      // Arrow key controls for PC
      keyDown("left", () => {
        keyLeft = true;
        updateMoveDir();
      });
      keyDown("right", () => {
        keyRight = true;
        updateMoveDir();
      });
      keyDown("a", () => {
        keyA = true;
        updateMoveDir();
      });
      keyDown("d", () => {
        keyD = true;
        updateMoveDir();
      });

      // Track key releases using window events (kaboom doesn't have keyUp)
      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
          keyLeft = false;
          keyA = false;
          updateMoveDir();
        }
        if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
          keyRight = false;
          keyD = false;
          updateMoveDir();
        }
      };

      keyUpHandler = handleKeyUp;
      window.addEventListener("keyup", handleKeyUp);

      // Jump controls
      keyDown("up", () => {
        if (player.grounded()) {
          player.jump(CURRENT_JUMP_FORCE);
        }
      });
      keyPress("space", () => {
        if (player.grounded()) player.jump(CURRENT_JUMP_FORCE);
      });

      // Pipe interaction - automatic progression when on top
      let isOnPipe = false;
      let hasProgressed = false;
      let progressTimer = 0;

      // Track when player is on pipe
      player.collides("pipe", () => {
        isOnPipe = true;
      });

      // Main player action
      player.action(() => {
        // Handle touch jump
        if (jumpRequested) {
          if (player.grounded()) player.jump(CURRENT_JUMP_FORCE);
          jumpRequested = false;
        }

        // Move based on keyboard input
        if (moveDir !== 0) {
          player.move(moveDir * MOVE_SPEED, 0);
        }

        camPos(player.pos.add(vec2(40, -10)));
        isJumping = !player.grounded();

        if (player.pos.y >= FALL_DEATH) {
          go("lose", { score: scoreLabel.value });
        }

        // Automatic progression when standing on pipe
        if (isOnPipe && player.grounded() && !hasProgressed) {
          hasProgressed = true;
          progressTimer = 0.5;
        }

        // Handle progression timer
        if (progressTimer > 0) {
          progressTimer -= dt();
          if (progressTimer <= 0) {
            const nextLevel = level + 1;
            if (nextLevel >= maps.length) {
              go("win", { score: scoreLabel.value });
            } else {
              go("game", { level: nextLevel, score: scoreLabel.value });
            }
          }
        }

        // Reset pipe flag
        isOnPipe = false; // Reset each frame, will be set if colliding
      });
    });

    scene("lose", ({ score }: any) => {
      // Reference to global origin function to avoid window.origin conflict
      const originFn = (globalThis as any).origin;
      add([
        text(`Score: ${score}`, 32),
        originFn("center"),
        pos(width() / 2, height() / 2),
      ]);
    });

    scene("win", ({ score }: any) => {
      // Reference to global origin function to avoid window.origin conflict
      const originFn = (globalThis as any).origin;
      add([
        text(`You Win! Final Score: ${score}`, 32),
        originFn("center"),
        pos(width() / 2, height() / 2),
      ]);
      // Optional: Add restart key
      keyPress("space", () => go("game", { level: 0, score: 0 }));
    });

    start("game", { level: 0, score: 0 });
    return () => {
      // Clean up keyboard listeners
      if (el) {
        el.removeEventListener("keydown", handleKeyDown);
      }
      if (keyUpHandler) {
        window.removeEventListener("keyup", keyUpHandler);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );
};

export default GameSandbox;
