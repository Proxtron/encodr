import { useRef, useState, type DragEvent } from "react";
import { apiRequest } from "../../utils/client";
import styles from "./UploadVideo.module.css";
import UploadIcon from "../../assets/uploadIcon.svg?react";

interface UploadVideoModalProps {
    onClose: () => void;
    onUploaded?: () => void;
}

const UploadVideoModal = ({ onClose, onUploaded }: UploadVideoModalProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectFile = (selected: File | undefined) => {
        if (!selected) return;
        if (!selected.name.toLowerCase().endsWith(".mp4")) {
            setError("Only .mp4 files are supported.");
            return;
        }
        setError(null);
        setFile(selected);
    };

    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        selectFile(e.dataTransfer.files[0]);
    };

    const upload = async () => {
        if (!file) return;
        if (!title) return setError("Missing video title");

        setUploading(true);
        setError(null);
        try {
            const mimeType = file.type;
            const { presignedUrl } = await apiRequest<{
                presignedUrl: string;
                videoId: number;
            }>("/video", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, mimeType }),
            });

            const res = await fetch(presignedUrl, {
                method: "PUT",
                headers: { "Content-Type": "video/mp4" },
                body: file,
            });
            
            if (!res.ok) throw new Error(`Upload failed (${res.status})`);

            onUploaded?.();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.title}>Upload Video</h2>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Close">
                        &times;
                    </button>
                </div>

                <div
                    className={`${styles.dropzone} ${dragging ? styles.dropzoneActive : ""}`}
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="video/mp4,.mp4"
                        className={styles.hiddenInput}
                        onChange={(e) => selectFile(e.target.files?.[0])}
                    />
                    <UploadIcon className={styles.uploadIcon}/>
                    {file ? (
                        <p className={styles.dropPrimary}>{file.name}</p>
                    ) : (
                        <>
                            <p className={styles.dropPrimary}>Drop your video here or click to browse</p>
                            <p className={styles.dropSecondary}>MP4 only</p>
                        </>
                    )}
                </div>

                <label className={styles.label}>Title</label>
                <input
                    className={styles.input}
                    placeholder="Enter video title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                {error && <p className={styles.error}>{error}</p>}

                <button
                    className={styles.uploadButton}
                    onClick={upload}
                    disabled={!file || uploading}
                >
                    {uploading ? "Uploading…" : "Upload"}
                </button>
            </div>
        </div>
    );
};

export default UploadVideoModal;
