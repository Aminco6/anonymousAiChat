// ===================== CONFIGURATION =====================
const WORKER_API_URL = 'https://anonymous-telegram-bot.voicedontdie.workers.dev';

// ===================== UTILS =====================
function showToast(msg, isError = false) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
    background: ${isError ? '#ef4444' : '#1a1a2e'}; border: 1px solid #c084fc;
    border-radius: 12px; padding: 12px 20px; color: white; z-index: 10000;
    animation: fade-up 0.3s ease; white-space: nowrap;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function escapeHtml(str) { return str?.replace(/[&<>]/g, function(m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]; }) || ''; }

// ===================== GROUP SELECTION =====================
async function loadGroups() {
  const select = document.getElementById('target-group');
  if (!select) return;
  select.innerHTML = '<option>-- Loading groups... --</option>';
  try {
    const res = await fetch(`${WORKER_API_URL}/api/groups`);
    const data = await res.json();
    if (data.success && data.groups.length) {
      select.innerHTML = '<option value="">-- Select a group --</option>';
      data.groups.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g.id;
        opt.textContent = g.title;
        select.appendChild(opt);
      });
      const last = localStorage.getItem('lastGroup');
      if (last && data.groups.find(g => g.id == last)) select.value = last;
    } else {
      select.innerHTML = '<option>-- No groups found. Add bot to a group first! --</option>';
    }
  } catch(e) { select.innerHTML = '<option>-- Error loading groups --</option>'; }
}

function saveSelectedGroup() {
  const select = document.getElementById('target-group');
  if (select?.value) localStorage.setItem('lastGroup', select.value);
}

