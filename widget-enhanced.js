// Enhanced Widget JavaScript with Test Data Integration

// First, inject the widget HTML
(function() {
  const widgetHTML = `
    <div id="copilot-widget" class="widget-container">
      <!-- Widget Header -->
      <div class="widget-header">
        <div class="header-left">
          <div class="avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <circle cx="12" cy="17" r="1"></circle>
            </svg>
          </div>
          <div class="header-info">
            <h3>Shopper Copilot</h3>
            <span class="status-text">Online</span>
          </div>
        </div>
        <div class="header-actions">
          <button class="icon-btn" id="refreshBtn" title="Refresh">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M23 4v6h-6"></path>
              <path d="M1 20v-6h6"></path>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
          </button>
          <button class="icon-btn" id="minimizeBtn" title="Minimize">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <button class="icon-btn" id="closeBtn" title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 6L6 18"></path>
              <path d="M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button class="tab-btn active" data-tab="chat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Chat
        </button>
        <button class="tab-btn" data-tab="summary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <path d="M14 2v6h6"></path>
            <path d="M16 13H8"></path>
            <path d="M16 17H8"></path>
            <path d="M10 9H8"></path>
          </svg>
          Summary
        </button>
        <button class="tab-btn" data-tab="friends">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Friends
        </button>
      </div>

      <!-- Chat Tab Content -->
      <div class="tab-content active" id="chatTab">
        <div class="messages-container" id="messagesContainer">
          <div class="message bot-message">
            <div class="message-avatar bot-avatar">AI</div>
            <div class="message-content">
              <p>Hello! I'm analyzing this page for you. Ask me anything or use the quick actions below!</p>
            </div>
          </div>
        </div>

        <div class="input-container">
          <textarea id="messageInput" class="message-input" placeholder="Ask me anything about this page..." rows="1"></textarea>
          <button class="send-btn" id="sendBtn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 2L11 13"></path>
              <path d="M22 2L15 22L11 13L2 9L22 2z"></path>
            </svg>
          </button>
        </div>

        <div class="quick-actions-bar">
          <button class="quick-action-btn" data-action="summarize">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            Summarize
          </button>
          <button class="quick-action-btn" data-action="links">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            Links
          </button>
          <button class="quick-action-btn" data-action="share">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <path d="M8.59 13.51l6.83 3.98"></path>
              <path d="M15.41 6.51l-6.82 3.98"></path>
            </svg>
            Share
          </button>
        </div>
      </div>

      <!-- Summary Tab Content -->
      <div class="tab-content" id="summaryTab">
        <div class="summary-container">
          <div class="summary-header">
            <h3>Page Summary</h3>
            <button class="action-btn-small" id="generateSummary">Generate</button>
          </div>

          <div class="summary-section">
            <h4>Title</h4>
            <p id="pageTitle" class="summary-text">Click "Generate" to analyze</p>
          </div>

          <div class="summary-section">
            <h4>Key Points</h4>
            <ul id="keyPoints" class="summary-list">
              <li class="placeholder">No summary yet</li>
            </ul>
          </div>

          <div class="summary-section">
            <h4>Important Links</h4>
            <div id="importantLinks" class="links-list">
              <p class="placeholder">No links extracted</p>
            </div>
          </div>

          <div class="summary-actions">
            <button class="action-btn-secondary" id="copySummary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy
            </button>
            <button class="action-btn-secondary" id="shareSummary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <path d="M8.59 13.51l6.83 3.98"></path>
                <path d="M15.41 6.51l-6.82 3.98"></path>
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>

      <!-- Friends Tab -->
      <div class="tab-content" id="friendsTab">
        <div class="friends-container">
          <div class="friends-header">
            <h3>Share with Friends</h3>
            <button class="action-btn-small" id="addFriend">+ Add</button>
          </div>

          <div class="friends-list">
            <div class="friend-item">
              <div class="friend-avatar">JD</div>
              <div class="friend-info">
                <div class="friend-name">John Doe</div>
                <div class="friend-platform">WhatsApp</div>
              </div>
              <button class="send-to-friend-btn" data-friend="john">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 2L11 13"></path>
                  <path d="M22 2L15 22L11 13L2 9L22 2z"></path>
                </svg>
              </button>
            </div>

            <div class="friend-item">
              <div class="friend-avatar">SA</div>
              <div class="friend-info">
                <div class="friend-name">Sarah Anderson</div>
                <div class="friend-platform">Telegram</div>
              </div>
              <button class="send-to-friend-btn" data-friend="sarah">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 2L11 13"></path>
                  <path d="M22 2L15 22L11 13L2 9L22 2z"></path>
                </svg>
              </button>
            </div>

            <div class="friend-item">
              <div class="friend-avatar">MJ</div>
              <div class="friend-info">
                <div class="friend-name">Mike Johnson</div>
                <div class="friend-platform">Messenger</div>
              </div>
              <button class="send-to-friend-btn" data-friend="mike">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 2L11 13"></path>
                  <path d="M22 2L15 22L11 13L2 9L22 2z"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="message-preview">
            <h4>Message Preview</h4>
            <textarea id="friendMessageInput" class="friend-message-input" placeholder="Customize message...">Check out this page! 🛍️</textarea>
            <button class="action-btn-primary" id="sendToSelected">Send to Friend</button>
          </div>
        </div>
      </div>
    </div>

    <button id="copilot-fab" class="fab hidden">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span class="notification-badge hidden" id="notificationBadge">0</span>
    </button>
  `;

  const root = document.getElementById('shopper-copilot-root');
  if (root) {
    root.innerHTML = widgetHTML;
  }
})();

