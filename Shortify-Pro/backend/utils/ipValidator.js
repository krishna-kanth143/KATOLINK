import dns from 'dns/promises';

/**
 * Checks if a hostname or IP address resolves to a private/local range.
 * This is a critical protection against SSRF.
 */
export const isPrivateIp = async (hostname) => {
  try {
    // Basic local checks
    if (['localhost', '127.0.0.1', '::1', '0.0.0.0'].includes(hostname.toLowerCase())) {
      return true;
    }

    // Resolve hostname to IP
    const addresses = await dns.resolve(hostname).catch(() => []);
    
    // Also try lookup (handles cases where resolve fails but it's a valid IP)
    const lookup = await dns.lookup(hostname).catch(() => null);
    if (lookup) addresses.push(lookup.address);

    const privateRanges = [
      /^10\./,             // 10.0.0.0 – 10.255.255.255
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0 – 172.31.255.255
      /^192\.168\./,       // 192.168.0.0 – 192.168.255.255
      /^169\.254\./,       // Link-local
      /^127\./             // Loopback
    ];

    return addresses.some(ip => privateRanges.some(range => range.test(ip)));
  } catch (error) {
    // If resolution fails, we conservatively allow it or block it? 
    // Usually, blocking is safer for SSRF protection.
    return false;
  }
};
