import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import { 
  IoHeart, 
  IoSparkles, 
  IoMusicalNotes, 
  IoMoon, 
  IoStar,
  IoTrophy,
  IoRose
} from 'react-icons/io5';
import { FaBullseye, FaPuzzlePiece, FaHeart } from 'react-icons/fa';
import { GiShatteredHeart } from 'react-icons/gi';

function App() {
  // Main app states
  const [stage, setStage] = useState('fake-login'); // fake-login, memory-game, cipher-challenge, truth-revealed, final-question, success
  const [systemUnlocked, setSystemUnlocked] = useState(false);
  
  // Game states
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [cipherInput, setCipherInput] = useState('');
  
  // Final question states
  const [clicked, setClicked] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [noClicks, setNoClicks] = useState(0);
  const [showHearts, setShowHearts] = useState(false);
  const [konami, setKonami] = useState([]);
  
  // Easter eggs
  const [secretsFound, setSecretsFound] = useState(0);

  // Initialize memory game
  useEffect(() => {
    if (stage === 'memory-game' && memoryCards.length === 0) {
      const symbols = [
        { icon: IoHeart, key: 'heart1' },
        { icon: IoSparkles, key: 'sparkles' },
        { icon: IoRose, key: 'rose' },
        { icon: GiShatteredHeart, key: 'heart2' },
        { icon: IoMusicalNotes, key: 'music' },
        { icon: IoMoon, key: 'moon' },
        { icon: IoStar, key: 'star' },
        { icon: FaHeart, key: 'heart3' }
      ];
      const cards = [...symbols, ...symbols]
        .sort(() => Math.random() - 0.5)
        .map((symbol, index) => ({ id: index, symbol, matched: false }));
      setMemoryCards(cards);
    }
  }, [stage, memoryCards.length]);

  // Konami code listener (easter egg)
  useEffect(() => {
    const handleKeyPress = (e) => {
      const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
      const newKonami = [...konami, e.key].slice(-10);
      setKonami(newKonami);
      
      if (JSON.stringify(newKonami) === JSON.stringify(konamiCode)) {
        setSecretsFound(prev => prev + 1);
        alert('Cheat code activated! +1 secret found');
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [konami]);

  // FAKE LOGIN HANDLERS
  const handleFakeLogin = (password) => {
    if (password.toLowerCase() === 'valentine' || password === '021426') {
      setSystemUnlocked(true);
      setTimeout(() => setStage('memory-game'), 2000);
    }
  };

  // MEMORY GAME HANDLERS
  const handleCardClick = (cardId) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardId)) return;
    
    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);
    
    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const firstCard = memoryCards.find(c => c.id === first);
      const secondCard = memoryCards.find(c => c.id === second);
      
      if (firstCard.symbol.key === secondCard.symbol.key) {
        setMatchedPairs([...matchedPairs, firstCard.symbol.key]);
        setTimeout(() => setFlippedCards([]), 500);
        
        if (matchedPairs.length + 1 === 8) {
          setTimeout(() => setStage('cipher-challenge'), 1000);
        }
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  // CIPHER CHALLENGE HANDLERS
  const handleCipherSubmit = () => {
    if (cipherInput.trim().length > 0) {
      setStage('truth-revealed');
      setTimeout(() => setStage('final-question'), 3000);
    } else {
      alert('Please enter something to decrypt...');
    }
  };

  // FINAL QUESTION HANDLERS
  const handleYes = () => {
    setClicked(true);
    setShowHearts(true);
  };

  const handleNo = () => {
    const randomX = Math.random() * (window.innerWidth - 200);
    const randomY = Math.random() * (window.innerHeight - 200);
    setNoButtonPosition({ x: randomX, y: randomY });
    setNoClicks(noClicks + 1);
  };

  const noButtonTexts = [
    "No",
    "Wait, sure ka?",
    "Think about it...",
    "Aww bakit naman",
    "Please lang?",
    "Last chance to",
    "Seriously?",
    "Come on...",
  ];

  const memeImages = [
    { src: '/v1.JPG', alt: 'Meme 1' },
    { src: '/v2.jpg', alt: 'Meme 2' },
    { src: '/v3.jpg', alt: 'Meme 3' },
    { src: '/v4.JPG', alt: 'Meme 4' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  // ============ RENDER STAGES ============
  
  // STAGE 0: FAKE LOGIN SCREEN
  if (stage === 'fake-login') {
    return (
      <div className="App fake-system">
        <motion.div 
          className="fake-login-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="system-header">
            <div className="status-bar">
              <span className="status-dot"></span>
              <span className="status-text">SECURE CONNECTION ESTABLISHED</span>
            </div>
            <h1 className="system-title">◆ CLASSIFIED DATABASE ACCESS ◆</h1>
            <p className="system-subtitle">Security Level: MAXIMUM</p>
          </div>

          <motion.div 
            className="login-box"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="warning-banner">
              ⚠️ AUTHORIZED PERSONNEL ONLY ⚠️
            </div>
            
            <div className="glitch-text" data-text="ENTER CREDENTIALS">
              ENTER CREDENTIALS
            </div>

            <input
              type="text"
              className="fake-input"
              placeholder="USERNAME: MARA_****"
              disabled
              value="MARA_2026"
            />

            <input
              type="password"
              className="fake-input"
              placeholder="PASSWORD: ••••••"
              onKeyPress={(e) => e.key === 'Enter' && handleFakeLogin(e.target.value)}
              onChange={(e) => e.target.value}
            />

            <div className="hint-box">
              <p className="hint-text">HINT: When is Valentine's Day? (MMDDYY)</p>
              <p className="hint-text-alt">Alternative: The name of this special day...</p>
            </div>

            <button 
              className="fake-button"
              onClick={(e) => {
                const input = e.target.previousElementSibling.previousElementSibling;
                handleFakeLogin(input.value);
              }}
            >
              → ACCESS SYSTEM
            </button>

            {systemUnlocked && (
              <motion.div
                className="unlock-message"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="glitch-text success" data-text="ACCESS GRANTED">
                  ACCESS GRANTED
                </div>
                <p>INITIALIZING MEMORY CORE...</p>
              </motion.div>
            )}
          </motion.div>

          <motion.div 
            className="secret-corner" 
            onClick={() => {
              setSecretsFound(prev => prev + 1);
              alert('You found a secret! ' + (secretsFound + 1) + '/3 discovered');
            }}
            whileHover={{ scale: 1.2, rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            {secretsFound > 0 && <IoSparkles style={{ fontSize: '24px', color: '#FFD700' }} />}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // STAGE 1: MEMORY CARD GAME
  if (stage === 'memory-game') {
    return (
      <div className="App game-bg">
        {/* Floating particles */}
        <div className="particles">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                y: [null, Math.random() * window.innerHeight],
                x: [null, Math.random() * window.innerWidth],
              }}
              transition={{ 
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
        
        <motion.div
          className="game-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="game-title">
            MEMORY RECONSTRUCTION
          </h2>
          <p className="game-subtitle">Match all pairs to unlock the next layer</p>
          <div className="progress-bar">
            <motion.div 
              className="progress-fill" 
              style={{ width: `${(matchedPairs.length / 8) * 100}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${(matchedPairs.length / 8) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="memory-grid">
            {memoryCards.map(card => (
              <motion.div
                key={card.id}
                className={`memory-card ${
                  flippedCards.includes(card.id) || matchedPairs.includes(card.symbol.key) 
                    ? 'flipped' 
                    : ''
                }`}
                onClick={() => handleCardClick(card.id)}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="card-inner">
                  <div className="card-front">?</div>
                  <div className="card-back">
                    <card.symbol.icon style={{ fontSize: '48px', color: '#ff6b9d' }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // STAGE 2: CIPHER CHALLENGE
  if (stage === 'cipher-challenge') {
    return (
      <div className="App cipher-bg">
        <motion.div
          className="cipher-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="cipher-title">DECRYPTION PROTOCOL</h2>
          <div className="cipher-box">
            <div className="encrypted-message">
              <motion.p 
                className="cipher-line"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                01001101 01000001 01010010 01000001
              </motion.p>
              <motion.p 
                className="cipher-line glow-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              >
                M.A.R.A + <IoHeart style={{ color: '#ff1744', fontSize: '24px' }} /> + 2026
              </motion.p>
              <motion.p 
                className="cipher-line"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <FaBullseye style={{ color: '#00ffff', fontSize: '20px' }} /> Combine the pieces...
              </motion.p>
            </div>
            
            <div className="cipher-hint">
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaPuzzlePiece style={{ color: '#ffaa00' }} /> Decode the pattern...
              </p>
              <p className="small-hint">Connect: Name + Holiday + Year</p>
            </div>

            <input
              type="text"
              className="cipher-input"
              placeholder="Enter decoded message..."
              value={cipherInput}
              onChange={(e) => setCipherInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCipherSubmit()}
            />

            <button className="cipher-button" onClick={handleCipherSubmit}>
              DECRYPT →
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // STAGE 3: TRUTH REVEALED
  if (stage === 'truth-revealed') {
    return (
      <motion.div
        className="App reveal-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="reveal-container"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="reveal-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            SYSTEM DECRYPTED
          </motion.h1>
          <motion.p 
            className="reveal-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            This was never a database...<br/>
            It was always about you.
          </motion.p>
          <motion.div
            className="reveal-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
          >
            <IoHeart style={{ fontSize: '120px', color: '#ff6b9d' }} />
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  // STAGE 4: FINAL QUESTION (Original App)

  // STAGE 4: FINAL QUESTION (Original App)
  if (stage === 'final-question') {
    if (clicked) {
      return (
        <motion.div 
          className="App valentine-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence>
            {showHearts && (
              <div className="floating-hearts">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="floating-heart"
                    initial={{ 
                      opacity: 0, 
                      y: "100vh", 
                      x: Math.random() * window.innerWidth,
                      scale: Math.random() * 0.5 + 0.5
                    }}
                    animate={{ 
                      opacity: [0, 1, 1, 0], 
                      y: "-20vh",
                      rotate: Math.random() * 360
                    }}
                    transition={{ 
                      duration: Math.random() * 3 + 2, 
                      delay: Math.random() * 0.5,
                      ease: "easeOut"
                    }}
                  >
                    <span className="emoji-apple">❤️</span>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
          
          <motion.div 
            className="success-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="success-title"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}
            >
              You said YES! 
              <IoTrophy style={{ fontSize: '48px', color: '#FFD700' }} />
              <IoHeart style={{ fontSize: '48px', color: '#ff1744' }} />
            </motion.h1>
            
            <motion.div className="meme-container" variants={itemVariants}>
              <div className="meme-grid">
                {memeImages.map((meme, i) => (
                  <motion.img
                    key={i}
                    src={meme.src}
                    alt={meme.alt}
                    className="meme-image"
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ 
                      delay: i * 0.2,
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      rotate: [0, -5, 5, -5, 5, 0],
                      transition: { duration: 0.5 }
                    }}
                  />
                ))}
              </div>
            </motion.div>
            
            <motion.div className="success-message" variants={itemVariants}>
              <p className="big-text">
                You just made me the happiest person! 💕
              </p>
              <p>I promise to make this Valentine's Day unforgettable.</p>
              <p>Thank you for saying yes, Mara. You mean everything to me.</p>
              <motion.p 
                className="signature"
                whileHover={{ scale: 1.05 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
              >
                <span>Forever yours,</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>- Jade <FaHeart style={{ color: '#ff1744', fontSize: '20px' }} /></span>
              </motion.p>
              {secretsFound >= 3 && (
                <motion.p 
                  className="secret-reward"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}
                >
                  <IoTrophy style={{ color: '#FFD700', fontSize: '24px' }} />
                  SECRET ACHIEVEMENT UNLOCKED: Master Detective! You found all {secretsFound} secrets!
                  <IoSparkles style={{ color: '#FFD700', fontSize: '24px' }} />
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      );
    }

    return (
      <motion.div 
        className="App valentine-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background meme collage */}
        <div className="background-memes">
          {memeImages.map((meme, i) => (
            <motion.img
              key={i}
              src={meme.src}
              alt={meme.alt}
              className="bg-meme"
              style={{
                top: `${[10, 60, 15, 65][i]}%`,
                left: `${[5, 70, 75, 10][i]}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>

        <motion.div 
          className="container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="heart-animation"
            animate={{ y: [0, -10, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FaHeart style={{ fontSize: '80px', color: '#ff1744' }} />
          </motion.div>
          
          <motion.h1 
            className="main-title" 
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            Hi Mara
          </motion.h1>
          
          <motion.div className="content-box" variants={itemVariants}>
            <motion.div 
              className="romantic-section"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="love-text">
                Every moment with you feels special.
                <br/>
                You light up my world in ways I never imagined possible.
                <br/>
                Can't wait to create more beautiful memories together.
              </p>
            </motion.div>

            <motion.div 
              className="question-box"
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.2)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="question" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                Will you be my Valentine? 
                <span style={{ display: 'flex', gap: '6px' }}>
                  <IoHeart style={{ fontSize: '32px', color: '#fff' }} />
                  <IoHeart style={{ fontSize: '32px', color: '#fff' }} />
                </span>
              </h2>
            </motion.div>

            <div className="buttons-container">
              <motion.button 
                className="yes-button" 
                onClick={handleYes}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              >
                YES! <IoHeart style={{ fontSize: '28px' }} />
              </motion.button>
              <motion.button 
                className="no-button" 
                onClick={handleNo}
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.9 }}
                animate={noClicks > 0 ? { x: [0, -10, 10, -5, 5, 0] } : {}}
                transition={{ duration: 0.3 }}
                style={{
                  position: noClicks > 0 ? 'fixed' : 'relative',
                  left: noClicks > 0 ? `${noButtonPosition.x}px` : 'auto',
                  top: noClicks > 0 ? `${noButtonPosition.y}px` : 'auto',
                }}
              >
                {noButtonTexts[Math.min(noClicks, noButtonTexts.length - 1)]}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return null;
}

export default App;
