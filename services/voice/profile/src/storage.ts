import fs from 'fs/promises';
import path from 'path';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { createReadStream } from 'fs';

// Initialize S3 Client (Backblaze B2 compatible)
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    endpoint: process.env.S3_ENDPOINT, // e.g. https://s3.us-west-004.backblazeb2.com
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'quantummint-voice-profiles';

/**
 * Upload sample to persistent storage (S3/Backblaze/Local)
 */
export async function uploadToStorage(filePath: string, metadata: {
    userId: string;
    profileId: string;
    originalName: string;
}): Promise<string> {
    const storageProvider = process.env.STORAGE_PROVIDER || 'local';
    
    const ext = path.extname(metadata.originalName);
    const fileName = `${metadata.userId}/${metadata.profileId}/${Date.now()}${ext}`;

    if (storageProvider === 'local') {
        const storageDir = process.env.LOCAL_STORAGE_DIR || '/app/storage/samples';
        await fs.mkdir(path.join(storageDir, metadata.userId, metadata.profileId), { recursive: true });
        
        const targetPath = path.join(storageDir, fileName);
        await fs.copyFile(filePath, targetPath);
        return targetPath;
    }
    
    if (storageProvider === 's3' || storageProvider === 'backblaze') {
        const fileStream = createReadStream(filePath);
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: BUCKET_NAME,
                Key: `samples/${fileName}`,
                Body: fileStream,
                ContentType: getContentType(ext),
            },
        });

        await upload.done();
        return `s3://${BUCKET_NAME}/samples/${fileName}`;
    }
    
    throw new Error(`Storage provider ${storageProvider} not implemented`);
}

/**
 * Delete sample from persistent storage
 */
export async function deleteFromStorage(storagePath: string): Promise<void> {
    const storageProvider = process.env.STORAGE_PROVIDER || 'local';
    
    if (storageProvider === 'local') {
        try {
            await fs.unlink(storagePath);
        } catch (err) {
            console.warn('Failed to delete local sample:', storagePath, err);
        }
        return;
    }

    if (storageProvider === 's3' || storageProvider === 'backblaze') {
        if (!storagePath.startsWith('s3://')) return;
        
        const key = storagePath.replace(`s3://${BUCKET_NAME}/`, '');
        try {
            await s3Client.send(new DeleteObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key,
            }));
        } catch (err) {
            console.error('Failed to delete S3 object:', storagePath, err);
        }
        return;
    }
}

/**
 * Upload synthesized audio buffer to storage
 */
export async function uploadAudioToStorage(buffer: ArrayBuffer | Buffer): Promise<string> {
    const storageProvider = process.env.STORAGE_PROVIDER || 'local';
    const fileName = `${Date.now()}_synth.mp3`;

    if (storageProvider === 'local') {
        const storageDir = process.env.LOCAL_STORAGE_DIR || '/app/storage/synthesized';
        await fs.mkdir(storageDir, { recursive: true });
        
        const targetPath = path.join(storageDir, fileName);
        await fs.writeFile(targetPath, Buffer.from(buffer));
        return targetPath;
    }

    if (storageProvider === 's3' || storageProvider === 'backblaze') {
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: BUCKET_NAME,
                Key: `synthesized/${fileName}`,
                Body: Buffer.from(buffer),
                ContentType: 'audio/mpeg',
            },
        });

        await upload.done();
        return `s3://${BUCKET_NAME}/synthesized/${fileName}`;
    }

    throw new Error(`Storage provider ${storageProvider} not implemented`);
}

function getContentType(ext: string): string {
    switch (ext.toLowerCase()) {
        case '.wav': return 'audio/wav';
        case '.mp3': return 'audio/mpeg';
        case '.m4a': return 'audio/mp4';
        case '.ogg': return 'audio/ogg';
        default: return 'application/octet-stream';
    }
}
