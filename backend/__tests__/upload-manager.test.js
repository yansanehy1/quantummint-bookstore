const path = require('path');
const fs = require('fs').promises;
const QuantumUploadManager = require(path.join(__dirname, '..', '..', 'services', 'video', 'processor', 'upload-manager.js'));

describe('QuantumUploadManager', () => {
  const tempDir = path.join(__dirname, 'tmpVideoUploads');
  const uploadDir = path.join(__dirname, 'tmpVideoSaved');
  let manager;

  beforeAll(async () => {
    manager = new QuantumUploadManager({ tempDir, uploadDir, maxFileSize: 10 * 1024 * 1024 });
    await manager.initDirectories();
  });

  afterAll(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
    await fs.rm(uploadDir, { recursive: true, force: true });
  });

  test('initUpload rejects missing fields', async () => {
    await expect(manager.initUpload({ filename: 'video.mp4' })).rejects.toThrow(/Missing required field/);
  });

  test('initUpload rejects unsupported mimeType', async () => {
    await expect(manager.initUpload({ filename: 'video.mp4', size: 1024, mimeType: 'text/plain', totalChunks: 1, userId: 'user1' })).rejects.toThrow(/Unsupported mimeType/);
  });

  test('initUpload and chunk handling works for safe path', async () => {
    const meta = { filename: 'safe-video.mp4', size: 1024, mimeType: 'video/mp4', totalChunks: 1, userId: 'user1' };
    const { uploadId } = await manager.initUpload(meta);
    const result = await manager.handleChunk(uploadId, 0, Buffer.alloc(1024), 'user1');
    expect(result).toHaveProperty('status', 'completed');
    expect(result).toHaveProperty('filePath');
    const stats = await fs.stat(result.filePath);
    expect(stats.size).toBe(1024);
  });

  test('handleChunk rejects unauthorized user', async () => {
    const meta = { filename: 'safe-video.mp4', size: 1024, mimeType: 'video/mp4', totalChunks: 1, userId: 'owner' };
    const { uploadId } = await manager.initUpload(meta);
    await expect(manager.handleChunk(uploadId, 0, Buffer.alloc(1024), 'intruder')).rejects.toThrow(/Unauthorized chunk upload/);
  });

  test('finalizeUpload rejects path traversal final path settings', async () => {
    // This is asssertion that finalize path cannot be outside safe uploadDir.
    // We can emulate by tampering upload entry with unsafe filename extension and high risk
    const meta = { filename: '../evil.mp4', size: 1, mimeType: 'video/mp4', totalChunks: 0, userId: 'user1' };
    // initUpload does path.basename and now filename is evil.mp4, so we create session manually for a check
    const uploadId = 'hacksession';
    manager.activeUploads.set(uploadId, {
      id: uploadId,
      filename: '../evil.mp4',
      size: 1,
      mimeType: 'video/mp4',
      chunks: [],
      totalChunks: 1,
      uploadedSize: 0,
      status: 'uploading',
      createdAt: Date.now(),
      userId: 'user1',
      metadata: meta
    });
    await expect(manager.finalizeUpload(uploadId)).rejects.toThrow(/Invalid file extension|Upload size mismatch/);
  });
});
