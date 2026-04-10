/* ===========================
   Anonymous AI Messenger
   script.js — Complete with Scratch Reveal & Line-by-Line Suspense
   =========================== */

'use strict';

// =====================
// CONFIGURATION
// =====================


const WORKER_API_URL = 'https://anonymous-telegram-bot.voicedontdie.workers.dev';



// =====================
// EXPANDABLE TEASERS POOL - ADD AS MANY AS YOU WANT FOR EACH CATEGORY
// =====================
const categoryTeasers = {
  birthday: {
    name: "Birthday",
    icon: "🎂",
    teasers: [
      "🎂 Someone has a special birthday message just for you...",
      "🎈 It's your birthday! Someone wants to make it unforgettable...",
      "🎁 A birthday surprise is waiting to be revealed...",
      "🕯️ Make a wish... someone made one for you...",
      "🎉 Party time! Someone sent birthday love your way...",
      "🎂 The candles are lit and someone's thinking of you...",
      "💝 A birthday wish from a secret admirer is coming...",
      "🌟 Today is your day and someone noticed...",
      "🎀 A gift-shaped message is waiting to be opened...",
      "🥳 Someone's celebrating YOU from afar...",
      "🎈 Pop! A birthday message is about to be delivered...",
      "🎂 Another trip around the sun, and someone's cheering for you...",
      "💖 Your secret fan has birthday butterflies...",
      "✨ Make a wish... someone already made theirs about you..."
    ]
  },
  love_romance: {
    name: "Love & Romance",
    icon: "❤️",
    teasers: [
      "❤️ Someone's heart beats faster when they think of you...",
      "💕 A secret admirer has been waiting to tell you something...",
      "🌹 Romance is in the air... someone has feelings for you...",
      "💖 Your biggest fan just left you a message...",
      "😍 Someone can't stop thinking about you...",
      "💗 A love letter in digital form is waiting...",
      "🌸 Your secret admirer is ready to confess...",
      "✨ Cupid's arrow has struck... someone sent you a message...",
      "💓 Butterflies incoming... someone's thinking of you...",
      "🌙 Under the moonlight, someone wrote you a message...",
      "💝 Their heart races every time they see you...",
      "🌹 A rose has a message attached just for you...",
      "💌 Someone's been writing and rewriting this for days...",
      "🌟 You've been on someone's mind... in a romantic way..."
    ]
  },
  adult_humor: {
    name: "Adult Humor",
    icon: "🔥",
    teasers: [
      "🔥 Someone's feeling spicy... should we let them talk?",
      "😏 A naughty (but clean) message is waiting...",
      "💋 Someone's feeling bold today... ready to hear it?",
      "🍑 A flirty little secret is about to be revealed...",
      "😉 Someone thinks you're hot... literally...",
      "🌶️ Spicy vibes incoming... open if you dare...",
      "🍆 Just kidding! But someone does have something to say...",
      "💦 Someone's got a confession that might make you blush...",
      "😈 A little devilish message is waiting for you...",
      "🍒 Someone's feeling cheeky today...",
      "🔥 Your secret admirer is feeling extra bold...",
      "😏 They've been practicing this message all week...",
      "💋 A wink and a whisper... someone's thinking of you...",
      "🌶️ This message comes with a warning: may cause blushing..."
    ]
  },
  flirty: {
    name: "Flirty",
    icon: "💋",
    teasers: [
      "💋 Someone's been practicing their pickup lines for you...",
      "😘 A secret crush is ready to confess...",
      "💕 Flirty vibes incoming... are you ready?",
      "😏 Someone thinks you're cute... very cute...",
      "💌 A little flirtation is heading your way...",
      "💗 Someone's heart skipped a beat thinking about you...",
      "🌸 You've been on someone's mind... in a flirty way...",
      "✨ A little spark is about to fly...",
      "💋 Pucker up? Someone has something cute to say...",
      "😊 Someone's smiling just thinking about telling you this...",
      "👀 They've been staring from across the room...",
      "💫 A little magic and a lot of flirtation coming your way...",
      "😉 Someone thinks you're something special...",
      "💕 Butterflies in their stomach... just for you..."
    ]
  },
  wedding: {
    name: "Wedding",
    icon: "💍",
    teasers: [
      "💍 Wedding bells! Someone has a special message for the happy couple...",
      "💒 Love is in the air... a wedding message awaits...",
      "🥂 A toast to love! Someone sent wedding wishes...",
      "👰‍♀️🤵‍♂️ Congratulations are in order... open to see who's celebrating you...",
      "💐 Someone's thinking of you on your special day...",
      "💍 Forever starts here... someone has a message for you...",
      "🥂 Raise your glass! Wedding wishes are coming...",
      "💒 Someone's heart is full of joy for your union...",
      "💐 A bouquet of blessings is waiting to be opened...",
      "🎊 Congratulations! Someone wants to celebrate with you...",
      "💍 Two hearts, one love... a wedding blessing awaits...",
      "🥂 Here's to forever... someone wants to toast to you...",
      "💒 Your love story inspired someone to write this...",
      "🎀 A wedding wish wrapped with love is coming..."
    ]
  },
  relationship: {
    name: "Relationship",
    icon: "🤝",
    teasers: [
      "🤝 Someone wants to make things right between you...",
      "💬 A heartfelt message about your relationship is waiting...",
      "🙏 Someone's grateful for you... and they want you to know...",
      "💪 Let's work on us... a message from someone who cares...",
      "🫂 An apology or appreciation is coming your way...",
      "💖 Someone values you more than words can say...",
      "🤲 A peace offering in digital form awaits...",
      "💬 Someone's been wanting to tell you something important...",
      "🌟 You matter to someone... open to find out who...",
      "💪 A message about us is waiting to be read...",
      "🤝 A bridge is being built... someone wants to connect...",
      "💖 Your presence in their life means everything...",
      "🙏 Gratitude and love are headed your way...",
      "💬 A conversation starter from someone who cares deeply..."
    ]
  },
  sympathy: {
    name: "Sympathy",
    icon: "😢",
    teasers: [
      "😢 Someone's thinking of you during this difficult time...",
      "🫂 A comforting message is waiting for you...",
      "💪 You're not alone... someone wants you to know...",
      "🌧️ Sending love and strength... open when you're ready...",
      "🤗 A virtual hug is coming your way...",
      "🕯️ Someone's lighting a candle and thinking of you...",
      "💝 A gentle message of love and support awaits...",
      "🌈 Brighter days are ahead... someone believes in you...",
      "🤲 You're in someone's thoughts and prayers...",
      "💪 You're stronger than you know... open for a reminder...",
      "🌻 Thinking of you during this season...",
      "🕊️ Peace and comfort are being sent your way...",
      "💕 Someone's holding space for you in their heart...",
      "🤗 A shoulder to lean on... through this message..."
    ]
  },
  fun: {
    name: "Fun",
    icon: "😂",
    teasers: [
      "😂 Someone's got a joke that'll make your day...",
      "🎉 Ready to laugh? A funny message awaits...",
      "🤪 Something silly is coming your way...",
      "😜 Someone wants to prank you (in a good way)...",
      "🃏 Get ready to smile... a fun surprise is here...",
      "🎈 Laughter incoming! Open for a good time...",
      "🤣 Someone's trying to make you LOL...",
      "😹 This message might cause spontaneous giggling...",
      "🎪 Step right up for a fun surprise!",
      "🦄 Something magical and silly is waiting...",
      "😂 Warning: May cause uncontrollable smiling...",
      "🎉 Party popper! Someone's sending fun your way...",
      "🤪 Get ready for a dose of happiness...",
      "🃏 A little humor to brighten your day..."
    ]
  },
  holidays: {
    name: "Holidays",
    icon: "🎄",
    teasers: [
      "🎄 Ho ho ho! Someone sent holiday cheer just for you...",
      "🎆 Happy celebrations! A holiday message is waiting...",
      "🕎 Season's greetings... someone's thinking of you...",
      "🥂 Cheers to the holidays! Open for a special message...",
      "🎁 A holiday surprise is wrapped and ready...",
      "🦃 Someone's thankful for you this season...",
      "🎅 Santa's not the only one with a message for you...",
      "✨ Holiday magic is in the air... and in this message...",
      "🕯️ Someone's sending warm wishes your way...",
      "🎊 Let the celebrations begin! A holiday greeting awaits...",
      "🎄 Deck the halls... with a secret message...",
      "🎆 Fireworks of joy are coming your way...",
      "🥂 A toast to you this holiday season...",
      "🎁 Unwrap this message like a holiday gift..."
    ]
  },
  islamic: {
    name: "Islamic",
    icon: "🌙",
    teasers: [
      "🌙 Eid Mubarak! Someone's sending you blessings...",
      "🕌 A special Islamic greeting is waiting for you...",
      "🤲 Duas and love coming your way...",
      "🌟 May Allah bless you... someone wants you to know...",
      "📿 A spiritual message awaits...",
      "🕋 Someone's praying for you and sent a message...",
      "🌙 Moonlit blessings are being delivered...",
      "🤲 Your name was mentioned in someone's dua...",
      "✨ A message of peace and blessings awaits...",
      "📖 Someone found a verse that reminded them of you...",
      "🌙 Ramadan or Eid blessings coming your way...",
      "🕌 Peace and serenity are being sent to you...",
      "🤲 May this message bring barakah to your day...",
      "🌟 Someone made dua especially for you..."
    ]
  },
  nigeria: {
    name: "Nigeria",
    icon: "🇳🇬",
    teasers: [
      "🇳🇬 Proudly Nigerian! Someone's celebrating with you...",
      "🦅 A message from the heart of Africa awaits...",
      "🎉 Naija no dey carry last! Open for a special greeting...",
      "💚🤍💚 Someone's thinking of you on this special day...",
      "🥘 Jollof love coming your way...",
      "🇳🇬 Green white green! Someone's got a message for you...",
      "🦅 Soaring high like an eagle... open to see who's proud of you...",
      "🎊 Naija vibes! Someone's sending love from home...",
      "🍛 Suya and love? Someone's thinking of you...",
      "💚 One Nigeria, one love... a message awaits...",
      "🇳🇬 From Lagos to Kano... someone's thinking of you...",
      "🥁 Talking drum beats... a message from home...",
      "🎉 Celebration time! Someone's proud to know you...",
      "💚🤍💚 Unity and love... wrapped in this message..."
    ]
  }
};

