/* ===========================
   Anonymous AI Messenger - FINAL VERSION
   Telegram Web App Integration
   =========================== */

'use strict';

// =====================
// CONFIGURATION
// =====================
const WORKER_API_URL = 'https://anonymous-telegram-bot.voicedontdie.workers.dev';


const WEBSITE_URL = 'https://anonymousmessenger.voddic.com.ng';


// =====================
// TELEGRAM WEB APP DETECTION
// =====================
let tg = null;
if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
  tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();
  console.log('✅ Running in Telegram Web App');
}

// =====================
// EXPANDABLE TEASERS POOL
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
      "🥳 Someone's celebrating YOU from afar..."
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
      "🌙 Under the moonlight, someone wrote you a message..."
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
      "💦 Someone's got a confession that might make you blush...",
      "😈 A little devilish message is waiting for you...",
      "🍒 Someone's feeling cheeky today...",
      "🔥 Your secret admirer is feeling extra bold..."
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
      "😊 Someone's smiling just thinking about telling you this..."
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
      "🎊 Congratulations! Someone wants to celebrate with you..."
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
      "💪 A message about us is waiting to be read..."
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
      "💪 You're stronger than you know... open for a reminder..."
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
      "🦄 Something magical and silly is waiting..."
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
      "🎊 Let the celebrations begin! A holiday greeting awaits..."
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
      "📖 Someone found a verse that reminded them of you..."
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
      "💚 One Nigeria, one love... a message awaits..."
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
// CREATE SECRET MESSAGE (Web App)
// =====================
async function createSecretMessage(message, recipientTelegram, senderName, emoji, category, senderTelegram) {
  const statusDiv = document.getElementById('delivery-status');
  
  if (statusDiv) {
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = '🔐 Creating your secret message...';
  }
  
  try {
    const response = await fetch(`${WORKER_API_URL}/api/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        recipientTelegram: recipientTelegram,
        senderName: senderName || 'Secret Admirer',
        category: category || 'general',
        emoji: emoji || '💌',
        senderTelegram: senderTelegram || null
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      if (statusDiv) {
        statusDiv.style.background = 'rgba(16,185,129,0.1)';
        statusDiv.innerHTML = `✅ Secret message sent to @${recipientTelegram.replace('@', '')}! They'll receive a button to tap and reveal.`;
      }
      showToast('✅ Message sent anonymously!');
      
      // Clear form
      document.getElementById('msg-text').value = '';
      document.getElementById('telegram-recipient').value = '';
      document.getElementById('msg-from').value = '';
      
      setTimeout(() => {
        if (statusDiv) statusDiv.style.display = 'none';
      }, 5000);
      
      return result;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Create error:', error);
    if (statusDiv) {
      statusDiv.style.background = 'rgba(239,68,68,0.1)';
      statusDiv.innerHTML = `❌ Failed: ${error.message}`;
    }
    showToast('❌ Failed to send message', true);
    return null;
  }
}

