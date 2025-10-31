# Shopper Copilot - Smart Page Summarizer

A powerful JavaScript chatbot that runs as a browser extension to help you summarize web pages, extract important information, and share insights with friends via messaging apps.

## Features

### Core Functionality
- **AI-Powered Summarization**: Automatically summarize any web page you're viewing
- **Smart Link Extraction**: Extract and organize important links from pages
- **Interactive Chat Interface**: Chat with the AI to get insights about the current page
- **Messaging Integration**: Send summaries directly to friends via WhatsApp, Telegram, or Messenger
- **Friend Responses**: View friend responses within the chat or in your messaging app

### User Interface
- **Floating Chat Widget**: Beautiful, non-intrusive chat widget that appears on any website
- **Three Main Tabs**:
  - **Chat**: Interactive conversation with the AI assistant
  - **Summary**: View generated page summaries and key points
  - **Friends**: Manage friends and share content via messaging apps

- **Quick Actions**: One-click buttons for common tasks
- **Responsive Design**: Works on desktop and mobile browsers

## Project Structure

```
shopper-copilot/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── widget.html           # Floating chat widget template
├── widget.css            # Widget styling
├── widget.js             # Widget functionality
├── content.js            # Content script for page injection
├── background.js         # Background service worker
├── icons/                # Extension icons
└── README.md            # This file
```

## Installation

### For Development

1. Clone this repository:
   ```bash
   git clone https://github.com/aliomraniH/shopper-copilot.git
   cd shopper-copilot
   ```

2. **CRITICAL:** Create your `.env` file (required for backend):
   ```bash
   # Copy the template
   cp .env.example .env

   # Edit and add your OpenAI API key
   nano .env
   ```

   Your `.env` should contain:
   ```env
   OPENAI_API_KEY=your-actual-api-key-here
   PORT=3000
   NODE_ENV=development
   ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
   ```

   **Get API key:** https://platform.openai.com/api-keys

   **⚠️ Without this file, the backend server will crash with:**
   ```
   OpenAIError: The OPENAI_API_KEY environment variable is missing or empty
   ```

3. Install backend dependencies:
   ```bash
   npm install
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

5. Load the extension in Chrome/Edge:
   - Open `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the `shopper-copilot` directory

6. The extension icon should appear in your browser toolbar

### For Production

1. Download the extension from the Chrome Web Store (coming soon)
2. Click "Add to Chrome"
3. Grant necessary permissions

## Usage

### Getting Started

1. Click the Shopper Copilot icon in your browser toolbar
2. Click "Open Chat Widget" to launch the floating assistant
3. The widget will appear on any webpage you visit

### Summarizing Pages

**Method 1: Quick Action**
- Click the "Summarize" button in the quick actions bar
- View the summary in the Summary tab

**Method 2: Chat Command**
- Type "summarize this page" in the chat
- The AI will analyze and present the summary

**Method 3: Extension Popup**
- Click the extension icon
- Click "Summarize This Page"

### Extracting Links

- Click "Links" in the quick actions bar
- All important links will be extracted and displayed in the Summary tab
- Click any link to open it in a new tab

### Sharing with Friends

1. Navigate to the Friends tab
2. Select a friend from your list
3. Customize the message (optional)
4. Click "Send to Friend"
5. The summary will be sent via their connected messaging app

### Configuring Messaging Apps

1. Click "Configure Integrations" in the extension popup
2. Connect your messaging apps:
   - **WhatsApp**: Enter WhatsApp Business API credentials
   - **Telegram**: Enter your Telegram Bot token
   - **Messenger**: Connect via Facebook authentication

## Technical Architecture

### Components

#### 1. Content Script (`content.js`)
- Injected into every webpage
- Creates the floating widget DOM
- Handles communication between page and extension
- Extracts page content and links

#### 2. Widget (`widget.js` + `widget.html` + `widget.css`)
- Main user interface
- Handles user interactions
- Manages chat messages and tabs
- Displays summaries and friend lists