// Helper function to get random teasers from category
function getRandomTeasers(category, count = 4) {
  const teaserList = categoryTeasers[category]?.teasers || [
    "🤫 Shh... I have a secret to tell you...",
    "✨ Someone sent you something special...",
    "💭 They've been thinking about you all day...",
    "🎁 It's a message just for you...",
    "💌 Are you ready to hear what they said?",
    "😊 They wanted you to know something important...",
    "🌟 Opening your secret message now...",
    "💖 This might make your day...",
    "🎀 Ready?"
  ];
  
  // Shuffle and return random teasers
  const shuffled = [...teaserList].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getCategoryIcon(category) {
  return categoryTeasers[category]?.icon || "💌";
}

// =====================
// UTILS
// =====================
function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function encodeParams(data) {
  return Object.entries(data)
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}

function decodeHash(hash) {
  const params = {};
  if (!hash || hash.length < 2) return params;
  const str = hash.startsWith('#') ? hash.substring(1) : hash;
  
  str.split('&').forEach(pair => {
    const [k, v] = pair.split('=');
    if (k && v) {
      params[decodeURIComponent(k)] = decodeURIComponent(v);
    }
  });
  return params;
}

function copyToClipboard(text) {
  navigator.clipboard?.writeText(text).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}

function showToast(message, isError = false) {
  const toast = document.createElement('div');
  toast.className = 'qr-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${isError ? '#ef4444' : '#1a1a2e'};
    border: 1px solid ${isError ? '#ef4444' : '#c084fc'};
    border-radius: 12px;
    padding: 12px 20px;
    color: white;
    font-size: 0.85rem;
    z-index: 10000;
    animation: fade-up 0.3s ease;
    white-space: nowrap;
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'fade-up 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// =====================
// LINE-BY-LINE MESSAGE REVEAL WITH SUSPENSE
// =====================
function splitMessageIntoLines(message) {
  // Split by periods, question marks, exclamation marks followed by space or newline
  // Also preserve line breaks
  const sentences = message.split(/(?<=[.!?])\s+(?=[A-Za-z0-9])/);
  const lines = [];
  sentences.forEach(sentence => {
    if (sentence.includes('\n')) {
      lines.push(...sentence.split('\n'));
    } else {
      lines.push(sentence);
    }
  });
  return lines.filter(line => line.trim().length > 0).map(line => line.trim());
}

// Split message into chunks of words for even more suspense
function splitMessageIntoWordChunks(message, wordsPerChunk = 8) {
  const words = message.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    chunks.push(words.slice(i, i + wordsPerChunk).join(' '));
  }
  return chunks;
}

// =====================
// SCRATCH CARD FOR MESSAGE REVEAL
// =====================
function createMessageScratchCard(messageId) {
  return `
    <div class="scratch-message-container" id="scratch-container-${messageId}">
      <div class="scratch-card-label">✨ SCRATCH TO REVEAL THE SECRET MESSAGE ✨</div>
      <div class="scratch-area">
        <canvas id="scratch-canvas-${messageId}" width="300" height="120" class="message-scratch-canvas"></canvas>
        <div class="scratch-overlay-text">← Scratch Here →</div>
      </div>
      <div id="scratch-message-content-${messageId}" class="scratch-message-hidden" style="display: none;">
        <div class="scratch-loading">✨ Preparing your message... ✨</div>
      </div>
    </div>
  `;
}

function initMessageScratchCard(canvasId, onRevealComplete) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const container = canvas.closest('.scratch-message-container');
  const contentDiv = container?.querySelector(`[id^="scratch-message-content"]`);
  let isDragging = false;
  let isRevealed = false;
  let scratchedPixels = 0;
  
  // Draw scratch layer
  ctx.fillStyle = '#888';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add pattern
  ctx.fillStyle = '#666';
  for (let i = 0; i < 400; i++) {
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
  }
  
  // Draw scratch text
  ctx.fillStyle = '#c084fc';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('← SCRATCH HERE →', canvas.width/2, canvas.height/2);
  
  function getCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: Math.max(0, Math.min(canvas.width, (clientX - rect.left) * scaleX)),
      y: Math.max(0, Math.min(canvas.height, (clientY - rect.top) * scaleY))
    };
  }
  
  function scratch(e) {
    if (!isDragging || isRevealed) return;
    e.preventDefault();
    
    const { x, y } = getCoords(e);
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
    
    scratchedPixels++;
    
    // Check if scratched enough (center area)
    if (!isRevealed) {
      const imageData = ctx.getImageData(canvas.width/2, canvas.height/2, 1, 1);
      if (imageData.data[3] === 0 || scratchedPixels > 80) {
        isRevealed = true;
        canvas.style.display = 'none';
        const overlayText = container?.querySelector('.scratch-overlay-text');
        if (overlayText) overlayText.style.display = 'none';
        
        if (contentDiv) {
          contentDiv.style.display = 'block';
          contentDiv.innerHTML = '<div class="scratch-loading">✨ Revealing message... ✨</div>';
        }
        
        if (onRevealComplete) onRevealComplete();
      }
    }
  }
  
  canvas.addEventListener('mousedown', () => isDragging = true);
  canvas.addEventListener('mouseup', () => isDragging = false);
  canvas.addEventListener('mousemove', scratch);
  canvas.addEventListener('touchstart', () => isDragging = true);
  canvas.addEventListener('touchend', () => isDragging = false);
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); scratch(e); });
}

