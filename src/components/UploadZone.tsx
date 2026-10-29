import { useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from 'react';
import { Icon } from './Icon';

interface UploadZoneProps {
  accept?: string;
  description: string;
  disabled?: boolean;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
}

export function UploadZone({
  accept = 'image/jpeg,image/png,image/webp',
  description,
  disabled = false,
  multiple = false,
  onFiles,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const selectFiles = (list: FileList | null) => {
    const files = Array.from(list ?? []);
    if (files.length > 0) onFiles(multiple ? files : files.slice(0, 1));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFiles(event.target.files);
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (!disabled) selectFiles(event.dataTransfer.files);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
      event.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div
      className={`upload-zone ${dragging ? 'upload-zone-dragging' : ''} ${disabled ? 'pointer-events-none opacity-60' : ''}`}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={handleKeyDown}
      onDragEnter={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false);
      }}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept={accept}
        disabled={disabled}
        multiple={multiple}
        onChange={handleChange}
      />
      <span className="upload-icon"><Icon className="size-7" name="upload" /></span>
      <p className="mt-5 text-lg font-bold tracking-tight text-slate-900">
        {multiple ? 'Arrastra tus imágenes aquí' : 'Arrastra tu imagen aquí'}
      </p>
      <p className="mt-1 text-sm text-slate-500">
        {multiple ? 'o haz clic para elegir uno o varios archivos' : 'o haz clic para elegir un archivo'}
      </p>
      <span className="btn btn-secondary mt-6 pointer-events-none">
        {multiple ? 'Seleccionar imágenes' : 'Seleccionar imagen'}
      </span>
      <p className="mt-5 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}
