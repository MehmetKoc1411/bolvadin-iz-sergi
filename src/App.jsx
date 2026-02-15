import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';

// --- ASSETS (Müzikler ve Afiş src içinde kalabilir) ---
import poster from './assets/poster.png'; 
import music1 from './assets/pirates-cello.mp3'; 
import music2 from './assets/despacito-cello.mp3';
import music3 from './assets/halvorsen-piano.mp3';
import music4 from './assets/schubert-serenade.mp3'; 

// --- VERİ YAPISI (16 ESER - Public Klasörüne Göre) ---
const resimler = [
  { id: 'kirkgoz-kopru', name: 'Kırkgöz Köprüsü', file: 'kirkgoz-kopru.jpeg', desc: 'Selçuklu ve Osmanlı mirası, Akarçay üzerindeki kadim yolun en zarif halkası.' },
  { id: 'ataturk-evi', name: 'Çakmaklı Konağı', file: 'ataturk-evi.jpeg', desc: 'Gazi Mustafa Kemal Atatürk’ün Bolvadin ziyareti sırasında konakladığı, Milli Mücadele ruhunu taşıyan tarihi yapı.' },
  { id: 'eber-sarisi', name: 'Eber Sarısı', file: 'eber-sarisi.jpeg', desc: 'Dünyada sadece Eber Gölü çevresinde yetişen, Bolvadin’in endemik mucizesi ve doğa mirası.' },
  { id: 'bolvadin-hashas', name: 'Bolvadin Haşhaşı', file: 'bolvadin-hashas.jpeg', desc: 'Topraklarımızın beyaz ve mor çiçeklerle bezeli bereket simgesi, kadim bir tarım mirası.' },
  { id: 'bolvadin-kaymak', name: 'Manda Kaymağı', file: 'bolvadin-kaymak.jpeg', desc: 'Bolvadin’in dünyaca ünlü, geleneksel yöntemlerle hazırlanan saf ve eşsiz lezzeti.' },
  { id: 'bolvadin-termal', name: 'Heybeli Termal', file: 'bolvadin-termal.jpeg', desc: 'Kadimden bugüne şifalı suları ile derman kaynağı olan bölgenin termal kalbi.' },
  { id: 'bukme', name: 'Bolvadin Bükmesi', file: 'bukme.jpeg', desc: 'Mercimekli ve çıtır dokusuyla Bolvadin mutfağının tescilli ve en sevilen lezzeti.' },
  { id: 'eber-golu', name: 'Eber Gölü', file: 'eber-golu.jpeg', desc: 'Eşsiz biyoçeşitliliği ve doğal güzelliği ile bölgenin nefes alan en önemli doğal mirası.' },
  { id: 'ekmek-kadayifi', name: 'Ekmek Kadayıfı', file: 'ekmek-kadayifi.jpeg', desc: 'Vişne ve manda kaymağı ile taçlanan, damaklarda iz bırakan bir Bolvadin klasiği.' },
  { id: 'kirik-minare', name: 'Kırık Minare', file: 'kirik-minare.jpeg', desc: 'Zamana meydan okuyan duruşuyla Bolvadin’in tarihi derinliğini yansıtan sessiz tanık.' },
  { id: 'lokum', name: 'Bolvadin Lokumu', file: 'lokum.jpeg', desc: 'Geleneksel tariflerle harmanlanan, bayramların ve en tatlı sohbetlerin vazgeçilmezi.' },
  { id: 'manda', name: 'Bolvadin Mandası', file: 'manda.jpeg', desc: 'Bölge ekonomisinin ve meşhur kaymağın can damarı, Bolvadin doğasının bir parçası.' },
  { id: 'peri-bacalari', name: 'Bolvadin Peri Bacaları', file: 'peri-bacalari.jpeg', desc: 'Doğanın sabırla işlediği, Özburun yolu üzerindeki büyüleyici jeolojik sanat eserleri.' },
  { id: 'sucuklu-yumurta', name: 'Bolvadin Sucuğu', file: 'sucuklu-yumurta.jpeg', desc: 'Geleneksel baharat harmanıyla hazırlanan, Bolvadin kahvaltılarının baş tacı.' },
  { id: 'yanik-kisla', name: 'Yanık Kışla', file: 'yanik-kisla.jpeg', desc: 'Milli Mücadele hatıralarını barındıran, kentin kahramanlık geçmişinin izlerini taşıyan yapı.' },
  { id: 'yedi-kapi', name: 'Yedi Kapı Manastırı', file: 'yedi-kapi.jpeg', desc: 'Kaya yerleşimleri ve manastır yapısıyla bölgenin antik gizemine ışık tutan tarihi durak.' }
];