// =====================
// LINE-BY-LINE MESSAGE DISPLAY WITH SUSPENSE
// =====================
async function revealMessageLineByLine(container, message, avatarEmoji, options = {}) {
  const { wordsPerChunk = 6, delayBetweenChunks = 800, onComplete } = options;
  
  // Split into chunks of words for suspense
  const chunks = splitMessageIntoWordChunks(message, wordsPerChunk);
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const isLastChunk = (i === chunks.length - 1);
    
    // Show typing indicator
    await showTyping(container, 800 + (chunk.length * 15));
    
    // Append the chunk
    appendBubble(container, 'in', chunk, avatarEmoji, !isLastChunk);
    
    if (!isLastChunk) {
      await sleep(delayBetweenChunks);
    }
  }
  
  if (onComplete) onComplete();
}

// =====================
// TELEGRAM MESSAGE DELIVERY
// =====================
async function sendAnonymousTelegramMessage(message, recipientTelegram, senderName, emoji, category) {
  const statusDiv = document.getElementById('delivery-status');
  
  if (statusDiv) {
    statusDiv.style.display = 'block';
    statusDiv.style.background = 'rgba(192,132,252,0.1)';
    statusDiv.innerHTML = '📤 Sending your anonymous message...';
  }
  
  try {
    console.log('Sending to worker:', WORKER_API_URL);
    console.log('Recipient:', recipientTelegram);
    console.log('Message:', message.substring(0, 50));
    
    const response = await fetch(`${WORKER_API_URL}/api/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientTelegram: recipientTelegram,
        message: message,
        senderId: `user_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
        senderName: senderName || 'Secret Admirer',
        category: category || 'general',
        emoji: emoji || '💌'
      })
    });
    
    console.log('Response status:', response.status);
    
    const result = await response.json();
    console.log('Response result:', result);
    
    if (result.success) {
      if (statusDiv) {
        statusDiv.style.background = 'rgba(16,185,129,0.1)';
        statusDiv.innerHTML = `✅ Message sent anonymously to @${recipientTelegram.replace('@', '')}! They will receive a secret link.`;
      }
      showToast('✅ Message sent anonymously!');
      trackEvent('telegram_message_sent', { category: category });
      
      // Clear form
      document.getElementById('msg-text').value = '';
      document.getElementById('telegram-recipient').value = '';
      document.getElementById('msg-from').value = '';
      
      setTimeout(() => {
        if (statusDiv) statusDiv.style.display = 'none';
      }, 5000);
    } else {
      throw new Error(result.error || 'Failed to send');
    }
  } catch (error) {
    console.error('Send error:', error);
    if (statusDiv) {
      statusDiv.style.background = 'rgba(239,68,68,0.1)';
      statusDiv.innerHTML = `❌ Error: ${error.message}. Make sure the worker is deployed and the URL is correct.`;
    }
    showToast(`❌ Error: ${error.message}`, true);
  }
}



// =====================
// COUNTER
// =====================
const COUNTER_KEY = 'anon_msg_count';
const COUNTER_SEED = 14837;

