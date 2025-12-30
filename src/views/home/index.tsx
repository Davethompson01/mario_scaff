// Next, React
import { FC, useState } from 'react';
import pkg from '../../../package.json';

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
        <div className="relative aspect-[9/16] w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 shadow-[0_0_40px_rgba(56,189,248,0.35)]">
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

    // Shared input state for keyboard + touch
    let inputDir = 0; // -1 = left, 1 = right
    let playerRef: any = null;

    // Basic swipe handling for touch devices
    const el = containerRef.current;
    let activeTouchId: number | null = null;
    let touchStartX = 0;
    let touchStartY = 0;
    const SWIPE_THRESHOLD = 24; // px

    const getTouchById = (e: TouchEvent, id: number | null) => {
      if (id === null) return null;
      for (let i = 0; i < e.changedTouches.length; i += 1) {
        const t = e.changedTouches.item(i);
        if (t && t.identifier === id) return t;
      }
      return null;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (activeTouchId !== null) return;
      const t = e.changedTouches[0];
      if (!t) return;
      activeTouchId = t.identifier;
      touchStartX = t.clientX;
      touchStartY = t.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const t = getTouchById(e, activeTouchId);
      if (!t) return;
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;

      // Horizontal swipe → move left / right
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
        inputDir = dx > 0 ? 1 : -1;
      }

      // Upward swipe → jump
      if (
        Math.abs(dy) > Math.abs(dx) &&
        -dy > SWIPE_THRESHOLD &&
        playerRef &&
        typeof playerRef.grounded === "function" &&
        playerRef.grounded()
      ) {
        playerRef.jump(CURRENT_JUMP_FORCE);
        // Reset so a single swipe doesn't trigger multiple jumps
        touchStartY = t.clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const t = getTouchById(e, activeTouchId);
      if (!t) return;
      activeTouchId = null;
      inputDir = 0;
    };

    if (el) {
      el.addEventListener("touchstart", handleTouchStart, { passive: true });
      el.addEventListener("touchmove", handleTouchMove, { passive: true });
      el.addEventListener("touchend", handleTouchEnd, { passive: true });
      el.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    }

    // @ts-ignore – provided by CDN
    kaboom({
      global: true,
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      // Slightly less zoom so we can see more of the level, especially on mobile
      scale:
        containerRef.current.clientWidth < 480
          ? 1
          : 1.5,
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
    loadSprite("brick", brick.src );
    loadSprite("block", block.src );
    loadSprite("mario", mario.src );
    loadSprite("mushroom", mushroom.src );
    loadSprite("surprise", surprise.src );
    loadSprite("unboxed", unboxed.src );

    loadSprite("pipe-top-left", pipeTopLeft.src );
    loadSprite("pipe-top-right", pipeTopRight.src );
    loadSprite("pipe-bottom-left", pipeBottomLeft.src );
    loadSprite("pipe-bottom-right", pipeBottomRight.src );

    loadSprite("blue-block", blueBlock.src );
    loadSprite("blue-brick", blueBrick.src );
    loadSprite("blue-steel", blueSteel.src );
    loadSprite("blue-evil-shroom", blueEvilShroom.src );
    loadSprite("blue-surprise", blueSuprise.src );

    /* ---------------- SCENES ---------------- */

    scene("game", ({ level, score }: any) => {
      // Reference to global origin function to avoid window.origin conflict
      const originFn = (globalThis as any).origin;
      layers(["bg", "obj", "ui"], "obj");

      const maps = [
        [
          "                                      ",
          "                                      ",
          "                                      ",
          "                                      ",
          "                                      ",
          "     %   =*=%=                        ",
          "                                      ",
          "                            -+        ",
          "                    ^   ^   ()        ",
          "==============================   =====",
        ],
        [
          "£                                       £",
          "£                                       £",
          "£                                       £",
          "£                                       £",
          "£                                       £",
          "£        @@@@@@              x x        £",
          "£                          x x x        £",
          "£                        x x x x  x   -+£",
          "£               z   z  x x x x x  x   ()£",
          "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
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
        // Expose to touch handlers
        playerRef = player;

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

        player.action(() => {
          // Keyboard: original left/right key handling
          // Touch: continuous movement based on swipe direction
          if (inputDir !== 0) {
            player.move(inputDir * MOVE_SPEED, 0);
          }

          // Camera follows player; a bit ahead in x to see incoming obstacles
          camPos(player.pos.add(vec2(40, -10)));
          isJumping = !player.grounded();
          if (player.pos.y >= FALL_DEATH) {
            go("lose", { score: scoreLabel.value });
          }
        });

        player.collides("pipe", () => {
          keyPress("down", () =>
            go("game", {
              level: (level + 1) % maps.length,
              score: scoreLabel.value,
            })
          );
        });

        keyPress("space", () => {
          if (player.grounded()) player.jump(CURRENT_JUMP_FORCE);
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

    start("game", { level: 0, score: 0 });
    return () => {
      // Clean up touch listeners
      if (el) {
        el.removeEventListener("touchstart", handleTouchStart);
        el.removeEventListener("touchmove", handleTouchMove);
        el.removeEventListener("touchend", handleTouchEnd);
        el.removeEventListener("touchcancel", handleTouchEnd);
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default GameSandbox;


