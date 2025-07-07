# 🔒 Seguridad de Farcaster Mini App

## ⚠️ **IMPORTANTE: Datos Sensibles**

Los datos en `accountAssociation` del manifest de Farcaster **SON SENSIBLES** y contienen:

- **FID (Farcaster ID)** de tu cuenta
- **Clave privada** o información de autenticación  
- **Firma digital** que prueba la propiedad del dominio

## 🚨 **NUNCA expongas estos datos en repositorios públicos**

### Datos Sensibles:
```json
{
  "accountAssociation": {
    "header": "eyJmaWQiOjQ3MzYyNiwidHlwZSI6ImF1dGgiLCJrZXkiOiIweGUzNzRDZDdDRGFDQmRkYzlmMjhFQkIzMjU2NTU4Mjk0ZWJkMEE0RUIifQ",
    "payload": "eyJkb21haW4iOiJyZS1taS52ZXJjZWwuYXBwIn0", 
    "signature": "mHa+YYxvJkorqP5CnUAE6O64m9QNsRW9/iPRUpGynNBBoQ5ZVW5+B+AN8mQzaf1x5uswsJktFLaPM/7PMz7+Ohw="
  }
}
```

## 🔧 **Configuración Segura**

### 1. **Variables de Entorno**
Crea un archivo `.env.local` (ya está en .gitignore):

```env
# Farcaster Mini App Configuration
NEXT_PUBLIC_FARCASTER_HEADER="tu_header_aqui"
NEXT_PUBLIC_FARCASTER_PAYLOAD="tu_payload_aqui"
NEXT_PUBLIC_FARCASTER_SIGNATURE="tu_signature_aqui"

# Neynar API Configuration
NEYNAR_API_KEY="tu_neynar_api_key_aqui"
NEYNAR_SIGNER_UUID="tu_neynar_signer_uuid_aqui"
```

### 2. **Obtener los Valores**
1. Ve a la [herramienta de manifest de Farcaster](https://farcaster.xyz/manifest)
2. Ingresa tu dominio
3. Haz clic en "Claim Ownership"
4. Firma con tu cuenta de Farcaster
5. Copia los valores del manifest resultante

### 3. **Configurar en Producción**
- **Vercel**: Agrega las variables en Settings > Environment Variables
- **Otros hosts**: Configura las variables de entorno del servidor

## 🛡️ **Buenas Prácticas**

1. **NUNCA** commits datos sensibles
2. **SIEMPRE** usa variables de entorno
3. **VERIFICA** que .env.local esté en .gitignore
4. **ROTA** las claves regularmente
5. **MONITOREA** el uso de tu cuenta

## 🔍 **Verificación**

Para verificar que todo está configurado correctamente:

1. El archivo `.env.local` existe y tiene los valores correctos
2. El archivo `.env.local` NO está en el repositorio
3. Las variables se cargan correctamente en la app
4. La autenticación funciona en Farcaster

## 📞 **Soporte**

Si sospechas que tus datos han sido comprometidos:
1. Cambia inmediatamente tu clave de Farcaster
2. Regenera el manifest
3. Actualiza las variables de entorno
4. Revisa el historial de commits 