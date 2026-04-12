declare module "gif-encoder-2" {
  import { Readable } from "stream";

  interface GIFEncoderOut {
    getData(): Uint8Array;
  }

  class GIFEncoder {
    out: GIFEncoderOut;
    constructor(
      width: number,
      height: number,
      algorithm?: string,
      useOptimizer?: boolean,
      totalFrames?: number
    );
    setDelay(delay: number): void;
    setRepeat(repeat: number): void;
    setQuality(quality: number): void;
    setTransparent(color: number): void;
    start(): void;
    addFrame(ctx: CanvasRenderingContext2D): void;
    finish(): void;
    createReadStream(): Readable;
  }

  export = GIFEncoder;
}
