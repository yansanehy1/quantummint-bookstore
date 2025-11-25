/**
 * Next.js configuration for static export.
 * Setting `output: 'export'` tells Next to generate a fully static site
 * when `next build` is run. The static files will be placed in the `out/`
 * directory, which you can then serve from Hostinger.
 */
module.exports = {
    output: 'export',
    typescript: {
        // Temporarily ignore TypeScript errors during build
        ignoreBuildErrors: true,
    },
    eslint: {
        // Temporarily ignore ESLint errors during build
        ignoreDuringBuilds: true,
    },
};
