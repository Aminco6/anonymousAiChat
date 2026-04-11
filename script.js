/* ===========================
   Anonymous Group Messenger
   script.js - Complete Fixed Version
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
  let cleaned = input.replace(/<[^>]*>/g, '');
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, '[LINK REMOVED]');
  cleaned = cleaned.replace(/www\.[^\s]+/g, '[LINK REMOVED]');
  cleaned = cleaned.replace(/t\.me\/[^\s]+/g, '[LINK REMOVED]');
  cleaned = cleaned.replace(/[<>{}[\]\\]/g, '');
  cleaned = cleaned.substring(0, 500);
  return cleaned.trim();
}

function validateUsername(username) {
  if (!username) return false;
  let clean = username.trim();
  if (clean.startsWith('@')) clean = clean.substring(1);
  const usernameRegex = /^[a-zA-Z0-9_]{5,32}$/;
  return usernameRegex.test(clean);
}

function validateMessage(message) {
  if (!message) return false;
  const cleaned = sanitizeText(message);
  if (cleaned.length < 1) return false;
  if (cleaned.length > 400) return false;
  const urlCount = (message.match(/https?:\/\//g) || []).length;
  if (urlCount > 0) return false;
  return true;
}

// =====================
// CATEGORY TEASERS
// =====================
const categoryTeasers = {
  birthday: { name: "Birthday", icon: "🎂", teasers: ["🎂 Someone has a special birthday message just for you...", "🎈 It's your birthday! Someone wants to make it unforgettable...", "🎁 A birthday surprise is waiting to be revealed...", "🕯️ Make a wish... someone made one for you...", "🎉 Party time! Someone sent birthday love your way..."] },
  love_romance: { name: "Love & Romance", icon: "❤️", teasers: ["❤️ Someone's heart beats faster when they think of you...", "💕 A secret admirer has been waiting to tell you something...", "🌹 Romance is in the air... someone has feelings for you...", "💖 Your biggest fan just left you a message...", "😍 Someone can't stop thinking about you..."] },
  adult_humor: { name: "Adult Humor", icon: "🔥", teasers: ["🔥 Someone's feeling spicy... should we let them talk?", "😏 A naughty (but clean) message is waiting...", "💋 Someone's feeling bold today... ready to hear it?", "🍑 A flirty little secret is about to be revealed...", "😉 Someone thinks you're hot... literally..."] },
  flirty: { name: "Flirty", icon: "💋", teasers: ["💋 Someone's been practicing their pickup lines for you...", "😘 A secret crush is ready to confess...", "💕 Flirty vibes incoming... are you ready?", "😏 Someone thinks you're cute... very cute...", "💌 A little flirtation is heading your way..."] },
  wedding: { name: "Wedding", icon: "💍", teasers: ["💍 Wedding bells! Someone has a special message for the happy couple...", "💒 Love is in the air... a wedding message awaits...", "🥂 A toast to love! Someone sent wedding wishes...", "👰‍♀️🤵‍♂️ Congratulations are in order...", "💐 Someone's thinking of you on your special day..."] },
  relationship: { name: "Relationship", icon: "🤝", teasers: ["🤝 Someone wants to make things right between you...", "💬 A heartfelt message about your relationship is waiting...", "🙏 Someone's grateful for you...", "💪 Let's work on us...", "🫂 An apology or appreciation is coming your way..."] },
  sympathy: { name: "Sympathy", icon: "😢", teasers: ["😢 Someone's thinking of you during this difficult time...", "🫂 A comforting message is waiting...", "💪 You're not alone...", "🌧️ Sending love and strength...", "🤗 A virtual hug is coming your way..."] },
  fun: { name: "Fun", icon: "😂", teasers: ["😂 Someone's got a joke that'll make your day...", "🎉 Ready to laugh? A funny message awaits...", "🤪 Something silly is coming your way...", "😜 Someone wants to prank you...", "🃏 Get ready to smile..."] },
  holidays: { name: "Holidays", icon: "🎄", teasers: ["🎄 Ho ho ho! Someone sent holiday cheer...", "🎆 Happy celebrations!", "🥂 Cheers to the holidays!", "🎁 A holiday surprise is wrapped and ready...", "✨ Holiday magic is in the air..."] },
  islamic: { name: "Islamic", icon: "🌙", teasers: ["🌙 Eid Mubarak! Someone's sending you blessings...", "🕌 A special Islamic greeting is waiting...", "🤲 Duas and love coming your way...", "🌟 May Allah bless you...", "📿 A spiritual message awaits..."] },
  nigeria: { name: "Nigeria", icon: "🇳🇬", teasers: ["🇳🇬 Proudly Nigerian! Someone's celebrating with you...", "🦅 A message from the heart of Africa awaits...", "🎉 Naija no dey carry last!", "💚🤍💚 Someone's thinking of you...", "🥘 Jollof love coming your way..."] }
};

function getRandomTeasers(category, count = 4) {
  const teaserList = categoryTeasers[category]?.teasers || ["🤫 Shh... I have a secret to tell you...", "✨ Someone sent you something special...", "💭 They've been thinking about you all day...", "🎁 It's a message just for you...", "💌 Are you ready to hear what they said?"];
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
// GROUP JOIN MANAGEMENT
// =====================
function hasJoinedGroup() {
  return localStorage.getItem('hasJoinedGroup') === 'true';
}

function showGroupJoinModal() {
  if (!hasJoinedGroup()) {
    const modal = document.getElementById('group-join-modal');
    if (modal) modal.style.display = 'flex';
  }
}

function closeGroupModal() {
  const modal = document.getElementById('group-join-modal');
  if (modal) modal.style.display = 'none';
}

function alreadyJoinedGroup() {
  localStorage.setItem('hasJoinedGroup', 'true');
  localStorage.setItem('groupJoinedDate', new Date().toISOString());
  closeGroupModal();
  showToast('✅ Thanks for confirming! You can now send anonymous messages.');
}

function confirmGroupJoin() {
  window.open('https://t.me/+gRSBLQDiO0kyOTU0', '_blank');
  closeGroupModal();
  setTimeout(() => {
    showToast('After joining the group, tap "I\'ve Already Joined" to start sending messages.');
  }, 1000);
}

function resetGroupStatus() {
  localStorage.removeItem('hasJoinedGroup');
  localStorage.removeItem('groupJoinedDate');
  showToast('Group status reset.');
}

// =====================
// LOAD AVAILABLE GROUPS
// =====================
let isLoadingGroups = false;
let lastGroupLoadTime = 0;
const GROUP_LOAD_COOLDOWN = 300000; // 5 minutes (300,000 milliseconds)

async function loadGroups(force = false) {
  const groupSelect = document.getElementById('target-group');
  if (!groupSelect) return;
  
  // Prevent multiple simultaneous loads
  if (isLoadingGroups) return;
  
  // Don't reload too frequently unless forced
  const now = Date.now();
  if (!force && (now - lastGroupLoadTime) < GROUP_LOAD_COOLDOWN && groupSelect.options.length > 1) {
    console.log('Using cached groups, next refresh in:', Math.ceil((GROUP_LOAD_COOLDOWN - (now - lastGroupLoadTime))/1000), 'seconds');
    return;
  }
  
  isLoadingGroups = true;
  groupSelect.innerHTML = '<option value="">-- Loading groups... --</option>';
  
  try {
    console.log('Fetching groups from worker...');
    const response = await fetch(`${WORKER_API_URL}/api/groups`);
    const result = await response.json();
    
    console.log('Groups response:', result);
    
    if (result.success && result.groups && result.groups.length > 0) {
      groupSelect.innerHTML = '<option value="">-- Select a group --</option>';
      
      for (const group of result.groups) {
        const option = document.createElement('option');
        option.value = group.id;
        option.textContent = group.title || 'Unnamed Group';
        groupSelect.appendChild(option);
      }
      
      // Auto-select if only one group
      if (result.groups.length === 1) {
        groupSelect.value = result.groups[0].id;
        console.log('Auto-selected group:', result.groups[0].title);
      }
      
      // Restore last selected group
      const lastGroup = localStorage.getItem('lastSelectedGroup');
      if (lastGroup && result.groups.find(g => g.id === lastGroup)) {
        groupSelect.value = lastGroup;
      }
      
      lastGroupLoadTime = Date.now();
    } else {
      groupSelect.innerHTML = '<option value="">-- No groups found. Add bot to a group first! --</option>';
    }
  } catch (error) {
    console.error('Error loading groups:', error);
    groupSelect.innerHTML = '<option value="">-- Error loading groups --</option>';
  }
  
  isLoadingGroups = false;
}

// Save selected group
function saveSelectedGroup() {
  const groupSelect = document.getElementById('target-group');
  if (groupSelect && groupSelect.value) {
    localStorage.setItem('lastSelectedGroup', groupSelect.value);
  }
}

// Manual refresh (user clicks button)
function refreshGroups() {
  loadGroups(true);
  showToast('🔄 Refreshing groups...');
}


// Initialize - load once, then refresh every 5 minutes
function initGroupDropdown() {
  loadGroups(true); // Load once on page load
  // Refresh every 5 minutes
  setInterval(() => {
    loadGroups(false);
  }, GROUP_LOAD_COOLDOWN);
}


// Save selected group (no auto-refresh)
function saveSelectedGroup() {
  const groupSelect = document.getElementById('target-group');
  if (groupSelect && groupSelect.value) {
    localStorage.setItem('lastSelectedGroup', groupSelect.value);
  }
}

// Manual refresh (user clicks button)
function refreshGroups() {
  loadGroups(true);
  showToast('🔄 Refreshing groups...');
}

// Initialize - load once, then only on manual refresh
function initGroupDropdown() {
  loadGroups(true); // Load once on page load
  // Remove the automatic interval refresh
}

// =====================
// CREATE SECRET MESSAGE (With groupId)
// =====================
async function createSecretMessage(message, recipientTelegram, senderName, emoji, category, groupId) {
  const statusDiv = document.getElementById('delivery-status');
  
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
  
  let cleanRecipient = recipientTelegram.trim();
  if (cleanRecipient.startsWith('@')) cleanRecipient = cleanRecipient.substring(1);
  const cleanMessage = sanitizeText(message);
  let cleanSender = '';
  if (senderName && senderName.trim()) {
    cleanSender = sanitizeText(senderName).substring(0, 30);
  }
  
  if (statusDiv) {
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = '📤 Sending your anonymous message...';
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
        emoji: emoji || '💌',
        groupId: groupId
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      if (statusDiv) {
        statusDiv.style.background = 'rgba(16,185,129,0.1)';
        statusDiv.innerHTML = `✅ Your anonymous message has been posted to the group!`;
      }
      showToast('✅ Message sent anonymously!');
      
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
// HANDLE GENERATE
// =====================
function handleGenerate() {
  let msg = (document.getElementById('msg-text')?.value || '').trim();
  const recipient = (document.getElementById('telegram-recipient')?.value || '').trim();
  const senderName = (document.getElementById('msg-from')?.value || '').trim();
  const emoji = (document.getElementById('msg-emoji')?.value || '').trim();
  const category = document.getElementById('msg-category')?.value || '';
  const groupId = document.getElementById('target-group')?.value || '';

  if (!msg) {
    shakeElement(document.getElementById('msg-text'));
    showToast('Please write a message', true);
    return;
  }
  
  if (msg.match(/https?:\/\/[^\s]+/g) || msg.match(/www\.[^\s]+/g)) {
    shakeElement(document.getElementById('msg-text'));
    showToast('URLs are not allowed in messages', true);
    return;
  }
  
  if (!recipient) {
    shakeElement(document.getElementById('telegram-recipient'));
    showToast('Please enter recipient\'s Telegram username', true);
    return;
  }
  
  if (!groupId) {
    showToast('Please select a group from the dropdown', true);
    return;
  }
  
  let cleanRecipient = recipient.trim();
  if (cleanRecipient.startsWith('@')) cleanRecipient = cleanRecipient.substring(1);
  
  if (!validateUsername(cleanRecipient)) {
    shakeElement(document.getElementById('telegram-recipient'));
    showToast('Invalid username: 5-32 characters (letters, numbers, underscore only)', true);
    return;
  }

  saveSelectedGroup();
  createSecretMessage(msg, recipient, senderName, emoji, category, groupId);
  incrementCount();
}

// =====================
// LOAD MESSAGE
// =====================
async function loadSecretMessage(messageId) {
  try {
    const response = await fetch(`${WORKER_API_URL}/api/message?id=${messageId}`);
    const result = await response.json();
    if (result.success) {
      return result;
    } else {
      showToast('Message not found', true);
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
// MESSAGE CREATOR UI
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
  
  if (!hasJoinedGroup()) {
    setTimeout(() => {
      if (!hasJoinedGroup()) {
        showGroupJoinModal();
      }
    }, 2000);
  }
}

function shakeElement(el) {
  if (!el) return;
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shake 0.4s ease';
  el.addEventListener('animationend', () => el.style.animation = '', { once: true });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// =====================
// TEMPLATES
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
  grid.innerHTML = '<div class="template-card" style="padding:40px;text-align:center;grid-column:1/-1;">Loading templates... ✨</div>';
  
  try {
    allTemplates = [];
    
    for (const cat of templateCategories) {
      try {
        const response = await fetch(`./messages/${cat.file}`);
        if (response.ok) {
          const text = await response.text();
          let categoryData;
          try {
            categoryData = JSON.parse(text);
          } catch (parseError) {
            console.error(`JSON parse error for ${cat.file}:`, parseError);
            continue;
          }
          
          if (categoryData.messages && Array.isArray(categoryData.messages)) {
            const templatesFromCategory = categoryData.messages.map((msg, index) => ({
              id: `${cat.id}_${msg.id || index}`,
              title: `${cat.icon} ${categoryData.category || cat.name} ${index + 1}`,
              message: msg.text,
              emoji: msg.logo || cat.icon,
              from: "Secret Admirer",
              category: cat.id,
              flow: msg.flow || null,
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
      allTemplates = getFallbackTemplates();
    }
    
    renderTemplateCategoryTabs();
    renderTemplatesByCategory('all');
    
  } catch (error) {
    console.error('Error loading templates:', error);
    grid.innerHTML = '<div class="template-card" style="padding:40px;text-align:center;grid-column:1/-1;">Failed to load templates. Refresh page. 🔄</div>';
    allTemplates = getFallbackTemplates();
    renderTemplateCategoryTabs();
    renderTemplatesByCategory('all');
  }
  
  isLoadingTemplates = false;
}

function getFallbackTemplates() {
  return [
    { id: 'f1', title: "🎂 Birthday Surprise", message: "Happy Birthday! Someone is thinking of you today! 🎂", emoji: "🎂", from: "Secret Admirer", category: "birthday", original_text: "Happy Birthday! Someone is thinking of you today! 🎂" },
    { id: 'f2', title: "❤️ Secret Crush", message: "I've been wanting to tell you... you're amazing! ❤️", emoji: "❤️", from: "Secret Admirer", category: "love_romance", original_text: "I've been wanting to tell you... you're amazing! ❤️" },
    { id: 'f3', title: "🔥 You're Hot", message: "Just saying... you're looking good today! 🔥", emoji: "🔥", from: "Secret Admirer", category: "adult_humor", original_text: "Just saying... you're looking good today! 🔥" },
    { id: 'f4', title: "💋 Flirty Vibes", message: "Hey there... someone thinks you're cute! 💋", emoji: "💋", from: "Secret Admirer", category: "flirty", original_text: "Hey there... someone thinks you're cute! 💋" }
  ];
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
    grid.innerHTML = `<div class="template-card" style="padding:40px;text-align:center;grid-column:1/-1;">No templates in this category yet.</div>`;
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
    
    const card = document.createElement('div');
    card.className = 'template-card';
    card.style.animationDelay = `${i * 0.05}s`;

    card.innerHTML = `
      <div class="tooltip">${escapeHtml(messageText.slice(0, 80))}...</div>
      <div class="template-body">
        <div class="template-title">${escapeHtml(tpl.title)}</div>
        <div class="template-preview">${escapeHtml(messageText.substring(0, 100))}...</div>
        <div class="template-emoji">${tpl.emoji || '💌'}</div>
      </div>
    `;

    grid.appendChild(card);

    card.addEventListener('click', () => {
      document.getElementById('msg-text').value = messageText;
      document.getElementById('msg-emoji').value = tpl.emoji || '💌';
      const categorySelect = document.getElementById('msg-category');
      if (categorySelect && tpl.category) {
        categorySelect.value = tpl.category;
      }
      showToast('✅ Template loaded! Ready to send.');
      document.getElementById('creator').scrollIntoView({ behavior: 'smooth' });
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

function updateGroupBanner() {
  const banner = document.getElementById('group-join-banner');
  if (banner) {
    if (!hasJoinedGroup()) {
      banner.style.display = 'block';
    } else {
      banner.style.display = 'none';
    }
  }
}

// Make functions global
window.alreadyJoinedGroup = alreadyJoinedGroup;
window.confirmGroupJoin = confirmGroupJoin;
window.closeGroupModal = closeGroupModal;
window.showGroupJoinModal = showGroupJoinModal;
window.resetGroupStatus = resetGroupStatus;
window.useTemplate = useTemplate;
window.sendReplyFromChat = sendReplyFromChat;
window.closeChat = closeChat;
window.goToCreator = goToCreator;
window.refreshGroups = refreshGroups;

// =====================
// CHAT SEQUENCE FUNCTIONS
// =====================
let chatActive = false;

function checkAndLoadChat() {
  const urlParams = new URLSearchParams(window.location.search);
  const messageId = urlParams.get('id');
  
  console.log('Checking for message ID:', messageId);
  
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
    } else if (sentence.length > 60) {
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
  
  setTimeout(() => {
    const scratchCanvas = wrap.querySelector('.scratch-canvas');
    if (scratchCanvas) {
      initScratchCard(scratchCanvas.id);
    }
  }, 100);
}

function createScratchCard(id) {
  const uniqueId = id + '_' + Date.now();
  return `
    <div class="scratch-container" id="scratch-container-${uniqueId}">
      <div class="scratch-label">✨ SCRATCH TO REVEAL ✨</div>
      <div class="scratch-area">
        <canvas id="scratch-canvas-${uniqueId}" width="280" height="100" class="scratch-canvas"></canvas>
        <div class="scratch-overlay">← Scratch Here →</div>
      </div>
      <div id="scratch-content-${uniqueId}" class="scratch-content" style="display: none;"></div>
    </div>
  `;
}

function initScratchCard(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const container = canvas.closest('.scratch-container');
  const contentDiv = container?.querySelector(`[id^="scratch-content"]`);
  let isDragging = false;
  let isRevealed = false;
  let scratchCount = 0;
  
  ctx.fillStyle = '#888';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#666';
  for (let i = 0; i < 300; i++) {
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
  }
  
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
    
    if (!isRevealed && scratchCount > 30) {
      const imageData = ctx.getImageData(canvas.width/2, canvas.height/2, 1, 1);
      if (imageData.data[3] === 0) {
        isRevealed = true;
        canvas.style.display = 'none';
        const overlay = container?.querySelector('.scratch-overlay');
        if (overlay) overlay.style.display = 'none';
        if (contentDiv) contentDiv.style.display = 'block';
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
  
  const randomTeasers = getRandomTeasers(category, 4);
  for (let i = 0; i < randomTeasers.length; i++) {
    await showTyping(messagesEl, 1200);
    let teaserEmoji = messageLogo;
    const emojiMatch = randomTeasers[i].match(/^([\u{1F300}-\u{1F9FF}])\s/iu);
    if (emojiMatch) teaserEmoji = emojiMatch[1];
    appendBubble(messagesEl, 'in', randomTeasers[i], teaserEmoji);
    await sleep(2000 + Math.random() * 500);
  }
  
  await showTyping(messagesEl, 1000);
  appendBubble(messagesEl, 'in', "💭 They've been waiting to share this with you...", "💭");
  await sleep(1800);
  
  await showTyping(messagesEl, 800);
  appendBubble(messagesEl, 'in', "⏰ The moment has arrived...", "⏰");
  await sleep(1500);
  
  await showTyping(messagesEl, 1200);
  appendBubble(messagesEl, 'in', "✨ Their message is hidden below. Scratch to reveal it... ✨", "✨");
  await sleep(1000);
  
  const scratchId = Date.now().toString();
  const scratchHtml = createScratchCard(scratchId);
  appendHtmlBubble(messagesEl, 'in', scratchHtml, "🎫");
  
  await sleep(500);
  
  await new Promise((resolve) => {
    let resolved = false;
    const targetId = `scratch-content-${scratchId}`;
    
    const checkInterval = setInterval(() => {
      const contentDiv = document.getElementById(targetId);
      if (contentDiv && contentDiv.style.display === 'block' && !resolved) {
        resolved = true;
        clearInterval(checkInterval);
        resolve();
      }
    }, 500);
    
    setTimeout(() => {
      if (!resolved) {
        clearInterval(checkInterval);
        const contentDiv = document.getElementById(targetId);
        if (contentDiv) {
          contentDiv.style.display = 'block';
        }
        resolve();
      }
    }, 60000);
  });
  
  const contentDiv = document.getElementById(`scratch-content-${scratchId}`);
  if (contentDiv) {
    contentDiv.innerHTML = '<div class="scratch-loading">✨ Revealing your message... ✨</div>';
    await sleep(800);
    
    contentDiv.innerHTML = '<div class="line-reveal-container"></div>';
    const revealContainer = contentDiv.querySelector('.line-reveal-container');
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
      
      revealContainer.scrollTop = revealContainer.scrollHeight;
      const delay = Math.min(800 + line.length * 20, 2000);
      await sleep(delay);
    }
  }
  
  await sleep(1000);
  
  if (senderName && senderName !== 'Secret Admirer') {
    await showTyping(messagesEl, 1000);
    appendBubble(messagesEl, 'in', `— ${senderName} ${params.emoji || messageLogo}`, messageLogo);
  } else {
    await sleep(800);
    appendBubble(messagesEl, 'in', `— Someone who cares ${params.emoji || '💌'}`, messageLogo);
  }
  
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

function goToCreator() {
  closeChat();
  setTimeout(() => {
    const creator = document.getElementById('creator');
    if (creator) creator.scrollIntoView({ behavior: 'smooth' });
  }, 300);
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

document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded, initializing Group Messenger...');
  
  checkAndLoadChat();
  updateCounterDisplay();
  initCreator();
  loadTemplates();
  initScrollAnimations();
  initEmojiPicker();
  initCategoryDropdown();
  initGroupDropdown();
  updateGroupBanner();
  
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
  .template-emoji {
    font-size: 1.5rem;
    margin-top: 8px;
    text-align: center;
  }
  
  .templates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
  
  .category-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-bottom: 24px;
  }
  
  .category-tab {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 40px;
    padding: 8px 20px;
    cursor: pointer;
    transition: all 0.2s;
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
    margin-top: 24px;
    align-items: center;
  }
  
  .btn-load-more, .btn-load-less {
    background: linear-gradient(135deg, #c084fc, #818cf8);
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 40px;
    cursor: pointer;
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
  }
  
  .scratch-container {
    text-align: center;
    padding: 10px;
    background: linear-gradient(135deg, #1e1e32, #2a1a3e);
    border-radius: 16px;
  }
  
  .scratch-label {
    font-size: 0.8rem;
    color: #c084fc;
    margin-bottom: 10px;
  }
  
  .scratch-area {
    position: relative;
    display: inline-block;
  }
  
  .scratch-canvas {
    border-radius: 12px;
    cursor: pointer;
  }
  
  .scratch-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.7rem;
    color: white;
    background: rgba(0,0,0,0.5);
    padding: 4px 12px;
    border-radius: 20px;
    pointer-events: none;
  }
  
  .scratch-content {
    background: linear-gradient(135deg, #1e1e32, #2a1a3e);
    border-radius: 16px;
    padding: 20px;
    margin-top: 10px;
  }
  
  .reveal-line {
    margin-bottom: 12px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(192,132,252,0.1);
    display: flex;
    gap: 12px;
  }
  
  .reveal-emoji {
    font-size: 1.2rem;
    min-width: 32px;
  }
  
  .reveal-text {
    flex: 1;
    line-height: 1.6;
  }
  
  .bubble.main-msg {
    background: linear-gradient(135deg, #1e1e32, #2a1a3e);
    border: 1px solid rgba(192,132,252,0.15);
  }
  
  .msg-wrap {
    display: flex;
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
  }
  
  .bubble {
    max-width: 75%;
    padding: 10px 14px;
    border-radius: 18px;
    font-size: 0.9rem;
  }
  
  .bubble.in { background: #1e1e32; border-bottom-left-radius: 4px; }
  .bubble.out { background: linear-gradient(135deg, #c084fc, #818cf8); border-bottom-right-radius: 4px; }
  
  .time { font-size: 0.65rem; opacity: 0.6; margin-top: 4px; text-align: right; }
  
  .msg-date-divider { text-align: center; font-size: 0.7rem; color: var(--muted); margin: 16px 0; }
  
  .typing-indicator { display: flex; gap: 10px; margin: 8px 0; }
  .typing-bubble { background: #1e1e32; padding: 12px 16px; border-radius: 18px; display: flex; gap: 4px; }
  .typing-bubble span { width: 6px; height: 6px; background: #7878a0; border-radius: 50%; animation: typing 1.4s infinite; }
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
  }
  
  .group-join-banner {
    background: linear-gradient(135deg, rgba(192,132,252,0.15), rgba(129,140,248,0.1));
    border: 1px solid rgba(192,132,252,0.3);
    border-radius: 24px;
    margin: 40px auto;
    max-width: 600px;
    padding: 4px;
  }
  
  .group-join-content {
    background: var(--bg-card);
    border-radius: 20px;
    padding: 24px;
    text-align: center;
  }
  
  .group-join-icon { font-size: 3rem; margin-bottom: 12px; }
  .group-join-text h3 { font-family: 'Sora', sans-serif; font-size: 1.3rem; margin-bottom: 8px; background: linear-gradient(135deg, #c084fc, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .group-join-text p { color: var(--subtext); font-size: 0.9rem; margin-bottom: 16px; }
  .group-join-btn { display: inline-block; background: linear-gradient(135deg, #c084fc, #818cf8); color: white; padding: 12px 28px; border-radius: 50px; text-decoration: none; font-weight: 600; margin: 8px 0; }
  .group-join-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(192,132,252,0.4); }
  .group-join-note { font-size: 0.75rem !important; color: var(--muted) !important; margin-top: 12px !important; }
`;
document.head.appendChild(styleSheet);





// At the very top of your script, after DOMContentLoaded
function getMessageIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Modified checkAndLoadChat
function checkAndLoadChat() {
  const messageId = getMessageIdFromURL();
  
  console.log('Checking for message ID:', messageId);
  
  if (messageId && messageId.startsWith('msg_') && !chatActive) {
    chatActive = true;
    
    // Show loading state
    const overlay = document.getElementById('chat-overlay');
    if (overlay) overlay.classList.add('active');
    
    loadSecretMessage(messageId).then(messageData => {
      if (messageData && messageData.success) {
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
            <p>The secret message may have expired or been deleted.</p>
            <button class="btn-primary" onclick="closeChat()">Go Back</button>
          </div>
        `;
      }
    });
  }
}









