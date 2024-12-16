import { UploadCloud, X } from 'lucide-react';
import { useState } from 'react';

interface ImageUploadProps {
  currentImage?: string | null;
  onImageChange: (image: string | null) => void;
}

export default function ImageUpload({ currentImage, onImageChange }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, загрузите изображение');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Размер изображения не должен превышать 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onImageChange(null);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage}
            alt="Product"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center
            ${dragActive 
              ? 'border-[#ffd700] bg-[#ffd700]/10' 
              : 'border-[#ffd700]/20 hover:border-[#ffd700]/40'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center">
            <UploadCloud className="w-10 h-10 text-[#ffd700]/60 mb-2" />
            <p className="text-sm text-gray-400">
              Перетащите изображение сюда или нажмите для выбора
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG до 5MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}