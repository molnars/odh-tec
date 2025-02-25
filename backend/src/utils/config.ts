import { S3Client } from '@aws-sdk/client-s3';
import { NodeJsClient } from '@smithy/types';

// Initial configuration
let accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
let secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
let region = process.env.AWS_DEFAULT_REGION || 'us-east-1';
let endpoint = process.env.AWS_S3_ENDPOINT || '';
let defaultBucket = process.env.AWS_S3_BUCKET || '';
let hfToken = process.env.HF_TOKEN || '';
let maxConcurrentTransfers = parseInt(process.env.MAX_CONCURRENT_TRANSFERS || '2', 10);

// Load proxy settings from environment variables
const proxyHost = process.env.HTTP_PROXY_HOST;
const proxyPort = process.env.HTTP_PROXY_PORT ? parseInt(process.env.HTTP_PROXY_PORT) : undefined;
const proxyUser = process.env.HTTP_PROXY_USER;
const proxyPassword = process.env.HTTP_PROXY_PASSWORD;

// Check if the proxy is enabled based on environment variables
const isProxyEnabled = !!(proxyHost && proxyPort);

export const proxyConfig = (): proxyConfig => {
  proxy: isProxyEnabled
      ? {
            host: proxyHost!,
            port: proxyPort!,
            auth: proxyUser && proxyPassword ? { username: proxyUser, password: proxyPassword } : undefined
        }
      : false // Disables proxy if not needed
};

export const initializeS3Client = (): S3Client => {
  return new S3Client({
    region: region,
    endpoint: endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  }) as NodeJsClient<S3Client>;
};

let s3Client = initializeS3Client();

export const updateS3Config = (
  newAccessKeyId: string,
  newSecretAccessKey: string,
  newRegion: string,
  newEndpoint: string,
  newDefaultBucket: string,
): void => {
  accessKeyId = newAccessKeyId;
  secretAccessKey = newSecretAccessKey;
  region = newRegion;
  endpoint = newEndpoint;
  defaultBucket = newDefaultBucket;

  // Reinitialize the S3 client
  s3Client = initializeS3Client();
};

export const getS3Config = (): any => {
  return {
    accessKeyId,
    secretAccessKey,
    region,
    endpoint,
    defaultBucket,
    s3Client,
  };
};

export const getHFConfig = (): string => {
  return hfToken;
};

export const updateHFConfig = (newHfToken: string): void => {
  hfToken = newHfToken;
};

export const getMaxConcurrentTransfers = (): number => {
  return maxConcurrentTransfers;
};

export const updateMaxConcurrentTransfers = (newMaxConcurrentTransfers: number): void => {
  maxConcurrentTransfers = newMaxConcurrentTransfers;
};
