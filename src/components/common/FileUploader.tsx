
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X } from 'lucide-react';
import { useSupabaseUpload } from '@/hooks/useSupabaseQuery';

type FileUploaderProps = {
  bucketName: string;
  folderPath?: string;
  fileTypes?: string[];
  maxSize?: number; // en MB
  onFileUploaded: (url: string) => void;
  currentFileUrl?: string;
};

const FileUploader: React.FC<FileUploaderProps> = ({
  bucketName,
  folderPath = '',
  fileTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  maxSize = 5, // 5MB por defecto
  onFileUploaded,
  currentFileUrl
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentFileUrl || null);
  
  const uploadMutation = useSupabaseUpload();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    
    if (!selectedFile) {
      return;
    }
    
    // Validar el tipo de archivo
    if (!fileTypes.includes(selectedFile.type)) {
      setError(`Tipo de archivo no admitido. Tipos admitidos: ${fileTypes.join(', ')}`);
      return;
    }
    
    // Validar el tamaño del archivo
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`El archivo es demasiado grande. Tamaño máximo: ${maxSize}MB`);
      return;
    }
    
    setError(null);
    setFile(selectedFile);
    
    // Crear una vista previa si es una imagen
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // Si es otro tipo de archivo (por ejemplo, PDF), mostrar un icono genérico
      setPreview(null);
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setProgress(10);
    
    try {
      // Generar un nombre de archivo único
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;
      
      // Simular progreso mientras se sube
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);
      
      // Subir archivo
      await uploadMutation.mutateAsync({
        bucketName,
        filePath,
        file
      });
      
      clearInterval(interval);
      setProgress(100);
      
      // Obtener URL pública y notificar al componente padre
      const publicUrl = `${bucketName}/${filePath}`;
      onFileUploaded(publicUrl);
      
      // Limpiar después de unos segundos
      setTimeout(() => {
        setProgress(0);
      }, 1000);
      
    } catch (error) {
      setError('Error al subir el archivo. Inténtalo de nuevo.');
      setProgress(0);
    }
  };
  
  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
    setError(null);
    onFileUploaded('');
  };
  
  const isImage = file?.type.startsWith('image/') || (preview && currentFileUrl?.match(/\.(jpeg|jpg|gif|png)$/i));
  
  return (
    <div className="space-y-4">
      {/* Vista previa */}
      {preview && (
        <div className="relative border rounded-md overflow-hidden">
          {isImage ? (
            <img 
              src={preview} 
              alt="Vista previa" 
              className="h-48 w-full object-contain bg-muted/20"
            />
          ) : (
            <div className="h-32 flex items-center justify-center bg-muted/20">
              <div className="text-center p-4">
                <FileIcon fileType={file?.type || currentFileUrl?.split('.').pop() || ''} />
                <p className="text-sm mt-2 truncate max-w-full">
                  {file?.name || currentFileUrl?.split('/').pop() || 'Archivo'}
                </p>
              </div>
            </div>
          )}
          
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute top-2 right-2 h-7 w-7"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Selector de archivo */}
      {!file && !preview && (
        <div className="border border-dashed border-border rounded-md p-6 text-center bg-muted/20">
          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground mb-2">
            Arrastra y suelta un archivo aquí, o haz click para seleccionar uno
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Formatos permitidos: {fileTypes.map(type => type.replace('image/', '.')).join(', ')} | Máximo: {maxSize}MB
          </p>
          <input 
            type="file" 
            className="hidden" 
            onChange={handleFileChange}
            accept={fileTypes.join(',')}
            id="file-upload"
          />
          <Button 
            variant="outline" 
            asChild
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              Seleccionar archivo
            </label>
          </Button>
        </div>
      )}
      
      {/* Mensaje de error */}
      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}
      
      {/* Barra de progreso */}
      {progress > 0 && (
        <Progress value={progress} className="h-2" />
      )}
      
      {/* Botón de subida */}
      {file && !error && progress === 0 && (
        <Button onClick={handleUpload}>
          Subir archivo
        </Button>
      )}
    </div>
  );
};

// Componente auxiliar para mostrar un icono según el tipo de archivo
const FileIcon = ({ fileType }: { fileType: string }) => {
  // Simplificado para mostrar solo un icono de archivo genérico
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-auto text-muted-foreground"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
};

export default FileUploader;
