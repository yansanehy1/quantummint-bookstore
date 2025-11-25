"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const next_auth_1 = require("next-auth");
const ____nextauth_1 = require("../../../../pages/api/auth/[...nextauth]");
const service_registry_1 = require("@/lib/service-registry");
async function getBookServiceUrl() {
    try {
        const bookService = await service_registry_1.serviceRegistry.getService('book-service');
        return bookService.url;
    }
    catch (error) {
        console.error('Failed to get book service URL:', error);
        throw new Error('Book service is not available');
    }
}
async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    try {
        const session = await (0, next_auth_1.getServerSession)(req, res, ____nextauth_1.authOptions);
        if (!session) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Check if user has the required role
        const allowedRoles = ['ADMIN', 'SELLER', 'EDUCATOR'];
        if (!allowedRoles.includes(session.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }
        const bookServiceUrl = await getBookServiceUrl();
        const response = await fetch(`${bookServiceUrl}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify({
                ...req.body,
                // Add the user ID from the session
                createdBy: session.user.id,
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({ message: data.message || 'Failed to create book' });
        }
        return res.status(201).json(data);
    }
    catch (error) {
        console.error('Book creation error:', error);
        return res.status(500).json({
            message: error instanceof Error ? error.message : 'Internal server error'
        });
    }
}
