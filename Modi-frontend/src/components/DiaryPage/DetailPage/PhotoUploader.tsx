import { useRef } from "react";
import styles from "./PhotoUploader.module.css";

interface PhotoUploaderProps {
  image: string | null;
  onFileSelect: (file: File) => void;
}

const PhotoUploader = ({ image, onFileSelect }: PhotoUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileSelect(file);
  };

  return (
    <div
      className={styles.photo_upload_box}
      onClick={() => fileInputRef.current?.click()}
    >
      {image ? (
        <img src={image} alt="preview" className={styles.preview_image} />
      ) : (
        <div className={styles.upload_placeholder}>
          <img src="/icons/plus.svg" alt="plus" />
          <span className={styles.label}>사진 첨부</span>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default PhotoUploader;
