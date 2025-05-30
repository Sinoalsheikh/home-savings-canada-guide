
// Web Crypto API utilities for client-side encryption
const ENCRYPTION_KEY_NAME = 'smart-home-savings-key';
const DATA_EXPIRY_DAYS = 7;

// Generate or retrieve encryption key
async function getOrCreateEncryptionKey(): Promise<CryptoKey> {
  const keyData = localStorage.getItem(ENCRYPTION_KEY_NAME);
  
  if (keyData) {
    try {
      const importedKey = await crypto.subtle.importKey(
        'jwk',
        JSON.parse(keyData),
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      return importedKey;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to import existing key, generating new one');
      }
    }
  }
  
  // Generate new key
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  
  // Store key for future use
  const exportedKey = await crypto.subtle.exportKey('jwk', key);
  localStorage.setItem(ENCRYPTION_KEY_NAME, JSON.stringify(exportedKey));
  
  return key;
}

// Encrypt data
export async function encryptData(data: any): Promise<string> {
  try {
    const key = await getOrCreateEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(JSON.stringify({
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + (DATA_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
    }));
    
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encodedData
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Encryption failed:', error);
    }
    throw new Error('Failed to encrypt data');
  }
}

// Decrypt data
export async function decryptData(encryptedString: string): Promise<any> {
  try {
    const key = await getOrCreateEncryptionKey();
    const combined = new Uint8Array(
      atob(encryptedString).split('').map(char => char.charCodeAt(0))
    );
    
    const iv = combined.slice(0, 12);
    const encryptedData = combined.slice(12);
    
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedData
    );
    
    const decodedData = JSON.parse(new TextDecoder().decode(decryptedData));
    
    // Check if data has expired
    if (Date.now() > decodedData.expiresAt) {
      throw new Error('Data has expired');
    }
    
    return decodedData.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Decryption failed:', error);
    }
    throw new Error('Failed to decrypt data');
  }
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Enhanced email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Canadian phone number validation
export function validateCanadianPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '');
  // Canadian numbers: 10 digits, starting with area codes 2-9
  const phoneRegex = /^[2-9]\d{2}[2-9]\d{2}\d{4}$/;
  return phoneRegex.test(cleanPhone);
}

// Enhanced postal code validation
export function validateCanadianPostalCode(postalCode: string): boolean {
  const cleanPostal = postalCode.replace(/\s/g, '').toUpperCase();
  // Canadian postal code format: A1A1A1 or A1A 1A1
  const postalRegex = /^[A-CEJ-NPR-TVXY]\d[A-CEJ-NPR-TV-Z]\d[A-CEJ-NPR-TV-Z]\d$/;
  return postalRegex.test(cleanPostal);
}

// Secure data cleanup
export function secureDataCleanup(): void {
  try {
    // Remove assessment data
    localStorage.removeItem('smartHomeSavingsAssessment');
    
    // Remove encryption key (forces regeneration)
    localStorage.removeItem(ENCRYPTION_KEY_NAME);
    
    // Clear any expired data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('smart-home-') || key.startsWith('energy-assessment-')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.expiresAt && Date.now() > data.expiresAt) {
            localStorage.removeItem(key);
          }
        } catch {
          // Remove malformed data
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Data cleanup failed:', error);
    }
  }
}

// Rate limiting for form submissions
const RATE_LIMIT_KEY = 'form-submission-rate';
const MAX_SUBMISSIONS = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(): boolean {
  try {
    const rateLimitData = localStorage.getItem(RATE_LIMIT_KEY);
    const now = Date.now();
    
    if (!rateLimitData) {
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: 1, resetTime: now + RATE_LIMIT_WINDOW }));
      return true;
    }
    
    const { count, resetTime } = JSON.parse(rateLimitData);
    
    if (now > resetTime) {
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: 1, resetTime: now + RATE_LIMIT_WINDOW }));
      return true;
    }
    
    if (count >= MAX_SUBMISSIONS) {
      return false;
    }
    
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: count + 1, resetTime }));
    return true;
  } catch {
    return true; // Allow submission if rate limiting fails
  }
}

// Privacy compliance helpers
export function trackConsent(consentType: string): void {
  try {
    const consentData = {
      type: consentType,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ip: 'client-side' // Would be filled by backend
    };
    
    const existingConsents = JSON.parse(localStorage.getItem('user-consents') || '[]');
    existingConsents.push(consentData);
    
    // Keep only last 10 consent records
    const limitedConsents = existingConsents.slice(-10);
    localStorage.setItem('user-consents', JSON.stringify(limitedConsents));
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to track consent:', error);
    }
  }
}

// CSP violation reporting (client-side)
export function setupCSPReporting(): void {
  window.addEventListener('securitypolicyviolation', (event) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('CSP Violation:', {
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        originalPolicy: event.originalPolicy,
        disposition: event.disposition
      });
    }
    // In production, send to monitoring service
  });
}