function getCount() {
  const stored = parseInt(localStorage.getItem(COUNTER_KEY) || '0');
  return COUNTER_SEED + stored;
}

function incrementCount() {
  const stored = parseInt(localStorage.getItem(COUNTER_KEY) || '0');
  localStorage.setItem(COUNTER_KEY, stored + 1);
  updateCounterDisplay();
}

function updateCounterDisplay() {
  const el = document.getElementById('msg-count');
  if (el) {
    el.textContent = getCount().toLocaleString() + '+';
  }
}

// =====================
// QR CODE GENERATION
// =====================
function generateQR(containerId, url, size = 180) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  try {
    new QRCode(container, {
      text: url,
      width: size,
      height: size,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  } catch (e) {
    console.error('QR generation error:', e);
  }
}

function generateQRWithBackground(containerId, url, size = 180, category = 'default') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  
  ctx.globalAlpha = 0.1;
  ctx.font = `${Math.floor(size / 3)}px "Segoe UI Emoji"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(getCategoryIcon(category), size/2, size/2);
  ctx.globalAlpha = 1;
  
  const qrDiv = document.createElement('div');
  qrDiv.style.position = 'absolute';
  qrDiv.style.left = '-9999px';
  document.body.appendChild(qrDiv);
  
  try {
    new QRCode(qrDiv, {
      text: url,
      width: size,
      height: size,
      colorDark: '#000000',
      colorLight: 'rgba(255,255,255,0)',
      correctLevel: QRCode.CorrectLevel.H
    });
    
    setTimeout(() => {
      const qrCanvas = qrDiv.querySelector('canvas');
      if (qrCanvas) {
        ctx.drawImage(qrCanvas, 0, 0, size, size);
        document.body.removeChild(qrDiv);
        container.appendChild(canvas);
      } else {
        document.body.removeChild(qrDiv);
        new QRCode(container, { text: url, width: size, height: size });
      }
    }, 200);
  } catch (e) {
    document.body.removeChild(qrDiv);
    new QRCode(container, { text: url, width: size, height: size });
  }
}

// =====================
// MESSAGE CREATOR
// =====================
const messageInput = document.getElementById('msg-text');
const charCountEl = document.getElementById('char-count');
const MAX_CHARS = 2000;

function initCategoryDropdown() {
  const categorySelect = document.getElementById('msg-category');
  if (!categorySelect) return;
  
  categorySelect.innerHTML = '<option value="">-- Select Category (Optional) --</option>';
  Object.entries(categoryTeasers).forEach(([key, value]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = `${value.icon} ${value.name}`;
    categorySelect.appendChild(option);
  });
}

function initCreator() {
  if (messageInput) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.length;
      if (charCountEl) charCountEl.textContent = `${len}/${MAX_CHARS}`;
      if (len > MAX_CHARS) {
        messageInput.value = messageInput.value.slice(0, MAX_CHARS);
      }
    });
  }

  const generateBtn = document.getElementById('generate-btn');
  if (generateBtn) {
    generateBtn.addEventListener('click', handleGenerate);
  }
}

function handleGenerate() {
  const msg = (document.getElementById('msg-text')?.value || '').trim();
  const recipient = (document.getElementById('telegram-recipient')?.value || '').trim();
  const senderName = (document.getElementById('msg-from')?.value || '').trim();
  const emoji = (document.getElementById('msg-emoji')?.value || '').trim();
  const category = document.getElementById('msg-category')?.value || '';
  const recipientName = (document.getElementById('recipient-name')?.value || '').trim();

  if (!msg) {
    shakeElement(document.getElementById('msg-text'));
    showToast('Please write a message', true);
    return;
  }
  
  if (!recipient) {
    shakeElement(document.getElementById('telegram-recipient'));
    showToast('Please enter recipient\'s Telegram username', true);
    return;
  }

  // Send via Telegram
  sendAnonymousTelegramMessage(msg, recipient, senderName, emoji, category);
  trackEvent('message_created', { category: category || 'none' });
  incrementCount();
}

function showResult(url, emoji, category) {
  const resultCard = document.getElementById('result-card');
  const linkEl = document.getElementById('share-link');

  if (resultCard) {
    resultCard.classList.add('visible');
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (linkEl) {
    const span = linkEl.querySelector('span');
    if (span) span.textContent = url;
  }

  generateQRWithBackground('qrcode', url, 180, category);
  updateShareButtons(url);
}

function updateShareButtons(url) {
  const text = encodeURIComponent(`Someone left you a secret message 🤫`);
  const fullText = encodeURIComponent(`Someone left you a secret message 🤫 Open it here: ${url}`);

  const wa = document.getElementById('share-wa');
  const fb = document.getElementById('share-fb');
  const tw = document.getElementById('share-tw');

  if (wa) wa.href = `https://wa.me/?text=${fullText}`;
  if (fb) fb.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  if (tw) tw.href = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`;
}

function shakeElement(el) {
  if (!el) return;
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shake 0.4s ease';
  el.addEventListener('animationend', () => el.style.animation = '', { once: true });
}

// =====================
// COPY LINK
// =====================
function initCopyLink() {
  const linkEl = document.getElementById('share-link');
  if (linkEl) {
    linkEl.addEventListener('click', () => {
      const span = linkEl.querySelector('span');
      if (span) {
        copyToClipboard(span.textContent);
        linkEl.classList.add('copied');
        setTimeout(() => linkEl.classList.remove('copied'), 2000);
      }
    });
  }

  const copyBtn = document.getElementById('share-copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      copyToClipboard(window._currentShareUrl || window.location.href);
      copyBtn.textContent = '✅ Copied!';
      setTimeout(() => copyBtn.textContent = '🔗 Copy Link', 2000);
    });
  }
}

// =====================
// TEMPLATES STORE
// =====================
let currentTemplateCategory = 'all';
let currentTemplatePage = 1;
const TEMPLATES_PER_PAGE = 8;
let allTemplates = [];
let isLoadingTemplates = false;

const templateCategories = [
  { id: 'birthday', name: '🎂 Birthday', icon: '🎂', file: 'birthday.json' },
  { id: 'love_romance', name: '❤️ Love & Romance', icon: '❤️', file: 'love_romance.json' },
  { id: 'adult_humor', name: '🔥 Adult Humor', icon: '🔥', file: 'adult_humor.json' },
  { id: 'flirty', name: '💋 Flirty', icon: '💋', file: 'flirty.json' },
  { id: 'wedding', name: '💍 Wedding', icon: '💍', file: 'wedding.json' },
  { id: 'relationship', name: '🤝 Relationship', icon: '🤝', file: 'relationship.json' },
  { id: 'sympathy', name: '😢 Sympathy', icon: '😢', file: 'sympathy.json' },
  { id: 'fun', name: '😂 Fun', icon: '😂', file: 'fun.json' },
  { id: 'holidays', name: '🎄 Holidays', icon: '🎄', file: 'holidays.json' },
  { id: 'islamic', name: '🌙 Islamic', icon: '🌙', file: 'islamic.json' },
  { id: 'nigeria', name: '🇳🇬 Nigeria', icon: '🇳🇬', file: 'nigeria.json' }
];

async function loadTemplates() {
  const grid = document.getElementById('templates-grid');
  if (!grid || isLoadingTemplates) return;
  
  isLoadingTemplates = true;
  grid.innerHTML = '<div class="template-card" style="padding:40px;text-align:center;color:var(--muted);grid-column:1/-1;">Loading templates... ✨</div>';
  
  try {
    allTemplates = [];
    
    for (const cat of templateCategories) {
      try {
        const response = await fetch(`./messages/${cat.file}`);
        if (response.ok) {
          const categoryData = await response.json();
          if (categoryData.messages && Array.isArray(categoryData.messages)) {
            const templatesFromCategory = categoryData.messages.map((msg, index) => ({
              id: `${cat.id}_${msg.id || index}`,
              title: `${cat.icon} ${categoryData.category || cat.name}`,
              message: msg.text,
              emoji: msg.logo || cat.icon,
              from: "Secret Admirer",
              category: cat.id,
              original_text: msg.text
            }));
            allTemplates.push(...templatesFromCategory);
          }
        }
      } catch (e) {
        console.warn(`Error loading ${cat.file}:`, e);
      }
    }
    
    if (allTemplates.length === 0) {
      allTemplates = FALLBACK_TEMPLATES;
    }
    
    renderTemplateCategoryTabs();
    renderTemplatesByCategory('all');
    
  } catch (error) {
    console.error('Error loading templates:', error);
    grid.innerHTML = '<div class="template-card" style="padding:40px;text-align:center;color:var(--muted);grid-column:1/-1;">Failed to load templates. Refresh page. 🔄</div>';
    allTemplates = FALLBACK_TEMPLATES;
    renderTemplateCategoryTabs();
    renderTemplatesByCategory('all');
  }
  
  isLoadingTemplates = false;
}

function renderTemplateCategoryTabs() {
  const templatesSection = document.getElementById('templates');
  const existingTabs = document.querySelector('.category-tabs');
  if (existingTabs) existingTabs.remove();
  
  const categories = [
    { id: 'all', name: '✨ All Categories', icon: '✨' },
    ...templateCategories
  ];
  
  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'category-tabs';
  tabsContainer.innerHTML = categories.map(cat => `
    <button class="category-tab ${cat.id === currentTemplateCategory ? 'active' : ''}" data-category="${cat.id}">
      ${cat.icon} ${cat.name}
    </button>
  `).join('');
  
  templatesSection.insertBefore(tabsContainer, document.getElementById('templates-grid'));
  
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTemplateCategory = tab.dataset.category;
      currentTemplatePage = 1;
      renderTemplatesByCategory(currentTemplateCategory);
    });
  });
}

function renderTemplatesByCategory(category) {
  const grid = document.getElementById('templates-grid');
  if (!grid) return;
  
  let filteredTemplates = allTemplates;
  if (category !== 'all') {
    filteredTemplates = allTemplates.filter(t => t.category === category);
  }
  
  if (filteredTemplates.length === 0) {
    grid.innerHTML = `<div class="template-card" style="padding:40px;text-align:center;color:var(--muted);grid-column:1/-1;">No templates in this category yet.</div>`;
    const existingButtons = document.querySelector('.template-load-buttons');
    if (existingButtons) existingButtons.remove();
    return;
  }
  
  const startIndex = (currentTemplatePage - 1) * TEMPLATES_PER_PAGE;
  const endIndex = startIndex + TEMPLATES_PER_PAGE;
  const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex);
  const hasMore = endIndex < filteredTemplates.length;
  const hasLess = currentTemplatePage > 1;
  
  renderTemplateCards(paginatedTemplates, grid);
  updateTemplateLoadButtons(hasMore, hasLess, filteredTemplates.length, category);
}

function renderTemplateCards(templates, grid) {
  grid.innerHTML = '';
  
  templates.forEach((tpl, i) => {
    const messageText = tpl.original_text || tpl.message;
    const params = { 
      msg: messageText, 
      from: tpl.from || "Secret Admirer", 
      emoji: tpl.emoji,
      category: tpl.category
    };
    const hash = '#' + encodeParams(params);
    const url = window.location.origin + window.location.pathname + hash;

    const card = document.createElement('div');
    card.className = 'template-card';
    card.style.animationDelay = `${i * 0.05}s`;

    card.innerHTML = `
      <div class="tooltip">${escapeHtml(messageText.slice(0, 80))}...</div>
      <div class="template-qr" id="tpl-qr-${tpl.id.replace(/[^a-zA-Z0-9]/g, '_')}"></div>
      <div class="template-body">
        <div class="template-title">${escapeHtml(tpl.title)}</div>
        <div class="template-preview">${escapeHtml(messageText.substring(0, 100))}...</div>
        <div class="template-buttons">
          <button class="template-share-link-btn" data-url="${encodeURIComponent(url)}">
            🔗 Copy Link
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);

    setTimeout(() => {
      generateQRWithBackground(`tpl-qr-${tpl.id.replace(/[^a-zA-Z0-9]/g, '_')}`, url, 110, tpl.category);
    }, i * 50);

    const shareLinkBtn = card.querySelector('.template-share-link-btn');
    if (shareLinkBtn) {
      shareLinkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const shareUrl = decodeURIComponent(shareLinkBtn.dataset.url);
        copyToClipboard(shareUrl);
        shareLinkBtn.textContent = '✅ Copied!';
        setTimeout(() => {
          shareLinkBtn.textContent = '🔗 Copy Link';
        }, 2000);
      });
    }

    card.addEventListener('click', (e) => {
      if (!e.target.closest('.template-share-link-btn')) {
        const shareUrl = decodeURIComponent(card.querySelector('.template-share-link-btn').dataset.url);
        window.location.href = shareUrl;
      }
    });
  });
}

