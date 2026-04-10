/* ===========================
   Anonymous Group Messenger
   script.js - Group Bot Version
   =========================== */

'use strict';

// =====================
// CONFIGURATION
// =====================
const WORKER_API_URL = 'https://anonymous-telegram-bot.voicedontdie.workers.dev';

// =====================
// CATEGORY TEASERS
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
      "🎉 Party time! Someone sent birthday love your way..."
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
      "😍 Someone can't stop thinking about you..."
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
      "😉 Someone thinks you're hot... literally..."
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
      "💌 A little flirtation is heading your way..."
    ]
  },
  wedding: {
    name: "Wedding",
    icon: "💍",
    teasers: [
      "💍 Wedding bells! Someone has a special message for the happy couple...",
      "💒 Love is in the air... a wedding message awaits...",
      "🥂 A toast to love! Someone sent wedding wishes...",
      "👰‍♀️🤵‍♂️ Congratulations are in order...",
      "💐 Someone's thinking of you on your special day..."
    ]
  },
  relationship: {
    name: "Relationship",
    icon: "🤝",
    teasers: [
      "🤝 Someone wants to make things right between you...",
      "💬 A heartfelt message about your relationship is waiting...",
      "🙏 Someone's grateful for you...",
      "💪 Let's work on us...",
      "🫂 An apology or appreciation is coming your way..."
    ]
  },
  sympathy: {
    name: "Sympathy",
    icon: "😢",
    teasers: [
      "😢 Someone's thinking of you during this difficult time...",
      "🫂 A comforting message is waiting...",
      "💪 You're not alone...",
      "🌧️ Sending love and strength...",
      "🤗 A virtual hug is coming your way..."
    ]
  },
  fun: {
    name: "Fun",
    icon: "😂",
    teasers: [
      "😂 Someone's got a joke that'll make your day...",
      "🎉 Ready to laugh? A funny message awaits...",
      "🤪 Something silly is coming your way...",
      "😜 Someone wants to prank you...",
      "🃏 Get ready to smile..."
    ]
  },
  holidays: {
    name: "Holidays",
    icon: "🎄",
    teasers: [
      "🎄 Ho ho ho! Someone sent holiday cheer...",
      "🎆 Happy celebrations!",
      "🥂 Cheers to the holidays!",
      "🎁 A holiday surprise is wrapped and ready...",
      "✨ Holiday magic is in the air..."
    ]
  },
  islamic: {
    name: "Islamic",
    icon: "🌙",
    teasers: [
      "🌙 Eid Mubarak! Someone's sending you blessings...",
      "🕌 A special Islamic greeting is waiting...",
      "🤲 Duas and love coming your way...",
      "🌟 May Allah bless you...",
      "📿 A spiritual message awaits..."
    ]
  },
  nigeria: {
    name: "Nigeria",
    icon: "🇳🇬",
    teasers: [
      "🇳🇬 Proudly Nigerian! Someone's celebrating with you...",
      "🦅 A message from the heart of Africa awaits...",
      "🎉 Naija no dey carry last!",
      "💚🤍💚 Someone's thinking of you...",
      "🥘 Jollof love coming your way..."
    ]
  }
};

