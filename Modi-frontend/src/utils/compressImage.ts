export async function compressImage(
  file: File,
  maxWidth = 1920,
  quality = 0.8
): Promise<File> {
  // 이미 JPEG/PNG만 처리 (필요 시 heic 등 추가)
  if (!/^image\/(jpeg|png|jpg)$/i.test(file.type)) return file;

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const imgEl = new Image();
    imgEl.onload = () => resolve(imgEl);
    imgEl.onerror = reject;
    imgEl.src = URL.createObjectURL(file);
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const scale = Math.min(1, maxWidth / img.naturalWidth);
  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  const type = "image/jpeg"; // 전송은 jpeg로 통일(용량↓). PNG 유지 원하면 분기처리
  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b as Blob), type, quality)
  );

  // File로 재래핑(파일명 유지 + 확장자는 jpg로 바꿔줌)
  const newName = file.name.replace(/\.\w+$/, ".jpg");
  return new File([blob], newName, { type, lastModified: Date.now() });
}