// ===================== SEND MESSAGE =====================
async function sendMessage(message, recipient, senderName, emoji, category, groupId) {
  const statusDiv = document.getElementById('delivery-status');
  if (statusDiv) {
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = '📤 Sending...';
  }
  
  try {
    const res = await fetch(`${WORKER_API_URL}/api/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, recipientTelegram: recipient, senderName, emoji, category, groupId })
    });
    const data = await res.json();
    if (data.success) {
      showToast('✅ Message sent anonymously!');
      document.getElementById('msg-text').value = '';
      document.getElementById('telegram-recipient').value = '';
      if (statusDiv) statusDiv.innerHTML = '✅ Message posted to group!';
      setTimeout(() => { if (statusDiv) statusDiv.style.display = 'none'; }, 3000);
    } else {
      throw new Error(data.error);
    }
  } catch(e) {
    showToast('❌ Failed: ' + e.message, true);
    if (statusDiv) statusDiv.innerHTML = '❌ Failed to send';
  }
}

function handleGenerate() {
  const msg = document.getElementById('msg-text')?.value.trim();
  const recipient = document.getElementById('telegram-recipient')?.value.trim();
  const senderName = document.getElementById('msg-from')?.value.trim();
  const emoji = document.getElementById('msg-emoji')?.value.trim();
  const category = document.getElementById('msg-category')?.value;
  const groupId = document.getElementById('target-group')?.value;
  
  if (!msg) return showToast('Please write a message', true);
  if (!recipient) return showToast('Please enter recipient username', true);
  if (!groupId) return showToast('Please select a group', true);
  
  saveSelectedGroup();
  sendMessage(msg, recipient, senderName, emoji, category, groupId);
}

// ===================== MESSAGE REVEAL (SCRATCH + LINE BY LINE) =====================
let chatActive = false;

function checkAndLoadChat() {
  const msgId = new URLSearchParams(window.location.search).get('id');
  if (!msgId || chatActive) return;
  chatActive = true;
  
  fetch(`${WORKER_API_URL}/api/message?id=${msgId}`)
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        openChat({ msg: data.message, from: data.senderName, emoji: data.emoji, category: data.category, messageId: msgId });
      } else {
        document.getElementById('chat-overlay').classList.add('active');
        document.getElementById('chat-messages').innerHTML = '<div style="text-align:center;padding:50px;"><h3>Message Not Found</h3><button class="btn-primary" onclick="closeChat()">Go Back</button></div>';
      }
    });
}

function openChat(params) {
  const overlay = document.getElementById('chat-overlay');
  if (!overlay) return;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  startChatSequence(params);
}

function closeChat() {
  document.getElementById('chat-overlay').classList.remove('active');
  document.body.style.overflow = '';
  chatActive = false;
  window.history.pushState('', '', window.location.pathname);
}

async function startChatSequence(params) {
  const messagesEl = document.getElementById('chat-messages');
  messagesEl.innerHTML = '';
  await sleep(2000);
  
  appendMsg(messagesEl, 'in', `✨ Someone sent you a secret message... ✨`, '🤫');
  await sleep(1500);
  
  const teasers = getRandomTeasers(params.category);
  for (let t of teasers.slice(0, 3)) {
    await showTyping(messagesEl, 1000);
    appendMsg(messagesEl, 'in', t, '💭');
    await sleep(1800);
  }
  
  await showTyping(messagesEl, 1000);
  appendMsg(messagesEl, 'in', '✨ Scratch below to reveal the message ✨', '🎫');
  
  const scratchId = 'scratch_' + Date.now();
  const scratchHtml = createScratchCard(scratchId);
  appendHtml(messagesEl, 'in', scratchHtml, '🎁');
  
  await new Promise(resolve => {
    const check = setInterval(() => {
      const content = document.getElementById(`scratch-content-${scratchId}`);
      if (content?.style.display === 'block') {
        clearInterval(check);
        resolve();
      }
    }, 500);
    setTimeout(() => { clearInterval(check); resolve(); }, 30000);
  });
  
  const contentDiv = document.getElementById(`scratch-content-${scratchId}`);
  if (contentDiv) {
    contentDiv.innerHTML = '<div class="scratch-loading">✨ Revealing... ✨</div>';
    await sleep(800);
    contentDiv.innerHTML = '<div class="line-reveal-container"></div>';
    const container = contentDiv.querySelector('.line-reveal-container');
    const lines = splitIntoLines(params.msg);
    for (let line of lines) {
      const lineDiv = document.createElement('div');
      lineDiv.className = 'reveal-line';
      lineDiv.innerHTML = `<span class="reveal-emoji">${params.emoji || '💌'}</span> <span class="reveal-text">${escapeHtml(line)}</span>`;
      container.appendChild(lineDiv);
      lineDiv.style.opacity = '0';
      setTimeout(() => lineDiv.style.opacity = '1', 50);
      await sleep(800);
    }
  }
  
  await sleep(1000);
  appendMsg(messagesEl, 'in', `— ${params.from || 'Someone who cares'} ${params.emoji || '💌'}`, '💕');
  
  const replyDiv = document.createElement('div');
  replyDiv.className = 'reveal-cta';
  replyDiv.innerHTML = `
    <p>💝 Want to reply anonymously?</p>
    <textarea id="reply-message" rows="2" placeholder="Type your reply..." style="width:100%; margin:10px 0; padding:10px; border-radius:12px; background:#1e1e32; border:1px solid #c084fc; color:white;"></textarea>
    <input type="text" id="reply-name" placeholder="Your name (optional)" style="width:100%; margin-bottom:10px; padding:10px; border-radius:12px; background:#1e1e32; border:1px solid #c084fc; color:white;">
    <button class="btn-primary" onclick="sendReply('${params.messageId}')">✨ Send Anonymous Reply</button>
    <hr style="margin:15px 0;"><button class="btn-primary" onclick="goToCreator()">✨ Create Your Own Message</button>
  `;
  messagesEl.appendChild(replyDiv);
}

async function sendReply(messageId) {
  const reply = document.getElementById('reply-message')?.value.trim();
  const name = document.getElementById('reply-name')?.value.trim();
  if (!reply) return showToast('Please write a reply', true);
  try {
    const res = await fetch(`${WORKER_API_URL}/api/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId, replyMessage: reply, replierName: name })
    });
    const data = await res.json();
    if (data.success) showToast('✅ Reply sent anonymously!');
    else throw new Error(data.error);
  } catch(e) { showToast('❌ Failed to send reply', true); }
}

function appendMsg(container, dir, text, emoji) {
  const wrap = document.createElement('div');
  wrap.className = `msg-wrap ${dir}`;
  wrap.innerHTML = `<div class="msg-avatar-sm">${emoji}</div><div class="bubble ${dir}">${escapeHtml(text)}<div class="time">${new Date().toLocaleTimeString()}</div></div>`;
  container.appendChild(wrap);
  container.scrollTop = container.scrollHeight;
}

function appendHtml(container, dir, html, emoji) {
  const wrap = document.createElement('div');
  wrap.className = `msg-wrap ${dir}`;
  wrap.innerHTML = `<div class="msg-avatar-sm">${emoji}</div><div class="bubble ${dir}">${html}<div class="time">${new Date().toLocaleTimeString()}</div></div>`;
  container.appendChild(wrap);
  container.scrollTop = container.scrollHeight;
  setTimeout(() => { const canvas = wrap.querySelector('.scratch-canvas'); if(canvas) initScratchCard(canvas.id); }, 100);
}

async function showTyping(container, duration) {
  const typing = document.createElement('div');
  typing.className = 'typing-indicator';
  typing.innerHTML = `<div class="msg-avatar-sm">🤖</div><div class="typing-bubble"><span></span><span></span><span></span></div>`;
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;
  await sleep(duration);
  typing.remove();
}

