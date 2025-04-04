import React, { useState, useRef, useCallback } from 'react';
import { X, Upload, File, AlertTriangle } from 'lucide-react';

interface FileUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (files: File[]) => Promise<void>;
    maxFileSize: number; // Taille maximale en Mo
    maxFilesCount: number; // Nombre maximum de fichiers
    title?: string;
    supportedFileTypes?: string[];
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
    isOpen,
    onClose,
    onUpload,
    maxFileSize = 10, // 10 Mo par défaut
    maxFilesCount = 3, // 3 fichiers maximum par défaut
    title = "Téléversement de fichiers",
    supportedFileTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.mp4', '.zip']
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Convertir les Mo en octets
    const maxSizeBytes = maxFileSize * 1024 * 1024;

    // Calculer la taille totale
    const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

    // Gérer la sélection de fichiers
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            validateAndAddFiles(Array.from(e.target.files));
        }
    };

    // Validation des fichiers
    const validateAndAddFiles = (filesToAdd: File[]) => {
        setError(null);

        // Vérifier le nombre total de fichiers
        if (selectedFiles.length + filesToAdd.length > maxFilesCount) {
            setError(`Vous ne pouvez pas téléverser plus de ${maxFilesCount} fichiers à la fois.`);
            return;
        }

        // Vérifier la taille totale des fichiers
        const newTotalSize = totalSize + filesToAdd.reduce((acc, file) => acc + file.size, 0);
        if (newTotalSize > maxSizeBytes) {
            setError(`La taille totale des fichiers ne doit pas dépasser ${maxFileSize} Mo.`);
            return;
        }

        // Vérifier l'extension de chaque fichier
        const fileExtensions = supportedFileTypes.map(ext => ext.toLowerCase());
        const invalidFiles = filesToAdd.filter(file => {
            const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
            return !fileExtensions.includes(extension);
        });

        if (invalidFiles.length > 0) {
            setError(`Types de fichiers non supportés : ${invalidFiles.map(f => f.name).join(', ')}`);
            return;
        }

        // Ajouter les fichiers valides
        setSelectedFiles(prev => [...prev, ...filesToAdd]);
    };

    // Supprimer un fichier
    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setError(null);
    };

    // Gérer le drag & drop
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            validateAndAddFiles(Array.from(e.dataTransfer.files));
        }
    }, []);

    // Déclencher l'input de fichier
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Soumettre les fichiers
    const handleSubmit = async () => {
        if (selectedFiles.length === 0) {
            setError('Veuillez sélectionner au moins un fichier.');
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            await onUpload(selectedFiles);
            setSelectedFiles([]);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du téléversement.');
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden">
                {/* En-tête */}
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        disabled={isUploading}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Contenu */}
                <div className="p-4 overflow-y-auto max-h-[60vh]">
                    {/* Zone de drop */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-4 text-center ${dragActive
                                ? "border-orange-500 bg-orange-50 dark:bg-orange-900/10"
                                : "border-gray-300 dark:border-gray-700"
                            }`}
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={triggerFileInput}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            multiple
                            accept={supportedFileTypes.join(',')}
                            disabled={isUploading}
                        />

                        <Upload className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" />
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                            Glissez-déposez vos fichiers ici ou <span className="text-orange-500 font-medium">cliquez pour parcourir</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {`Types de fichiers supportés: ${supportedFileTypes.join(', ')}`}<br />
                            {`Taille maximale: ${maxFileSize} Mo - Maximum ${maxFilesCount} fichiers`}
                        </p>
                    </div>

                    {/* Liste des fichiers sélectionnés */}
                    {selectedFiles.length > 0 && (
                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                    Fichiers sélectionnés ({selectedFiles.length})
                                </h4>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {totalSizeMB} Mo / {maxFileSize} Mo
                                </span>
                            </div>
                            <div className="space-y-2">
                                {selectedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2"
                                    >
                                        <div className="flex items-center space-x-2 truncate">
                                            <File className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                                {file.name}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                ({(file.size / (1024 * 1024)).toFixed(2)} Mo)
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                                            disabled={isUploading}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Message d'erreur */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 rounded-lg flex items-start gap-2 text-sm">
                            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                {/* Pied de modal */}
                <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        disabled={isUploading}
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isUploading || selectedFiles.length === 0}
                        className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2
              ${isUploading || selectedFiles.length === 0
                                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                                : "bg-orange-500 hover:bg-orange-600"
                            }`}
                    >
                        {isUploading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Téléversement...
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4" />
                                Téléverser
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FileUploadModal;