function updateTemplateLoadButtons(hasMore, hasLess, totalCount, category) {
  const existingButtons = document.querySelector('.template-load-buttons');
  if (existingButtons) existingButtons.remove();
  
  if (!hasMore && !hasLess) return;
  
  const grid = document.getElementById('templates-grid');
  
  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'template-load-buttons';
  
  buttonsDiv.innerHTML = `
    ${hasLess ? '<button class="btn-load-less" id="template-load-less">⬆️ Load Less</button>' : ''}
    ${hasMore ? '<button class="btn-load-more" id="template-load-more">Load More ⬇️</button>' : ''}
    <span class="template-count">Showing ${Math.min(currentTemplatePage * TEMPLATES_PER_PAGE, totalCount)} of ${totalCount}</span>
  `;
  
  grid.parentNode.insertBefore(buttonsDiv, grid.nextSibling);
  
  const loadMoreBtn = document.getElementById('template-load-more');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      currentTemplatePage++;
      renderTemplatesByCategory(currentTemplateCategory);
      document.getElementById('templates').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  
  const loadLessBtn = document.getElementById('template-load-less');
  if (loadLessBtn) {
    loadLessBtn.addEventListener('click', () => {
      currentTemplatePage--;
      renderTemplatesByCategory(currentTemplateCategory);
      document.getElementById('templates').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

const FALLBACK_TEMPLATES = [
  { id: 'f1', title: "🎂 Someone secretly likes you", message: "Someone out there notices you — in the best way possible.", emoji: "👀", from: "Secret Admirer", category: "birthday", original_text: "Someone out there notices you — in the best way possible." },
  { id: 'f2', title: "🌟 A message from your future self", message: "It all works out. Keep going — future you is proud of you.", emoji: "🌟", from: "Future You", category: "love_romance", original_text: "It all works out. Keep going — future you is proud of you." },
  { id: 'f3', title: "☀️ Someone noticed your smile", message: "Your smile lit up the whole room. Someone couldn't look away.", emoji: "☀️", from: "Silent Observer", category: "flirty", original_text: "Your smile lit up the whole room. Someone couldn't look away." },
  { id: 'f4', title: "💜 You are appreciated", message: "Someone thinks about you more than you know. They appreciate your kindness.", emoji: "💜", from: "Someone Who Cares", category: "relationship", original_text: "Someone thinks about you more than you know." }
];

// =====================
// COMPLETE CHAT SEQUENCE WITH SCRATCH REVEAL & LINE-BY-LINE
// =====================
let chatActive = false;
let currentMessageRevealed = false;

function checkAndLoadChat() {
  const hash = window.location.hash;
  const params = decodeHash(hash);
  if (params.msg && !chatActive) {
    chatActive = true;
    openChat(params);
  }
}

function openChat(params) {
  const overlay = document.getElementById('chat-overlay');
  if (!overlay) return;
  
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  const category = params.category || 'love_romance';
  const avatarEmoji = params.emoji || getCategoryIcon(category);
  const chatAvatarEl = overlay.querySelector('.chat-avatar');
  if (chatAvatarEl) chatAvatarEl.textContent = avatarEmoji;
  
  const splashIcon = overlay.querySelector('.splash-icon');
  if (splashIcon) splashIcon.textContent = avatarEmoji;
  
  trackEvent('message_opened', { category: category });
  startChatSequence(params);
}

function closeChat() {
  const overlay = document.getElementById('chat-overlay');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
  chatActive = false;
  currentMessageRevealed = false;
  history.pushState('', document.title, window.location.pathname + window.location.search);
}

async function startChatSequence(params) {
  const splash = document.getElementById('chat-splash');
  const messagesEl = document.getElementById('chat-messages');
  const category = params.category || 'love_romance';
  const messageText = params.msg;
  const messageLogo = params.emoji || getCategoryIcon(category);
  const recipientName = params.recipient || 'there';
  const senderName = params.from || null;
  
  if (!messagesEl) return;
  
  messagesEl.innerHTML = '';
  
  await sleep(3000);
  
  if (splash) {
    splash.classList.add('hide');
    await sleep(600);
    splash.style.display = 'none';
  }
  
  appendDateDivider(messagesEl, 'Today');
  
  // ========== STEP 1: TIME GREETING ==========
  const hour = new Date().getHours();
  let greeting = "Hello";
  let greetingEmoji = "👋";
  if (hour < 12) { greeting = "Good morning"; greetingEmoji = "🌅"; }
  else if (hour < 17) { greeting = "Good afternoon"; greetingEmoji = "☀️"; }
  else if (hour < 21) { greeting = "Good evening"; greetingEmoji = "🌆"; }
  else { greeting = "Good night"; greetingEmoji = "🌙"; }
  
  await showTyping(messagesEl, 1200);
  appendBubble(messagesEl, 'in', `${greetingEmoji} ${greeting}, ${recipientName}! ✨`, messageLogo);
  await sleep(1500);
  
  // ========== STEP 2: RANDOM TEASERS FROM CATEGORY ==========
  const randomTeasers = getRandomTeasers(category, 4);
  
  for (let i = 0; i < randomTeasers.length; i++) {
    await showTyping(messagesEl, 1200);
    let teaserEmoji = messageLogo;
    const emojiMatch = randomTeasers[i].match(/^([\u{1F300}-\u{1F9FF}])\s/iu);
    if (emojiMatch) teaserEmoji = emojiMatch[1];
    appendBubble(messagesEl, 'in', randomTeasers[i], teaserEmoji);
    await sleep(2000 + Math.random() * 500);
  }
  
  // ========== STEP 3: ANTICIPATION ==========
  await showTyping(messagesEl, 1000);
  appendBubble(messagesEl, 'in', "💭 They've been waiting to share this with you...", "💭");
  await sleep(1800);
  
  await showTyping(messagesEl, 800);
  appendBubble(messagesEl, 'in', "⏰ The moment has arrived...", "⏰");
  await sleep(1500);
  
  // ========== STEP 4: SCRATCH CARD FOR MESSAGE REVEAL ==========
  await showTyping(messagesEl, 1200);
  appendBubble(messagesEl, 'in', "✨ Their message is hidden below. Scratch to reveal it... ✨", "✨");
  await sleep(1000);
  
  const scratchId = Date.now().toString();
  const scratchHtml = createMessageScratchCard(scratchId);
  appendHtmlBubble(messagesEl, 'in', scratchHtml, "🎫");
  
  // Initialize scratch card
  await sleep(500);
  
  // Wait for scratch completion
  await new Promise((resolve) => {
    let resolved = false;
    
    const checkInterval = setInterval(() => {
      const contentDiv = document.getElementById(`scratch-message-content-${scratchId}`);
      if (contentDiv && contentDiv.style.display === 'block' && !resolved) {
        resolved = true;
        clearInterval(checkInterval);
        resolve();
      }
    }, 500);
    
    // Timeout after 30 seconds
    setTimeout(() => {
      if (!resolved) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 30000);
  });
  
  // Update the content div with loading state then reveal
  const contentDiv = document.getElementById(`scratch-message-content-${scratchId}`);
  if (contentDiv) {
    contentDiv.innerHTML = '<div class="scratch-loading">✨ Preparing your message... ✨</div>';
    await sleep(800);
    
    // Start revealing line by line
    contentDiv.innerHTML = '<div class="scratch-message-reveal" id="line-reveal-container"></div>';
    const revealContainer = contentDiv.querySelector('.scratch-message-reveal');
    
    // Reveal message line by line with suspense
    await revealMessageInContainer(revealContainer, messageText, messageLogo);
  }
  
  await sleep(1000);
  
  // ========== STEP 5: SENDER REVEAL ==========
  if (senderName) {
    await showTyping(messagesEl, 1000);
    appendBubble(messagesEl, 'in', `— ${senderName} ${params.emoji || messageLogo}`, messageLogo);
  } else {
    await sleep(800);
    const anonymousSenders = ["— Someone who cares", "— A secret admirer", "— Someone thinking of you", "— Your secret sender"];
    const randomSender = anonymousSenders[Math.floor(Math.random() * anonymousSenders.length)];
    appendBubble(messagesEl, 'in', `${randomSender} ${params.emoji || '💌'}`, messageLogo);
  }
  
  // ========== STEP 6: REPLY OPTION ==========
  await sleep(1500);
  
  const replyCta = document.createElement('div');
  replyCta.className = 'reveal-cta';
  replyCta.innerHTML = `
    <p>💝 Want to reply to your anonymous secret admirer? 💝</p>
    <p style="font-size:0.8rem; margin-bottom:1rem;">Create your own anonymous message to send back!</p>
    <button class="btn-primary" onclick="goToCreator()">
      ✨ Send Anonymous Reply
    </button>
  `;
  messagesEl.appendChild(replyCta);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  
  incrementCount();
}

// Helper function to reveal message line by line inside a container
async function revealMessageInContainer(container, message, avatarEmoji) {
  // Split into lines/sentences for dramatic effect
  const lines = splitMessageIntoLines(message);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineDiv = document.createElement('div');
    lineDiv.className = 'reveal-line';
    lineDiv.style.opacity = '0';
    lineDiv.style.transform = 'translateY(10px)';
    lineDiv.style.transition = 'all 0.3s ease';
    lineDiv.innerHTML = `<span class="reveal-emoji">${avatarEmoji}</span> <span class="reveal-text">${escapeHtml(line)}</span>`;
    container.appendChild(lineDiv);
    
    // Animate in
    setTimeout(() => {
      lineDiv.style.opacity = '1';
      lineDiv.style.transform = 'translateY(0)';
    }, 100);
    
    // Scroll to show new line
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Delay between lines based on length
    const delay = Math.min(800 + line.length * 20, 2000);
    await sleep(delay);
  }
}

function appendHtmlBubble(container, direction, html, avatarEmoji = '🤖') {
  const wrap = document.createElement('div');
  wrap.className = `msg-wrap ${direction}`;
  
  if (direction === 'in') {
    wrap.innerHTML = `
      <div class="msg-avatar-sm">${escapeHtml(avatarEmoji)}</div>
      <div class="bubble in">
        ${html}
        <div class="time">${getTime()}</div>
      </div>
    `;
  } else {
    wrap.innerHTML = `
      <div class="bubble out">
        ${html}
        <div class="time">${getTime()} ✓✓</div>
      </div>
    `;
  }
  
  container.appendChild(wrap);
  container.scrollTop = container.scrollHeight;
  
  // Initialize scratch card if present
  const scratchCanvas = wrap.querySelector('.message-scratch-canvas');
  if (scratchCanvas) {
    const canvasId = scratchCanvas.id;
    initMessageScratchCard(canvasId, () => {
      // On reveal complete - this is handled by the interval in startChatSequence
    });
  }
}

function appendDateDivider(container, text) {
  const div = document.createElement('div');
  div.className = 'msg-date-divider';
  div.textContent = text;
  container.appendChild(div);
}

function appendBubble(container, direction, text, avatarEmoji, isMain = false) {
  const wrap = document.createElement('div');
  wrap.className = `msg-wrap ${direction}`;
  const time = getTime();

  if (direction === 'in') {
    wrap.innerHTML = `
      <div class="msg-avatar-sm">${escapeHtml(avatarEmoji || '🤖')}</div>
      <div class="bubble in${isMain ? ' main-msg' : ''}">
        ${escapeHtml(text)}
        <div class="time">${time}</div>
      </div>
    `;
  } else {
    wrap.innerHTML = `
      <div class="bubble out">
        ${escapeHtml(text)}
        <div class="time">${time} ✓✓</div>
      </div>
    `;
  }
  container.appendChild(wrap);
  container.scrollTop = container.scrollHeight;
}

async function showTyping(container, duration) {
  const wrap = document.createElement('div');
  wrap.className = 'typing-indicator';
  wrap.id = 'typing-wrap';
  wrap.innerHTML = `
    <div class="msg-avatar-sm">🤖</div>
    <div class="typing-bubble">
      <span></span><span></span><span></span>
    </div>
  `;
  container.appendChild(wrap);
  container.scrollTop = container.scrollHeight;
  await sleep(duration);
  const existing = document.getElementById('typing-wrap');
  if (existing) existing.remove();
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

function goToCreator() {
  closeChat();
  setTimeout(() => {
    const creator = document.getElementById('creator');
    if (creator) creator.scrollIntoView({ behavior: 'smooth' });
  }, 300);
}

// =====================
// INITIALIZATION
// =====================
function initEmojiPicker() {
  const emojis = ['💌', '💜', '❤️', '🔥', '👀', '🌹', '✨', '🥺', '😍', '🫶', '😘', '💋', '🎂', '🎉', '🌟', '💎', '🌸', '🦋', '⭐', '💫', '⚡', '💕', '💖', '💗', '💓', '💞', '💝', '🎁'];
  const container = document.getElementById('emoji-quick');
  if (!container) return;
  
  emojis.forEach(em => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = em;
    btn.className = 'emoji-pick-btn';
    btn.addEventListener('click', () => {
      const input = document.getElementById('msg-emoji');
      if (input) input.value = em;
    });
    container.appendChild(btn);
  });
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fade-up 0.6s ease both';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.template-card, .creator-form-card, .result-card').forEach(el => observer.observe(el));
}

function scrollToCreator() {
  const el = document.getElementById('creator');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function animateCounter() {
  const el = document.getElementById('msg-count');
  if (!el) return;
  const target = getCount();
  let current = Math.max(COUNTER_SEED, target - 100);
  const step = Math.ceil(100 / 40);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString() + '+';
    if (current >= target) clearInterval(timer);
  }, 20);
}

document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded, initializing app...');
  
  checkAndLoadChat();
  updateCounterDisplay();
  initCreator();
  initCopyLink();
  loadTemplates();
  initScrollAnimations();
  initEmojiPicker();
  initCategoryDropdown();
  
  const backBtn = document.getElementById('chat-back');
  if (backBtn) backBtn.addEventListener('click', closeChat);
  
  window.addEventListener('hashchange', () => {
    if (!chatActive) checkAndLoadChat();
  });
  
  document.querySelectorAll('[data-scroll-creator]').forEach(btn => {
    btn.addEventListener('click', scrollToCreator);
  });
  
  animateCounter();
});