// Widget Controller Class
class ShopperCopilotWidget {
  constructor() {
    this.currentTab = 'chat';
    this.isMinimized = false;
    this.currentPageData = null;
    this.init();
  }

  init() {
    setTimeout(() => {
      this.attachEventListeners();
      this.maximize();
    }, 100);
  }

  attachEventListeners() {
    document.getElementById('minimizeBtn')?.addEventListener('click', () => this.minimize());
    document.getElementById('closeBtn')?.addEventListener('click', () => this.close());
    document.getElementById('refreshBtn')?.addEventListener('click', () => this.refresh());
    document.getElementById('copilot-fab')?.addEventListener('click', () => this.maximize());

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchTab(e.target.closest('.tab-btn').dataset.tab));
    });

    document.getElementById('sendBtn')?.addEventListener('click', () => this.sendMessage());
    document.getElementById('messageInput')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    document.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.closest('.quick-action-btn').dataset.action;
        this.handleQuickAction(action);
      });
    });

    document.getElementById('generateSummary')?.addEventListener('click', () => this.generateSummary());
    document.getElementById('copySummary')?.addEventListener('click', () => this.copySummary());
    document.getElementById('shareSummary')?.addEventListener('click', () => this.shareSummary());
    document.getElementById('sendToSelected')?.addEventListener('click', () => this.sendToFriend());

    document.querySelectorAll('.send-to-friend-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const friend = e.target.closest('.send-to-friend-btn').dataset.friend;
        this.sendToSpecificFriend(friend);
      });
    });
  }

  minimize() {
    this.isMinimized = true;
    document.getElementById('copilot-widget').classList.add('minimized');
    document.getElementById('copilot-fab').classList.remove('hidden');
  }

  maximize() {
    this.isMinimized = false;
    document.getElementById('copilot-widget').classList.remove('minimized');
    document.getElementById('copilot-fab').classList.add('hidden');
  }

  close() {
    document.getElementById('copilot-widget').style.display = 'none';
    document.getElementById('copilot-fab').style.display = 'none';
  }

  refresh() {
    this.addBotMessage('Refreshing page analysis...');
    setTimeout(() => this.generateSummary(), 500);
  }

  switchTab(tabName) {
    this.currentTab = tabName;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.tab-btn[data-tab="${tabName}"]`)?.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}Tab`)?.classList.add('active');
  }

  sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (!message) return;

    this.addUserMessage(message);
    input.value = '';

    setTimeout(() => this.handleBotResponse(message), 1000);
  }

  addUserMessage(text) {
    const container = document.getElementById('messagesContainer');
    const div = document.createElement('div');
    div.className = 'message user-message';
    div.innerHTML = `
      <div class="message-avatar user-avatar">You</div>
      <div class="message-content">${this.escapeHtml(text)}</div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  addBotMessage(text) {
    const container = document.getElementById('messagesContainer');
    const div = document.createElement('div');
    div.className = 'message bot-message';
    div.innerHTML = `
      <div class="message-avatar bot-avatar">AI</div>
      <div class="message-content">${text}</div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  handleBotResponse(userMessage) {
    const lower = userMessage.toLowerCase();
    if (lower.includes('summarize') || lower.includes('summary')) {
      this.generateSummary();
      this.addBotMessage('I\'ve generated a summary! Check the Summary tab.');
    } else if (lower.includes('link')) {
      this.addBotMessage('Extracting links from this page...');
      this.extractLinks();
    } else if (lower.includes('share') || lower.includes('friend')) {
      this.addBotMessage('You can share from the Friends tab!');
      this.switchTab('friends');
    } else {
      this.addBotMessage(`I can help you with:\n• Summarizing this page\n• Extracting links\n• Sharing with friends\n\nWhat would you like?`);
    }
  }

  handleQuickAction(action) {
    switch (action) {
      case 'summarize':
        this.addBotMessage('Analyzing page...');
        setTimeout(() => this.generateSummary(), 500);
        break;
      case 'links':
        this.addBotMessage('Extracting links...');
        setTimeout(() => this.extractLinks(), 500);
        break;
      case 'share':
        this.switchTab('friends');
        break;
    }
  }

  generateSummary() {
    // Get current page data if available
    if (typeof currentPageData !== 'undefined' && currentPageData) {
      document.getElementById('pageTitle').textContent = currentPageData.summary;

      const keyPointsList = document.getElementById('keyPoints');
      keyPointsList.innerHTML = currentPageData.keyPoints.map(point =>
        `<li>${point}</li>`
      ).join('');

      this.extractLinks();
      this.switchTab('summary');
      this.addBotMessage('✅ Summary generated with real data!');
    } else {
      // Fallback
      document.getElementById('pageTitle').textContent = document.title;
      this.addBotMessage('Summary generated!');
      this.switchTab('summary');
    }
  }

  extractLinks() {
    if (typeof currentPageData !== 'undefined' && currentPageData && currentPageData.links) {
      const linksContainer = document.getElementById('importantLinks');
      linksContainer.innerHTML = currentPageData.links.map(link =>
        `<a href="${link.url}" class="link-item" target="_blank">${this.escapeHtml(link.text)}</a>`
      ).join('');
    }
  }

  copySummary() {
    const title = document.getElementById('pageTitle').textContent;
    const points = Array.from(document.querySelectorAll('#keyPoints li'))
      .map(li => '• ' + li.textContent).join('\n');
    navigator.clipboard.writeText(`${title}\n\n${points}`);
    this.addBotMessage('📋 Copied to clipboard!');
  }

  shareSummary() {
    this.switchTab('friends');
    const title = document.getElementById('pageTitle').textContent;
    document.getElementById('friendMessageInput').value =
      `Check out this page! 🛍️\n\n${title}\n\nThought you might like it!`;
    this.addBotMessage('Message prepared! Select a friend to send.');
  }

  sendToFriend() {
    const message = document.getElementById('friendMessageInput').value;
    if (!message.trim()) return;

    this.addBotMessage('📤 Sending to friends... In production, this would use WhatsApp/Telegram/Messenger APIs!');

    // Open friend view in new window
    const friendWindow = window.open('friend-chat.html', '_blank', 'width=400,height=700');
    setTimeout(() => {
      if (friendWindow) {
        friendWindow.postMessage({ type: 'newMessage', message: message }, '*');
      }
    }, 1000);
  }

  sendToSpecificFriend(friendId) {
    this.addBotMessage(`📨 Sending to ${friendId}...`);
    setTimeout(() => {
      this.addBotMessage(`✅ Sent! ${friendId} will see it in their messaging app.`);
    }, 1000);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize
new ShopperCopilotWidget();
