# Google Drive Integration Setup Guide

This guide will help you set up Google Drive integration for Shopper Copilot to fetch files and folders from Google Drive.

## Quick Start

### 1. Get a Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **+ CREATE CREDENTIALS** → **API key**
5. Copy your API key (starts with `AIza...`)

### 2. Enable Google Drive API

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Drive API"
3. Click **Enable**

### 3. Configure Environment Variables

Create a `.env` file in the project root (or use the existing one):

```bash
cp .env.example .env
```

Add your Google API Key:

```env
GOOGLE_API_KEY=AIzaSy...your-actual-api-key-here
```

### 4. Test the Integration

Run the test script with the provided folder URL:

```bash
npm run test:drive
```

This will fetch files from the folder:
`https://drive.google.com/drive/folders/1LCLSDeydBgOlMvpm8gosBFyvoL1pwNNW?usp=sharing`

### 5. Start the Drive Server

```bash
npm run start:drive
```

The server will start on port 3001 (or the PORT specified in .env).

## API Endpoints

### List Folder Contents

**POST** `/api/drive/list-folder`

Request body:
```json
{
  "folderUrl": "https://drive.google.com/drive/folders/1LCLSDeydBgOlMvpm8gosBFyvoL1pwNNW?usp=sharing"
}
```

Or use folder ID directly:
```json
{
  "folderId": "1LCLSDeydBgOlMvpm8gosBFyvoL1pwNNW"
}
```

Response:
```json
{
  "success": true,
  "folderId": "1LCLSDeydBgOlMvpm8gosBFyvoL1pwNNW",
  "fileCount": 5,
  "files": [
    {
      "id": "abc123",
      "name": "document.pdf",
      "mimeType": "application/pdf",
      "size": 1024000,
      "sizeFormatted": "1000 KB",
      "createdTime": "2025-01-01T00:00:00.000Z",
      "modifiedTime": "2025-01-15T00:00:00.000Z",
      "webViewLink": "https://drive.google.com/file/d/abc123/view",
      "webContentLink": "https://drive.google.com/uc?id=abc123&export=download",
      "iconLink": "https://drive-thirdparty.googleusercontent.com/16/type/application/pdf",
      "thumbnailLink": "https://...",
      "isFolder": false
    }
  ]
}
```

### Get Folder Metadata

**POST** `/api/drive/folder-info`

Request body:
```json
{
  "folderUrl": "https://drive.google.com/drive/folders/..."
}
```

### Download File

**POST** `/api/drive/download-file`

Request body:
```json
{
  "fileId": "abc123",
  "fileName": "document.pdf"
}
```

Returns the file as a binary stream.

### Export Google Workspace File

**POST** `/api/drive/export-file`

Request body:
```json
{
  "fileId": "abc123",
  "mimeType": "application/pdf",
  "fileName": "document.pdf"
}
```

Exports Google Docs, Sheets, Slides to standard formats (PDF, Excel, PowerPoint).

## Usage Examples

### Using cURL

List folder contents:
```bash
curl -X POST http://localhost:3001/api/drive/list-folder \
  -H "Content-Type: application/json" \
  -d '{"folderUrl": "https://drive.google.com/drive/folders/1LCLSDeydBgOlMvpm8gosBFyvoL1pwNNW?usp=sharing"}'
```

Download a file:
```bash
curl -X POST http://localhost:3001/api/drive/download-file \
  -H "Content-Type: application/json" \
  -d '{"fileId": "abc123", "fileName": "document.pdf"}' \
  --output document.pdf
```

### Using JavaScript/Fetch

```javascript
// List folder contents
const response = await fetch('http://localhost:3001/api/drive/list-folder', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    folderUrl: 'https://drive.google.com/drive/folders/1LCLSDeydBgOlMvpm8gosBFyvoL1pwNNW?usp=sharing'
  })
});

const data = await response.json();
console.log('Files:', data.files);
```

### Using the Module Directly

