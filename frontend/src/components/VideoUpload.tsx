import React, { useState, useRef } from 'react';
import { UploadCloud, Video, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';
import { apiRequest } from '../services/api';

interface MockResponse {
  result: 'fake' | 'real';
  confidence: number;
  model_results: {
    face_model: number;
    temporal_model: number;
  };
}

export default function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<MockResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile: File) => {
    // Validate file type is video
    if (!selectedFile.type.startsWith('video/')) {
      setError('Only video files are supported for analysis.');
      setFile(null);
      setResponse(null);
      return;
    }
    setError(null);
    setFile(selectedFile);
    setResponse(null);
  };

  const triggerUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    const formData = new FormData();
    formData.append('video', file);

    try {
      // POST the uploaded video to our new backend route
      const res = await apiRequest('/api/detection/video', {
        method: 'POST',
        body: formData,
      });

      console.log('Video upload response:', res);
      setResponse(res);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.message || 'An error occurred during video upload.');
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setResponse(null);
    setError(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2 mb-4">
        <Video className="h-5 w-5 text-blue-500" />
        <span>Hardware Forensic Video Intake</span>
      </h3>

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-blue-500 bg-blue-500/10 text-blue-400'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-500'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="video/*"
            onChange={handleFileChange}
          />
          <UploadCloud className="h-10 w-10 mx-auto text-blue-500 mb-3" />
          <span className="block text-sm font-bold text-slate-700 dark:text-slate-300">
            Drag & drop target video or click to select
          </span>
          <span className="block text-xs text-slate-400 mt-1">
            Supports MP4, MOV, MKV files up to 50MB
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="flex items-center space-x-3 overflow-hidden">
              <Video className="h-6 w-6 text-slate-400 flex-shrink-0" />
              <div className="text-left overflow-hidden">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-slate-400">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!loading && !response && (
              <button
                onClick={resetUpload}
                className="text-xs text-rose-500 hover:text-rose-600 font-bold px-2 py-1"
              >
                Remove
              </button>
            )}
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-xl text-left">
              {error}
            </div>
          )}

          {!response && (
            <button
              onClick={triggerUpload}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold text-sm py-2.5 px-4 rounded-xl transition-colors"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Processing Analysis...</span>
                </>
              ) : (
                <span>Analyze Specimen</span>
              )}
            </button>
          )}

          {response && (
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2 text-left">
                {response.result === 'fake' ? (
                  <ShieldAlert className="h-5 w-5 text-rose-500" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                )}
                <span className="text-sm font-black">
                  Prediction Outcome: 
                  <span className={`ml-1.5 uppercase ${response.result === 'fake' ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {response.result}
                  </span>
                </span>
              </div>

              {/* Graphical representation of scores */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-950/40 p-4 border border-slate-200 dark:border-slate-800 rounded-xl text-left">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                    <span>Overall Synthetic Confidence</span>
                    <span>{(response.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        response.result === 'fake' ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${response.confidence * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Face Mesh Score</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {(response.model_results.face_model * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Temporal Pattern Score</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {(response.model_results.temporal_model * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={resetUpload}
                className="w-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm py-2.5 px-4 rounded-xl transition-colors"
              >
                Upload New Specimen
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