#### 3. Popup (`popup.js` + `popup.html` + `popup.css`)
- Extension toolbar popup
- Quick access to main features
- Integration status display
- Settings management

#### 4. Background Worker (`background.js`)
- Handles API calls to LLM services
- Manages messaging app integrations
- Stores user preferences
- Coordinates extension-wide state

### Data Flow

```
User Action → Widget UI → Content Script → Background Worker → External APIs
                ↓                                    ↓
              DOM Updates ← Message Response ← API Response
```

## API Integrations

### LLM Integration (To Be Implemented)

The extension is designed to work with various LLM providers:

```javascript
// Example: OpenAI Integration
async function summarizeWithLLM(pageContent) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Summarize the following webpage content' },
        { role: 'user', content: pageContent }
      ]
    })
  });
  return response.json();
}
```

### Messaging App APIs (To Be Implemented)

#### WhatsApp Business API
```javascript
// WhatsApp message sending
async function sendWhatsAppMessage(to, message) {
  const response = await fetch('https://graph.facebook.com/v18.0/PHONE_NUMBER_ID/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: to,
      text: { body: message }
    })
  });
  return response.json();
}
```

#### Telegram Bot API
```javascript
// Telegram message sending
async function sendTelegramMessage(chatId, message) {
  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message
    })
  });
  return response.json();
}
```

## Development Roadmap

### Phase 1: Frontend Mockup ✅
- [x] Extension structure
- [x] Floating chat widget UI
- [x] Popup interface
- [x] Summary and Friends tabs
- [x] Responsive design

### Phase 2: Core Functionality (Next)
- [ ] LLM API integration
- [ ] Real page content extraction
- [ ] Advanced summarization
- [ ] Link analysis and categorization

### Phase 3: Messaging Integration
- [ ] WhatsApp Business API integration
- [ ] Telegram Bot API integration
- [ ] Facebook Messenger API integration
- [ ] Friend management system

### Phase 4: Advanced Features
- [ ] Multi-language support
- [ ] Custom summarization prompts
- [ ] History of summaries
- [ ] Export summaries (PDF, Markdown)
- [ ] Browser sync across devices

### Phase 5: AI Enhancements
- [ ] Sentiment analysis
- [ ] Topic categorization
- [ ] Smart recommendations
- [ ] Conversation memory

## Browser Compatibility

- ✅ Chrome 88+
- ✅ Edge 88+
- ⚠️ Firefox (Manifest V3 support in progress)
- ⚠️ Safari (Requires adaptation)

## Privacy & Security

- **Local Processing**: Page content is processed securely
- **No Data Collection**: We don't store your browsing history
- **Encrypted Communications**: All API calls use HTTPS
- **User Consent**: Messaging features require explicit permission
- **Open Source**: Full transparency of code

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Setup

```bash
# Clone the repo
git clone https://github.com/aliomraniH/shopper-copilot.git

# No build step required - it's vanilla JavaScript!
# Just load the extension in Chrome as described in Installation
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/aliomraniH/shopper-copilot/issues)
- **Discussions**: [GitHub Discussions](https://github.com/aliomraniH/shopper-copilot/discussions)
- **Email**: support@shoppercopilot.com (coming soon)

## Acknowledgments

- Icons from [Feather Icons](https://feathericons.com/)
- Gradient inspiration from [uiGradients](https://uigradients.com/)
- Built with vanilla JavaScript - no frameworks required!

## Screenshots

### Chat Interface
The interactive chat widget allows you to ask questions about the current page and get instant AI-powered responses.

### Summary View
View comprehensive summaries of web pages with key points, important links, and actionable insights.

### Friends Integration
Share summaries with friends via WhatsApp, Telegram, or Messenger with just one click.

---

**Made with ❤️ by the Shopper Copilot Team**

*Note: This is currently a frontend mockup. API integrations for LLM and messaging services are planned for future releases.*
