// Farcaster Mini App SDK Client Script
// This script loads only on the client side and initializes the Mini App SDK

(function() {
  if (typeof window === 'undefined') return;
  
  // Load Farcaster Mini App SDK from CDN
  const script = document.createElement('script');
  script.type = 'module';
  script.textContent = `
    import { sdk } from 'https://esm.sh/@farcaster/miniapp-sdk@latest';
    window.farcasterSDK = sdk;
    
    // Initialize Mini App SDK when loaded
    if (window.farcasterSDK && window.farcasterSDK.actions) {
      // Call ready as early as possible in the app
      window.farcasterSDK.actions.ready().then(() => {
        console.log('Farcaster Mini App SDK ready called successfully');
        
        // Set up event listeners for Mini App context
        if (window.farcasterSDK.events) {
          window.farcasterSDK.events.on('ready', () => {
            console.log('Farcaster Mini App SDK está listo');
          });
          
          window.farcasterSDK.events.on('auth', (user) => {
            console.log('Usuario autenticado en Mini App:', user);
          });
          
          window.farcasterSDK.events.on('error', (error) => {
            console.error('Error en Mini App SDK:', error);
          });
        }
        
        // Add Mini App specific methods
        window.farcasterSDK.quickAuth = {
          fetch: async (url) => {
            try {
              // Use the Mini App's authenticated fetch
              return await window.farcasterSDK.actions.fetch(url);
            } catch (error) {
              console.error('Error en quickAuth.fetch:', error);
              throw error;
            }
          }
        };
        
        // Add wallet provider access
        window.farcasterSDK.wallet = {
          ethProvider: window.farcasterSDK.wallet?.ethProvider || null,
          getAddress: async () => {
            try {
              if (window.farcasterSDK.wallet?.ethProvider) {
                const accounts = await window.farcasterSDK.wallet.ethProvider.request({
                  method: 'eth_accounts'
                });
                return accounts[0];
              }
              return null;
            } catch (error) {
              console.error('Error getting wallet address:', error);
              return null;
            }
          }
        };
        
      }).catch((error) => {
        console.error('Error calling Farcaster Mini App SDK ready:', error);
      });
    }
  `;
  
  document.head.appendChild(script);
})(); 