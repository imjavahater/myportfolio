// =========================================================
// AI CHATBOT WIDGET
// Talks to your Cloudflare Worker (which holds the secret API key).
// =========================================================

// 1) After deploying the Worker, paste its address here (see chatbot-worker/README.md).
//    While it still says YOUR-SUBDOMAIN, the chat button stays hidden.
const CHAT_API_URL = 'imjavahater.workers.dev';

const CHAT_STORAGE_KEY = 'kts-chat';
const CHAT_MAX_CHARS = 1000;
const CHAT_SUGGESTIONS = [
  "What's Kennard's experience?",
  'Which tech skills does he have?',
  'Show me his projects',
  'How can I contact him?'
];
const CHAT_GREETING = "Hi! I'm Kennard's AI assistant. Ask me anything about his experience, skills, or projects.";

(function () {
  if (CHAT_API_URL.indexOf('YOUR-SUBDOMAIN') !== -1) return; // not set up yet

  // ---------- Conversation memory (survives page reloads in this tab) ----------
  let history = [];
  try { history = JSON.parse(sessionStorage.getItem(CHAT_STORAGE_KEY)) || []; } catch (e) { history = []; }
  function saveHistory() {
    try { sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(history)); } catch (e) { /* ignore */ }
  }

  // ---------- Build the widget ----------
  const launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.className = 'chat-launcher';
  launcher.setAttribute('aria-label', 'Open chat with AI assistant');
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'chatPanel');
  launcher.innerHTML = '<i class="ri-chat-smile-2-line" aria-hidden="true"></i><span class="chat-launcher-text">Ask AI</span>';

  const panel = document.createElement('section');
  panel.className = 'chat-panel';
  panel.id = 'chatPanel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'AI assistant chat');
  panel.hidden = true;
  panel.innerHTML =
    '<header class="chat-header">' +
      '<div><p class="chat-title">Ask about Kennard</p><p class="chat-subtitle">AI assistant · may make mistakes</p></div>' +
      '<button type="button" class="chat-close" aria-label="Close chat"><i class="ri-close-line" aria-hidden="true"></i></button>' +
    '</header>' +
    '<div class="chat-log" role="log" aria-live="polite"></div>' +
    '<div class="chat-suggestions"></div>' +
    '<form class="chat-form">' +
      '<label for="chatInput" class="chat-sr">Your message</label>' +
      '<textarea id="chatInput" class="chat-input" rows="1" maxlength="' + CHAT_MAX_CHARS + '" placeholder="Type your question..." required></textarea>' +
      '<button type="submit" class="chat-send" aria-label="Send"><i class="ri-send-plane-2-fill" aria-hidden="true"></i></button>' +
    '</form>';

  document.body.appendChild(launcher);
  document.body.appendChild(panel);
  document.body.classList.add('has-chat');

  const log = panel.querySelector('.chat-log');
  const suggestions = panel.querySelector('.chat-suggestions');
  const form = panel.querySelector('.chat-form');
  const input = panel.querySelector('.chat-input');
  const sendBtn = panel.querySelector('.chat-send');
  const closeBtn = panel.querySelector('.chat-close');

  // ---------- Rendering (textContent only = safe from injected HTML) ----------
  function addLinks(el, text) {
    const parts = text.split(/(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+)/g);
    parts.forEach(function (part, i) {
      if (i % 2 === 1) {
        const clean = part.replace(/[.,]+$/, '');
        const a = document.createElement('a');
        a.textContent = clean;
        if (clean.indexOf('@') !== -1 && clean.indexOf('http') !== 0) {
          a.href = 'mailto:' + clean;
        } else {
          a.href = clean;
          a.target = '_blank';
          a.rel = 'noopener';
        }
        el.appendChild(a);
        if (clean.length < part.length) el.appendChild(document.createTextNode(part.slice(clean.length)));
      } else if (part) {
        el.appendChild(document.createTextNode(part));
      }
    });
  }

  function addBubble(role, text, extraClass) {
    const div = document.createElement('div');
    div.className = 'chat-msg chat-' + role + (extraClass ? ' ' + extraClass : '');
    addLinks(div, text);
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  function renderAll() {
    log.textContent = '';
    addBubble('assistant', CHAT_GREETING);
    history.forEach(function (m) { addBubble(m.role, m.content); });
    suggestions.hidden = history.length > 0;
  }

  CHAT_SUGGESTIONS.forEach(function (q) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chat-chip';
    b.textContent = q;
    b.addEventListener('click', function () { send(q); });
    suggestions.appendChild(b);
  });

  // ---------- Open / close ----------
  function setOpen(open) {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('chat-open', open);
    if (open) {
      renderAll();
      input.focus();
    } else {
      launcher.focus();
    }
  }
  launcher.addEventListener('click', function () { setOpen(panel.hidden); });
  closeBtn.addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) setOpen(false);
  });

  // Enter sends, Shift+Enter makes a new line; textarea grows with text
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });
  input.addEventListener('input', function () {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    send(input.value);
  });

  // ---------- Talk to the Worker ----------
  let busy = false;
  function send(text) {
    text = text.trim();
    if (!text || busy) return;
    busy = true;
    sendBtn.disabled = true;
    suggestions.hidden = true;
    input.value = '';
    input.style.height = 'auto';

    history.push({ role: 'user', content: text.slice(0, CHAT_MAX_CHARS) });
    saveHistory();
    addBubble('user', text);
    const typing = addBubble('assistant', 'Thinking', 'chat-typing');

    fetch(CHAT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history.slice(-20) })
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok || !data.reply) throw new Error(data.error || 'Request failed');
          return data.reply;
        });
      })
      .then(function (reply) {
        typing.remove();
        history.push({ role: 'assistant', content: reply });
        saveHistory();
        addBubble('assistant', reply);
      })
      .catch(function (err) {
        typing.remove();
        history.pop(); // forget the failed question so the conversation stays valid
        saveHistory();
        const msg = err && err.message && err.message !== 'Failed to fetch' && err.message !== 'Request failed'
          ? err.message
          : 'Sorry, I could not connect. Please try again, or use the contact form.';
        addBubble('assistant', msg, 'chat-error');
      })
      .finally(function () {
        busy = false;
        sendBtn.disabled = false;
      });
  }
})();
