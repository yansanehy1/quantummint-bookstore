import "@/styles/bookstore.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import Head from "next/head";
import { Toaster } from "sonner";
import { registerServiceWorker, setupInstallPrompt, setupConnectivityListeners } from "@/lib/pwa";

export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        // Register service worker for PWA
        registerServiceWorker();

        // Setup install prompt
        setupInstallPrompt();

        // Setup connectivity listeners
        setupConnectivityListeners(
            () => console.log('App is back online'),
            () => console.log('App is offline')
        );
    }, []);

    return (
        <>
            <Head>
                {/* PWA Meta Tags */}
                <meta name="application-name" content="QuantumMint Bookstore" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="QuantumMint" />
                <meta name="description" content="Educational bookstore platform for Sierra Leone" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="theme-color" content="#d97706" />

                {/* Viewport */}
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />

                {/* PWA Links */}
                <link rel="manifest" href="/manifest.json" />
                <link rel="shortcut icon" href="/icons/icon-72x72.png" />

                {/* Apple Touch Icons */}
                <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
                <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
                <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-192x192.png" />
            </Head>

            <Component {...pageProps} />
            <Toaster position="top-right" richColors />
        </>
    );
}
