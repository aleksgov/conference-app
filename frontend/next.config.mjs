/** @type {import('next').NextConfig} */
const nextConfig = {
    // Добавляем обработчик SVG
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },

    // Существующие переадресации
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8080/api/:path*',
            },
            {
                source: '/status',
                destination: 'http://localhost:8080/status',
            },
        ];
    },
};

export default nextConfig;
