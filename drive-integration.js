const { google } = require('googleapis');
const path = require('path');

class DriveIntegration {
  constructor() {
    this.auth = null;
    this.drive = null;
  }

  /**
   * Initialize Google Drive API with credentials
   * Supports both OAuth and API Key authentication
   */
  async initialize() {
    try {
      // Check if we have OAuth credentials or API key
      if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        // OAuth 2.0 authentication
        this.auth = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/oauth2callback'
        );

        // If we have a refresh token, set it
        if (process.env.GOOGLE_REFRESH_TOKEN) {
          this.auth.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
          });
        }
      } else if (process.env.GOOGLE_API_KEY) {
        // API Key authentication (for public files)
        this.auth = process.env.GOOGLE_API_KEY;
      } else {
        throw new Error('No Google Drive credentials found. Please set GOOGLE_API_KEY or OAuth credentials.');
      }

      this.drive = google.drive({ version: 'v3', auth: this.auth });
      console.log('Google Drive API initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Google Drive API:', error.message);
      throw error;
    }
  }

  /**
   * Extract folder ID from Google Drive URL
   * @param {string} url - Google Drive folder URL
   * @returns {string} - Folder ID
   */
  extractFolderIdFromUrl(url) {
    // Match patterns like:
    // https://drive.google.com/drive/folders/1LCLSDeydBgOlMvpm8gosBFyvoL1pwNNW
    // https://drive.google.com/drive/folders/1LCLSDeydBgOlMvpm8gosBFyvoL1pwNNW?usp=sharing
    const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return match[1];
    }

    // If it's already just an ID, return it
    if (/^[a-zA-Z0-9_-]+$/.test(url)) {
      return url;
    }

    throw new Error('Invalid Google Drive folder URL or ID');
  }

  /**
   * List all files in a folder
   * @param {string} folderIdOrUrl - Folder ID or Google Drive URL
   * @param {number} maxResults - Maximum number of results to return
   * @returns {Array} - List of files
   */
  async listFilesInFolder(folderIdOrUrl, maxResults = 100) {
    try {
      if (!this.drive) {
        await this.initialize();
      }

      const folderId = this.extractFolderIdFromUrl(folderIdOrUrl);
      console.log(`Fetching files from folder: ${folderId}`);

      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        pageSize: maxResults,
        fields: 'nextPageToken, files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink, iconLink, thumbnailLink)',
        orderBy: 'name'
      });

      const files = response.data.files;
      console.log(`Found ${files.length} files in folder`);

      return files.map(file => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        size: file.size ? parseInt(file.size) : 0,
        sizeFormatted: file.size ? this.formatFileSize(parseInt(file.size)) : 'N/A',
        createdTime: file.createdTime,
        modifiedTime: file.modifiedTime,
        webViewLink: file.webViewLink,
        webContentLink: file.webContentLink,
        iconLink: file.iconLink,
        thumbnailLink: file.thumbnailLink,
        isFolder: file.mimeType === 'application/vnd.google-apps.folder'
      }));
    } catch (error) {
      console.error('Error listing files:', error.message);

      // Provide more helpful error messages
      if (error.code === 404) {
        throw new Error('Folder not found. Please check the folder ID and make sure it exists.');
      } else if (error.code === 403) {
        throw new Error('Access denied. Please check folder permissions and API credentials.');
      } else {
        throw error;
      }
    }
  }

  /**
   * Get folder metadata
   * @param {string} folderIdOrUrl - Folder ID or Google Drive URL
   * @returns {Object} - Folder metadata
   */
  async getFolderMetadata(folderIdOrUrl) {
    try {
      if (!this.drive) {
        await this.initialize();
      }

      const folderId = this.extractFolderIdFromUrl(folderIdOrUrl);

      const response = await this.drive.files.get({
        fileId: folderId,
        fields: 'id, name, mimeType, createdTime, modifiedTime, owners, shared, permissions'
      });

      return response.data;
    } catch (error) {
      console.error('Error getting folder metadata:', error.message);
      throw error;
    }
  }

  /**
   * Download file content
   * @param {string} fileId - File ID
   * @returns {Buffer} - File content
   */
  async downloadFile(fileId) {
    try {
      if (!this.drive) {
        await this.initialize();
      }

      const response = await this.drive.files.get(
        { fileId: fileId, alt: 'media' },
        { responseType: 'arraybuffer' }
      );

      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error downloading file:', error.message);
      throw error;
    }
  }

  /**
   * Export Google Workspace files (Docs, Sheets, etc.)
   * @param {string} fileId - File ID
   * @param {string} mimeType - Export MIME type
   * @returns {Buffer} - Exported file content
   */
  async exportFile(fileId, mimeType) {
    try {
      if (!this.drive) {
        await this.initialize();
      }

      const response = await this.drive.files.export(
        { fileId: fileId, mimeType: mimeType },
        { responseType: 'arraybuffer' }
      );

      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error exporting file:', error.message);
      throw error;
    }
  }

  /**
   * Format file size in human-readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} - Formatted size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Get export MIME type for Google Workspace files
   * @param {string} googleMimeType - Google Workspace MIME type
   * @returns {string} - Export MIME type
   */
  getExportMimeType(googleMimeType) {
    const mimeTypeMap = {
      'application/vnd.google-apps.document': 'application/pdf',
      'application/vnd.google-apps.spreadsheet': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.google-apps.presentation': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.google-apps.drawing': 'application/pdf',
    };

    return mimeTypeMap[googleMimeType] || 'application/pdf';
  }
}

module.exports = DriveIntegration;
