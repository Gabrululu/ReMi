# ReMi - Social Agenda Web3

Una aplicación de agenda social con recompensas Web3, construida con Next.js, Tailwind CSS y Wagmi.

## 🚀 Características

- 📅 **Recordatorios personales y sociales**
- 💰 **Sistema de recompensas con tokens REMI**
- 🌟 **Construcción de reputación Web3**
- 🔗 **Conexión de wallet simplificada con Wagmi**
- 🌐 **Soporte para Base Sepolia y Celo Alfajores**
- 🐦 **Integración con Farcaster**

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Wagmi, Viem, Ethers.js
- **Blockchain**: Base Sepolia, Celo Alfajores
- **Smart Contracts**: Solidity, Hardhat

## 📦 Instalación

1. **Clona el repositorio**
```bash
git clone <repository-url>
cd remi-miniapp
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura las variables de entorno**
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# WalletConnect Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here

# Contract Addresses
NEXT_PUBLIC_REMI_TOKEN_BASE=0x2bd8AbEB2F5598f8477560C70c742aFfc22912de
NEXT_PUBLIC_REMI_TOKEN_CELO=0x321a83089D68c37c2Ee4Df00cC30B4D330f0399B

# Network RPC URLs
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://sepolia.base.org
NEXT_PUBLIC_CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
```

4. **Obtén tu Project ID de WalletConnect**
- Ve a [WalletConnect Cloud](https://cloud.walletconnect.com)
- Crea un nuevo proyecto
- Copia el Project ID y agrégalo a tu `.env.local`

5. **Ejecuta el servidor de desarrollo**
```bash
npm run dev
```

## 🔧 Configuración de Wallet Connection

La aplicación usa **Wagmi** para una experiencia de conexión de wallet moderna y confiable.

### Características de Wagmi:
- ✅ **Conexión simplificada** con múltiples wallets
- ✅ **Soporte para MetaMask** (injected connector)
- ✅ **Soporte para WalletConnect v2**
- ✅ **Cambio de redes automático**
- ✅ **UI/UX moderna y responsive**

### Conectores disponibles:
- **MetaMask** y otras wallets inyectadas
- **WalletConnect** para conexión móvil
- **Cambio automático de redes**

## 🌐 Redes Soportadas

### Base Sepolia
- **Chain ID**: 84532
- **RPC**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Contract**: `0x2bd8AbEB2F5598f8477560C70c742aFfc22912de`

### Celo Alfajores
- **Chain ID**: 44787
- **RPC**: https://alfajores-forno.celo-testnet.org
- **Explorer**: https://alfajores.celoscan.io
- **Contract**: `0x321a83089D68c37c2Ee4Df00cC30B4D330f0399B`

## 💡 Uso

1. **Conecta tu Wallet**
   - Haz clic en "Conectar Wallet"
   - Selecciona tu wallet preferida (MetaMask, WalletConnect, etc.)
   - Acepta la conexión

2. **Selecciona una Red**
   - Cambia entre Base Sepolia y Celo Alfajores
   - La aplicación automáticamente se adaptará a la red seleccionada

3. **Interactúa con la App**
   - Completa tareas para ganar tokens REMI
   - Construye tu reputación Web3
   - Comparte tus logros en Farcaster

## 🏗️ Estructura del Proyecto

```
remi-miniapp/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout principal con providers
│   │   ├── page.tsx            # Página principal
│   │   └── providers.tsx       # Providers de Wagmi
│   └── components/
│       ├── ConnectWallet.tsx   # Componente de conexión
│       └── UserStats.tsx       # Estadísticas del usuario
├── lib/
│   ├── appkit-config.ts        # Configuración de Wagmi
│   ├── contracts.ts            # Servicios de smart contracts
│   └── networks.ts             # Configuración de redes
└── contracts/
    └── RemiToken.sol           # Smart contract principal
```

## 🔗 Enlaces Útiles

- [Wagmi Documentation](https://wagmi.sh)
- [WalletConnect Cloud](https://cloud.walletconnect.com)
- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
- [Celo Alfajores Faucet](https://faucet.celo.org/alfajores)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:
- Revisa la [documentación de Wagmi](https://wagmi.sh)
- Abre un issue en el repositorio
- Contacta al equipo de desarrollo

---

**¡Disfruta construyendo tu reputación Web3 con ReMi!** 🚀
