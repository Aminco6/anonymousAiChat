/* ===========================
   Anonymous AI Messenger
   script.js — Complete with Image Sharing & Music Controls
   =========================== */

'use strict';

// =====================
// GA4 TRACKING
// =====================
function trackEvent(eventName, params = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
  }
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

// =====================
// BACKGROUND MUSIC MANAGER
// =====================
let currentAudio = null;
let isMusicPlaying = false;
let musicControlAdded = false;

function initBackgroundMusic(audioUrl) {
  stopBackgroundMusic();
  
  if (!audioUrl) return null;
  
  try {
    const audio = new Audio(audioUrl);
    audio.loop = true;
    audio.volume = 0.25;
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    currentAudio = audio;
    return audio;
  } catch (e) {
    console.error('Failed to initialize audio:', e);
    return null;
  }
}

async function startBackgroundMusic() {
  if (!currentAudio) return false;
  
  try {
    await currentAudio.play();
    isMusicPlaying = true;
    updateMusicButton(true);
    console.log('Background music started');
    return true;
  } catch (e) {
    console.log('Autoplay prevented:', e);
    showMusicControl();
    return false;
  }
}

function stopBackgroundMusic() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
    isMusicPlaying = false;
    removeMusicControl();
    console.log('Background music stopped');
  }
}

function toggleMusic() {
  if (!currentAudio) return;
  
  if (isMusicPlaying) {
    currentAudio.pause();
    isMusicPlaying = false;
    updateMusicButton(false);
  } else {
    currentAudio.play().catch(e => console.log('Play failed:', e));
    isMusicPlaying = true;
    updateMusicButton(true);
  }
}

function showMusicControl() {
  if (musicControlAdded) return;
  
  const chatMessages = document.getElementById('chat-messages');
  if (!chatMessages) return;
  
  const musicControl = document.createElement('div');
  musicControl.id = 'music-control';
  musicControl.className = 'music-control';
  musicControl.innerHTML = `
    <button id="music-toggle-btn" class="music-toggle-btn">
      <span class="music-icon">🎵</span>
      <span class="music-text">Tap to play background music</span>
    </button>
  `;
  
  // Insert at the top of chat
  chatMessages.insertBefore(musicControl, chatMessages.firstChild);
  
  const toggleBtn = document.getElementById('music-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      startBackgroundMusic();
      if (musicControl) musicControl.style.display = 'none';
    });
  }
  
  musicControlAdded = true;
}

function updateMusicButton(isPlaying) {
  const toggleBtn = document.getElementById('music-toggle-btn');
  if (toggleBtn) {
    if (isPlaying) {
      toggleBtn.innerHTML = '<span class="music-icon">🎵</span><span class="music-text">Music playing ✨</span>';
      toggleBtn.style.opacity = '0.7';
    } else {
      toggleBtn.innerHTML = '<span class="music-icon">🎵</span><span class="music-text">Music paused</span>';
    }
  }
}

function removeMusicControl() {
  const musicControl = document.getElementById('music-control');
  if (musicControl) musicControl.remove();
  musicControlAdded = false;
}