function getRandomTeasers(category, count = 4) {
  const teaserList = categoryTeasers[category]?.teasers || [
    "🤫 Shh... I have a secret to tell you...",
    "✨ Someone sent you something special...",
    "💭 They've been thinking about you all day...",
    "🎁 It's a message just for you...",
    "💌 Are you ready to hear what they said?"
  ];
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
// CREATE SECRET MESSAGE (Sends to Group)
// =====================
async function createSecretMessage(message, recipientTelegram, senderName, emoji, category) {
  const statusDiv = document.getElementById('delivery-status');
  
  if (statusDiv) {
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = '📤 Sending your anonymous message to the group...';
    statusDiv.style.background = 'rgba(192,132,252,0.1)';
  }
  
  try {
    console.log('Sending to worker:', WORKER_API_URL);
    console.log('Recipient:', recipientTelegram);
    console.log('Message:', message.substring(0, 50));
    
    const response = await fetch(`${WORKER_API_URL}/api/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        recipientTelegram: recipientTelegram,
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
        statusDiv.innerHTML = `✅ Your anonymous message has been posted to the group for @${recipientTelegram.replace('@', '')}! They can reply anonymously.`;
      }
      showToast('✅ Message sent to group!');
      
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
    console.error('Create error:', error);
    if (statusDiv) {
      statusDiv.style.background = 'rgba(239,68,68,0.1)';
      statusDiv.innerHTML = `❌ Failed: ${error.message}`;
    }
    showToast('❌ Failed to send message', true);
  }
}

// =====================
// LOAD MESSAGE (for secret link - optional)
// =====================
async function loadSecretMessage(messageId) {
  try {
    const response = await fetch(`${WORKER_API_URL}/api/message?id=${messageId}`);
    const result = await response.json();
    
    if (result.success) {
      return result;
    } else {
      showToast('Message not found or expired', true);
      return null;
    }
  } catch (error) {
    console.error('Load error:', error);
    return null;
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
  if (el) el.textContent = getCount().toLocaleString() + '+';
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
    generateBtn.removeEventListener('click', handleGenerate);
    generateBtn.addEventListener('click', handleGenerate);
  }
}

function handleGenerate() {
  const msg = (document.getElementById('msg-text')?.value || '').trim();
  const recipient = (document.getElementById('telegram-recipient')?.value || '').trim();
  const senderName = (document.getElementById('msg-from')?.value || '').trim();
  const emoji = (document.getElementById('msg-emoji')?.value || '').trim();
  const category = document.getElementById('msg-category')?.value || '';

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

  // Send to group via worker
  createSecretMessage(msg, recipient, senderName, emoji, category);
  incrementCount();
}

function shakeElement(el) {
  if (!el) return;
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shake 0.4s ease';
  el.addEventListener('animationend', () => el.style.animation = '', { once: true });
}

// =====================
// TEMPLATES (simplified)
// =====================
async function loadTemplates() {
  const grid = document.getElementById('templates-grid');
  if (!grid) return;
  
  grid.innerHTML = '<div class="template-card" style="padding:40px;text-align:center;">Loading templates... ✨</div>';
  
  // Use fallback templates for now
  const templates = [
    { id: 1, title: "🎂 Birthday Surprise", message: "Happy Birthday! Someone is thinking of you today! 🎂", emoji: "🎂", category: "birthday" },
    { id: 2, title: "❤️ Secret Crush", message: "I've been wanting to tell you... you're amazing! ❤️", emoji: "❤️", category: "love_romance" },
    { id: 3, title: "🔥 You're Hot", message: "Just saying... you're looking good today! 🔥", emoji: "🔥", category: "adult_humor" },
    { id: 4, title: "💋 Flirty Vibes", message: "Hey there... someone thinks you're cute! 💋", emoji: "💋", category: "flirty" }
  ];
  
  grid.innerHTML = templates.map(tpl => `
    <div class="template-card" onclick="useTemplate('${tpl.message}', '${tpl.emoji}', '${tpl.category}')">
      <div class="template-body">
        <div class="template-title">${tpl.title}</div>
        <div class="template-preview">${tpl.message.substring(0, 80)}...</div>
      </div>
    </div>
  `).join('');
}

function useTemplate(message, emoji, category) {
  document.getElementById('msg-text').value = message;
  document.getElementById('msg-emoji').value = emoji;
  const categorySelect = document.getElementById('msg-category');
  if (categorySelect) categorySelect.value = category;
  showToast('Template loaded! Ready to send.');
}

// =====================
// INITIALIZATION
// =====================
function initEmojiPicker() {
  const emojis = ['💌', '💜', '❤️', '🔥', '👀', '🌹', '✨', '🥺', '😍', '🫶', '😘', '💋', '🎂', '🎉', '🌟'];
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

// Make functions global
window.useTemplate = useTemplate;
window.scrollToCreator = scrollToCreator;

document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded, initializing Group Messenger...');
  
  updateCounterDisplay();
  initCreator();
  loadTemplates();
  initScrollAnimations();
  initEmojiPicker();
  initCategoryDropdown();
  
  document.querySelectorAll('[data-scroll-creator]').forEach(btn => {
    btn.addEventListener('click', scrollToCreator);
  });
  
  animateCounter();
});

// Add CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-6px); }
    40%, 80% { transform: translateX(6px); }
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
  
  .template-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.3s;
  }
  .template-card:hover {
    transform: translateY(-4px);
    border-color: #c084fc;
  }
  .template-title {
    font-weight: 600;
    margin-bottom: 8px;
  }
  .template-preview {
    font-size: 0.8rem;
    color: var(--subtext);
  }
  
  .templates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
  
  #delivery-status {
    margin-top: 16px;
    padding: 12px;
    border-radius: 12px;
    font-size: 0.85rem;
    text-align: center;
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