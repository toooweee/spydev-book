import { useRef } from "react";
import { Box, Card, CardContent, Button, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useFileChange } from "../actionPages/MemoryFormPageActions";

const UploadPhoto = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { handleFileChange, photoPreview } = useFileChange();

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer.files.length > 0) {
            const file = event.dataTransfer.files[0];
            if (file.type.startsWith("image/")) {
                handleFileChange({ target: { files: [file] } } as any);
            }
        }
    };

    return (
        <Card
            sx={{
                maxWidth: 300,
                height: '100%',
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "2px dashed #ccc",
                cursor: "pointer",
                "&:hover": { borderColor: "#f44336" }
            }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <CardContent sx={{ textAlign: "center" }}>
                {photoPreview ? (
                    <Box
                        component="img"
                        src={photoPreview}
                        alt="Preview"
                        sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                    />
                ) : (
                    <>
                        <CloudUploadIcon sx={{ fontSize: 48, color: "#f44336" }} />
                        <Typography variant="body1" sx={{ mt: 1, color: "#555" }}>
                            Загрузите фотографию героя
                        </Typography>
                        <Button variant="contained" color="error" sx={{ mt: 2 }}>
                            Выберите файл
                        </Button>
                        <Typography variant="caption" sx={{ display: "block", mt: 1, color: "#777" }}>
                            К загрузке принимаются файлы до 5МБ формата: jpg, gif, png
                        </Typography>
                    </>
                )}
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/gif"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
            </CardContent>
        </Card>
    );
};

export default UploadPhoto;