// =====================
// ENHANCED IMAGE SHARING (with QR + Link)
// =====================
async function generateShareableImage(url, title, emoji = '💌') {
  // Create canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Set dimensions
  canvas.width = 800;
  canvas.height = 1000;
  
  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Gradient border
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, '#c084fc');
  gradient.addColorStop(1, '#818cf8');
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 8;
  ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);
  
  // Header
  ctx.fillStyle = '#1a1a2e';
  ctx.font = 'bold 36px "Sora", "DM Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${emoji} Secret Message ${emoji}`, canvas.width / 2, 70);
  
  ctx.font = '18px "DM Sans", sans-serif';
  ctx.fillStyle = '#7878a0';
  ctx.fillText('Someone left you a secret message', canvas.width / 2, 115);
  
  // Generate QR code temporarily
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '-9999px';
  document.body.appendChild(tempDiv);
  
  const qrContainer = document.createElement('div');
  tempDiv.appendChild(qrContainer);
  
  return new Promise((resolve) => {
    const qr = new QRCode(qrContainer, {
      text: url,
      width: 300,
      height: 300,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
    
    setTimeout(() => {
      const qrCanvas = qrContainer.querySelector('canvas');
      if (qrCanvas) {
        // Draw QR code
        const qrX = (canvas.width - 300) / 2;
        const qrY = 150;
        ctx.drawImage(qrCanvas, qrX, qrY, 300, 300);
        
        // Draw decorative elements around QR
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 2;
        ctx.strokeRect(qrX - 5, qrY - 5, 310, 310);
        
        // Title text
        ctx.fillStyle = '#1a1a2e';
        ctx.font = 'bold 20px "Sora", "DM Sans", sans-serif';
        ctx.fillText(title.length > 40 ? title.substring(0, 37) + '...' : title, canvas.width / 2, 490);
        
        // Link text (for copying)
        ctx.font = '14px "DM Mono", monospace';
        ctx.fillStyle = '#c084fc';
        const shortUrl = url.length > 50 ? url.substring(0, 47) + '...' : url;
        ctx.fillText(shortUrl, canvas.width / 2, 530);
        
        // Instructions
        ctx.font = '14px "DM Sans", sans-serif';
        ctx.fillStyle = '#7878a0';
        ctx.fillText('📱 Scan QR code OR copy the link above', canvas.width / 2, 580);
        ctx.fillText('to reveal your secret message', canvas.width / 2, 610);
        
        // Footer
        ctx.font = '12px "DM Sans", sans-serif';
        ctx.fillStyle = '#c084fc';
        ctx.fillText('Anonymous AI Messenger', canvas.width / 2, canvas.height - 30);
        
        // Decorative elements
        ctx.fillStyle = '#f0f0ff';
        for (let i = 0; i < 50; i++) {
          ctx.fillRect(20 + (i * 15), canvas.height - 45, 2, 2);
        }
      }
      
      document.body.removeChild(tempDiv);
      resolve(canvas);
    }, 300);
  });
}

async function downloadShareableImage() {
  const url = window._currentShareUrl || window.location.href;
  const msg = (document.getElementById('msg-text')?.value || 'Secret Message').substring(0, 40);
  const emoji = (document.getElementById('msg-emoji')?.value || '💌');
  
  showToast('🖼️ Generating shareable image...');
  
  const canvas = await generateShareableImage(url, msg, emoji);
  
  // Download
  const link = document.createElement('a');
  link.download = 'secret-message-share.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  
  showToast('✅ Image saved! Share it on WhatsApp');
  trackEvent('shareable_image_downloaded');
}

// Add new share button to result card
function addImageShareButton() {
  const shareGrid = document.querySelector('.share-grid');
  if (shareGrid && !document.getElementById('share-image')) {
    const imageShareBtn = document.createElement('button');
    imageShareBtn.id = 'share-image';
    imageShareBtn.className = 'share-btn';
    imageShareBtn.innerHTML = '🖼️ Share as Image';
    imageShareBtn.addEventListener('click', downloadShareableImage);
    shareGrid.appendChild(imageShareBtn);
  }
}

// =====================
// COUNTER (localStorage)
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
  if (!container) {
    console.warn(`Container ${containerId} not found`);
    return;
  }
  container.innerHTML = '';
  try {
    const qr = new QRCode(container, {
      text: url,
      width: size,
      height: size,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
    return qr;
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
  const from = (document.getElementById('msg-from')?.value || '').trim();
  const emoji = (document.getElementById('msg-emoji')?.value || '').trim();
  const audio = (document.getElementById('msg-audio')?.value || '').trim();

  if (!msg) {
    shakeElement(document.getElementById('msg-text'));
    return;
  }

  const params = { msg };
  if (from) params.from = from;
  if (emoji) params.emoji = emoji;
  if (audio) params.audio = audio;

  const hash = '#' + encodeParams(params);
  const shareUrl = window.location.origin + window.location.pathname + hash;

  showResult(shareUrl, emoji || '💌');
  trackEvent('message_created');
  incrementCount();
}

function showResult(url, emoji) {
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

  generateQR('qrcode', url, 180);

  window._currentShareUrl = url;
  window._currentShareEmoji = emoji;

  updateShareButtons(url);
  addImageShareButton(); // Add the new image share button
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
async function loadTemplates() {
  const grid = document.getElementById('templates-grid');
  if (!grid) return;

  try {
    const res = await fetch('./templates.json');
    const templates = await res.json();
    renderTemplates(templates, grid);
  } catch (e) {
    console.warn('Failed to load templates.json, using fallback', e);
    renderTemplates(FALLBACK_TEMPLATES, grid);
  }
}

function renderTemplates(templates, grid) {
  grid.innerHTML = '';
  templates.forEach((tpl, i) => {
    const params = { msg: tpl.message, from: tpl.from, emoji: tpl.emoji };
    const hash = '#' + encodeParams(params);
    const url = window.location.origin + window.location.pathname + hash;

    const card = document.createElement('div');
    card.className = 'template-card';
    card.style.animationDelay = `${i * 0.05}s`;

    card.innerHTML = `
      <div class="tooltip">${escapeHtml(tpl.message.slice(0, 80))}...</div>
      <div class="template-qr" id="tpl-qr-${tpl.id}"></div>
      <div class="template-body">
        <div class="template-title">${escapeHtml(tpl.title)}</div>
        <div class="template-preview">${escapeHtml(tpl.message.substring(0, 100))}...</div>
        <div class="template-buttons">
          <button class="template-share-qr-btn" data-url="${encodeURIComponent(url)}" data-title="${escapeHtml(tpl.title)}" data-emoji="${tpl.emoji}">
            📱 Share as Image
          </button>
          <button class="template-share-link-btn" data-url="${encodeURIComponent(url)}">
            🔗 Copy Link
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);

    setTimeout(() => {
      generateQR(`tpl-qr-${tpl.id}`, url, 110);
    }, i * 30);

    const shareQRBtn = card.querySelector('.template-share-qr-btn');
    if (shareQRBtn) {
      shareQRBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const shareUrl = decodeURIComponent(shareQRBtn.dataset.url);
        const title = shareQRBtn.dataset.title;
        const emoji = shareQRBtn.dataset.emoji;
        
        showToast('🖼️ Generating shareable image...');
        const canvas = await generateShareableImage(shareUrl, title, emoji);
        
        // Download
        const link = document.createElement('a');
        link.download = `secret-${title.substring(0, 20).replace(/[^a-z0-9]/gi, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        showToast('✅ Image saved! Share it on WhatsApp');
        trackEvent('template_image_shared', { template_id: tpl.id });
      });
    }

    const shareLinkBtn = card.querySelector('.template-share-link-btn');
    if (shareLinkBtn) {
      shareLinkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const shareUrl = decodeURIComponent(shareLinkBtn.dataset.url);
        copyToClipboard(shareUrl);
        const originalText = shareLinkBtn.textContent;
        shareLinkBtn.textContent = '✅ Copied!';
        setTimeout(() => {
          shareLinkBtn.textContent = originalText;
        }, 2000);
        trackEvent('template_link_copied', { template_id: tpl.id });
      });
    }

    card.addEventListener('click', () => {
      const shareUrl = decodeURIComponent(shareQRBtn.dataset.url);
      window.location.href = shareUrl;
    });
  });
}

const FALLBACK_TEMPLATES = [
  { id: 'f1', title: "Someone secretly likes you 👀", message: "Someone out there notices you — in the best way possible. They see the little things you do, and it makes their day brighter just seeing you smile.", emoji: "👀", from: "Your Secret Admirer" },
  { id: 'f2', title: "A message from your future self 🌟", message: "It's me — you, from the future. I just wanted to say: it all works out. You made it through. Keep going — future you is so proud of you.", emoji: "🌟", from: "Future You" },
  { id: 'f3', title: "Someone noticed your smile ☀️", message: "Your smile today lit up the whole room. Someone saw it and couldn't look away. You made the world a little more beautiful today.", emoji: "☀️", from: "A Silent Observer" },
  { id: 'f4', title: "You are deeply appreciated 💜", message: "There's someone who thinks about you more than you know. They appreciate your kindness and the quiet ways you make life better for others.", emoji: "💜", from: "Someone Who Cares" }
];

// =====================
// MESSAGE SPLITTER (Line by Line Reveal)
// =====================
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

// =====================
// TEASING MESSAGES
// =====================
const teasingMessages = [
  { text: "🤫 Shh... I have a secret to tell you...", delay: 800 },
  { text: "✨ Someone sent you something special...", delay: 600 },
  { text: "💭 They've been thinking about you all day...", delay: 700 },
  { text: "🎁 It's a message just for you...", delay: 500 },
  { text: "💌 Are you ready to hear what they said?", delay: 800 },
  { text: "😊 They wanted you to know something important...", delay: 600 },
  { text: "🌟 Opening your secret message now...", delay: 500 },
  { text: "💖 This might make your day...", delay: 700 },
  { text: "🎀 Ready?", delay: 400 }
];

// =====================
// CHAT INTERFACE
// =====================
let chatActive = false;

function checkAndLoadChat() {
  const hash = window.location.hash;
  console.log('Checking hash:', hash);
  const params = decodeHash(hash);
  console.log('Decoded params:', params);

  if (params.msg && !chatActive) {
    console.log('Message found, opening chat');
    chatActive = true;
    openChat(params);
  }
}

function openChat(params) {
  const overlay = document.getElementById('chat-overlay');
  if (!overlay) {
    console.error('Chat overlay not found');
    return;
  }

  console.log('Opening chat with params:', params);
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  const avatarEmoji = params.emoji || '🤖';
  const chatAvatarEl = overlay.querySelector('.chat-avatar');
  if (chatAvatarEl) chatAvatarEl.textContent = avatarEmoji;
  
  const splashIcon = overlay.querySelector('.splash-icon');
  if (splashIcon) splashIcon.textContent = avatarEmoji;

  // Initialize music if provided (but don't autoplay)
  if (params.audio && params.audio.trim()) {
    console.log('Music URL detected:', params.audio);
    initBackgroundMusic(params.audio);
    // Show music control button instead of autoplaying
    setTimeout(() => {
      if (!isMusicPlaying && currentAudio) {
        showMusicControl();
      }
    }, 1000);
  }

  trackEvent('message_opened');
  startChatSequence(params);
}

function closeChat() {
  const overlay = document.getElementById('chat-overlay');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
  chatActive = false;
  stopBackgroundMusic();
  history.pushState('', document.title, window.location.pathname + window.location.search);
}

async function startChatSequence(params) {
  const splash = document.getElementById('chat-splash');
  const messagesEl = document.getElementById('chat-messages');

  if (!messagesEl) {
    console.error('Messages element not found');
    return;
  }
  
  messagesEl.innerHTML = '';

  await sleep(3000);

  if (splash) {
    splash.classList.add('hide');
    await sleep(600);
    splash.style.display = 'none';
  }

  appendDateDivider(messagesEl, 'Today');

  // Teasing sequence
  let totalTeaseTime = 0;
  const maxTeaseTime = 20000;
  const minTeaseTime = 15000;
  
  for (const tease of teasingMessages) {
    if (totalTeaseTime >= maxTeaseTime) break;
    
    await showTyping(messagesEl, 1200);
    appendBubble(messagesEl, 'in', tease.text, '🤖');
    
    const delay = tease.delay + Math.random() * 500;
    await sleep(delay);
    totalTeaseTime += delay + 1200;
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  
  if (totalTeaseTime < minTeaseTime) {
    await sleep(minTeaseTime - totalTeaseTime);
  }
  
  await showTyping(messagesEl, 1500);
  appendBubble(messagesEl, 'in', "Here's their message to you... 💌", '🤖');
  await sleep(1000);
  
  // Reveal message line by line
  const messageLines = splitMessageIntoLines(params.msg);
  
  for (let i = 0; i < messageLines.length; i++) {
    const line = messageLines[i];
    await showTyping(messagesEl, 1800 + (line.length * 30));
    const isLastLine = (i === messageLines.length - 1);
    appendBubble(messagesEl, 'in', line, '🤖', true);
    
    if (!isLastLine) {
      await sleep(800);
    }
  }
  
  if (params.from) {
    await sleep(1000);
    await showTyping(messagesEl, 1200);
    const emoji = params.emoji || '💌';
    appendBubble(messagesEl, 'in', `— ${params.from} ${emoji}`, '🤖');
  }
  
  await sleep(1500);
  appendRevealCTA(messagesEl);

  trackEvent('message_revealed');
  incrementCount();
  messagesEl.scrollTop = messagesEl.scrollHeight;
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

function appendRevealCTA(container) {
  const cta = document.createElement('div');
  cta.className = 'reveal-cta';
  cta.innerHTML = `
    <p>Want to send your own secret message? 😏</p>
    <button class="btn-primary" onclick="goToCreator()">
      ✨ Create Your Message
    </button>
  `;
  container.appendChild(cta);
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

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'qr-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #1a1a2e;
    border: 1px solid #c084fc;
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
// SCROLL ANIMATIONS & UI
// =====================
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fade-up 0.6s ease both';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.template-card, .creator-form-card, .result-card').forEach(el => {
    observer.observe(el);
  });
}

function initEmojiPicker() {
  const emojis = ['💌', '💜', '❤️', '🔥', '👀', '🌹', '✨', '🥺', '😍', '🫶'];
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

function initHeroPreview() {
  const bubbles = document.querySelectorAll('.preview-bubble');
  bubbles.forEach((b, i) => {
    b.style.opacity = '0';
    setTimeout(() => {
      b.style.animation = `bubble-pop 0.4s ease ${i * 0.3}s both`;
      b.style.opacity = '1';
    }, 1000 + i * 400);
  });
}

function scrollToCreator() {
  const el = document.getElementById('creator');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// =====================
// INIT
// =====================
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded, initializing app...');
  
  checkAndLoadChat();
  
  updateCounterDisplay();
  initCreator();
  initCopyLink();
  loadTemplates();
  initScrollAnimations();
  initEmojiPicker();
  initHeroPreview();

  const backBtn = document.getElementById('chat-back');
  if (backBtn) backBtn.addEventListener('click', closeChat);

  window.addEventListener('hashchange', () => {
    console.log('Hash changed to:', window.location.hash);
    if (!chatActive) checkAndLoadChat();
  });

  const dlBtn = document.getElementById('download-qr');
  if (dlBtn) dlBtn.addEventListener('click', downloadShareableImage);

  document.querySelectorAll('[data-scroll-creator]').forEach(btn => {
    btn.addEventListener('click', scrollToCreator);
  });

  animateCounter();
});

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

// Add CSS for music control and image share
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-6px); }
    40%, 80% { transform: translateX(6px); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.9; }
  }
  
  .music-control {
    text-align: center;
    padding: 10px;
    margin: 10px 0;
  }
  
  .music-toggle-btn {
    background: linear-gradient(135deg, #c084fc, #818cf8);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    animation: pulse 2s infinite;
    transition: all 0.3s ease;
  }
  
  .music-toggle-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(192,132,252,0.4);
  }
  
  .music-icon {
    font-size: 1.1rem;
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
    font-size: 0.95rem;
  }
  
  .template-buttons {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }
  
  .template-share-qr-btn,
  .template-share-link-btn {
    flex: 1;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
    border: none;
  }
  
  .template-share-qr-btn {
    background: linear-gradient(135deg, #c084fc, #818cf8);
    color: white;
  }
  
  .template-share-qr-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(192,132,252,0.3);
  }
  
  .template-share-link-btn {
    background: rgba(192,132,252,0.1);
    border: 1px solid rgba(192,132,252,0.2);
    color: #c084fc;
  }
  
  .template-share-link-btn:hover {
    background: rgba(192,132,252,0.2);
  }
  
  #share-image {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
  }
  
  #share-image:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16,185,129,0.3);
  }
  
  
  
  @media (max-width: 640px) {
    .template-buttons {
      flex-direction: column;
    }
  }
`;
document.head.appendChild(styleSheet);