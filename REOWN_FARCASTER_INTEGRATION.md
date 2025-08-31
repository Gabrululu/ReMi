# Integración Reown + Farcaster en ReMi

## 🚀 Resumen

Esta integración permite que tu aplicación ReMi reconozca automáticamente cuando un usuario está conectado tanto con Reown (wallet) como con Farcaster, proporcionando una experiencia Web3 sin fricción.

## 🔧 Características Implementadas

### 1. **Detección Automática de Contexto**
- Detecta automáticamente si el usuario está en un contexto de Farcaster
- Identifica si hay una wallet conectada a través de Reown
- Maneja ambos estados de forma independiente

### 2. **Autenticación Conjunta**
- **Reown**: Conexión de wallet tradicional con soporte para múltiples wallets
- **Farcaster**: Autenticación automática cuando se detecta contexto de Mini App
- **Integración**: Ambos sistemas funcionan de forma independiente pero coordinada

### 3. **Componentes Principales**

#### `useFarcasterAuth` Hook
```typescript
const { 
  user, 
  loading, 
  error, 
  isAuthenticated, 
  isInFarcaster,
  login, 
  logout, 
  checkFarcasterAuth 
} = useFarcasterAuth();
```

#### `ReownFarcasterIntegration` Component
```typescript
<ReownFarcasterIntegration>
  {/* Contenido de la aplicación */}
</ReownFarcasterIntegration>
```

#### `ReownFarcasterDemo` Component
```typescript
<ReownFarcasterDemo />
```

## 📱 Flujo de Autenticación

### 1. **Detección de Contexto**
```javascript
// Detecta si estamos en Farcaster
const isInFarcaster = window.location.href.includes('farcaster.xyz') || 
                      window.navigator.userAgent.includes('Farcaster') ||
                      (window as any).farcasterSDK;
```

### 2. **Quick Auth de Farcaster**
```javascript
// Intenta autenticación automática
if ((window as any).farcasterSDK?.quickAuth?.fetch) {
  const response = await (window as any).farcasterSDK.quickAuth.fetch('/api/me');
  if (response.ok) {
    const userData = await response.json();
    // Usuario autenticado
  }
}
```

### 3. **Conexión de Wallet con Reown**
```javascript
// Usa Wagmi para conectar wallet
const { connect, connectors } = useConnect();
const connector = connectors[0];
if (connector) {
  connect({ connector });
}
```

## 🎯 Uso de los Componentes

### Hook de Autenticación
```javascript
import { useFarcasterAuth } from '../hooks/useFarcasterAuth';

function MyComponent() {
  const { 
    user: farcasterUser, 
    isAuthenticated: isFarcasterAuthenticated,
    isInFarcaster,
    login: farcasterLogin 
  } = useFarcasterAuth();

  return (
    <div>
      {isInFarcaster && !isFarcasterAuthenticated && (
        <button onClick={farcasterLogin}>
          Conectar Farcaster
        </button>
      )}
      
      {isFarcasterAuthenticated && farcasterUser && (
        <div>
          <p>Bienvenido @{farcasterUser.username}</p>
          <p>FID: {farcasterUser.fid}</p>
        </div>
      )}
    </div>
  );
}
```

### Componente de Integración
```javascript
import { ReownFarcasterIntegration } from '../components/ReownFarcasterIntegration';

function App() {
  return (
    <ReownFarcasterIntegration>
      <div>
        {/* Tu contenido de la aplicación */}
        <p>Contenido que se muestra cuando hay wallet o Farcaster conectado</p>
      </div>
    </ReownFarcasterIntegration>
  );
}
```

## 🔗 Configuración

### 1. **Variables de Entorno**
```env
# WalletConnect Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here

# Farcaster Configuration (opcional)
NEYNAR_API_KEY=your_neynar_api_key
NEYNAR_SIGNER_UUID=your_neynar_signer_uuid
```

