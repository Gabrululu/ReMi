// Farcaster SDK Client Script
// This script loads only on the client side

(function() {
  if (typeof window === 'undefined') return;
  
  // Load Farcaster SDK from CDN
  const script = document.createElement('script');
  script.type = 'module';
  script.textContent = `
    import { sdk } from 'https://esm.sh/@farcaster/miniapp-sdk@0.1.4';
    window.farcasterSDK = sdk;
    
    // Call ready when the app is loaded
    if (window.farcasterSDK && window.farcasterSDK.actions) {
      window.farcasterSDK.actions.ready().then(() => {
        console.log('Farcaster SDK ready called successfully');
      }).catch((error) => {
        console.error('Error calling Farcaster SDK ready:', error);
      });
    }
  `;
  
  document.head.appendChild(script);
})(); 