// Add CSS for new elements
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-6px); }
    40%, 80% { transform: translateX(6px); }
  }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scratchPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(192,132,252,0.4); }
    50% { box-shadow: 0 0 0 10px rgba(192,132,252,0); }
  }
  
  .emoji-pick-btn {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.15s;
  }
  .emoji-pick-btn:hover {
    background: var(--card-hover);
    transform: scale(1.15);
  }
  
  .bubble.main-msg {
    background: linear-gradient(135deg, #1e1e32, #2a1a3e);
    border: 1px solid rgba(192,132,252,0.15);
  }
  
  .template-buttons {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }
  .template-share-link-btn {
    flex: 1;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    background: rgba(192,132,252,0.1);
    border: 1px solid rgba(192,132,252,0.2);
    color: #c084fc;
    font-family: inherit;
  }
  .template-share-link-btn:hover {
    background: rgba(192,132,252,0.2);
  }
  
  .category-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 24px;
    justify-content: center;
  }
  .category-tab {
    padding: 8px 16px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 40px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    font-size: 0.85rem;
    color: var(--text-secondary);
  }
  .category-tab.active {
    background: linear-gradient(135deg, #c084fc, #818cf8);
    color: white;
    border-color: transparent;
  }
  
  .template-load-buttons {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 32px;
    align-items: center;
    flex-wrap: wrap;
  }
  .btn-load-more, .btn-load-less {
    background: linear-gradient(135deg, #c084fc, #818cf8);
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 40px;
    cursor: pointer;
    font-weight: 600;
  }
  .template-count {
    font-size: 0.8rem;
    color: var(--text-muted);
  }
  
  /* Scratch Card Styles */
  .scratch-message-container {
    text-align: center;
    padding: 10px;
  }
  .scratch-card-label {
    font-size: 0.8rem;
    color: #c084fc;
    margin-bottom: 10px;
    font-weight: 500;
  }
  .scratch-area {
    position: relative;
    display: inline-block;
  }
  .message-scratch-canvas {
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    animation: scratchPulse 2s infinite;
  }
  .scratch-overlay-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.75rem;
    color: white;
    font-weight: bold;
    text-shadow: 1px 1px 2px black;
    pointer-events: none;
    white-space: nowrap;
  }
  .scratch-message-hidden {
    background: linear-gradient(135deg, #1e1e32, #2a1a3e);
    border-radius: 16px;
    padding: 20px;
    margin-top: 10px;
    border: 1px solid rgba(192,132,252,0.3);
    text-align: left;
  }
  .scratch-loading {
    text-align: center;
    color: #c084fc;
    padding: 20px;
  }
  .scratch-message-reveal {
    max-height: 300px;
    overflow-y: auto;
  }
  .reveal-line {
    margin-bottom: 12px;
    padding: 6px 0;
    border-bottom: 1px solid rgba(192,132,252,0.1);
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }
  .reveal-emoji {
    font-size: 1.2rem;
    min-width: 30px;
  }
  .reveal-text {
    flex: 1;
    line-height: 1.5;
    color: var(--text-primary);
  }
  
  .typing-indicator {
    display: flex;
    gap: 10px;
    margin: 8px 0;
  }
  .typing-bubble {
    background: var(--bg-secondary);
    padding: 12px 16px;
    border-radius: 18px;
    border-bottom-left-radius: 4px;
    display: flex;
    gap: 4px;
  }
  .typing-bubble span {
    width: 6px;
    height: 6px;
    background: var(--text-muted);
    border-radius: 50%;
    animation: typing 1.4s infinite;
  }
  .typing-bubble span:nth-child(2) { animation-delay: 0.2s; }
  .typing-bubble span:nth-child(3) { animation-delay: 0.4s; }
  
  @keyframes typing {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-6px); opacity: 1; }
  }
  
  .reveal-cta {
    background: linear-gradient(135deg, rgba(192,132,252,0.1), rgba(129,140,248,0.1));
    border-radius: 20px;
    padding: 1.5rem;
    text-align: center;
    margin-top: 1rem;
    border: 1px solid rgba(192,132,252,0.2);
  }
  .reveal-cta p {
    margin-bottom: 1rem;
  }
  .btn-primary {
    background: linear-gradient(135deg, #c084fc, #818cf8);
    border: none;
    padding: 10px 24px;
    border-radius: 40px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
  }
`;
document.head.appendChild(styleSheet);