```javascript
const DriveIntegration = require('./drive-integration');

async function fetchFolder() {
  const drive = new DriveIntegration();
  await drive.initialize();

  const files = await drive.listFilesInFolder(
    'https://drive.google.com/drive/folders/1LCLSDeydBgOlMvpm8gosBFyvoL1pwNNW?usp=sharing'
  );

  console.log('Files:', files);
}

fetchFolder();
```

## Folder Permissions

### For Public Folders (API Key)

The folder must be shared with "Anyone with the link":

1. Right-click the folder in Google Drive
2. Click "Share"
3. Click "Change" next to "Restricted"
4. Select "Anyone with the link"
5. Set permissions to "Viewer" or "Commenter"
6. Click "Done"

### For Private Folders (OAuth 2.0)

If you need to access private folders, use OAuth 2.0 credentials:

1. In Google Cloud Console, create OAuth 2.0 Client ID credentials
2. Add to `.env`:
   ```env
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:3001/oauth2callback
   GOOGLE_REFRESH_TOKEN=your-refresh-token
   ```

## Troubleshooting

### Error: "Access denied" (403)

**Possible causes:**
- Folder is not shared publicly
- API key is invalid or restricted
- Google Drive API is not enabled

**Solutions:**
1. Make sure folder is shared with "Anyone with the link"
2. Verify API key in Google Cloud Console
3. Check that Google Drive API is enabled
4. For private folders, use OAuth 2.0 instead of API key

### Error: "Folder not found" (404)

**Possible causes:**
- Folder URL/ID is incorrect
- Folder was deleted
- You don't have permission to access it

**Solutions:**
1. Verify the folder URL is correct
2. Check folder still exists in Google Drive
3. Make sure you have access permission

### Error: "No Google Drive credentials found"

**Solution:**
1. Create `.env` file: `cp .env.example .env`
2. Add your `GOOGLE_API_KEY` to the `.env` file
3. Restart the server

### Rate Limits

Google Drive API has the following limits:
- **API Key**: 1,000 queries per 100 seconds per project
- **Per User**: 12,000 queries per 100 seconds

If you hit rate limits:
- Implement caching
- Use exponential backoff
- Consider using multiple API keys for different projects

## Security Best Practices

1. **Never commit** your `.env` file to git (it's in `.gitignore`)
2. **Never share** your API keys publicly
3. **Restrict** your API key to only Google Drive API
4. **Use** OAuth 2.0 for accessing private user data
5. **Rotate** API keys periodically
6. **Monitor** API usage in Google Cloud Console

## Supported File Types

The integration supports:
- Regular files (PDF, images, videos, etc.)
- Google Docs (exportable to PDF, Word)
- Google Sheets (exportable to Excel, PDF)
- Google Slides (exportable to PowerPoint, PDF)
- Folders (for nested navigation)

## Advanced Features

### Recursive Folder Listing

To list all files in nested folders:

```javascript
async function listAllFiles(folderId, allFiles = []) {
  const files = await drive.listFilesInFolder(folderId);

  for (const file of files) {
    allFiles.push(file);

    if (file.isFolder) {
      await listAllFiles(file.id, allFiles);
    }
  }

  return allFiles;
}
```

### Filtering Files

```javascript
const files = await drive.listFilesInFolder(folderId);

// Only PDFs
const pdfs = files.filter(f => f.mimeType === 'application/pdf');

// Only images
const images = files.filter(f => f.mimeType.startsWith('image/'));

// Files larger than 1MB
const largeFiles = files.filter(f => f.size > 1024 * 1024);
```

## Next Steps

- [ ] Set up your Google API key
- [ ] Test with the provided folder URL
- [ ] Try fetching your own folders
- [ ] Integrate with your application
- [ ] Implement error handling
- [ ] Add caching for better performance

## Support

For more information:
- [Google Drive API Documentation](https://developers.google.com/drive/api/v3/about-sdk)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Project README](./README.md)

---

**Happy fetching! 🚀**
