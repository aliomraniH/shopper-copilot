// Test script to fetch Google Drive folder contents
// Usage: node test-drive-fetch.js

const DriveIntegration = require('./drive-integration');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// The folder URL provided by the user
const FOLDER_URL = 'https://drive.google.com/drive/folders/1LCLSDeydBgOlMvpm8gosBFyvoL1pwNNW?usp=sharing';

async function testDriveFetch() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║  Google Drive Folder Fetch Test                        ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const driveIntegration = new DriveIntegration();

  try {
    // Step 1: Extract folder ID
    console.log('📂 Folder URL:', FOLDER_URL);
    const folderId = driveIntegration.extractFolderIdFromUrl(FOLDER_URL);
    console.log('✓ Extracted Folder ID:', folderId);
    console.log('');

    // Step 2: Initialize Google Drive API
    console.log('🔧 Initializing Google Drive API...');
    await driveIntegration.initialize();
    console.log('✓ Drive API initialized successfully');
    console.log('');

    // Step 3: Get folder metadata
    console.log('📊 Fetching folder metadata...');
    try {
      const metadata = await driveIntegration.getFolderMetadata(folderId);
      console.log('✓ Folder Name:', metadata.name);
      console.log('  Created:', metadata.createdTime);
      console.log('  Modified:', metadata.modifiedTime);
      console.log('  Shared:', metadata.shared ? 'Yes' : 'No');
      console.log('');
    } catch (error) {
      console.log('⚠️  Could not fetch metadata (this is normal for shared folders)');
      console.log('   Error:', error.message);
      console.log('');
    }

    // Step 4: List files in the folder
    console.log('📁 Fetching folder contents...');
    const files = await driveIntegration.listFilesInFolder(folderId);

    console.log(`✓ Found ${files.length} files/folders\n`);

    if (files.length === 0) {
      console.log('The folder is empty or you may not have permission to view its contents.');
      console.log('\n💡 Tip: Make sure the folder is shared with "Anyone with the link"');
      console.log('   or you have proper OAuth credentials configured.');
    } else {
      console.log('Files and folders:');
      console.log('══════════════════════════════════════════════════════════\n');

      files.forEach((file, index) => {
        const icon = file.isFolder ? '📁' : '📄';
        console.log(`${index + 1}. ${icon} ${file.name}`);
        console.log(`   Type: ${file.mimeType}`);
        console.log(`   Size: ${file.sizeFormatted}`);
        console.log(`   Modified: ${new Date(file.modifiedTime).toLocaleDateString()}`);
        console.log(`   View: ${file.webViewLink}`);
        console.log('');
      });

      // Summary by type
      console.log('══════════════════════════════════════════════════════════');
      console.log('\n📊 Summary:');
      const folders = files.filter(f => f.isFolder).length;
      const regularFiles = files.filter(f => !f.isFolder).length;
      console.log(`   Folders: ${folders}`);
      console.log(`   Files: ${regularFiles}`);
      console.log(`   Total: ${files.length}`);

      // Calculate total size
      const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
      console.log(`   Total Size: ${driveIntegration.formatFileSize(totalSize)}`);
    }

    console.log('\n✅ Test completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Error during test:');
    console.error('   Message:', error.message);

    if (error.code === 403) {
      console.error('\n💡 Troubleshooting tips:');
      console.error('   1. Make sure the folder is shared with "Anyone with the link"');
      console.error('   2. Check that your Google API credentials are valid');
      console.error('   3. Verify that the Google Drive API is enabled in your project');
      console.error('   4. For private folders, use OAuth 2.0 credentials instead of API key');
    } else if (error.code === 404) {
      console.error('\n💡 The folder was not found. Please check:');
      console.error('   1. The folder URL is correct');
      console.error('   2. The folder still exists');
      console.error('   3. You have permission to access it');
    } else if (error.message.includes('credentials')) {
      console.error('\n💡 API credentials are missing:');
      console.error('   1. Copy .env.example to .env: cp .env.example .env');
      console.error('   2. Add your GOOGLE_API_KEY to the .env file');
      console.error('   3. Get an API key from: https://console.cloud.google.com/apis/credentials');
    }

    console.error('\n');
    process.exit(1);
  }
}

// Run the test
testDriveFetch();
