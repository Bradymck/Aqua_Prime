export function ipfsToHttp(ipfsUri: string): string {
  if (!ipfsUri) return '';
  
  // Remove ipfs:// prefix
  const cid = ipfsUri.replace('ipfs://', '');
  
  // Use preferred gateway
  return `https://${cid}.ipfs.nftstorage.link`;
}

export function httpToIpfs(httpUrl: string): string {
  if (!httpUrl) return '';
  
  // Extract CID from gateway URL
  const matches = httpUrl.match(/(.+)\.ipfs\.nftstorage\.link/);
  if (!matches) return httpUrl;
  
  return `ipfs://${matches[1]}`;
}

export function isIpfsUri(uri: string): boolean {
  return uri.startsWith('ipfs://');
}

export function validateIpfsUri(uri: string): boolean {
  if (!isIpfsUri(uri)) return false;
  
  const cid = uri.replace('ipfs://', '');
  // Basic CID validation
  return cid.length >= 46 && cid.length <= 64;
} 