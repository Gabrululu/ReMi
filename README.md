# ReMi - Social Agenda Web3

Una aplicación de agenda social con recompensas Web3, construida con Next.js, Tailwind CSS y Wagmi.

## 🚀 Características

- 📅 **Recordatorios personales y sociales**
- 💰 **Sistema de recompensas con tokens REMI**
- 🌟 **Construcción de reputación Web3**
- 🔗 **Conexión de wallet simplificada con Wagmi**
- 🌐 **Soporte para Base Sepolia y Celo Alfajores**
- 🐦 **Integración con Farcaster**
- 📊 **Tracking on-chain de progreso y reputación**

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
NEXT_PUBLIC_REMI_TOKEN_BASE=0x56018a39f418C8e4b138648e2D307F137b2Ec3d8
NEXT_PUBLIC_REMI_TOKEN_CELO=0x321a83089D68c37c2Ee4Df00cC30B4D330f0399B
NEXT_PUBLIC_REMI_PROGRESS_BASE=0xa89fb8A3f72C77cA15cfb8a1903f6Ef4D48bed82
NEXT_PUBLIC_REMI_PROGRESS_CELO=0x0000000000000000000000000000000000000000

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
- **RemiToken**: `0x56018a39f418C8e4b138648e2D307F137b2Ec3d8`
- **RemiProgress**: `0xa89fb8A3f72C77cA15cfb8a1903f6Ef4D48bed82`

### Celo Alfajores
- **Chain ID**: 44787
- **RPC**: https://alfajores-forno.celo-testnet.org
- **Explorer**: https://alfajores.celoscan.io
- **RemiToken**: `0x321a83089D68c37c2Ee4Df00cC30B4D330f0399B`
- **RemiProgress**: `0x0000000000000000000000000000000000000000` (pendiente de deploy)

## 📊 Smart Contracts

### RemiToken.sol
- **Propósito**: Token ERC20 para recompensas
- **Funciones**: `completeTask()`, `completeWeeklyGoal()`, `rewardFarcasterShare()`
- **Eventos**: `TaskCompleted`, `StreakBonus`, `FarcasterShare`, `WeeklyGoal`

### RemiProgress.sol
- **Propósito**: Tracking on-chain de progreso y reputación
- **Funciones**: `completeTask()`, `completeGoal()`, `bumpStreak()`, `setMissionProgress()`
- **Eventos**: `TaskCompleted`, `GoalCompleted`, `StreakUpdated`, `MissionProgressed`
- **Características**: Misiones semanales, rachas diarias, métricas verificables

## 🚀 Deploy de Contratos

### Comandos de Deploy
```bash
# Deploy en Base Sepolia
npx hardhat run scripts/deploy.ts --network baseSepolia

# Deploy en Celo Alfajores
npx hardhat run scripts/deploy.ts --network celoAlfajores
```

### Verificación de Contratos
```bash
# Verificar en Base Sepolia
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS>

# Verificar en Celo Alfajores
npx hardhat verify --network celoAlfajores <CONTRACT_ADDRESS>
```

## 💡 Uso

1. **Conecta tu Wallet**
   - Haz clic en "Conectar Wallet"
   - Selecciona tu wallet preferida (MetaMask, WalletConnect, etc.)
   - Acepta la conexión

2. **Selecciona una Red**
   - Cambia entre Base Sepolia y Celo Alfajores
   - La aplicación automáticamente se adaptará a la red seleccionada

3. **Crea y Completa Tareas**
   - Las tareas se guardan localmente para UX rápida
   - El progreso se registra on-chain en background
   - Recibe tokens REMI por completar tareas

4. **Gestiona Metas Semanales**
   - Establece objetivos semanales
   - El progreso se sincroniza con el contrato de reputación
   - Comparte logros en Farcaster

5. **Mantén tu Racha**
   - Haz check-in diario para mantener tu racha
   - Las rachas se verifican on-chain
   - Recibe bonificaciones por consistencia

## 🔍 Tracking On-Chain

La aplicación implementa un sistema híbrido:

- **Optimistic UI**: Las acciones se reflejan inmediatamente en la UI
- **Background Sync**: El progreso se registra on-chain sin bloquear la experiencia
- **Fallback Graceful**: Si falla la transacción on-chain, se mantiene el estado local
- **Verificación**: Los usuarios pueden ver qué datos están verificados on-chain

## 📈 Métricas Verificables

- ✅ Tareas completadas
- 🎯 Metas semanales alcanzadas
- 🔥 Rachas diarias mantenidas
- 📊 Progreso en misiones semanales
- 💰 Tokens REMI ganados

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.
