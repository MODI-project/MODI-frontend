/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "exif-js" {
  export function getData(
    img: HTMLImageElement,
    callback: (this: HTMLImageElement) => void
  ): void;

  export function getTag(img: HTMLImageElement, tag: string): any;

  const EXIF: {
    getData: typeof getData;
    getTag: typeof getTag;
  };

  export default EXIF;
}
