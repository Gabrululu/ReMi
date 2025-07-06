/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
        appDir: true,
    },
    images: {
        domains: ['cdn.builder.io']
    }
};

export default nextConfig;
