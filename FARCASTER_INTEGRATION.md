# Integración de Farcaster en ReMi

## 🚀 Características Implementadas

### 1. **Quick Auth de Farcaster**
- Autenticación automática cuando la app se abre en Farcaster
- Detección del contexto de Farcaster Mini App
- Obtención del FID (Farcaster ID) del usuario

### 2. **Componentes de Autenticación**
- `useFarcasterAuth`: Hook personalizado para manejar la autenticación
- `FarcasterAuth`: Componente wrapper que maneja la autenticación automática
- `UserProfile`: Componente que muestra el perfil del usuario de Farcaster

### 3. **Dashboard de Farcaster**
- `FarcasterDashboard`: Dashboard completo con estadísticas y acciones
- `FarcasterNotifications`: Componente para enviar notificaciones
- Integración con el estado de la wallet

### 4. **Endpoints de API**
- `/api/me`: Endpoint para verificar autenticación de Farcaster
- `/api/frame`: Endpoint para manejar frames de Farcaster

## 🔧 Configuración

### SDK de Farcaster
El SDK se carga dinámicamente desde CDN en `public/farcaster-sdk.js`:

```javascript
// Carga el SDK solo en el cliente
import { sdk } from 'https://esm.sh/@farcaster/miniapp-sdk@0.1.4';
window.farcasterSDK = sdk;
```

### Meta Tags de Farcaster
Configurados en `src/app/layout.tsx`:

```html
<meta name="fc:miniapp" content='{
  "accountAssociation": { ... },
  "miniapp": { ... },
  "version": "next",
  "imageUrl": "...",
  "button": "Abrir ReMi"
}' />
```

## 📱 Flujo de Autenticación

### 1. **Detección Automática**
```javascript
const isInFarcaster = window.location.href.includes('farcaster.xyz') || 
                      window.navigator.userAgent.includes('Farcaster');
```

### 2. **Quick Auth**
```javascript
const response = await window.farcasterSDK.quickAuth.fetch('/api/me');
if (response.ok) {
  const user = await response.json();
  // Usuario autenticado
}
```

### 3. **Sign In Manual (fallback)**
```javascript
const nonce = Math.random().toString(36).substring(7);
await window.farcasterSDK.actions.signIn({ nonce });
```

## 🎯 Uso de los Componentes

### Hook de Autenticación
```javascript
import { useFarcasterAuth } from '../hooks/useFarcasterAuth';

const { user, loading, error, isAuthenticated, login, logout } = useFarcasterAuth();
```

### Componente de Perfil
```javascript
import { UserProfile } from '../components/UserProfile';

<UserProfile />
```

### Dashboard Completo
```javascript
import { FarcasterDashboard } from '../components/FarcasterDashboard';

<FarcasterDashboard />
```

## 🔗 URLs de Farcaster

### Mini App URL
```
https://farcaster.xyz/miniapps/Nf9G0Et26Mk9/remi---your-social-web3-schedule
```

### Frame URL
```
https://re-mi.vercel.app/api/frame
```

## 📊 Funcionalidades

### 1. **Compartir en Farcaster**
```javascript
const shareText = `¡Acabo de completar una tarea en ReMi! 🎉`;
await window.farcasterSDK.actions.share({
  text: shareText,
  url: 'https://re-mi.vercel.app/'
});
```

### 2. **Enviar Notificaciones**
```javascript
await window.farcasterSDK.actions.sendNotification({
  message: 'Nueva tarea completada',
  title: 'ReMi - Logro desbloqueado',
  body: '¡Felicidades! Has completado una tarea.'
});
```

### 3. **Navegación entre Apps**
```javascript
await window.farcasterSDK.actions.openUrl('https://farcaster.xyz/miniapps/...');
```

## 🛠️ Desarrollo

### Estructura de Archivos
```
├── hooks/
│   └── useFarcasterAuth.ts          # Hook de autenticación
├── components/
│   ├── FarcasterAuth.tsx            # Wrapper de autenticación
│   ├── UserProfile.tsx              # Perfil de usuario
│   ├── FarcasterDashboard.tsx       # Dashboard principal
│   └── FarcasterNotifications.tsx   # Notificaciones
├── src/app/api/
│   ├── me/route.ts                  # Endpoint de autenticación
│   └── frame/route.ts               # Endpoint de frames
└── public/
    └── farcaster-sdk.js             # Script del SDK
```

### Variables de Entorno
```env
# Farcaster Configuration
FARCASTER_APP_ID=your_app_id
FARCASTER_APP_SECRET=your_app_secret
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

## 📈 Próximos Pasos

1. **Implementar verificación real de tokens**
2. **Agregar más funcionalidades del SDK**
3. **Integrar con la API de Farcaster**
4. **Implementar notificaciones push**
5. **Agregar analytics de uso**

## 🔗 Recursos

- [Documentación de Farcaster Mini Apps](https://miniapps.farcaster.xyz/docs)
- [SDK de Farcaster](https://github.com/farcasterxyz/miniapp-sdk)
- [Guía de URLs](https://miniapps.farcaster.xyz/docs/guides/urls)
- [Quick Auth](https://miniapps.farcaster.xyz/docs/guides/quick-auth) 