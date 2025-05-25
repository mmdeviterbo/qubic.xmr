import type { NextConfig } from "next";

const ContentSecurityPolicy = [
  "default-src https: 'self' https://qubic-xmr.vercel.app/*",
  "object-src 'none'",
  "style-src 'self' 'unsafe-inline'",
  "script-src https: 'self' https://qubic-xmr.vercel.app/*",
  "connect-src 'self'",
  "img-src https: data: blob: 'self'",
];

const PermissionsPolicy = [
  "accelerometer=()",
  "autoplay=()",
  "camera=()",
  "display-capture=()",
  "document-domain=()",
  "encrypted-media=()",
  "geolocation=()",
  "gyroscope=()",
  "magnetometer=()",
  "microphone=()",
  "midi=()",
  "payment=()",
  "picture-in-picture=()",
  "publickey-credentials-get=()",
  "screen-wake-lock=()",
  "sync-xhr=(self)",
  "usb=()",
  "web-share=()",
  "xr-spatial-tracking=()",
];

const securityHeaders = [
  {
    // Inform browsers that only HTTPS should be used.
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // Prevent rendering embedded content (e.g., <iframe>) from other
    // origins.
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    // Prevent browsers from guessing content types when not specified.
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Restrict how much information the browser provides to other sites.
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Limit 3rd party locations that content can be loaded from.
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.join("; "),
  },
  {
    // Limit which browser features are made available. This feature
    // is EXPERIMENTAL.
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
    key: "Permissions-Policy",
    value: PermissionsPolicy.join(", "),
  },
  {
    key: "Access-Control-Allow-Origin",
    value: "https://qubic-xmr.vercel.app/"
  },
  {
    key: "Access-Control-Allow-Methods",
    value: "GET",
  },
  {
    key: "Access-Control-Allow-Headers",
    value: "Content-Type, Authorization",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
