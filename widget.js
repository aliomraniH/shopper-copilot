// Widget JavaScript - Handles all widget interactions

class ShopperCopilotWidget {
  constructor() {
    this.widget = null;
    this.fab = null;
    this.isMinimized = false;
    this.currentTab = 'chat';
    this.messages = [];
    this.notificationCount = 0;

    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.widget = document.getElementById('copilot-widget');
    this.fab = document.getElementById('copilot-fab');

    if (!this.widget || !this.fab) {
      console.error('Widget elements not found');
      return;
    }

    this.attachEventListeners();
    this.loadInitialState();
  }

  attachEventListeners() {
    // Header buttons
    document.getElementById('minimizeBtn')?.addEventListener('click', () => this.minimize());
    document.getElementById('closeBtn')?.addEventListener('click', () => this.close());
    document.getElementById('refreshBtn')?.addEventListener('click', () => this.refresh());

    // FAB
    this.fab?.addEventListener('click', () => this.maximize());

    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchTab(e.target.closest('.tab-btn').dataset.tab));
    });

    // Chat functionality
    const sendBtn = document.getElementById('sendBtn');
    const messageInput = document.getElementById('messageInput');

    sendBtn?.addEventListener('click', () => this.sendMessage());
    messageInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Auto-resize textarea
    messageInput?.addEventListener('input', (e) => {
      e.target.style.height = 'auto';
      e.target.style.height = e.target.scrollHeight + 'px';
    });

    // Quick action buttons
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.closest('.quick-action-btn').dataset.action;
        this.handleQuickAction(action);
      });
    });

    // Summary tab actions
    document.getElementById('generateSummary')?.addEventListener('click', () => this.generateSummary());
    document.getElementById('copySummary')?.addEventListener('click', () => this.copySummary());
    document.getElementById('shareSummary')?.addEventListener('click', () => this.shareSummary());

    // Friends tab actions
    document.getElementById('addFriend')?.addEventListener('click', () => this.addFriend());
    document.getElementById('sendToSelected')?.addEventListener('click', () => this.sendToFriend());

    document.querySelectorAll('.send-to-friend-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const friend = e.target.closest('.send-to-friend-btn').dataset.friend;
        this.sendToSpecificFriend(friend);
      });
    });
  }

  loadInitialState() {
    // Show widget by default
    this.maximize();
  }

  minimize() {
    this.isMinimized = true;
    this.widget.classList.add('minimized');
    this.fab.classList.remove('hidden');
  }

  maximize() {
    this.isMinimized = false;
    this.widget.classList.remove('minimized');
    this.fab.classList.add('hidden');
    this.resetNotifications();
  }

  close() {
    this.widget.style.display = 'none';
    this.fab.style.display = 'none';
  }

  refresh() {
    this.addBotMessage('Refreshing page analysis...');
    setTimeout(() => {
      this.addBotMessage('Page refreshed! I\'m ready to help you analyze the current content.');
    }, 1000);
  }

  switchTab(tabName) {
    this.currentTab = tabName;

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`.tab-btn[data-tab="${tabName}"]`)?.classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`)?.classList.add('active');
  }

  sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    this.addUserMessage(message);

    // Clear input
    input.value = '';
    input.style.height = 'auto';

    // Simulate bot response (In production, this would call an LLM API)
    setTimeout(() => {
      this.handleBotResponse(message);
    }, 1000);
  }

  addUserMessage(text) {
    const messagesContainer = document.getElementById('messagesContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `
      <div class="message-avatar user-avatar">You</div>
      <div class="message-content">${this.escapeHtml(text)}</div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  addBotMessage(text) {
    const messagesContainer = document.getElementById('messagesContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.innerHTML = `
      <div class="message-avatar bot-avatar">AI</div>
      <div class="message-content">${text}</div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    if (this.isMinimized) {
      this.incrementNotifications();
    }
  }

  handleBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('summarize') || lowerMessage.includes('summary')) {
      this.addBotMessage('I\'ll analyze this page for you. Give me a moment...');
      setTimeout(() => {
        this.generateSummary();
        this.addBotMessage('I\'ve generated a summary! Check the Summary tab to view it.');
      }, 1500);
    } else if (lowerMessage.includes('link')) {
      this.addBotMessage('Let me extract the important links from this page...');
      setTimeout(() => {
        this.extractLinks();
        this.addBotMessage('I\'ve found several important links. Check the Summary tab!');
      }, 1500);
    } else if (lowerMessage.includes('share') || lowerMessage.includes('friend')) {
      this.addBotMessage('You can share this page with your friends from the Friends tab. Would you like me to prepare a message?');
    } else {
      // Generic response
      this.addBotMessage(`I understand you're asking about: "${userMessage}".

I can help you with:
• Summarizing this page
• Extracting important links
• Sharing content with friends

What would you like to do?`);
    }
  }

  handleQuickAction(action) {
    switch (action) {
      case 'summarize':
        this.addBotMessage('Generating page summary...');
        setTimeout(() => this.generateSummary(), 500);
        break;
      case 'links':
        this.addBotMessage('Extracting links...');
        setTimeout(() => this.extractLinks(), 500);
        break;
      case 'share':
        this.addBotMessage('Let\'s share this with your friends! Check the Friends tab.');
        this.switchTab('friends');
        break;
    }
  }

  generateSummary() {
    // In production, this would analyze the actual page content
    const pageTitle = document.title;
    const pageUrl = window.location.href;

    // Mock summary data
    document.getElementById('pageTitle').textContent = pageTitle;

    const keyPointsList = document.getElementById('keyPoints');
    keyPointsList.innerHTML = `
      <li>Main topic: ${pageTitle}</li>
      <li>Page contains valuable information about the subject</li>
      <li>Several key points and insights are discussed</li>
      <li>Relevant links and resources are available</li>
    `;

    this.switchTab('summary');
    this.addBotMessage('Summary generated! I\'ve analyzed the page and extracted the key points.');
  }

  extractLinks() {
    // Extract actual links from the page
    const links = Array.from(document.querySelectorAll('a[href]'))
      .map(a => ({ url: a.href, text: a.textContent.trim() }))
      .filter(link => link.text && link.url.startsWith('http'))
      .slice(0, 10); // Limit to 10 links

    const linksContainer = document.getElementById('importantLinks');

    if (links.length > 0) {
      linksContainer.innerHTML = links.map(link => `
        <a href="${link.url}" class="link-item" target="_blank">
          ${this.escapeHtml(link.text.substring(0, 50))}${link.text.length > 50 ? '...' : ''}
        </a>
      `).join('');
    } else {
      linksContainer.innerHTML = '<p class="placeholder">No external links found on this page</p>';
    }

    this.addBotMessage(`I found ${links.length} important links on this page.`);
  }

  copySummary() {
    const pageTitle = document.getElementById('pageTitle').textContent;
    const keyPoints = Array.from(document.querySelectorAll('#keyPoints li'))
      .map(li => '• ' + li.textContent)
      .join('\n');

    const summary = `Page Summary:\n\n${pageTitle}\n\n${keyPoints}`;

    navigator.clipboard.writeText(summary).then(() => {
      this.addBotMessage('Summary copied to clipboard!');
    });
  }

  shareSummary() {
    this.switchTab('friends');
    const pageTitle = document.getElementById('pageTitle').textContent;
    document.getElementById('friendMessageInput').value =
      `Check out this page I found!\n\n"${pageTitle}"\n\nI thought you might find it interesting!`;
    this.addBotMessage('I\'ve prepared a message for your friend. Select who you\'d like to send it to!');
  }

  addFriend() {
    alert('Friend management will be available soon! You\'ll be able to connect your messaging apps and add friends.');
  }

  sendToFriend() {
    const message = document.getElementById('friendMessageInput').value;
    if (!message.trim()) {
      alert('Please enter a message to send.');
      return;
    }

    // In production, this would call the messaging API
    this.addBotMessage('Message sent to your friend! They\'ll receive it via their connected messaging app.');
    alert('Message sent! (In production, this would integrate with WhatsApp/Telegram/Messenger APIs)');
  }

  sendToSpecificFriend(friendId) {
    const message = document.getElementById('friendMessageInput').value || 'Check out this page!';
    this.addBotMessage(`Sending message to ${friendId}...`);

    setTimeout(() => {
      this.addBotMessage(`Message sent to ${friendId}! They can reply and you'll see their response here.`);
    }, 1000);
  }

  incrementNotifications() {
    this.notificationCount++;
    const badge = document.getElementById('notificationBadge');
    badge.textContent = this.notificationCount;
    badge.classList.remove('hidden');
  }

  resetNotifications() {
    this.notificationCount = 0;
    const badge = document.getElementById('notificationBadge');
    badge.textContent = '0';
    badge.classList.add('hidden');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize widget when script loads
const widget = new ShopperCopilotWidget();

// Export for use by content script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ShopperCopilotWidget;
}
