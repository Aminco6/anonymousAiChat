/* ===========================
   Anonymous Group Messenger
   script.js - With Validation & Security
   =========================== */

'use strict';

// =====================
// CONFIGURATION
// =====================
const WORKER_API_URL = 'https://anonymous-telegram-bot.voicedontdie.workers.dev';

// =====================
// SECURITY: Sanitize Input
// =====================
function sanitizeText(input) {
  if (!input) return '';
  // Remove HTML tags
  let cleaned = input.replace(/<[^>]*>/g, '');
  // Remove URLs
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, '[LINK REMOVED]');
  cleaned = cleaned.replace(/www\.[^\s]+/g, '[LINK REMOVED]');
  cleaned = cleaned.replace(/t\.me\/[^\s]+/g, '[LINK REMOVED]');
  // Remove malicious characters but keep emojis and basic punctuation
  cleaned = cleaned.replace(/[<>{}[\]\\]/g, '');
  // Limit length
  cleaned = cleaned.substring(0, 500);
  return cleaned.trim();
}

function validateUsername(username) {
  if (!username) return false;
  let clean = username.trim();
  if (clean.startsWith('@')) clean = clean.substring(1);
  // Telegram username rules: 5-32 chars, letters, numbers, underscore
  const usernameRegex = /^[a-zA-Z0-9_]{5,32}$/;
  return usernameRegex.test(clean);
}