### 2. **SDK de Farcaster**
El SDK se carga automáticamente desde CDN en `lib/appkit-config.tsx`:
```javascript
import { sdk } from 'https://esm.sh/@farcaster/miniapp-sdk@latest';
window.farcasterSDK = sdk;
```

### 3. **Configuración de Reown**
```javascript
// lib/appkit-config.tsx
const config = createConfig({
  chains: [baseSepolia, celoAlfajores],
  connectors: [
    // ... otros conectores
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      metadata: {
        name: 'ReMi - Social Agenda Web3',
        description: 'Tu agenda social con recompensas Web3 y integración Farcaster',
        url: 'https://remi-app.vercel.app',
        icons: ['https://remi-app.vercel.app/icon.png'],
      },
      optionalChains: [baseSepolia.id, celoAlfajores.id],
    }),
  ],
});
```

## 🎨 UI/UX

### Estados de Conexión
1. **No conectado**: Muestra opciones para conectar wallet y Farcaster
2. **Solo wallet**: Muestra información de wallet y opción para conectar Farcaster
3. **Solo Farcaster**: Muestra información de Farcaster y opción para conectar wallet
4. **Ambos conectados**: Muestra información completa y estadísticas

### Indicadores Visuales
- ✅ Verde: Conectado/Autenticado
- ⚠️ Amarillo: No conectado/No autenticado
- 🔄 Azul: Cargando
- ❌ Rojo: Error

## 🛠️ Desarrollo

### Estructura de Archivos
```
├── hooks/
│   └── useFarcasterAuth.ts              # Hook de autenticación de Farcaster
├── components/
│   ├── ReownFarcasterIntegration.tsx    # Componente de integración
│   ├── ReownFarcasterDemo.tsx           # Componente de demostración
│   └── ConnectWallet.tsx                # Componente actualizado
├── lib/
│   └── appkit-config.tsx                # Configuración de Reown + Farcaster
└── src/app/api/
    └── me/route.ts                      # Endpoint de autenticación
```

### Comandos de Desarrollo
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🚨 Solución de Problemas

### Error: "SDK no disponible"
- Verificar que el script se carga correctamente
- Comprobar que estamos en el cliente (no SSR)

### Error: "Ready not called"
- Asegurar que `sdk.actions.ready()` se llama
- Verificar que el SDK está inicializado

### Error: "window is not defined"
- Mover código del servidor al cliente
- Usar `useEffect` para código del navegador

### Error: "No autorizado" en /api/me
- Verificar headers de Farcaster
- Comprobar configuración de Neynar API

## 📊 Funcionalidades Avanzadas

### 1. **Compartir en Farcaster**
```javascript
const shareOnFarcaster = async () => {
  const shareText = `¡Acabo de completar una tarea en ReMi! 🎉`;
  await navigator.clipboard.writeText(shareText);
  alert('Texto copiado al portapapeles. Compártelo en Farcaster!');
};
```

### 2. **Notificaciones**
```javascript
// Enviar notificación a través de Farcaster
if ((window as any).farcasterSDK?.actions?.sendNotification) {
  await (window as any).farcasterSDK.actions.sendNotification({
    message: 'Nueva tarea completada',
    title: 'ReMi - Logro desbloqueado'
  });
}
```

### 3. **Navegación**
```javascript
// Abrir URL en Farcaster
if ((window as any).farcasterSDK?.actions?.openUrl) {
  await (window as any).farcasterSDK.actions.openUrl('https://farcaster.xyz/...');
}
```

## 🔗 Recursos

- [Documentación de Reown](https://docs.reown.com)
- [Documentación de Farcaster Mini Apps](https://miniapps.farcaster.xyz/docs)
- [SDK de Farcaster](https://github.com/farcasterxyz/miniapp-sdk)
- [Wagmi Documentation](https://wagmi.sh)

## 📈 Próximos Pasos

1. **Implementar verificación real de tokens**
2. **Agregar más funcionalidades del SDK**
3. **Integrar con la API de Farcaster**
4. **Implementar notificaciones push**
5. **Agregar analytics de uso**
6. **Soporte para más redes blockchain**
