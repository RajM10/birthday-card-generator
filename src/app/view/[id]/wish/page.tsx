"use client";
import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { cardStorage } from "@/lib/cardStorage";
function Fireworks() {
  const router = useRouter();
  // timer in seconds
  const { id } = useParams();
  const data = cardStorage.getCardById(id as string);
  // timer in seconds
  const timer = 15;
  const wish = ["HAPPY", "BIRTHDAY", data?.name || ""];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const WISH = wish;
  const opts = {
    strings: WISH,
    charSize: 50,
    charSpacing: 35,
    lineHeight: 40,
    fireworkPrevPoints: 10,
    fireworkBaseLineWidth: 5,
    fireworkAddedLineWidth: 8,
    fireworkSpawnTime: 200,
    fireworkBaseReachTime: 30,
    fireworkAddedReachTime: 30,
    fireworkCircleBaseSize: 20,
    fireworkCircleAddedSize: 10,
    fireworkCircleBaseTime: 30,
    fireworkCircleAddedTime: 30,
    fireworkCircleFadeBaseTime: 10,
    fireworkCircleFadeAddedTime: 5,
    fireworkBaseShards: 5,
    fireworkAddedShards: 5,
    fireworkShardPrevPoints: 3,
    fireworkShardBaseVel: 4,
    fireworkShardAddedVel: 2,
    fireworkShardBaseSize: 3,
    fireworkShardAddedSize: 3,
    gravity: 0.1,
    upFlow: -0.05,
    letterContemplatingWaitTime: 360,
    balloonSpawnTime: 20,
    balloonBaseInflateTime: 10,
    balloonAddedInflateTime: 10,
    balloonBaseSize: 20,
    balloonAddedSize: 20,
    balloonBaseVel: 0.4,
    balloonAddedVel: 0.4,
    balloonBaseRadian: -(Math.PI / 2 - 0.5),
    balloonAddedRadian: -1,
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let hw = w / 2;
    let hh = h / 2;
    const Tau = Math.PI * 2;
    const TauQuarter = Tau / 4;
    const letters: Letter[] = [];

    // Create gradient background

    ctx.fillRect(0, 0, w, h);

    ctx.font = `${opts.charSize}px Verdana`;
    class Shard {
      x: number;
      y: number;
      vx: number;
      vy: number;
      prevPoints: [number, number][];
      color: string;
      alive: boolean;
      size: number;

      constructor(x: number, y: number, vx: number, vy: number, color: string) {
        const vel =
          opts.fireworkShardBaseVel +
          opts.fireworkShardAddedVel * Math.random();

        this.vx = vx * vel;
        this.vy = vy * vel;

        this.x = x;
        this.y = y;

        this.prevPoints = [[x, y]];
        this.color = color;

        this.alive = true;

        this.size =
          opts.fireworkShardBaseSize +
          opts.fireworkShardAddedSize * Math.random();
      }

      step() {
        this.x += this.vx;
        this.y += this.vy += opts.gravity;

        if (this.prevPoints.length > opts.fireworkShardPrevPoints)
          this.prevPoints.shift();

        this.prevPoints.push([this.x, this.y]);

        const lineWidthProportion = this.size / this.prevPoints.length;

        for (let k = 0; k < this.prevPoints.length - 1; ++k) {
          if (!ctx) return;
          const point = this.prevPoints[k],
            point2 = this.prevPoints[k + 1];
          ctx.strokeStyle = this.color.replace(
            "alp",
            String(k / this.prevPoints.length)
          );
          ctx.lineWidth = k * lineWidthProportion;
          ctx.beginPath();
          ctx.moveTo(point[0], point[1]);
          ctx.lineTo(point2[0], point2[1]);
          ctx.stroke();
        }

        if (this.prevPoints[0][1] > hh) this.alive = false;
      }
    }

    class Letter {
      char: string;
      x: number;
      y: number;
      dx: number;
      dy: number;
      fireworkDy: number;
      color: string;
      lightAlphaColor: string;
      lightColor: string;
      alphaColor: string;
      phase: string;
      tick: number;
      spawned: boolean;
      spawningTime: number;
      reachTime: number;
      lineWidth: number;
      prevPoints: [number, number, number][];
      circleFinalSize?: number;
      circleCompleteTime?: number;
      circleCreating?: boolean;
      circleFading?: boolean;
      circleFadeTime?: number;
      tick2?: number;
      shards?: Shard[];
      cx?: number;
      cy?: number;
      size?: number;
      vx?: number;
      vy?: number;
      spawning?: boolean;
      inflateTime?: number;
      inflating?: boolean;
      spawnTime?: number;

      constructor(char: string, x: number, y: number) {
        if (!ctx) throw new Error("Canvas context not initialized");
        this.char = char;
        this.x = x;
        this.y = y;
        this.dx = -ctx.measureText(char).width / 2;
        this.dy = opts.charSize / 2;
        this.fireworkDy = this.y - hh;
        const hue =
          (x /
            (opts.charSpacing *
              Math.max(opts.strings[0].length, opts.strings[1].length))) *
          360;
        this.color = `hsl(${hue},80%,50%)`;
        this.lightAlphaColor = `hsla(${hue},80%,light%,alp)`;
        this.lightColor = `hsl(${hue},80%,light%)`;
        this.alphaColor = `hsla(${hue},80%,50%,alp)`;

        // Initialize required properties
        this.phase = "";
        this.tick = 0;
        this.spawned = false;
        this.spawningTime = 0;
        this.reachTime = 0;
        this.lineWidth = 0;
        this.prevPoints = [];

        this.reset();
      }

      reset(): void {
        this.phase = "firework";
        this.tick = 0;
        this.spawned = false;
        this.spawningTime = (opts.fireworkSpawnTime * Math.random()) | 0;
        this.reachTime =
          (opts.fireworkBaseReachTime +
            opts.fireworkAddedReachTime * Math.random()) |
          0;
        this.lineWidth =
          opts.fireworkBaseLineWidth +
          opts.fireworkAddedLineWidth * Math.random();
        this.prevPoints = [[0, hh, 0]];
      }

      step(): void {
        if (!ctx) return;

        if (this.phase === "firework") {
          if (!this.spawned) {
            ++this.tick;
            if (this.tick >= this.spawningTime) {
              this.tick = 0;
              this.spawned = true;
            }
          } else {
            ++this.tick;

            const linearProportion = this.tick / this.reachTime,
              armonicProportion = Math.sin(linearProportion * TauQuarter),
              x = linearProportion * this.x,
              y = hh + armonicProportion * this.fireworkDy;

            if (this.prevPoints.length > opts.fireworkPrevPoints)
              this.prevPoints.shift();

            this.prevPoints.push([x, y, linearProportion * this.lineWidth]);

            const lineWidthProportion = 1 / (this.prevPoints.length - 1);

            for (let i = 1; i < this.prevPoints.length; ++i) {
              const point = this.prevPoints[i],
                point2 = this.prevPoints[i - 1];

              ctx.strokeStyle = this.alphaColor.replace(
                "alp",
                String(i / this.prevPoints.length)
              );
              ctx.lineWidth = point[2] * lineWidthProportion * i;
              ctx.beginPath();
              ctx.moveTo(point[0], point[1]);
              ctx.lineTo(point2[0], point2[1]);
              ctx.stroke();
            }

            if (this.tick >= this.reachTime) {
              this.phase = "contemplate";

              this.circleFinalSize =
                opts.fireworkCircleBaseSize +
                opts.fireworkCircleAddedSize * Math.random();
              this.circleCompleteTime =
                (opts.fireworkCircleBaseTime +
                  opts.fireworkCircleAddedTime * Math.random()) |
                0;
              this.circleCreating = true;
              this.circleFading = false;

              this.circleFadeTime =
                (opts.fireworkCircleFadeBaseTime +
                  opts.fireworkCircleFadeAddedTime * Math.random()) |
                0;
              this.tick = 0;
              this.tick2 = 0;

              this.shards = [];

              const shardCount =
                  (opts.fireworkBaseShards +
                    opts.fireworkAddedShards * Math.random()) |
                  0,
                angle = Tau / shardCount,
                cos = Math.cos(angle),
                sin = Math.sin(angle);
              let x = 1;
              let y = 0;

              for (let i = 0; i < shardCount; ++i) {
                const x1 = x;
                x = x * cos - y * sin;
                y = y * cos + x1 * sin;

                this.shards.push(
                  new Shard(this.x, this.y, x, y, this.alphaColor)
                );
              }
            }
          }
        } else if (this.phase === "contemplate") {
          ++this.tick;

          if (
            this.circleCreating &&
            this.tick2 !== undefined &&
            this.circleCompleteTime
          ) {
            ++this.tick2;
            const proportion = this.tick2 / this.circleCompleteTime,
              armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;

            ctx.beginPath();
            ctx.fillStyle = this.lightAlphaColor
              .replace("light", String(50 + 50 * proportion))
              .replace("alp", String(proportion));
            ctx.beginPath();
            if (this.circleFinalSize) {
              ctx.arc(this.x, this.y, armonic * this.circleFinalSize, 0, Tau);
            }
            ctx.fill();

            if (this.tick2 > (this.circleCompleteTime || 0)) {
              this.tick2 = 0;
              this.circleCreating = false;
              this.circleFading = true;
            }
          } else if (this.circleFading) {
            ctx.fillStyle = this.lightColor.replace("light", String(70));
            ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

            if (this.tick2 !== undefined && this.circleFadeTime) {
              ++this.tick2;
              const proportion = this.tick2 / this.circleFadeTime,
                armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;

              ctx.beginPath();
              ctx.fillStyle = this.lightAlphaColor
                .replace("light", String(100))
                .replace("alp", String(1 - armonic));
              if (this.circleFinalSize) {
                ctx.arc(this.x, this.y, this.circleFinalSize, 0, Tau);
              }
              ctx.fill();

              if (this.tick2 >= this.circleFadeTime) {
                this.circleFading = false;
              }
            }
          } else {
            ctx.fillStyle = this.lightColor.replace("light", String(70));
            ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
          }

          if (this.shards) {
            for (let i = 0; i < this.shards.length; ++i) {
              this.shards[i].step();
              if (!this.shards[i].alive) {
                this.shards.splice(i, 1);
                --i;
              }
            }
          }

          if (this.tick > opts.letterContemplatingWaitTime) {
            this.phase = "balloon";
            this.tick = 0;
            this.spawning = true;
            this.spawnTime = (opts.balloonSpawnTime * Math.random()) | 0;
            this.inflating = false;
            this.inflateTime =
              (opts.balloonBaseInflateTime +
                opts.balloonAddedInflateTime * Math.random()) |
              0;
            this.size =
              (opts.balloonBaseSize + opts.balloonAddedSize * Math.random()) |
              0;

            const rad =
                opts.balloonBaseRadian +
                opts.balloonAddedRadian * Math.random(),
              vel = opts.balloonBaseVel + opts.balloonAddedVel * Math.random();

            this.vx = Math.cos(rad) * vel;
            this.vy = Math.sin(rad) * vel;
          }
        } else if (this.phase === "balloon") {
          ctx.strokeStyle = this.lightColor.replace("light", String(80));

          if (this.spawning) {
            ++this.tick;
            ctx.fillStyle = this.lightColor.replace("light", String(70));
            ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

            if (this.tick >= (this.spawnTime || 0)) {
              this.tick = 0;
              this.spawning = false;
              this.inflating = true;
            }
          } else if (this.inflating) {
            ++this.tick;

            const proportion = this.inflateTime
              ? this.tick / this.inflateTime
              : 0;
            this.cx = this.x;
            this.cy = this.y - (this.size || 0) * proportion;

            ctx.fillStyle = this.alphaColor.replace("alp", String(proportion));
            ctx.beginPath();
            if (this.size && this.cx !== undefined && this.cy !== undefined) {
              generateBalloonPath(this.cx, this.cy, this.size * proportion);
            }
            ctx.fill();

            if (this.cx !== undefined && this.cy !== undefined) {
              ctx.beginPath();
              ctx.moveTo(this.cx, this.cy);
              ctx.lineTo(this.cx, this.y);
              ctx.stroke();
            }

            ctx.fillStyle = this.lightColor.replace("light", String(70));
            ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

            if (this.tick >= (this.inflateTime || 0)) {
              this.tick = 0;
              this.inflating = false;
            }
          } else {
            if (
              this.cx !== undefined &&
              this.cy !== undefined &&
              this.vx !== undefined &&
              this.vy !== undefined
            ) {
              this.cx += this.vx;
              this.cy += this.vy += opts.upFlow;

              ctx.fillStyle = this.color;
              ctx.beginPath();
              if (this.size) {
                generateBalloonPath(this.cx, this.cy, this.size);
              }
              ctx.fill();

              ctx.beginPath();
              ctx.moveTo(this.cx, this.cy);
              if (this.size) {
                ctx.lineTo(this.cx, this.cy + this.size);
              }
              ctx.stroke();

              ctx.fillStyle = this.lightColor.replace("light", String(70));
              if (this.size) {
                ctx.fillText(
                  this.char,
                  this.cx + this.dx,
                  this.cy + this.dy + this.size
                );
              }

              if (
                this.cy + (this.size || 0) < -hh ||
                this.cx < -hw ||
                this.cy > hw
              ) {
                this.phase = "done";
              }
            }
          }
        }
      }
    }

    function generateBalloonPath(x: number, y: number, size: number) {
      if (!ctx) return;
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(
        x - size / 2,
        y - size / 2,
        x - size / 4,
        y - size,
        x,
        y - size
      );
      ctx.bezierCurveTo(
        x + size / 4,
        y - size,
        x + size / 2,
        y - size / 2,
        x,
        y
      );
    }

    function anim() {
      if (!ctx) return;
      window.requestAnimationFrame(anim);
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, "#250211");
      gradient.addColorStop(0.5, "#1e0133");
      gradient.addColorStop(1, "#16133d");

      // Draw the base gradient
      ctx.fillStyle = gradient;
      // Add a semi-transparent overlay to create fade effect
      ctx.fillRect(0, 0, w, h);

      ctx.translate(hw, hh);
      let done = true;
      for (let l = 0; l < letters.length; ++l) {
        letters[l].step();
        if (letters[l].phase !== "done") done = false;
      }
      ctx.translate(-hw, -hh);
      if (done) for (let l = 0; l < letters.length; ++l) letters[l].reset();
    }

    for (let i = 0; i < opts.strings.length; ++i) {
      for (let j = 0; j < opts.strings[i].length; ++j) {
        letters.push(
          new Letter(
            opts.strings[i][j],
            j * opts.charSpacing +
              opts.charSpacing / 2 -
              (opts.strings[i].length * opts.charSize) / 2,
            i * opts.lineHeight +
              opts.lineHeight / 2 -
              (opts.strings.length * opts.lineHeight) / 2
          )
        );
      }
    }

    anim();

    window.addEventListener("resize", () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      hw = w / 2;
      hh = h / 2;
      ctx.font = `${opts.charSize}px Verdana`;
    });

    const timeout = setTimeout(() => {
      if (data?.showSlideshow) {
        router.push(`/view/${id}/card`);
      }
      else if (data?.message) router.push(`/view/${id}/letter`);
      else clearTimeout(timeout);
    }, timer * 1000);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", () => {});
    };
  }, [
    data,
    opts.balloonAddedInflateTime,
    opts.balloonAddedRadian,
    opts.balloonAddedSize,
    opts.balloonAddedVel,
    opts.balloonBaseInflateTime,
    opts.balloonBaseRadian,
    opts.balloonBaseSize,
    opts.balloonBaseVel,
    opts.balloonSpawnTime,
    opts.charSize,
    opts.charSpacing,
    opts.fireworkAddedLineWidth,
    opts.fireworkAddedReachTime,
    opts.fireworkAddedShards,
    opts.fireworkBaseLineWidth,
    opts.fireworkBaseReachTime,
    opts.fireworkBaseShards,
    opts.fireworkCircleAddedSize,
    opts.fireworkCircleAddedTime,
    opts.fireworkCircleBaseSize,
    opts.fireworkCircleBaseTime,
    opts.fireworkCircleFadeAddedTime,
    opts.fireworkCircleFadeBaseTime,
    opts.fireworkPrevPoints,
    opts.fireworkShardAddedSize,
    opts.fireworkShardAddedVel,
    opts.fireworkShardBaseSize,
    opts.fireworkShardBaseVel,
    opts.fireworkShardPrevPoints,
    opts.fireworkSpawnTime,
    opts.gravity,
    opts.letterContemplatingWaitTime,
    opts.lineHeight,
    opts.strings,
    opts.upFlow,
    router,
    id,
  ]);

  return (
    <canvas
      className='bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400'
      ref={canvasRef}
    />
  );
}

export default Fireworks;