const playlist = [
  { url: music4, title: 'Schubert Serenade' },
  { url: music1, title: 'Pirates of the Caribbean (Cello)' },
  { url: music2, title: 'Despacito (Cello)' },
  { url: music3, title: 'Handel-Halvorsen (Piano)' }
];

// --- SAYFA GEÇİŞ SARMALAYICI ---
const PageWrapper = ({ children }) => (
  <Motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.02 }}
    transition={{ duration: 0.6, ease: "easeInOut" }}
    className="fixed inset-0 w-full h-full"
  >
    {children}
  </Motion.div>
);

// --- FIRÇA İMLECİ (Performans Odaklı) ---
const BrushCursor = () => {
  const cursorRef = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const moveCursor = (event) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${event.clientX - 10}px, ${event.clientY - 30}px, 0)`;
        cursorRef.current.style.opacity = "1";
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);
  return <div ref={cursorRef} className="fixed top-0 left-0 pointer-events-none z-[9999] text-4xl opacity-0 transition-opacity duration-300 select-none">🖌️</div>;
};

// --- HAREKETSİZLİK ZAMANLAYICISI (5 Dakika) ---
const InactivityTimer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/') return;
    let timeoutId;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => { navigate('/'); }, 300000); // 300.000ms = 5 dk
    };
    const events = ['mousedown', 'touchstart', 'click', 'mousemove'];
    events.forEach(ev => window.addEventListener(ev, resetTimer));
    resetTimer();
    return () => {
      clearTimeout(timeoutId);
      events.forEach(ev => window.removeEventListener(ev, resetTimer));
    };
  }, [location.pathname, navigate]);
  return null;
};

// --- ANA SAYFA ---
const Home = ({ isPlaying, toggleMusic, currentTrackTitle }) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  return (
    <PageWrapper>
      <div className="fixed inset-0 bg-watercolor flex items-center justify-center font-serif overflow-hidden">
        <div className="bg-watercolor-content flex flex-row items-center justify-center gap-24 max-w-[1600px] px-10">
          <div className="flex flex-col gap-8 text-center">
            <Link to="/puzzle"><Motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-80 h-36 bg-[#c04a2e] text-white text-3xl rounded-[2rem] shadow-2xl border-b-[8px] border-[#8a331f] font-bold tracking-wide">Puzzle Oyna</Motion.button></Link>
            <Link to="/galeri"><Motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-80 h-36 bg-[#c04a2e] text-white text-3xl rounded-[2rem] shadow-2xl border-b-[8px] border-[#8a331f] font-bold tracking-wide">Eserleri İncele</Motion.button></Link>
            <Link to="/defter"><Motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-80 h-36 bg-white text-[#c04a2e] text-3xl rounded-[2rem] shadow-2xl border-b-[8px] border-gray-200 font-bold tracking-wide">Anı Defteri</Motion.button></Link>
            <div className="flex flex-col items-center gap-4 mt-4">
              <div className="flex flex-row gap-4">
                <button onClick={() => setIsInfoOpen(true)} className="w-16 h-16 bg-white border-2 border-[#c04a2e] rounded-full text-[#c04a2e] text-3xl font-bold shadow-lg">i</button>
                <button onClick={toggleMusic} className="w-16 h-16 bg-white border-2 border-[#c04a2e] rounded-full text-[#c04a2e] text-2xl shadow-lg flex items-center justify-center">{isPlaying ? '🔊' : '🔈'}</button>
              </div>
              {isPlaying && <p className="text-xs text-[#c04a2e] uppercase tracking-[0.2em] animate-pulse italic font-bold">Şu an çalıyor: {currentTrackTitle}</p>}
            </div>
          </div>
          <div className="shadow-[0_40px_100px_-20px_rgba(192,74,46,0.2)] border-[20px] border-white bg-white rounded-sm"><img src={poster} alt="Bolvadin İz" className="max-h-[80vh] w-auto block" /></div>
        </div>
        <AnimatePresence>
          {isInfoOpen && (
            <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-10 backdrop-blur-sm">
              <Motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-[#f4f1ea] max-w-4xl p-16 rounded-[3rem] shadow-2xl relative border-l-[20px] border-[#c04a2e]">
                <button onClick={() => setIsInfoOpen(false)} className="absolute top-8 right-8 text-4xl text-gray-400">✕</button>
                <h2 className="text-5xl font-bold text-gray-800 mb-10 tracking-tight">Sergi Hakkında</h2>
                <div className="space-y-10 text-2xl text-gray-700 leading-relaxed text-left font-serif">
                  <p><strong>Hatice Koç Kimdir?</strong><br/>Bolvadin Hasan Gemici Ortaokulu ve Bolvadin BİLSEM resim öğretmeni.</p>
                  <p><strong>Neden İZ?</strong><br/>Bu sergi; Bolvadin’in tarihine, doğasına ve mutfak kültürüne bırakılmış sanatsal bir izdir.</p>
                </div>
              </Motion.div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

// --- ANİ DEFTERİ ---
const VisitorBook = () => {
  const [marks, setMarks] = useState([]);
  const emojis = ['🎨', '🖌️', '🖍️', '🖼️', '✨', '❤️', '✒️', '📜', '🎭'];
  const addMark = (event) => {
    const newMark = { id: Date.now(), x: event.clientX, y: event.clientY, emoji: emojis[Math.floor(Math.random() * emojis.length)] };
    setMarks([...marks, newMark]);
  };
  return (
    <PageWrapper>
      <div onClick={addMark} className="fixed inset-0 bg-watercolor cursor-crosshair overflow-hidden">
        <Link to="/" className="fixed top-8 left-8 px-6 py-3 bg-white text-[#1a1a1a] text-sm tracking-[0.3em] uppercase font-bold border border-[#1a1a1a] shadow-lg z-50 hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 rounded-sm">Ana Sayfa</Link>
        <div className="bg-watercolor-content p-20 pointer-events-none text-center">
          <h2 className="text-6xl font-bold text-gray-800 mb-4 mt-10 tracking-tighter">Ziyaretçi Anı Defteri</h2>
          <p className="text-2xl text-gray-500 italic">Ekrana dokunarak kendi "izinizi" bırakın...</p>
        </div>
        {marks.map(mark => (
          <Motion.div key={mark.id} initial={{ scale: 0 }} animate={{ scale: 1.5 }} className="fixed pointer-events-none text-5xl" style={{ left: mark.x - 25, top: mark.y - 25 }}>{mark.emoji}</Motion.div>
        ))}
        <button onClick={(e) => { e.stopPropagation(); setMarks([]); }} className="fixed bottom-10 right-10 bg-white px-6 py-3 rounded-full shadow-lg border text-gray-500 font-bold uppercase tracking-widest text-xs">Defteri Temizle</button>
      </div>
    </PageWrapper>
  );
};

// --- GALERİ (OTOMATİK AKIŞ VE TUR KONTROLÜ) ---
const Gallery = () => {
  const [index, setIndex] = useState(0);
  const [loops, setLoops] = useState(0);
  const [magnifier, setMagnifier] = useState({ x: 0, y: 0, show: false });
  const navigate = useNavigate();

  // Otomatik İlerleme: 15 Saniye
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % resimler.length;
        if (next === 0) setLoops(l => l + 1);
        return next;
      });
    }, 15000); 
    return () => clearInterval(timer);
  }, []);

  // 2 Tur Tamamlandığında Ana Sayfaya Dön
  useEffect(() => { if (loops >= 2) navigate('/'); }, [loops, navigate]);

  const handleMouseMove = (event) => {
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = ((event.pageX - left - window.scrollX) / width) * 100;
    const y = ((event.pageY - top - window.scrollY) / height) * 100;
    setMagnifier({ x, y, show: true });
  };

  return (
    <PageWrapper>
      <div className="fixed inset-0 bg-watercolor flex flex-col items-center justify-center p-10 font-serif overflow-hidden">
        <Link to="/" className="fixed top-8 left-8 px-6 py-3 bg-white text-[#1a1a1a] text-sm tracking-[0.3em] uppercase font-bold border border-[#1a1a1a] shadow-lg z-50 hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 rounded-sm">Ana Sayfa</Link>
        <div className="fixed top-8 right-8 text-[#c04a2e] text-sm font-bold bg-white/50 px-4 py-2 rounded-full tracking-widest">Gezinti: {loops + 1} / 2</div>
        <div className="bg-watercolor-content flex flex-col items-center w-full h-full justify-center">
          <div className="flex flex-row items-center gap-12 w-full max-w-[1600px] justify-between px-10">
            <button onClick={() => setIndex((index - 1 + resimler.length) % resimler.length)} className="text-8xl text-gray-300 hover:text-gray-800 transition-colors">❮</button>
            <div className="flex flex-col md:flex-row items-center gap-16 bg-white p-12 rounded-[3rem] shadow-2xl w-full border-[12px] border-white relative z-10 overflow-hidden">
                <div className="w-1/2 relative cursor-none group overflow-hidden rounded-2xl shadow-inner border border-gray-100 bg-gray-50" onMouseMove={handleMouseMove} onMouseLeave={() => setMagnifier({ ...magnifier, show: false })} onTouchMove={(event) => handleMouseMove(event.touches[0])} onTouchEnd={() => setMagnifier({ ...magnifier, show: false })}>
                  {/* PUBLIC KLASÖRÜNDEN RESİM ÇEKME */}
                  <img src={`/gallery/${resimler[index].file}`} className="w-full max-h-[60vh] object-contain block select-none" alt={resimler[index].name} />
                  {magnifier.show && <div className="absolute pointer-events-none border-4 border-white shadow-2xl rounded-full z-50 bg-white" style={{ width: 250, height: 250, left: `${magnifier.x}%`, top: `${magnifier.y}%`, transform: 'translate(-50%, -50%)', backgroundImage: `url(/gallery/${resimler[index].file})`, backgroundRepeat: 'no-repeat', backgroundSize: '250%', backgroundPosition: `${magnifier.x}% ${magnifier.y}%` }} />}
                </div>
                <div className="w-1/2 space-y-8">
                  <h2 className="text-6xl font-bold text-gray-800 border-b-[8px] border-gray-100 pb-6 tracking-tight">{resimler[index].name}</h2>
                  <p className="text-3xl text-gray-500 leading-relaxed italic font-light">"{resimler[index].desc}"</p>
                  <p className="text-sm text-gray-400 uppercase tracking-[0.2em] font-medium pt-8">🔍 Detaylar için resme dokunun (Otomatik Akış: 15sn)</p>
                </div>
            </div>
            <button onClick={() => { const next = (index + 1) % resimler.length; if (next === 0) setLoops(l => l + 1); setIndex(next); }} className="text-8xl text-gray-300 hover:text-gray-800 transition-colors">❯</button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

// --- PUZZLE SEÇİM ---
const PuzzleSelection = () => (
  <PageWrapper>
    <div className="scrollable-page bg-watercolor w-full font-serif h-screen overflow-y-auto">
      <Link to="/" className="fixed top-8 left-8 px-6 py-3 bg-white text-[#1a1a1a] text-sm tracking-[0.3em] uppercase font-bold border border-[#1a1a1a] shadow-lg z-50 hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 rounded-sm">Ana Sayfa</Link>
      <div className="bg-watercolor-content pt-32 pb-20 text-center">
        <h1 className="text-6xl mb-16 font-bold text-gray-800 tracking-tighter">Eser Seçimi</h1>
        <div className="grid grid-cols-3 gap-12 max-w-[1200px] mx-auto text-left px-10">
          {resimler.map((img) => (
            <Link key={img.id} to={`/puzzle/${img.id}`}>
              <Motion.div whileHover={{ y: -10 }} className="bg-white p-5 rounded-[2.5rem] shadow-xl border-4 border-transparent hover:border-[#c04a2e] transition-all group">
                <div className="overflow-hidden rounded-2xl h-64">
                   <img src={`/gallery/${img.file}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={img.name} />
                </div>
                <p className="text-center mt-6 text-2xl font-bold text-gray-700">{img.name}</p>
              </Motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  </PageWrapper>
);

