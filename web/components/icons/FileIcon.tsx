import {
    File,
    FileText,
    FileImage,
    FileCode,
    FileArchive,
    FileAudio,
    FileVideo,
    FileJson,
    Folder
} from 'lucide-react';

interface FileIconProps extends React.ComponentProps<'svg'> {
    mime?: string | null;
    isFolder?: boolean;
    size?: number | string;
}

export function FileIcon({ mime, isFolder, className, size, ...props }: FileIconProps) {
    if (isFolder) {
        return <Folder className={`text-blue-400 ${className}`} size={size} {...props} />;
    }

    if (!mime) return <File className={className} size={size} {...props} />;

    if (mime.startsWith('image/')) return <FileImage className={`text-purple-400 ${className}`} size={size} {...props} />;
    if (mime.startsWith('video/')) return <FileVideo className={`text-pink-400 ${className}`} size={size} {...props} />;
    if (mime.startsWith('audio/')) return <FileAudio className={`text-orange-400 ${className}`} size={size} {...props} />;

    if (mime.includes('pdf')) return <FileText className={`text-red-400 ${className}`} size={size} {...props} />;
    if (mime.includes('zip') || mime.includes('tar') || mime.includes('rar')) return <FileArchive className={`text-yellow-500 ${className}`} size={size} {...props} />;

    if (mime.includes('javascript') || mime.includes('typescript') || mime.includes('html') || mime.includes('css')) {
        return <FileCode className={`text-green-400 ${className}`} size={size} {...props} />;
    }

    if (mime.includes('json')) return <FileJson className={`text-yellow-400 ${className}`} size={size} {...props} />;

    if (mime.startsWith('text/')) return <FileText className={`text-neutral-300 ${className}`} size={size} {...props} />;

    return <File className={className} size={size} {...props} />;
}
export function FolderIcon(props: React.ComponentProps<'svg'>) {
    return <Folder className="text-blue-400" {...props} />;
}
