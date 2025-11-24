import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../pages/api/auth/[...nextauth]';
import { serviceRegistry } from '@/lib/service-registry';

async function getBookServiceUrl() {
  try {
    const bookService = await serviceRegistry.getService('book-service');
    return bookService.url;
  } catch (error) {
    console.error('Failed to get book service URL:', error);
    throw new Error('Book service is not available');
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
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
  } catch (error) {
    console.error('Book creation error:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}
