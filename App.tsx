import React, { useState, useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const VIDEO_ID = 'LdqUvcMYn8o';

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const playerRef = useRef<any>(null);

  const onPlayerStateChange = useCallback((event: any) => {
    if (event.data === 0) {
      setIsEnded(true);
      setIsPlaying(false);
    } else if (event.data === 1) {
      setIsPlaying(true);
      setIsEnded(false);
    }
  }, []);

  const initPlayer = useCallback(() => {
    if (playerRef.current || !window.YT) return;
    
    playerRef.current = new window.YT.Player('youtube-player', {
      videoId: VIDEO_ID,
      playerVars: {
        autoplay: 0,
        controls: 0,
        modestbranding: 0,
        rel: 0,
        iv_load_policy: 3,
        fs: 0,
        disablekb: 1,
        showinfo: 0,
      },
      events: {
        onStateChange: onPlayerStateChange,
        onReady: () => setApiReady(true),
      },
    });
  }, [onPlayerStateChange]);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => initPlayer();
    } else {
      initPlayer();
    }
  }, [initPlayer]);

  const handleStart = () => {
    if (playerRef.current) {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const handleReplay = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.playVideo();
      setIsEnded(false);
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center overflow-hidden font-sans">
      
      {/* Header & Logo - Gardé tel quel car il fonctionne */}
      <header className="pt-12 pb-10 md:pt-20 md:pb-16 flex justify-center w-full animate-fade-in">
        <img 
          src="/logo-unilabs.png" 
          alt="Unilabs" 
          className="w-48 md:w-64 h-auto object-contain drop-shadow-2xl"
          onError={(e) => {
            e.currentTarget.onerror = null; 
            e.currentTarget.src = 'https://unilabs.fr/themes/unilabs/images/logo-unilabs.svg';
          }}
        />
      </header>

      {/* Main Video Section - Suppression de opacity-0 pour test direct */}
      <main className="w-full max-w-[1000px] px-4 md:px-0 animate-fade-in">
        <div className="relative aspect-video bg-[#050505] rounded-xl overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.05)] border border-white/5">
          
          {/* LE CROP : Scale 1.25 avec origin-center */}
          <div className="absolute inset-0 w-full h-full scale-[1] origin-center pointer-events-none">
            <div id="youtube-player" className="w-full h-full"></div>
          </div>

          {/* BOUCLIER : Div transparente */}
          <div className="absolute inset-0 z-10 w-full h-full bg-transparent"></div>

          {/* OVERLAY DE DÉPART */}
          {!isPlaying && !isEnded && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
              <button
                onClick={handleStart}
                className="group relative flex items-center justify-center w-24 h-24 rounded-full bg-white text-black transition-all duration-500 hover:scale-105 shadow-2xl"
                aria-label="Lancer la vidéo"
              >
                <div className="absolute inset-0 rounded-full border border-white/50 group-hover:animate-ping opacity-50"></div>
                <svg className="w-10 h-10 ml-1.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          )}

          {/* OVERLAY DE FIN */}
          {isEnded && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90">
              <button onClick={handleReplay} className="group flex flex-col items-center gap-5">
                <div className="w-16 h-16 flex items-center justify-center border border-white/10 rounded-full group-hover:bg-white/5 transition-colors">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </div>
                <span className="text-[9px] font-bold tracking-[0.6em] uppercase text-white/40 group-hover:text-white">Revoir les vœux</span>
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-auto py-12 animate-fade-in">
        <p className="text-[9px] text-gray-500 tracking-[0.8em] uppercase font-medium">
          Unilabs &bull; 2026
        </p>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