function validateMessage(message) {
  if (!message) return false;
  const cleaned = sanitizeText(message);
  if (cleaned.length < 1) return false;
  if (cleaned.length > 400) return false;
  // Check for too many URLs
  const urlCount = (message.match(/https?:\/\//g) || []).length;
  if (urlCount > 0) return false;
  return true;
}

function escapeMarkdown(text) {
  if (!text) return '';
  // Escape special Markdown characters
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

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
// CREATE SECRET MESSAGE (With Validation)
// =====================
async function createSecretMessage(message, recipientTelegram, senderName, emoji, category) {
  const statusDiv = document.getElementById('delivery-status');
  
  // Validate inputs
  if (!validateMessage(message)) {
    showToast('Invalid message: No URLs allowed, max 400 characters', true);
    if (statusDiv) {
      statusDiv.style.display = 'block';
      statusDiv.style.background = 'rgba(239,68,68,0.1)';
      statusDiv.innerHTML = '❌ Invalid message: No URLs or links allowed. Max 400 characters.';
      setTimeout(() => statusDiv.style.display = 'none', 3000);
    }
    return;
  }
  
  if (!validateUsername(recipientTelegram)) {
    showToast('Invalid username: Must be 5-32 characters (letters, numbers, underscore)', true);
    if (statusDiv) {
      statusDiv.style.display = 'block';
      statusDiv.style.background = 'rgba(239,68,68,0.1)';
      statusDiv.innerHTML = '❌ Invalid Telegram username. Use format: @username (5-32 chars, letters/numbers/underscore)';
      setTimeout(() => statusDiv.style.display = 'none', 3000);
    }
    return;
  }
  
  // Clean recipient
  let cleanRecipient = recipientTelegram.trim();
  if (cleanRecipient.startsWith('@')) cleanRecipient = cleanRecipient.substring(1);
  
  // Clean message
  const cleanMessage = sanitizeText(message);
  
  // Clean sender name (optional)
  let cleanSender = '';
  if (senderName && senderName.trim()) {
    cleanSender = sanitizeText(senderName).substring(0, 30);
  }
  
  if (statusDiv) {
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = '📤 Sending your anonymous message to the group...';
    statusDiv.style.background = 'rgba(192,132,252,0.1)';
  }
  
  try {
    const response = await fetch(`${WORKER_API_URL}/api/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: cleanMessage,
        recipientTelegram: cleanRecipient,
        senderName: cleanSender || 'Secret Admirer',
        category: category || 'general',
        emoji: emoji || '💌'
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      if (statusDiv) {
        statusDiv.style.background = 'rgba(16,185,129,0.1)';
        statusDiv.innerHTML = `✅ Your anonymous message has been posted to the group for @${cleanRecipient}!`;
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
// LOAD MESSAGE (for secret link)
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
async function sendReply(messageId, replyMessage, replierName) {
  const cleanReply = sanitizeText(replyMessage);
  if (!cleanReply || cleanReply.length < 1) {
    showToast('Please write a reply', true);
    return false;
  }
  
  try {
    const response = await fetch(`${WORKER_API_URL}/api/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messageId: messageId,
        replyMessage: cleanReply,
        replierName: replierName ? sanitizeText(replierName).substring(0, 30) : 'Someone'
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      showToast('✅ Reply sent anonymously!');
      return true;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Reply error:', error);
    showToast('❌ Failed to send reply', true);
    return false;
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

// =====================
// MESSAGE CREATOR
// =====================
const messageInput = document.getElementById('msg-text');
const charCountEl = document.getElementById('char-count');
const MAX_CHARS = 400;

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
      let len = messageInput.value.length;
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
  let msg = (document.getElementById('msg-text')?.value || '').trim();
  const recipient = (document.getElementById('telegram-recipient')?.value || '').trim();
  const senderName = (document.getElementById('msg-from')?.value || '').trim();
  const emoji = (document.getElementById('msg-emoji')?.value || '').trim();
  const category = document.getElementById('msg-category')?.value || '';

  // Validate message
  if (!msg) {
    shakeElement(document.getElementById('msg-text'));
    showToast('Please write a message', true);
    return;
  }
  
  // Check for URLs in message
  if (msg.match(/https?:\/\/[^\s]+/g) || msg.match(/www\.[^\s]+/g)) {
    shakeElement(document.getElementById('msg-text'));
    showToast('URLs are not allowed in messages', true);
    return;
  }
  
  // Validate recipient
  if (!recipient) {
    shakeElement(document.getElementById('telegram-recipient'));
    showToast('Please enter recipient\'s Telegram username', true);
    return;
  }
  
  let cleanRecipient = recipient.trim();
  if (cleanRecipient.startsWith('@')) cleanRecipient = cleanRecipient.substring(1);
  
  if (!validateUsername(cleanRecipient)) {
    shakeElement(document.getElementById('telegram-recipient'));
    showToast('Invalid username: 5-32 characters (letters, numbers, underscore only)', true);
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
// TEMPLATES
// =====================
async function loadTemplates() {
  const grid = document.getElementById('templates-grid');
  if (!grid) return;
  
  grid.innerHTML = '<div class="template-card" style="padding:40px;text-align:center;">Loading templates... ✨</div>';
  
  const templates = [
    { id: 1, title: "🎂 Birthday Surprise", message: "Happy Birthday! Someone is thinking of you today! 🎂", emoji: "🎂", category: "birthday" },
    { id: 2, title: "❤️ Secret Crush", message: "I've been wanting to tell you... you're amazing! ❤️", emoji: "❤️", category: "love_romance" },
    { id: 3, title: "🔥 You're Hot", message: "Just saying... you're looking good today! 🔥", emoji: "🔥", category: "adult_humor" },
    { id: 4, title: "💋 Flirty Vibes", message: "Hey there... someone thinks you're cute! 💋", emoji: "💋", category: "flirty" },
    { id: 5, title: "💍 Wedding Wishes", message: "Congratulations on your special day! 💍", emoji: "💍", category: "wedding" },
    { id: 6, title: "🤝 Appreciation", message: "I really appreciate having you in my life! 🤝", emoji: "🤝", category: "relationship" },
    { id: 7, title: "😢 Thinking of You", message: "Sending you love during this time. You're not alone. 😢", emoji: "😢", category: "sympathy" },
    { id: 8, title: "😂 Just for Laughs", message: "Why did the scarecrow win an award? He was outstanding in his field! 😂", emoji: "😂", category: "fun" }
  ];
  
  grid.innerHTML = templates.map(tpl => `
    <div class="template-card" onclick="useTemplate('${escapeHtml(tpl.message)}', '${tpl.emoji}', '${tpl.category}')">
      <div class="template-body">
        <div class="template-title">${tpl.title}</div>
        <div class="template-preview">${escapeHtml(tpl.message.substring(0, 80))}...</div>
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

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// =====================
// CHAT SEQUENCE (for secret link opens)
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
  
  // ========== SCRATCH CARD ==========
  await showTyping(messagesEl, 1200);
  appendBubble(messagesEl, 'in', "✨ Their message is hidden below. Scratch to reveal it... ✨", "✨");
  await sleep(1000);
  
  const scratchId = Date.now().toString();
  const scratchHtml = createScratchCard(scratchId);
  appendHtmlBubble(messagesEl, 'in', scratchHtml, "🎫");
  
  await sleep(500);
  
  // Wait for scratch completion
  await new Promise((resolve) => {
    let resolved = false;
    const checkInterval = setInterval(() => {
      const contentDiv = document.getElementById(`scratch-content-${scratchId}`);
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
  
  // ========== REVEAL MESSAGE LINE BY LINE AFTER SCRATCH ==========
  const contentDiv = document.getElementById(`scratch-content-${scratchId}`);
  if (contentDiv) {
    contentDiv.innerHTML = '<div class="scratch-loading">✨ Revealing your message... ✨</div>';
    await sleep(800);
    
    contentDiv.innerHTML = '<div class="line-reveal-container" id="line-reveal-container"></div>';
    const revealContainer = contentDiv.querySelector('.line-reveal-container');
    
    // Split message into lines (by periods, line breaks, etc.)
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
      
      // Animate in
      setTimeout(() => {
        lineDiv.style.opacity = '1';
        lineDiv.style.transform = 'translateY(0)';
      }, 100);
      
      // Scroll to show new line
      revealContainer.scrollTop = revealContainer.scrollHeight;
      
      // Delay between lines based on length (more suspense!)
      const delay = Math.min(800 + line.length * 20, 2000);
      await sleep(delay);
    }
  }
  
  await sleep(1000);
  
  // Sender reveal (if they chose to reveal identity)
  if (senderName && senderName !== 'Secret Admirer') {
    await showTyping(messagesEl, 1000);
    appendBubble(messagesEl, 'in', `— ${senderName} ${params.emoji || messageLogo}`, messageLogo);
  } else {
    await sleep(800);
    appendBubble(messagesEl, 'in', `— Someone who cares ${params.emoji || '💌'}`, messageLogo);
  }
  
  // Reply option
  await sleep(1500);
  
  const replyCta = document.createElement('div');
  replyCta.className = 'reveal-cta';
  replyCta.innerHTML = `
    <p>💝 Want to reply anonymously? 💝</p>
    <div class="reply-input-group" style="margin: 15px 0;">
      <input type="text" id="reply-name" placeholder="Your name (optional - stays anonymous)" style="width:100%; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:12px; color:var(--text); margin-bottom:10px;">
      <textarea id="reply-message" placeholder="Type your anonymous reply here..." rows="3" style="width:100%; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:12px; color:var(--text); margin-bottom:10px;"></textarea>
      <button class="btn-primary" onclick="sendReplyFromChat('${messageId}')">
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

// Scratch card generator
function createScratchCard(id) {
  return `
    <div class="scratch-container" id="scratch-container-${id}">
      <div class="scratch-label">✨ SCRATCH TO REVEAL ✨</div>
      <div class="scratch-area">
        <canvas id="scratch-canvas-${id}" width="280" height="100" class="scratch-canvas"></canvas>
        <div class="scratch-overlay">← Scratch Here →</div>
      </div>
      <div id="scratch-content-${id}" class="scratch-content" style="display: none;"></div>
    </div>
  `;
}

// Initialize scratch card
function initScratchCard(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const container = canvas.closest('.scratch-container');
  const contentDiv = container?.querySelector(`[id^="scratch-content"]`);
  let isDragging = false;
  let isRevealed = false;
  let scratchCount = 0;
  
  // Draw scratch layer
  ctx.fillStyle = '#888';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add pattern
  ctx.fillStyle = '#666';
  for (let i = 0; i < 300; i++) {
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
  }
  
  // Draw text
  ctx.fillStyle = '#c084fc';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('← SCRATCH →', canvas.width/2, canvas.height/2);
  
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
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();
    
    scratchCount++;
    
    // Reveal after enough scratching
    if (!isRevealed && scratchCount > 30) {
      const imageData = ctx.getImageData(canvas.width/2, canvas.height/2, 1, 1);
      if (imageData.data[3] === 0) {
        isRevealed = true;
        canvas.style.display = 'none';
        const overlay = container?.querySelector('.scratch-overlay');
        if (overlay) overlay.style.display = 'none';
        
        if (contentDiv) {
          contentDiv.style.display = 'block';
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

// Split message into lines for dramatic reveal
function splitMessageIntoLines(message) {
  // Split by periods, question marks, exclamation marks, or line breaks
  const sentences = message.split(/(?<=[.!?])\s+(?=[A-Za-z0-9])/);
  const lines = [];
  sentences.forEach(sentence => {
    if (sentence.includes('\n')) {
      lines.push(...sentence.split('\n'));
    } else if (sentence.length > 60) {
      // Split long sentences into chunks
      const words = sentence.split(' ');
      let chunk = '';
      for (const word of words) {
        if ((chunk + ' ' + word).length > 50) {
          lines.push(chunk);
          chunk = word;
        } else {
          chunk += (chunk ? ' ' : '') + word;
        }
      }
      if (chunk) lines.push(chunk);
    } else {
      lines.push(sentence);
    }
  });
  return lines.filter(line => line.trim().length > 0).map(line => line.trim());
}


















