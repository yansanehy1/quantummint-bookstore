import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

export const requireAuth = (role?: string) => {
    return async (context: GetServerSidePropsContext) => {
        const session = await getSession(context);

        if (!session) {
            return {
                redirect: {
                    destination: '/auth/signin',
                    permanent: false,
                },
            };
        }

        if (role && (session.user as any).role !== role) {
            return {
                redirect: {
                    destination: '/dashboard',
                    permanent: false,
                },
            };
        }

        return {
            props: {
                session,
            },
        };
    };
};
