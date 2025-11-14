// Shopper Copilot - Google Drive Integration Server
// Handles fetching files and folders from Google Drive

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const DriveIntegration = require('./drive-integration');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Drive Integration
const driveIntegration = new DriveIntegration();

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Shopper Copilot Google Drive backend is running',
    timestamp: new Date().toISOString(),
    driveConfigured: !!(process.env.GOOGLE_API_KEY || (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET))
  });
});

// List files in a Google Drive folder
app.post('/api/drive/list-folder', async (req, res) => {
  try {
    const { folderUrl, folderId, maxResults } = req.body;

    if (!folderUrl && !folderId) {
      return res.status(400).json({
        error: 'Folder URL or ID is required',
        message: 'Please provide either folderUrl or folderId in the request body'
      });
    }

    const folderIdOrUrl = folderUrl || folderId;
    console.log('Fetching folder contents:', folderIdOrUrl);

    // Initialize Drive API if not already done
    if (!driveIntegration.drive) {
      await driveIntegration.initialize();
    }

    // List files in the folder
    const files = await driveIntegration.listFilesInFolder(
      folderIdOrUrl,
      maxResults || 100
    );

    res.json({
      success: true,
      folderId: driveIntegration.extractFolderIdFromUrl(folderIdOrUrl),
      fileCount: files.length,
      files: files
    });

  } catch (error) {
    console.error('Error listing folder contents:', error);

    res.status(error.code === 404 ? 404 : error.code === 403 ? 403 : 500).json({
      error: 'Failed to list folder contents',
      message: error.message,
      code: error.code
    });
  }
});

// Get folder metadata
app.post('/api/drive/folder-info', async (req, res) => {
  try {
    const { folderUrl, folderId } = req.body;

    if (!folderUrl && !folderId) {
      return res.status(400).json({
        error: 'Folder URL or ID is required'
      });
    }

    const folderIdOrUrl = folderUrl || folderId;
    console.log('Getting folder metadata:', folderIdOrUrl);

    // Initialize Drive API if not already done
    if (!driveIntegration.drive) {
      await driveIntegration.initialize();
    }

    const metadata = await driveIntegration.getFolderMetadata(folderIdOrUrl);

    res.json({
      success: true,
      metadata: metadata
    });

  } catch (error) {
    console.error('Error getting folder metadata:', error);

    res.status(error.code === 404 ? 404 : error.code === 403 ? 403 : 500).json({
      error: 'Failed to get folder metadata',
      message: error.message
    });
  }
});

// Download a file from Google Drive
app.post('/api/drive/download-file', async (req, res) => {
  try {
    const { fileId, fileName } = req.body;

    if (!fileId) {
      return res.status(400).json({
        error: 'File ID is required'
      });
    }

    console.log('Downloading file:', fileId);

    // Initialize Drive API if not already done
    if (!driveIntegration.drive) {
      await driveIntegration.initialize();
    }

    const fileBuffer = await driveIntegration.downloadFile(fileId);

    // Set appropriate headers
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName || 'download'}"`);
    res.send(fileBuffer);

  } catch (error) {
    console.error('Error downloading file:', error);

    res.status(error.code === 404 ? 404 : error.code === 403 ? 403 : 500).json({
      error: 'Failed to download file',
      message: error.message
    });
  }
});

// Export Google Workspace file
app.post('/api/drive/export-file', async (req, res) => {
  try {
    const { fileId, mimeType, fileName } = req.body;

    if (!fileId) {
      return res.status(400).json({
        error: 'File ID is required'
      });
    }

    console.log('Exporting file:', fileId);

    // Initialize Drive API if not already done
    if (!driveIntegration.drive) {
      await driveIntegration.initialize();
    }

    const exportMimeType = mimeType || 'application/pdf';
    const fileBuffer = await driveIntegration.exportFile(fileId, exportMimeType);

    // Set appropriate headers
    res.setHeader('Content-Type', exportMimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName || 'export'}"`);
    res.send(fileBuffer);

  } catch (error) {
    console.error('Error exporting file:', error);

    res.status(error.code === 404 ? 404 : error.code === 403 ? 403 : 500).json({
      error: 'Failed to export file',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  Shopper Copilot - Google Drive Integration           ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

  // Check configuration
  const hasApiKey = !!process.env.GOOGLE_API_KEY;
  const hasOAuth = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  console.log('\n📊 Configuration Status:');
  console.log('  Google API Key:', hasApiKey ? '✓ Configured' : '✗ Not configured');
  console.log('  OAuth Credentials:', hasOAuth ? '✓ Configured' : '✗ Not configured');

  if (!hasApiKey && !hasOAuth) {
    console.log('\n⚠️  WARNING: No Google Drive credentials found!');
    console.log('   Please set GOOGLE_API_KEY or OAuth credentials in .env file');
    console.log('   See .env.example for details\n');
  } else {
    console.log('\n✓ Ready to fetch Google Drive folders!\n');
  }

  console.log('Endpoints:');
  console.log('  GET  /health                  - Health check');
  console.log('  POST /api/drive/list-folder   - List folder contents');
  console.log('  POST /api/drive/folder-info   - Get folder metadata');
  console.log('  POST /api/drive/download-file - Download a file');
  console.log('  POST /api/drive/export-file   - Export Google Workspace file');
  console.log('\n════════════════════════════════════════════════════════\n');
});

module.exports = app;
