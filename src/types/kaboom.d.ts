/* eslint-disable */

declare global {
    function kaboom(config?: any): any;
  
    function loadSprite(name: string, src: string): void;
    function scene(name: string, fn: (...args: any[]) => void): void;
    function start(name: string, data?: any): void;
    function go(name: string, data?: any): void;
  
    function layers(names: string[], def?: string): void;
    function layer(name: string): any;
  
    function add(comp: any[]): any;
    function addLevel(map: string[], cfg: any): any;
  
    function sprite(name: string): any;
    function solid(): any;
    function body(): any;
    function scale(n: number): any;
  
    function text(t: string, size?: number): any;
    function pos(x: number, y?: number): any;
  
    // ✅ SINGLE, CORRECT ORIGIN DECLARATION
    function origin(o: "center" | "bot" | "top" | "left" | "right" | "topleft" | "topright" | "botleft" | "botright"): any;
  
    function action(tag: string, fn: (obj: any) => void): void;
    function destroy(obj: any): void;
    function camPos(pos: any): void;
  
    function keyDown(key: string, fn: () => void): void;
    function keyPress(key: string, fn: () => void): void;
  
    function vec2(x?: number, y?: number): any;
    function dt(): number;
    function width(): number;
    function height(): number;
  }
  
  export {};
  