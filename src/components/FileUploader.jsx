import { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { CloudUpload, FileText, File, FileArchive, X, Sparkles, Upload } from 'lucide-react';

const FILE_TYPES = {
    'application/pdf': { label: 'PDF', color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30', icon: FileText },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { label: 'DOCX', color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30', icon: File },
    'application/zip': { label: 'ZIP', color: 'text-amber-505 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30', icon: FileArchive },
    'application/x-zip-compressed': { label: 'ZIP', color: 'text-amber-505 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30', icon: FileArchive },
};

const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.zip'];

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const FileUploader = ({ onUploadSuccess, onRemoveFile, theme, userName = 'student' }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadState, setUploadState] = useState('idle'); // idle | uploading | success | error
    const [generatedLink, setGeneratedLink] = useState('');
    const fileInputRef = useRef(null);

    const validateFile = (file) => {
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        if (!ACCEPTED_EXTENSIONS.includes(ext)) {
            return `Invalid file type. Only ${ACCEPTED_EXTENSIONS.join(', ')} files are accepted.`;
        }
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
            return 'File exceeds maximum size of 50MB.';
        }
        return null;
    };

    const simulateUpload = (file) => {
        setUploadState('uploading');
        setUploadProgress(0);
        let progress = 0;
        const interval = setInterval(() => {
            const increment = Math.random() * 15 + 5;
            progress = Math.min(progress + increment, 100);
            setUploadProgress(Math.round(progress));
            if (progress >= 100) {
                clearInterval(interval);
                setUploadState('success');
                const simulatedLink = `https://eduflow.storage/${userName.replace(/\s/g, '-').toLowerCase()}/${Date.now()}/${file.name}`;
                setGeneratedLink(simulatedLink);
                if (onUploadSuccess) onUploadSuccess(simulatedLink);
            }
        }, 200);
    };

    const handleFileSelect = (file) => {
        const error = validateFile(file);
        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid File',
                text: error,
                background: theme === 'dark' ? '#1e293b' : '#fff',
                color: theme === 'dark' ? '#e2e8f0' : '#1e293b'
            });
            return;
        }
        setSelectedFile(file);
        setUploadState('idle');
        setUploadProgress(0);
        setGeneratedLink('');
        setTimeout(() => simulateUpload(file), 400);
    };

    const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    const handleInputChange = (e) => {
        const file = e.target.files[0];
        if (file) handleFileSelect(file);
    };

    const removeFile = () => {
        setSelectedFile(null);
        setUploadState('idle');
        setUploadProgress(0);
        setGeneratedLink('');
        if (onRemoveFile) onRemoveFile();
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const getFileInfo = (file) => {
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        if (ext === '.pdf') return FILE_TYPES['application/pdf'];
        if (ext === '.docx') return FILE_TYPES['application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (ext === '.zip') return FILE_TYPES['application/x-zip-compressed'];
        return { label: ext.toUpperCase().slice(1), color: 'text-slate-500 bg-slate-50 dark:bg-slate-500/10 border-slate-200 dark:border-slate-550/35', icon: File };
    };

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-3">
                <Upload className="w-4 h-4 text-indigo-500" />
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">File Upload</span>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full ml-auto">PDF · DOCX · ZIP</span>
            </div>

            {!selectedFile ? (
                <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-8 text-center group
                        ${isDragging
                            ? 'border-indigo-500 bg-indigo-55/50 dark:bg-indigo-500/10 scale-[1.02]'
                            : 'border-slate-205 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:border-indigo-305 dark:hover:border-indigo-600 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5'
                        }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx,.zip"
                        onChange={handleInputChange}
                        className="hidden"
                    />

                    <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-all duration-300
                        ${isDragging
                            ? 'bg-indigo-100 dark:bg-indigo-500/20 scale-110'
                            : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20'
                        }`}
                    >
                        <CloudUpload className={`w-8 h-8 transition-colors duration-300 ${isDragging ? 'text-indigo-500' : 'text-slate-400 dark:text-slate-505 group-hover:text-indigo-500'}`} />
                    </div>

                    <p className="text-sm font-bold text-slate-705 dark:text-slate-300 mb-1">
                        {isDragging ? 'Drop your file here' : 'Drag & drop your file here'}
                    </p>
                    <p className="text-xs text-slate-405 dark:text-slate-500 font-medium">
                        or <span className="text-indigo-500 dark:text-indigo-400 font-bold">browse from computer</span>
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-3 font-semibold">Maximum file size: 50MB</p>

                    {isDragging && (
                        <div className="absolute inset-0 rounded-2xl border-2 border-indigo-500 animate-pulse pointer-events-none"></div>
                    )}
                </div>
            ) : (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 overflow-hidden transition-all duration-300">
                    <div className="p-5">
                        <div className="flex items-center gap-4">
                            {(() => {
                                const info = getFileInfo(selectedFile);
                                const IconComp = info.icon;
                                return (
                                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${info.color}`}>
                                        <IconComp className="w-6 h-6" />
                                    </div>
                                );
                            })()}

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{selectedFile.name}</p>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-505">
                                        {getFileInfo(selectedFile).label}
                                    </span>
                                    <span className="text-[10px] text-slate-300 dark:text-slate-600">•</span>
                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550">
                                        {formatFileSize(selectedFile.size)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {uploadState === 'success' && (
                                    <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                                        <X className="w-4 h-4 text-emerald-505 hidden" />
                                        <span className="text-emerald-500 text-xs font-black">✓</span>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={removeFile}
                                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-rose-500/20 flex items-center justify-center text-slate-405 hover:text-rose-500 transition-all cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {(uploadState === 'uploading' || uploadState === 'success') && (
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                        {uploadState === 'uploading' ? 'Processing...' : 'Upload Complete'}
                                    </span>
                                    <span className={`text-xs font-black ${uploadState === 'success' ? 'text-emerald-500' : 'text-indigo-500'}`}>
                                        {uploadProgress}%
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-305 ease-out ${
                                            uploadState === 'success'
                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                                : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                                        }`}
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {uploadState === 'success' && generatedLink && (
                            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-500/5 rounded-xl border border-emerald-105 dark:border-emerald-500/20">
                                <div className="flex items-center gap-2 mb-1">
                                    <Sparkles className="w-3 h-3 text-emerald-555" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-450">Secure Link Generated</span>
                                </div>
                                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-mono truncate">{generatedLink}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
