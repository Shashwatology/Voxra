import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Check, X, AlertCircle } from 'lucide-react';

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transcript: string) => void;
}

export const VoiceInputModal: React.FC<VoiceInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API availability
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setErrorMsg('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Optimized for Indian English and natural terms

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg(null);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMsg('Microphone permission was denied. Please allow microphone access in your browser settings.');
        } else {
          setErrorMsg(`Voice input error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      setIsSupported(false);
      setErrorMsg('Failed to initialize speech recognition engine.');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) return;
    setErrorMsg(null);
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn('Recognition already started or error:', e);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (e) {}
    setIsListening(false);
  };

  const handleConfirmAndSend = () => {
    const trimmed = transcript.trim();
    if (trimmed) {
      onSubmit(trimmed);
      onClose();
      setTranscript('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-xl max-w-md w-full p-6 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${isListening ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 animate-pulse' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Voice Question Input</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Speak naturally in English or Hinglish</p>
            </div>
          </div>
          <button
            onClick={() => { stopListening(); onClose(); }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning or Error State */}
        {errorMsg && (
          <div className="flex items-start space-x-2 p-3 text-xs bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-900/50">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Listening Animation and Control */}
        <div className="flex flex-col items-center justify-center py-4 space-y-3">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={!isSupported}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md focus:outline-none focus:ring-4 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white ring-red-200 dark:ring-red-900 animate-pulse'
                : 'bg-teal-600 hover:bg-teal-700 text-white ring-teal-200 dark:ring-teal-900'
            }`}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
          </button>
          <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
            {isListening ? 'Listening... Click to stop' : 'Click microphone to record'}
          </span>
        </div>

        {/* Transcript Preview & Edit Area */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex justify-between">
            <span>Recognized Transcript Preview:</span>
            <span className="text-slate-400 font-normal">Editable before submit</span>
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your spoken words will appear here. You can edit them before asking..."
            rows={3}
            className="w-full text-sm p-3 rounded-lg border border-border-light dark:border-border-dark bg-canvas-light dark:bg-canvas-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end space-x-2 pt-2">
          <button
            onClick={() => { stopListening(); onClose(); }}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmAndSend}
            disabled={!transcript.trim()}
            className="px-4 py-2 text-xs font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 shadow-sm"
          >
            <Check className="w-4 h-4" />
            <span>Confirm & Ask Enquiry</span>
          </button>
        </div>
      </div>
    </div>
  );
};

