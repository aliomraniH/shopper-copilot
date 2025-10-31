// Popup Script for Extension
document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  const toggleWidgetBtn = document.getElementById('toggleWidget');
  const summarizePageBtn = document.getElementById('summarizePage');
  const extractLinksBtn = document.getElementById('extractLinks');
  const configureIntegrationsBtn = document.getElementById('configureIntegrations');
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');

  // Status management
  function updateStatus(status, text) {
    statusDot.style.background = status === 'online' ? '#28a745' :
                                  status === 'busy' ? '#ffc107' : '#6c757d';
    statusText.textContent = text;
  }

  // Toggle Widget
  toggleWidgetBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      chrome.tabs.sendMessage(tab.id, {
        action: 'toggleWidget'
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error:', chrome.runtime.lastError);
          alert('Please refresh the page to use the widget.');
        } else {
          console.log('Widget toggled:', response);
          window.close();
        }
      });
    } catch (error) {
      console.error('Error toggling widget:', error);
    }
  });

  // Summarize Page
  summarizePageBtn.addEventListener('click', async () => {
    try {
      updateStatus('busy', 'Analyzing page...');
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      chrome.tabs.sendMessage(tab.id, {
        action: 'summarizePage'
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error:', chrome.runtime.lastError);
          alert('Please refresh the page first.');
          updateStatus('online', 'Ready');
        } else {
          console.log('Page summarized:', response);
          updateStatus('online', 'Summary complete');
          setTimeout(() => window.close(), 1000);
        }
      });
    } catch (error) {
      console.error('Error summarizing:', error);
      updateStatus('online', 'Ready');
    }
  });

  // Extract Links
  extractLinksBtn.addEventListener('click', async () => {
    try {
      updateStatus('busy', 'Extracting links...');
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      chrome.tabs.sendMessage(tab.id, {
        action: 'extractLinks'
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error:', chrome.runtime.lastError);
          alert('Please refresh the page first.');
          updateStatus('online', 'Ready');
        } else {
          console.log('Links extracted:', response);
          updateStatus('online', 'Links extracted');
          setTimeout(() => window.close(), 1000);
        }
      });
    } catch (error) {
      console.error('Error extracting links:', error);
      updateStatus('online', 'Ready');
    }
  });

  // Configure Integrations
  configureIntegrationsBtn.addEventListener('click', () => {
    // Open settings page (to be implemented)
    alert('Integration settings will open here. This will allow you to connect WhatsApp, Telegram, and Messenger APIs.');
  });

  // Load integration statuses from storage
  chrome.storage.local.get(['integrations'], (result) => {
    const integrations = result.integrations || {};

    if (integrations.whatsapp) {
      document.getElementById('whatsappStatus').textContent = 'Connected';
      document.getElementById('whatsappStatus').style.background = '#28a745';
      document.getElementById('whatsappStatus').style.color = 'white';
    }

    if (integrations.telegram) {
      document.getElementById('telegramStatus').textContent = 'Connected';
      document.getElementById('telegramStatus').style.background = '#28a745';
      document.getElementById('telegramStatus').style.color = 'white';
    }

    if (integrations.messenger) {
      document.getElementById('messengerStatus').textContent = 'Connected';
      document.getElementById('messengerStatus').style.background = '#28a745';
      document.getElementById('messengerStatus').style.color = 'white';
    }
  });

  // Initialize status
  updateStatus('online', 'Ready');
});
