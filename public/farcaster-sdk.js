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
    
    // Initialize SDK when loaded
    if (window.farcasterSDK && window.farcasterSDK.actions) {
      // Call ready when the app is loaded
      window.farcasterSDK.actions.ready().then(() => {
        console.log('Farcaster SDK ready called successfully');
        
        // Set up event listeners if available
        if (window.farcasterSDK.events) {
          window.farcasterSDK.events.on('ready', () => {
            console.log('Farcaster SDK está listo');
          });
          
          window.farcasterSDK.events.on('auth', (user) => {
            console.log('Usuario autenticado:', user);
          });
          
          window.farcasterSDK.events.on('error', (error) => {
            console.error('Error en SDK de Farcaster:', error);
          });
        }
        
        // Add custom methods for easier access
        window.farcasterSDK.quickAuth = {
          fetch: async (url) => {
            try {
              return await window.farcasterSDK.actions.fetch(url);
            } catch (error) {
              console.error('Error en quickAuth.fetch:', error);
              throw error;
            }
          }
        };
        
        // Add notification method
        window.farcasterSDK.actions.sendNotification = async (options) => {
          try {
            // This is a placeholder - actual implementation depends on SDK version
            console.log('Enviando notificación:', options);
            return { success: true };
          } catch (error) {
            console.error('Error enviando notificación:', error);
            throw error;
          }
        };
        
      }).catch((error) => {
        console.error('Error calling Farcaster SDK ready:', error);
      });
    }
  `;
  
  document.head.appendChild(script);
})(); 