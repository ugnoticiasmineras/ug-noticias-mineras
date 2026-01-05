// components/RadioPlayer.js
import { useState, useRef, useEffect } from 'react';

const RadioPlayer = ({ streamUrl, logoUrl, stationName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.warn("Auto-play bloqueado por el navegador. El usuario debe interactuar primero.");
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-blue-100 dark:border-blue-900 p-4">
      <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">{stationName}</h3>
      
      {/* Logo */}
      {logoUrl && (
        <img 
          src={logoUrl} 
          alt={stationName}
          className="w-16 h-16 rounded-full mx-auto mb-4"
        />
      )}

      {/* Controles */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={togglePlay}
          className={`p-2 rounded-full ${
            isPlaying 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-colors`}
          aria-label={isPlaying ? "Pausar" : "Reproducir"}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        <span className="text-sm text-gray-600 dark:text-gray-300">
          {isPlaying ? 'En vivo' : 'Detenido'}
        </span>

        {/* Volumen */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-20 h-2 bg-blue-300 rounded-full appearance-none cursor-pointer slider"
        />
      </div>

      {/* Audio element (oculto) */}
      <audio ref={audioRef} src={streamUrl} loop />
    </div>
  );
};

export default RadioPlayer;