function createScratchCard(id) {
  return `<div class="scratch-container" id="scratch-container-${id}">
    <div class="scratch-label">✨ SCRATCH TO REVEAL ✨</div>
    <div class="scratch-area">
      <canvas id="scratch-canvas-${id}" width="280" height="100" class="scratch-canvas"></canvas>
      <div class="scratch-overlay">← Scratch Here →</div>
    </div>
    <div id="scratch-content-${id}" class="scratch-content" style="display: none;"></div>
  </div>`;
}

function initScratchCard(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const container = canvas.closest('.scratch-container');
  const contentDiv = container?.querySelector('[id^="scratch-content"]');
  let dragging = false, revealed = false, count = 0;
  
  ctx.fillStyle = '#888'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#666';
  for(let i=0;i<300;i++) ctx.fillRect(Math.random()*canvas.width, Math.random()*canvas.height, 2, 2);
  ctx.fillStyle = '#c084fc'; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center';
  ctx.fillText('← SCRATCH →', canvas.width/2, canvas.height/2);
  
  function getCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width/rect.width, scaleY = canvas.height/rect.height;
    let cx, cy;
    if(e.touches) { cx = e.touches[0].clientX; cy = e.touches[0].clientY; }
    else { cx = e.clientX; cy = e.clientY; }
    return { x: Math.max(0, Math.min(canvas.width, (cx - rect.left)*scaleX)), y: Math.max(0, Math.min(canvas.height, (cy - rect.top)*scaleY)) };
  }
  
  function scratch(e) {
    if(!dragging || revealed) return;
    e.preventDefault();
    const {x,y} = getCoords(e);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(x,y,12,0,Math.PI*2); ctx.fill();
    count++;
    if(!revealed && count>30) {
      const imgData = ctx.getImageData(canvas.width/2, canvas.height/2, 1, 1);
      if(imgData.data[3] === 0) {
        revealed = true;
        canvas.style.display = 'none';
        if(contentDiv) contentDiv.style.display = 'block';
      }
    }
  }
  
  canvas.addEventListener('mousedown', () => dragging = true);
  canvas.addEventListener('mouseup', () => dragging = false);
  canvas.addEventListener('mousemove', scratch);
  canvas.addEventListener('touchstart', () => dragging = true);
  canvas.addEventListener('touchend', () => dragging = false);
  canvas.addEventListener('touchmove', e => { e.preventDefault(); scratch(e); });
}

function splitIntoLines(msg) {
  return msg.split(/(?<=[.!?])\s+/).filter(l => l.trim());
}

function getRandomTeasers(cat) {
  const teasers = {
    birthday: ['🎂 A special birthday message awaits...', '🎈 Someone is thinking of you today...'],
    love_romance: ['❤️ A secret admirer has a message for you...', '💕 Someone\'s heart beats for you...'],
    default: ['🤫 Shh... a secret message is waiting...', '✨ Someone sent you something special...']
  };
  return teasers[cat] || teasers.default;
}

function goToCreator() { closeChat(); document.getElementById('creator').scrollIntoView({ behavior: 'smooth' }); }

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
  loadGroups();
  document.getElementById('generate-btn')?.addEventListener('click', handleGenerate);
  document.getElementById('refresh-groups')?.addEventListener('click', loadGroups);
  checkAndLoadChat();
  
  // Emoji picker
  const emojis = ['💌','❤️','🔥','💋','🎂','✨','🌟','💕','💖','💗'];
  const container = document.getElementById('emoji-quick');
  if(container) {
    emojis.forEach(e => {
      const btn = document.createElement('button');
      btn.textContent = e;
      btn.className = 'emoji-pick-btn';
      btn.onclick = () => document.getElementById('msg-emoji').value = e;
      container.appendChild(btn);
    });
  }
  
  // Category dropdown
  const catSelect = document.getElementById('msg-category');
  if(catSelect) {
    const cats = { birthday:'🎂 Birthday', love_romance:'❤️ Romance', adult_humor:'🔥 Adult', flirty:'💋 Flirty', wedding:'💍 Wedding', relationship:'🤝 Relationship', sympathy:'😢 Sympathy', fun:'😂 Fun', holidays:'🎄 Holidays', islamic:'🌙 Islamic', nigeria:'🇳🇬 Nigeria' };
    catSelect.innerHTML = '<option value="">-- Select Category --</option>';
    Object.entries(cats).forEach(([k,v]) => { const opt = document.createElement('option'); opt.value = k; opt.textContent = v; catSelect.appendChild(opt); });
  }
});

window.sendReply = sendReply;
window.closeChat = closeChat;
window.goToCreator = goToCreator;