// =====================
// LOAD MESSAGE (when user clicks Web App button)
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
// SEND REPLY
// =====================
async function sendReply(messageId, replyMessage, replierTelegram) {
  try {
    const response = await fetch(`${WORKER_API_URL}/api/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messageId: messageId,
        replyMessage: replyMessage,
        replierTelegram: replierTelegram || null
      })
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Reply error:', error);
    return { success: false, error: error.message };
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
  const senderTelegram = (document.getElementById('sender-telegram')?.value || '').trim();

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

  createSecretMessage(msg, recipient, senderName, emoji, category, senderTelegram);
  trackEvent('message_created', { category: category || 'none' });
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
// TEMPLATES
// =====================
let currentTemplateCategory = 'all';
let currentTemplatePage = 1;
const TEMPLATES_PER_PAGE = 8;
let allTemplates = [];

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
  if (!grid) return;
  
  grid.innerHTML = '<div class="template-card" style="padding:40px;text-align:center;">Loading templates... ✨</div>';
  
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
    
    renderTemplateCategoryTabs();
    renderTemplatesByCategory('all');
    
  } catch (error) {
    console.error('Error loading templates:', error);
    grid.innerHTML = '<div class="template-card" style="padding:40px;text-align:center;">Failed to load templates. Refresh page. 🔄</div>';
  }
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
    grid.innerHTML = `<div class="template-card" style="padding:40px;text-align:center;">No templates in this category yet.</div>`;
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

// =====================
// CHAT SEQUENCE
// =====================
let chatActive = false;

function checkAndLoadChat() {
  const urlParams = new URLSearchParams(window.location.search);
  const messageId = urlParams.get('id');
  
  if (messageId && !chatActive) {
    chatActive = true;
    loadSecretMessage(messageId).then(messageData => {
      if (messageData) {
        openChat({
          msg: messageData.message,
          from: messageData.senderName,
          emoji: messageData.emoji,
          category: messageData.category,
          messageId: messageId
        });
      } else {
        document.getElementById('chat-overlay').classList.add('active');
        document.getElementById('chat-messages').innerHTML = `
          <div style="text-align:center;padding:50px;">
            <div style="font-size:3rem;">😢</div>
            <h3>Message Not Found</h3>
            <p>This secret message may have expired or been deleted.</p>
            <button class="btn-primary" onclick="closeChat()">Go Back</button>
          </div>
        `;
      }
    });
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
  
  startChatSequence(params);
}

function closeChat() {
  const overlay = document.getElementById('chat-overlay');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
  chatActive = false;
  if (tg) tg.close();
  history.pushState('', document.title, window.location.pathname + window.location.search);
}

function splitMessageIntoLines(message) {
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

function splitMessageIntoWordChunks(message, wordsPerChunk = 8) {
  const words = message.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    chunks.push(words.slice(i, i + wordsPerChunk).join(' '));
  }
  return chunks;
}

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

async function startChatSequence(params) {
  const splash = document.getElementById('chat-splash');
  const messagesEl = document.getElementById('chat-messages');
  const category = params.category || 'love_romance';
  const messageText = params.msg;
  const messageLogo = params.emoji || getCategoryIcon(category);
  const recipientName = params.recipient || 'there';
  const senderName = params.from || null;
  const messageId = params.messageId;
  
  if (!messagesEl) return;
  
  messagesEl.innerHTML = '';
  
  await sleep(3000);
  
  if (splash) {
    splash.classList.add('hide');
    await sleep(600);
    splash.style.display = 'none';
  }
  
  appendDateDivider(messagesEl, 'Today');
  
  // Time greeting
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
  
  // Random teasers
  const randomTeasers = getRandomTeasers(category, 4);
  for (let i = 0; i < randomTeasers.length; i++) {
    await showTyping(messagesEl, 1200);
    let teaserEmoji = messageLogo;
    const emojiMatch = randomTeasers[i].match(/^([\u{1F300}-\u{1F9FF}])\s/iu);
    if (emojiMatch) teaserEmoji = emojiMatch[1];
    appendBubble(messagesEl, 'in', randomTeasers[i], teaserEmoji);
    await sleep(2000 + Math.random() * 500);
  }
  
  // Anticipation
  await showTyping(messagesEl, 1000);
  appendBubble(messagesEl, 'in', "💭 They've been waiting to share this with you...", "💭");
  await sleep(1800);
  
  await showTyping(messagesEl, 800);
  appendBubble(messagesEl, 'in', "⏰ The moment has arrived...", "⏰");
  await sleep(1500);
  
  // Scratch card
  await showTyping(messagesEl, 1200);
  appendBubble(messagesEl, 'in', "✨ Their message is hidden below. Scratch to reveal it... ✨", "✨");
  await sleep(1000);
  
  const scratchId = Date.now().toString();
  const scratchHtml = createMessageScratchCard(scratchId);
  appendHtmlBubble(messagesEl, 'in', scratchHtml, "🎫");
  
  await sleep(500);
  
  // Wait for scratch
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
    setTimeout(() => {
      if (!resolved) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 30000);
  });
  
  const contentDiv = document.getElementById(`scratch-message-content-${scratchId}`);
  if (contentDiv) {
    contentDiv.innerHTML = '<div class="scratch-loading">✨ Preparing your message... ✨</div>';
    await sleep(800);
    
    contentDiv.innerHTML = '<div class="scratch-message-reveal" id="line-reveal-container"></div>';
    const revealContainer = contentDiv.querySelector('.scratch-message-reveal');
    
    const lines = splitMessageIntoLines(messageText);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineDiv = document.createElement('div');
      lineDiv.className = 'reveal-line';
      lineDiv.style.opacity = '0';
      lineDiv.style.transform = 'translateY(10px)';
      lineDiv.style.transition = 'all 0.3s ease';
      lineDiv.innerHTML = `<span class="reveal-emoji">${messageLogo}</span> <span class="reveal-text">${escapeHtml(line)}</span>`;
      revealContainer.appendChild(lineDiv);
      
      setTimeout(() => {
        lineDiv.style.opacity = '1';
        lineDiv.style.transform = 'translateY(0)';
      }, 100);
      
      const delay = Math.min(800 + line.length * 20, 2000);
      await sleep(delay);
    }
  }
  
  await sleep(1000);
  
  // Sender reveal
  if (senderName) {
    await showTyping(messagesEl, 1000);
    appendBubble(messagesEl, 'in', `— ${senderName} ${params.emoji || messageLogo}`, messageLogo);
  } else {
    await sleep(800);
    const anonymousSenders = ["— Someone who cares", "— A secret admirer", "— Someone thinking of you"];
    const randomSender = anonymousSenders[Math.floor(Math.random() * anonymousSenders.length)];
    appendBubble(messagesEl, 'in', `${randomSender} ${params.emoji || '💌'}`, messageLogo);
  }
  
  // Reply option
  await sleep(1500);
  
  const replyCta = document.createElement('div');
  replyCta.className = 'reveal-cta';
  replyCta.innerHTML = `
    <p>💝 Want to reply to your anonymous secret admirer? 💝</p>
    <div class="reply-input-group" style="margin: 15px 0;">
      <textarea id="reply-message" placeholder="Type your anonymous reply here..." rows="3" style="width:100%; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:12px; color:var(--text); margin-bottom:10px;"></textarea>
      <input type="text" id="reply-telegram" placeholder="Your Telegram (optional - to get reply back)" style="width:100%; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:12px; color:var(--text); margin-bottom:10px;">
      <button class="btn-primary" onclick="sendReplyToSender('${messageId}')">
        ✨ Send Anonymous Reply
      </button>
    </div>
    <hr style="border-color:var(--border); margin:15px 0;">
    <p>Want to send your own secret message? 😏</p>
    <button class="btn-primary" onclick="goToCreator()">
      ✨ Create Your Message
    </button>
  `;
  messagesEl.appendChild(replyCta);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  
  incrementCount();
}

async function sendReplyToSender(messageId) {
  const replyMessage = document.getElementById('reply-message')?.value.trim();
  const replierTelegram = document.getElementById('reply-telegram')?.value.trim();
  
  if (!replyMessage) {
    showToast('Please write a reply', true);
    return;
  }
  
  showToast('📤 Sending anonymous reply...');
  
  const result = await sendReply(messageId, replyMessage, replierTelegram);
  
  if (result.success) {
    showToast('✅ Reply sent anonymously!');
    document.getElementById('reply-message').value = '';
    document.getElementById('reply-telegram').value = '';
    if (tg) tg.close();
  } else {
    showToast('❌ Failed to send reply', true);
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
  
  const scratchCanvas = wrap.querySelector('.message-scratch-canvas');
  if (scratchCanvas) {
    initMessageScratchCard(scratchCanvas.id);
  }
}

function initMessageScratchCard(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const container = canvas.closest('.scratch-message-container');
  const contentDiv = container?.querySelector(`[id^="scratch-message-content"]`);
  let isDragging = false;
  let isRevealed = false;
  let scratchedPixels = 0;
  
  ctx.fillStyle = '#888';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#666';
  for (let i = 0; i < 400; i++) {
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
  }
  
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

function encodeParams(data) {
  return Object.entries(data)
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}

function trackEvent(eventName, params = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
  }
}

// =====================
// INITIALIZATION
// =====================
function initEmojiPicker() {
  const emojis = ['💌', '💜', '❤️', '🔥', '👀', '🌹', '✨', '🥺', '😍', '🫶', '😘', '💋', '🎂', '🎉', '🌟', '💎', '🌸', '🦋', '⭐', '💫'];
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

// Add CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
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
    max-height: 400px;
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
  
  #delivery-status {
    margin-top: 16px;
    padding: 12px;
    border-radius: 12px;
    font-size: 0.85rem;
    text-align: center;
  }
`;
document.head.appendChild(styleSheet);