// --- PUZZLE OYUN ---
const PuzzleGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const secilen = resimler.find(i => i.id === id);
  const [gridSize, setGridSize] = useState(3);
  const [solved, setSolved] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [pieces, setPieces] = useState(() => {
    const p = [...Array(3 * 3).keys()].map(i => ({ id: i }));
    return p.sort(() => Math.random() - 0.5);
  });
  const PIECE_SIZE = 600 / gridSize; 
  useEffect(() => {
    let interval;
    if (!solved) { interval = setInterval(() => { setSeconds(s => s + 1); }, 1000); }
    return () => clearInterval(interval);
  }, [solved]);
  const changeDifficulty = (size) => {
    setGridSize(size); setSeconds(0); setSolved(false);
    const p = [...Array(size * size).keys()].map(i => ({ id: i }));
    setPieces(p.sort(() => Math.random() - 0.5));
  };
  const swap = (draggedId, targetIndex) => {
    const newPieces = [...pieces];
    const draggedIndex = newPieces.findIndex(p => p.id === draggedId);
    [newPieces[draggedIndex], newPieces[targetIndex]] = [newPieces[targetIndex], newPieces[draggedIndex]];
    setPieces(newPieces);
    if (newPieces.every((p, i) => p.id === i)) setSolved(true);
  };
  return (
    <PageWrapper>
      <div className="fixed inset-0 bg-watercolor flex flex-col items-center justify-center font-serif overflow-hidden">
        <button onClick={() => navigate('/puzzle')} className="fixed top-8 left-8 px-6 py-3 bg-white text-[#1a1a1a] text-sm tracking-[0.3em] uppercase font-bold border border-[#1a1a1a] shadow-lg z-50 hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 rounded-sm">Seçime Dön</button>
        {!solved && (
          <div className="fixed top-8 right-8 flex flex-col items-end gap-6 z-50">
            <div className="bg-white px-8 py-3 rounded-2xl shadow-xl border-2 border-[#c04a2e] text-[#c04a2e] font-bold text-2xl">⏱️ {seconds} sn</div>
            <div className="flex gap-4">
              {[3, 4, 5].map((size) => (
                <button key={size} onClick={() => changeDifficulty(size)} className={`px-6 py-2 rounded-full font-bold transition-all border-2 ${gridSize === size ? 'bg-[#c04a2e] text-white border-[#c04a2e]' : 'bg-white text-[#c04a2e] border-[#c04a2e]'}`}>{size}x{size}</button>
              ))}
            </div>
          </div>
        )}
        <div className="bg-watercolor-content flex flex-col items-center justify-center w-full h-full px-20">
          <h2 className="text-4xl md:text-5xl mb-12 uppercase tracking-[0.3em] font-light text-gray-400">{secilen?.name}</h2>
          <div className="flex flex-row items-center justify-center gap-20">
            <div className="relative bg-white border-[12px] border-white shadow-2xl" style={{ width: 624, height: 624 }}>
              {!solved && <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url(/gallery/${secilen?.file})`, backgroundSize: 'cover' }} />}
              <div className="grid w-full h-full" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
                {pieces.map((p, index) => (
                  <Motion.div key={`piece-${p.id}`} drag={!solved} dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} dragElastic={0} dragMomentum={false} onDragEnd={(_, info) => { const xMove = Math.round(info.offset.x / PIECE_SIZE); const yMove = Math.round(info.offset.y / PIECE_SIZE); const targetIndex = index + xMove + (yMove * gridSize); if (targetIndex >= 0 && targetIndex < gridSize * gridSize) swap(p.id, targetIndex); }} className={`${!solved ? 'cursor-grab active:cursor-grabbing border border-gray-100/50' : ''} overflow-hidden relative`} style={{ width: PIECE_SIZE, height: PIECE_SIZE, backgroundImage: `url(/gallery/${secilen?.file})`, backgroundSize: `600px 600px`, backgroundPosition: `${-(p.id % gridSize) * PIECE_SIZE}px ${-Math.floor(p.id / gridSize) * PIECE_SIZE}px` }} />
                ))}
              </div>
            </div>
            <AnimatePresence>
              {solved && (
                <Motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-start gap-8 max-w-md">
                  <div className="bg-white/80 p-10 rounded-[3rem] shadow-2xl border-l-[12px] border-[#c04a2e]">
                    <h3 className="text-7xl font-bold text-gray-800 mb-6 tracking-tighter">İz Tamamlandı</h3>
                    <p className="text-3xl text-[#c04a2e] font-bold mb-8">🏆 {seconds} Saniyede!</p>
                    <p className="text-xl text-gray-500 italic leading-relaxed mb-10 font-serif">Bolvadin'in bu eşsiz parçasını başarıyla bir araya getirdiniz. Hatice Koç'un fırçasından çıkan bu eser artık tam bir bütün.</p>
                    <button onClick={() => navigate('/puzzle')} className="px-12 py-5 bg-[#c04a2e] text-white rounded-full text-2xl font-bold shadow-xl active:scale-95 transition-transform">Yeni Eser Seç</button>
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

// --- APP CONTENT ---
const AppContent = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (isPlaying) { audioRef.current?.play().catch(() => {}); }
    else { audioRef.current?.pause(); }
  }, [isPlaying, currentTrack]);

  return (
    <>
      <audio ref={audioRef} src={playlist[currentTrack].url} onEnded={() => setCurrentTrack((prev) => (prev + 1) % playlist.length)} />
      <InactivityTimer />
      <BrushCursor />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home isPlaying={isPlaying} toggleMusic={() => setIsPlaying(!isPlaying)} currentTrackTitle={playlist[currentTrack].title} />} />
          <Route path="/galeri" element={<Gallery />} />
          <Route path="/puzzle" element={<PuzzleSelection />} />
          <Route path="/puzzle/:id" element={<PuzzleGame />} />
          <Route path="/defter" element={<VisitorBook />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}