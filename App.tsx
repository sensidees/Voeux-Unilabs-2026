import React, { useState, useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const VIDEO_ID = 'ER-qkekcKb8';

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
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

    function initPlayer() {
      if (playerRef.current) return;
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          fs: 0,
          disablekb: 1,
          showinfo: 0, // Bien que déprécié, on le garde en résiduel
        },
        events: {
          onStateChange: onPlayerStateChange,
        },
      });
    }
  }, [onPlayerStateChange]);

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
      
      {/* Header & Logo - Système de Fallback de Casse */}
      <header className="pt-12 pb-10 md:pt-20 md:pb-16 flex justify-center w-full animate-fade-in">
        <img 
          src="/logo-unilabs.png" 
          alt="Unilabs" 
          className="w-48 md:w-64 h-auto object-contain drop-shadow-2xl"
          onError={(e) => {
            const img = e.currentTarget;
            // Si /Logo-Unilabs.png (Maj) échoue, on tente /logo-unilabs.png (Min)
            if (img.src.includes('logo-unilabs.png')) {
              img.src = '/logo-unilabs.png';
            } else {
              // Si tout échoue, logo officiel distant pour le branding
              img.src = 'https://unilabs.fr/themes/unilabs/images/logo-unilabs.svg';
            }
          }}
        />
      </header>

      {/* Main Video Section */}
      <main className="w-full max-w-[1000px] px-4 md:px-0 opacity-0 animate-fade-in [animation-delay:400ms] [animation-fill-mode:forwards]">
        <div className="relative aspect-video bg-[#050505] rounded-xl overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.05)] border border-white/5">
          
          {/* ZOOM AGRESSIF (1.25) pour masquer la photo de profil en haut à gauche */}
          <div className="absolute inset-0 w-full h-full scale-[1.25] origin-center pointer-events-none">
            <div id="youtube-player" className="w-full h-full"></div>
          </div>

          {/* BOUCLIER ANTI-HOVER : Empêche YouTube de détecter la souris */}
          <div className="absolute inset-0 z-10 w-full h-full bg-transparent"></div>

          {/* BOUTONS (z-20 pour être au-dessus du bouclier) */}
          {!isPlaying && !isEnded && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all duration-1000">
              <button
                onClick={handleStart}
                className="group relative flex items-center justify-center w-24 h-24 rounded-full bg-white text-black transition-all duration-500 hover:scale-105 shadow-2xl"
              >
                <div className="absolute inset-0 rounded-full border border-white/50 group-hover:animate-ping opacity-50"></div>
                <svg className="w-10 h-10 ml-1.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          )}

          {isEnded && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 animate-fade-in">
              <button onClick={handleReplay} className="group flex flex-col items-center gap-5">
                <div className="w-16 h-16 flex items-center justify-center border border-white/10 rounded-full group-hover:bg-white/5">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </div>
                <span className="text-[9px] font-bold tracking-[0.6em] uppercase text-white/40 group-hover:text-white transition-colors">Revoir les vœux</span>
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-auto py-12 opacity-0 animate-fade-in [animation-delay:800ms] [animation-fill-mode:forwards]">
        <p className="text-[9px] text-gray-500 tracking-[0.8em] uppercase font-medium">
          Unilabs Diagnostics &bull; 2026
        </p>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default App;
