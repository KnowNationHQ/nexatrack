(function() {
  var SUPABASE_URL = 'https://ujcokrzjvjdrcrdhcnjy.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqY29rcnpqdmpkcmNyZGhjbmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNzA1MzksImV4cCI6MjA5OTk0NjUzOX0.SFgd7FP8lnkbIJ0CxoXXfD5-yo8XIyHGlOS_aK1J9-I';

  var TOKEN_KEY = 'nxt_chat_token';
  var CHAT_ID_KEY = 'nxt_chat_id';
  var visitorToken = localStorage.getItem(TOKEN_KEY) || 'v_' + crypto.randomUUID();
  localStorage.setItem(TOKEN_KEY, visitorToken);

  var styles = document.createElement('style');
  styles.textContent = `
    #nxt-chat-btn {
      position: fixed; bottom: 24px; right: 24px; z-index: 999999;
      width: 60px; height: 60px; border-radius: 50%;
      background: #0d6efd; color: #fff; border: none; cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,.25); font-size: 28px;
      display: flex; align-items: center; justify-content: center;
      transition: transform .2s;
    }
    #nxt-chat-btn:hover { transform: scale(1.1); }
    #nxt-chat-badge {
      position: absolute; top: -4px; right: -4px; min-width: 22px; height: 22px;
      border-radius: 11px; background: #dc3545; color: #fff; font-size: 12px;
      font-weight: 700; display: none; align-items: center; justify-content: center;
      padding: 0 6px; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,.2);
    }
    #nxt-chat-btn.has-badge #nxt-chat-badge { display: flex; }
    @keyframes nxt-ring { 0%{transform:rotate(0)} 25%{transform:rotate(15deg)} 50%{transform:rotate(-10deg)} 75%{transform:rotate(5deg)} 100%{transform:rotate(0)} }
    #nxt-chat-btn.ring { animation: nxt-ring .4s ease 2; }
    #nxt-chat-window {
      position: fixed; bottom: 96px; right: 24px; z-index: 999999;
      width: 380px; height: 560px; max-height: calc(100vh - 140px);
      background: #fff; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,.18);
      display: none; flex-direction: column; overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    #nxt-chat-window.open { display: flex; }
    #nxt-chat-header {
      background: #0d6efd; color: #fff; padding: 16px 20px;
      display: flex; justify-content: space-between; align-items: center;
    }
    #nxt-chat-header h3 { margin: 0; font-size: 16px; font-weight: 600; }
    #nxt-chat-close { background: none; border: none; color: #fff; font-size: 20px; cursor: pointer; padding: 0 4px; }
    #nxt-chat-messages {
      flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 8px;
      background: #f8f9fa;
    }
    .nxt-msg {
      max-width: 80%; padding: 10px 14px; border-radius: 14px; font-size: 14px; line-height: 1.4;
      word-wrap: break-word;
    }
    .nxt-msg.visitor {
      align-self: flex-end; background: #0d6efd; color: #fff;
      border-bottom-right-radius: 4px;
    }
    .nxt-msg.agent {
      align-self: flex-start; background: #e9ecef; color: #212529;
      border-bottom-left-radius: 4px;
    }
    .nxt-msg .nxt-time {
      font-size: 11px; opacity: .7; margin-top: 4px; display: block;
    }
    #nxt-chat-input-area {
      display: flex; padding: 12px 16px; gap: 8px; border-top: 1px solid #dee2e6; background: #fff;
    }
    #nxt-chat-input {
      flex: 1; border: 1px solid #dee2e6; border-radius: 24px; padding: 10px 16px;
      font-size: 14px; outline: none;
    }
    #nxt-chat-input:focus { border-color: #0d6efd; }
    #nxt-chat-send {
      width: 42px; height: 42px; border-radius: 50%; background: #0d6efd; color: #fff;
      border: none; cursor: pointer; font-size: 18px; display: flex;
      align-items: center; justify-content: center; flex-shrink: 0;
    }
    #nxt-chat-send:hover { background: #0b5ed7; }
    #nxt-chat-send:disabled { opacity: .5; cursor: not-allowed; }
    .nxt-welcome {
      text-align: center; color: #6c757d; padding: 32px 16px;
    }
    .nxt-welcome h4 { margin: 0 0 8px; color: #212529; }
    .nxt-welcome p { margin: 0; font-size: 14px; }
    @media (max-width: 480px) {
      #nxt-chat-window { width: calc(100vw - 32px); right: 16px; bottom: 88px; }
    }
  `;
  document.head.appendChild(styles);

  var btn = document.createElement('button');
  btn.id = 'nxt-chat-btn';
  btn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a14 0 0 1 2 2z"/></svg><span id="nxt-chat-badge"></span>';
  btn.setAttribute('aria-label', 'Open chat');
  document.body.appendChild(btn);

  var win = document.createElement('div');
  win.id = 'nxt-chat-window';
  win.innerHTML = `
    <div id="nxt-chat-header">
      <h3>Nexatrack Chat</h3>
      <button id="nxt-chat-close">&times;</button>
    </div>
    <div id="nxt-chat-messages">
      <div class="nxt-welcome">
        <h4>Welcome to Nexatrack!</h4>
        <p>Ask us anything about our courier services. We're here to help!</p>
      </div>
    </div>
    <div id="nxt-chat-input-area">
      <input id="nxt-chat-input" type="text" placeholder="Type your message..." />
      <button id="nxt-chat-send" disabled><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
    </div>
  `;
  document.body.appendChild(win);

  var supabaseClient = null;
  var currentChatId = localStorage.getItem(CHAT_ID_KEY);
  var listener = null;
  var unread = 0;
  var badgeEl = document.getElementById('nxt-chat-badge');

  function loadSb(cb) {
    if (supabaseClient) { cb(supabaseClient); return; }
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    script.onload = function() {
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      cb(supabaseClient);
    };
    document.head.appendChild(script);
  }

  var msgContainer = document.getElementById('nxt-chat-messages');
  var chatInput = document.getElementById('nxt-chat-input');
  var sendBtn = document.getElementById('nxt-chat-send');
  var closeBtn = document.getElementById('nxt-chat-close');

  function scrollBottom() {
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  function addMsg(content, type, time) {
    var welcome = msgContainer.querySelector('.nxt-welcome');
    if (welcome) welcome.remove();
    var div = document.createElement('div');
    div.className = 'nxt-msg ' + type;
    div.innerHTML = content + '<span class="nxt-time">' + time + '</span>';
    msgContainer.appendChild(div);
    scrollBottom();
  }

  var blocked = false;

  function checkBlocked(cb) {
    loadSb(function(sb) {
      sb.from('blocked_tokens').select('token').eq('token', visitorToken).then(function(r) {
        blocked = r.data && r.data.length > 0;
        if (blocked) {
          msgContainer.innerHTML = '<div style="text-align:center;padding:40px 20px;color:#dc3545"><h4 style="margin:0 0 8px;color:#dc3545">You\'ve been blocked</h4><p style="font-size:14px;margin:0;color:#6c757d">You are no longer able to send messages through this chat.</p></div>';
          document.getElementById('nxt-chat-input-area').style.display = 'none';
        }
        cb(blocked);
      });
    });
  }

  function sendMessage() {
    if (blocked) return;
    var text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = '';
    sendBtn.disabled = true;

    loadSb(function(sb) {
      if (!currentChatId) {
        sb.from('livechat_chats').insert({
          visitor_token: visitorToken,
          visitor_name: 'Website Visitor',
          status: 'active'
        }).select().then(function(res) {
          if (res.error) { console.error(res.error); return; }
          currentChatId = res.data[0].id;
          localStorage.setItem(CHAT_ID_KEY, currentChatId);
          addMsg(text, 'visitor', new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}));
          sb.from('livechat_messages').insert({chat_id:currentChatId,sender_type:'visitor',content:text}).then(function(){
           sb.from('livechat_messages').insert({chat_id:currentChatId,sender_type:'agent',content:'Thank you for contacting Nexatrack! An agent will be with you shortly.'}).then(function(){sendBtn.disabled=false})
          });
          subscribeToChat(sb);
        });
      } else {
        addMsg(text, 'visitor', new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}));
        sb.from('livechat_messages').insert({
          chat_id: currentChatId,
          sender_type: 'visitor',
          content: text
        }).then(function() { sendBtn.disabled = false; });
      }
    });
  }

  function subscribeToChat(sb) {
    if (listener) return;
    listener = sb.channel('chat-' + currentChatId)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'livechat_messages', filter: 'chat_id=eq.' + currentChatId },
        function(payload) {
          var msg = payload.new;
          if (msg.sender_type === 'agent') {
            addMsg(msg.content, 'agent', new Date(msg.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}));
            if (!win.classList.contains('open')) {
              unread++; badgeEl.textContent = unread; btn.classList.add('has-badge','ring');
              setTimeout(function(){btn.classList.remove('ring')},800);
              if (Notification.permission==='granted') new Notification('Nexatrack Chat',{body:msg.content,icon:'https://nexatrack.vercel.app/img/favicon.ico'});
            }
          }
        }
      )
      .subscribe();
  }

  function loadHistory(sb) {
    if (!currentChatId) return;
    sb.from('livechat_messages')
      .select('*')
      .eq('chat_id', currentChatId)
      .order('created_at', { ascending: true })
      .then(function(res) {
        if (res.error || !res.data) return;
        res.data.forEach(function(msg) {
          var type = msg.sender_type === 'visitor' ? 'visitor' : 'agent';
          addMsg(msg.content, type, new Date(msg.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}));
        });
        subscribeToChat(sb);
      });
  }

  if (Notification.permission==='default') Notification.requestPermission();

  btn.addEventListener('click', function() {
    if (win.classList.contains('open')) {
      win.classList.remove('open');
      return;
    }
    win.classList.add('open');
    unread = 0; badgeEl.textContent = ''; btn.classList.remove('has-badge');
    checkBlocked(function() {
      loadSb(function(sb) {
        loadHistory(sb);
      });
    });
  });

  closeBtn.addEventListener('click', function() {
    win.classList.remove('open');
  });

  chatInput.addEventListener('input', function() {
    sendBtn.disabled = !chatInput.value.trim();
  });

  chatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !sendBtn.disabled) sendMessage();
  });

  sendBtn.addEventListener('click', sendMessage);
})();
