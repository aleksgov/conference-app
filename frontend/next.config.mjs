import withFlowbiteReact from "flowbite-react/plugin/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        JWT_SECRET_BASE64: process.env.JWT_SECRET_BASE64,
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },

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

export default withFlowbiteReact(nextConfig);