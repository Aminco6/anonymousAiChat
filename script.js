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
  
  // Reveal message line by line
  await showTyping(messagesEl, 1200);
  appendBubble(messagesEl, 'in', "✨ Here's their message to you... ✨", "✨");
  await sleep(1000);
  
  const lines = splitMessageIntoLines(messageText);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    await showTyping(messagesEl, 800 + line.length * 20);
    appendBubble(messagesEl, 'in', line, messageLogo, true);
    await sleep(500);
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

async function sendReplyFromChat(messageId) {
  const replyMessage = document.getElementById('reply-message')?.value.trim();
  const replierName = document.getElementById('reply-name')?.value.trim();
  
  if (!replyMessage) {
    showToast('Please write a reply', true);
    return;
  }
  
  const success = await sendReply(messageId, replyMessage, replierName);
  if (success) {
    document.getElementById('reply-message').value = '';
    document.getElementById('reply-name').value = '';
    showToast('✅ Reply sent to the group anonymously!');
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
window.sendReplyFromChat = sendReplyFromChat;
window.closeChat = closeChat;
window.goToCreator = goToCreator;

document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded, initializing Group Messenger...');
  
  checkAndLoadChat();
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
  
  .bubble.main-msg {
    background: linear-gradient(135deg, #1e1e32, #2a1a3e);
    border: 1px solid rgba(192,132,252,0.15);
  }
  
  .reveal-cta {
    background: linear-gradient(135deg, rgba(192,132,252,0.1), rgba(129,140,248,0.1));
    border-radius: 20px;
    padding: 1.5rem;
    text-align: center;
    margin-top: 1rem;
    border: 1px solid rgba(192,132,252,0.2);
  }
  
  .msg-wrap {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    margin-bottom: 8px;
  }
  
  .msg-wrap.in { justify-content: flex-start; }
  .msg-wrap.out { justify-content: flex-end; }
  
  .msg-avatar-sm {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #c084fc, #818cf8);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }
  
  .bubble {
    max-width: 75%;
    padding: 10px 14px;
    border-radius: 18px;
    font-size: 0.9rem;
    line-height: 1.5;
  }
  
  .bubble.in {
    background: #1e1e32;
    border-bottom-left-radius: 4px;
  }
  
  .bubble.out {
    background: linear-gradient(135deg, #c084fc, #818cf8);
    border-bottom-right-radius: 4px;
  }
  
  .time {
    font-size: 0.65rem;
    opacity: 0.6;
    margin-top: 4px;
    text-align: right;
  }
  
  .msg-date-divider {
    text-align: center;
    font-size: 0.7rem;
    color: var(--muted);
    margin: 16px 0;
  }
  
  .typing-indicator {
    display: flex;
    gap: 10px;
    margin: 8px 0;
  }
  
  .typing-bubble {
    background: #1e1e32;
    padding: 12px 16px;
    border-radius: 18px;
    border-bottom-left-radius: 4px;
    display: flex;
    gap: 4px;
  }
  
  .typing-bubble span {
    width: 6px;
    height: 6px;
    background: #7878a0;
    border-radius: 50%;
    animation: typing 1.4s infinite;
  }
  
  @keyframes typing {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-6px); opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);