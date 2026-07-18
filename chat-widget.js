(function () {
  var SB_URL = 'https://ujcokrzjvjdrcrdhcnjy.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqY29rcnpqdmpkcmNyZGhjbmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNzA1MzksImV4cCI6MjA5OTk0NjUzOX0.SFgd7FP8lnkbIJ0CxoXXfD5-yo8XIyHGlOS_aK1J9-I';
  var TK = 'nxt_chat_token', CK = 'nxt_chat_id';
  var vid = localStorage.getItem(TK) || 'v_' + crypto.randomUUID();
  localStorage.setItem(TK, vid);

  var s = document.createElement('style');
  s.textContent = `
#nxt-chat-btn{position:fixed;bottom:24px;right:24px;z-index:999999;width:60px;height:60px;border-radius:50%;
  background:linear-gradient(135deg,#FF3E41,#d92e31);color:#fff;border:none;cursor:pointer;
  box-shadow:0 4px 20px rgba(255,62,65,.4);font-size:28px;display:flex;align-items:center;justify-content:center;
  transition:transform .2s,box-shadow .2s}
#nxt-chat-btn:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(255,62,65,.5)}
#nxt-chat-btn:active{transform:scale(.95)}
#nxt-chat-badge{position:absolute;top:-3px;right:-3px;min-width:22px;height:22px;border-radius:11px;
  background:#060315;color:#fff;font-size:11px;font-weight:800;display:none;align-items:center;justify-content:center;
  padding:0 6px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.25)}
#nxt-chat-btn.has-badge #nxt-chat-badge{display:flex}
@keyframes nxt-ring{0%{transform:rotate(0)}20%{transform:rotate(12deg)}40%{transform:rotate(-10deg)}60%{transform:rotate(6deg)}80%{transform:rotate(-4deg)}100%{transform:rotate(0)}}
#nxt-chat-btn.ring{animation:nxt-ring .5s ease}

#nxt-chat-window{position:fixed;bottom:96px;right:24px;z-index:999999;width:400px;height:580px;
  max-height:calc(100vh - 140px);background:#fff;border-radius:18px;
  box-shadow:0 16px 60px rgba(6,3,21,.25);display:none;flex-direction:column;overflow:hidden;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
  animation:nxt-slideUp .25s ease}
@keyframes nxt-slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
#nxt-chat-window.open{display:flex}

#nxt-chat-header{
  background:linear-gradient(135deg,#060315 0%,#1a0a2e 50%,#FF3E41 100%);
  color:#fff;padding:16px 18px;display:flex;align-items:center;gap:10px;flex-shrink:0}
#nxt-header-left{display:flex;align-items:center;gap:8px;flex:1;position:relative}
#nxt-brand-icon{width:28px;height:28px;background:#FF3E41;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:#fff;flex-shrink:0}
#nxt-chat-header h3{margin:0;font-size:15px;font-weight:700;letter-spacing:-.2px}
#nxt-status-dot{width:6px;height:6px;border-radius:50%;background:#51CFED;display:inline-block;margin-left:6px;animation:nxt-pulse 2s infinite}
@keyframes nxt-pulse{0%{opacity:1}50%{opacity:.4}100%{opacity:1}}
#nxt-maximize-btn{background:none;border:none;color:#fff;font-size:16px;cursor:pointer;padding:4px;opacity:.6;transition:opacity .15s;line-height:1;display:flex;align-items:center}
#nxt-maximize-btn:hover{opacity:1}
#nxt-chat-close{background:none;border:none;color:#fff;font-size:22px;cursor:pointer;padding:0 4px;opacity:.7;transition:opacity .15s;line-height:1}
#nxt-chat-close:hover{opacity:1}

#nxt-chat-window.maximized{width:min(800px,calc(100vw - 48px));height:min(700px,calc(100vh - 120px));bottom:60px;right:96px}
@media(max-width:768px){#nxt-maximize-btn{display:none}}

#nxt-chat-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:8px;background:#F8F2F0}
#nxt-chat-messages::-webkit-scrollbar{width:5px}
#nxt-chat-messages::-webkit-scrollbar-thumb{background:#d5cbc7;border-radius:6px}

.nxt-msg{max-width:82%;padding:11px 16px;border-radius:16px;font-size:14px;line-height:1.45;word-wrap:break-word;position:relative}
.nxt-msg.visitor{align-self:flex-end;background:linear-gradient(135deg,#FF3E41,#d92e31);color:#fff;border-bottom-right-radius:4px;box-shadow:0 2px 8px rgba(255,62,65,.15)}
.nxt-msg.agent{align-self:flex-start;background:#fff;color:#060315;border-bottom-left-radius:4px;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.nxt-msg .nxt-time{font-size:10px;opacity:.65;margin-top:5px;display:block;letter-spacing:.2px}

#nxt-chat-input-area{display:flex;padding:12px 16px 14px;gap:8px;border-top:1px solid #e9ecef;background:#fff;flex-shrink:0}
#nxt-chat-input{flex:1;border:2px solid #e9ecef;border-radius:24px;padding:10px 18px;font-size:14px;outline:none;background:#F8F2F0;transition:border-color .2s}
#nxt-chat-input:focus{border-color:#FF3E41;background:#fff}
#nxt-chat-send{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#FF3E41,#d92e31);color:#fff;border:none;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .15s,box-shadow .15s;box-shadow:0 2px 8px rgba(255,62,65,.25)}
#nxt-chat-send:hover:not(:disabled){transform:scale(1.05);box-shadow:0 4px 14px rgba(255,62,65,.35)}
#nxt-chat-send:disabled{opacity:.4;cursor:not-allowed;box-shadow:none}

.nxt-welcome{text-align:center;color:#6c757d;padding:40px 20px}
.nxt-welcome h4{margin:0 0 6px;color:#060315;font-size:18px}
.nxt-welcome p{margin:0;font-size:14px;line-height:1.5}

#nxt-history-list{padding:16px;background:#fff;border-bottom:1px solid #e9ecef}
#nxt-history-list h5{font-size:13px;color:#6c757d;margin:0 0 12px;font-weight:600;text-transform:uppercase;letter-spacing:.5px}
.nxt-history-item{padding:10px 14px;border-radius:10px;cursor:pointer;font-size:13px;color:#060315;display:flex;justify-content:space-between;align-items:center;transition:background .15s}
.nxt-history-item:hover{background:#F8F2F0}
.nxt-history-item .chip-status{font-size:11px;color:#6c757d}
.nxt-new-chat-btn{display:block;width:100%;padding:10px;margin-top:10px;background:linear-gradient(135deg,#FF3E41,#d92e31);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;transition:transform .15s}
.nxt-new-chat-btn:hover{transform:translateY(-1px)}
.nxt-history-back{background:none;border:none;color:#FF3E41;font-size:13px;cursor:pointer;padding:4px 0;margin-bottom:10px;font-weight:600;display:inline-flex;align-items:center;gap:4px}
.nxt-readonly-banner{text-align:center;font-size:12px;color:#6c757d;padding:8px 12px;background:#fff3cd;border-bottom:1px solid #ffc107;flex-shrink:0}

@media(max-width:480px){
  #nxt-chat-window{width:calc(100vw - 24px);right:12px;bottom:84px;height:calc(100vh - 120px)}
  #nxt-chat-btn{bottom:18px;right:18px;width:54px;height:54px}
}`;
  document.head.appendChild(s);

  var btn = document.createElement('button');
  btn.id = 'nxt-chat-btn';
  btn.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span id="nxt-chat-badge"></span>';
  document.body.appendChild(btn);

  var win = document.createElement('div');
  win.id = 'nxt-chat-window';
  win.innerHTML =
    '<div id="nxt-chat-header">' +
    '<div id="nxt-header-left">' +
    '<div id="nxt-brand-icon">N</div>' +
    '<h3>Nexatrack <span id="nxt-status-dot"></span></h3>' +
    '</div>' +
    '<button id="nxt-maximize-btn" title="Maximize">' +
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>' +
    '</button>' +
    '<button id="nxt-chat-close">&times;</button>' +
    '</div>' +
    '<div id="nxt-chat-messages">' +
    '<div class="nxt-welcome"><h4>Welcome to Nexatrack!</h4><p>Ask us anything about our courier services. We\'re here to help!</p></div>' +
    '</div>' +
    '<div id="nxt-chat-input-area">' +
    '<input id="nxt-chat-input" type="text" placeholder="Type your message..." />' +
    '<button id="nxt-chat-send" disabled><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>' +
    '</div>';

  document.body.appendChild(win);

  var sb = null, cid = localStorage.getItem(CK), sub = null, unread = 0, blocked = false;
  var badgeEl = document.getElementById('nxt-chat-badge');
  var mc = document.getElementById('nxt-chat-messages');
  var ci = document.getElementById('nxt-chat-input');
  var sendBtn = document.getElementById('nxt-chat-send');
  var closeBtn = document.getElementById('nxt-chat-close');
  var maxBtn = document.getElementById('nxt-maximize-btn');
  var maximized = false;

  function notifySound() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'sine'; o.frequency.value = 660;
      g.gain.setValueAtTime(.3, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(.01, ctx.currentTime + .3);
      o.start(ctx.currentTime);
      o.stop(ctx.currentTime + .3);
      setTimeout(function () {
        var o2 = ctx.createOscillator();
        var g2 = ctx.createGain();
        o2.connect(g2); g2.connect(ctx.destination);
        o2.type = 'sine'; o2.frequency.value = 880;
        g2.gain.setValueAtTime(.25, ctx.currentTime);
        g2.gain.exponentialRampToValueAtTime(.01, ctx.currentTime + .25);
        o2.start(ctx.currentTime);
        o2.stop(ctx.currentTime + .25);
      }, 150);
    } catch (e) { /* silent */ }
  }

  function loadSb(cb) {
    if (sb) { cb(sb); return; }
    var sc = document.createElement('script');
    sc.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    sc.onload = function () { sb = supabase.createClient(SB_URL, SB_KEY); cb(sb); };
    document.head.appendChild(sc);
  }

  function scrollBottom() { mc.scrollTop = mc.scrollHeight; }

  function addMsg(content, type, time) {
    var w = mc.querySelector('.nxt-welcome');
    if (w) w.remove();
    var d = document.createElement('div');
    d.className = 'nxt-msg ' + type;
    d.innerHTML = content + '<span class="nxt-time">' + time + '</span>';
    mc.appendChild(d);
    scrollBottom();
  }

  function checkBlocked(cb) {
    loadSb(function (s) {
      s.from('blocked_tokens').select('token').eq('token', vid).then(function (r) {
        blocked = r.data && r.data.length > 0;
        if (blocked) {
          mc.innerHTML = '<div style="text-align:center;padding:40px 20px;color:#dc3545"><h4 style="margin:0 0 8px;color:#dc3545">You\'ve been blocked</h4><p style="font-size:14px;margin:0;color:#6c757d">You are no longer able to send messages through this chat.</p></div>';
          document.getElementById('nxt-chat-input-area').style.display = 'none';
        }
        cb(blocked);
      });
    });
  }

  function sendMessage() {
    if (blocked) return;
    var t = ci.value.trim();
    if (!t) return;
    ci.value = '';
    sendBtn.disabled = true;
    loadSb(function (s) {
      if (!cid) {
        s.from('livechat_chats').insert({ visitor_token: vid, visitor_name: 'Website Visitor', status: 'active' }).select().then(function (res) {
          if (res.error) { console.error(res.error); sendBtn.disabled = false; return; }
          cid = res.data[0].id;
          localStorage.setItem(CK, cid);
          addMsg(t, 'visitor', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          s.from('livechat_messages').insert({ chat_id: cid, sender_type: 'visitor', content: t }).then(function () {
            s.from('livechat_messages').insert({ chat_id: cid, sender_type: 'agent', content: 'Thank you for contacting Nexatrack! An agent will be with you shortly.' }).then(function () { sendBtn.disabled = false; });
          });
          subscribeToChat(s);
        });
      } else {
        addMsg(t, 'visitor', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        s.from('livechat_messages').insert({ chat_id: cid, sender_type: 'visitor', content: t }).then(function () { sendBtn.disabled = false; });
      }
    });
  }

  function subscribeToChat(s) {
    if (sub) return;
    sub = s.channel('chat-' + cid)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'livechat_messages', filter: 'chat_id=eq.' + cid },
        function (p) {
          var m = p.new;
          if (m.sender_type === 'agent') {
            addMsg(m.content, 'agent', new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            unread++;
            badgeEl.textContent = unread;
            btn.classList.add('has-badge', 'ring');
            setTimeout(function () { btn.classList.remove('ring'); }, 600);
            if (!win.classList.contains('open') && Notification.permission === 'granted') {
              new Notification('Nexatrack Chat', { body: m.content, icon: 'https://nexatrack.vercel.app/img/favicon.ico' });
            }
            notifySound();
          }
        })
      .subscribe();
  }

  function loadMessages(s, chatId) {
    s.from('livechat_messages').select('*').eq('chat_id', chatId).order('created_at', { ascending: true }).then(function (r) {
      if (r.error || !r.data) return;
      r.data.forEach(function (m) { addMsg(m.content, m.sender_type === 'visitor' ? 'visitor' : 'agent', new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); });
      subscribeToChat(s);
    });
  }

  function showHistory(chats, s) {
    mc.innerHTML = '';
    var h = document.createElement('div');
    h.id = 'nxt-history-list';
    h.innerHTML = '<h5>Previous conversations</h5>';
    chats.forEach(function (chat) {
      var item = document.createElement('div');
      item.className = 'nxt-history-item';
      item.innerHTML = '<span>' + (chat.visitor_name || 'Chat') + '</span><span class="chip-status">' + new Date(chat.created_at).toLocaleDateString() + (chat.status === 'active' ? ' (active)' : '') + '</span>';
      item.addEventListener('click', function () {
        mc.innerHTML = '';
        var b = document.createElement('button');
        b.className = 'nxt-history-back';
        b.innerHTML = '&larr; Back to history';
        b.addEventListener('click', function () { showHistory(chats, s); });
        mc.appendChild(b);
        if (chat.status === 'closed') {
          var bn = document.createElement('div');
          bn.className = 'nxt-readonly-banner';
          bn.textContent = 'This conversation is closed.';
          mc.appendChild(bn);
        }
        cid = chat.id;
        localStorage.setItem(CK, cid);
        loadMessages(s, chat.id);
        document.getElementById('nxt-chat-input-area').style.display = chat.status === 'active' ? 'flex' : 'none';
      });
      h.appendChild(item);
    });
    var nb = document.createElement('button');
    nb.className = 'nxt-new-chat-btn';
    nb.textContent = 'Start new chat';
    nb.addEventListener('click', function () {
      cid = null;
      localStorage.removeItem(CK);
      mc.innerHTML = '<div class="nxt-welcome"><h4>Welcome to Nexatrack!</h4><p>Ask us anything about our courier services. We\'re here to help!</p></div>';
      document.getElementById('nxt-chat-input-area').style.display = 'flex';
    });
    h.appendChild(nb);
    mc.appendChild(h);
  }

  function openChat() {
    win.classList.add('open');
    unread = 0;
    badgeEl.textContent = '';
    btn.classList.remove('has-badge');
    checkBlocked(function () {
      if (blocked) return;
      loadSb(function (s) {
        s.from('livechat_chats').select('*').eq('visitor_token', vid).order('created_at', { ascending: false }).then(function (r) {
          if (r.error || !r.data || r.data.length === 0) {
            mc.innerHTML = '<div class="nxt-welcome"><h4>Welcome to Nexatrack!</h4><p>Ask us anything about our courier services. We\'re here to help!</p></div>';
            document.getElementById('nxt-chat-input-area').style.display = 'flex';
            return;
          }
          var ac = r.data.filter(function (c) { return c.status === 'active'; });
          if (ac.length > 0) {
            cid = ac[0].id;
            localStorage.setItem(CK, cid);
            loadMessages(s, cid);
            document.getElementById('nxt-chat-input-area').style.display = 'flex';
          } else {
            document.getElementById('nxt-chat-input-area').style.display = 'none';
            showHistory(r.data, s);
          }
        });
      });
    });
  }

  if (Notification.permission === 'default') Notification.requestPermission();

  btn.addEventListener('click', function () {
    if (win.classList.contains('open')) { win.classList.remove('open'); if (sub) { loadSb(function (s) { s.removeChannel(sub); }); sub = null; } return; }
    openChat();
  });

  closeBtn.addEventListener('click', function () { win.classList.remove('open'); if (sub) { loadSb(function (s) { s.removeChannel(sub); }); sub = null; } });
  maxBtn.addEventListener('click', function () {
    maximized = !maximized;
    win.classList.toggle('maximized', maximized);
    maxBtn.innerHTML = maximized
      ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>'
      : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>';
  });

  ci.addEventListener('input', function () { sendBtn.disabled = !ci.value.trim(); });
  ci.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !sendBtn.disabled) sendMessage(); });
  sendBtn.addEventListener('click', sendMessage);
})();
