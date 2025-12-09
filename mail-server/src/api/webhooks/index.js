// Webhook Routes Integration
// This file integrates all QuantumMint webhook handlers into the mail server API

const express = require('express');
const router = express.Router();

// Import webhook handlers
const walletWebhooks = require('./wallet-webhooks');
const payoutWebhooks = require('./payout-webhooks');
const videoWebhooks = require('./video-webhooks');

// Mount wallet webhooks
router.use('/wallet', walletWebhooks);

// Mount payout webhooks
router.use('/payout', payoutWebhooks);

// Mount video webhooks
router.use('/video', videoWebhooks);

// Health check endpoint for webhooks
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'quantummint-webhooks',
        timestamp: new Date().toISOString(),
        available_endpoints: {
            wallet: [
                'POST /api/webhooks/wallet/topup',
                'POST /api/webhooks/wallet/deduct',
                'POST /api/webhooks/wallet/autotopup',
                'POST /api/webhooks/wallet/audiobook-certificate-issued'
            ],
            payout: [
                'POST /api/webhooks/payout/request',
                'POST /api/webhooks/payout/complete',
                'POST /api/webhooks/earnings/daily'
            ],
            video: [
                'POST /api/webhooks/video/session-end',
                'POST /api/webhooks/video/certificate-issued',
                'POST /api/webhooks/video/live-stream-starting',
                'POST /api/webhooks/video/upload-processed'
            ]
        }
    });
});

module.exports = router;
