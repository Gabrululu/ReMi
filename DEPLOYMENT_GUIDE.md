# 🚀 ReMi Smart Contract Deployment Guide

Este documento te guía a través del proceso de despliegue de los contratos inteligentes de ReMi en Base y Celo testnets.

## 📋 Prerrequisitos

### **1. Configuración de Wallet**
- MetaMask instalado
- Cuenta con ETH en Base Sepolia testnet
- Cuenta con CELO en Celo Alfajores testnet

### **2. Obtener Testnet Tokens**
- **Base Sepolia**: [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
- **Celo Alfajores**: [Celo Faucet](https://faucet.celo.org/alfajores)

### **3. API Keys Necesarias**
- [Basescan API Key](https://basescan.org/apis)
- [Celoscan API Key](https://celoscan.io/apis)

## 🔧 Configuración Inicial

### **1. Instalar Dependencias**
```bash
npm install
```

### **2. Configurar Variables de Entorno**
Crea un archivo `.env.local` basado en `.env.example`:

```env
# Deployment
PRIVATE_KEY=tu_private_key_sin_0x
BASESCAN_API_KEY=tu_basescan_api_key
CELOSCAN_API_KEY=tu_celoscan_api_key

# RPC URLs
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
CELO_ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org

# Contract addresses (se actualizarán después del deployment)
NEXT_PUBLIC_REMI_TOKEN_BASE=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_REMI_TOKEN_CELO=0x0000000000000000000000000000000000000000
```

### **3. Compilar Contratos**
```bash
npm run compile
```

## 🚀 Proceso de Deployment

### **Opción 1: Deployment Automático (Recomendado)**
```bash
# Desplegar a ambas redes
npm run deploy:all
```

### **Opción 2: Deployment Individual**
```bash
# Solo Base Sepolia
npm run deploy:base

# Solo Celo Alfajores
npm run deploy:celo
```

### **Opción 3: Deployment Manual**
```bash
# Base Sepolia
npx hardhat run scripts/deploy.ts --network baseSepolia

# Celo Alfajores
npx hardhat run scripts/deploy.ts --network celoAlfajores
```

## ✅ Verificación de Contratos

### **Verificación Automática**
Los contratos se verifican automáticamente durante el deployment.

### **Verificación Manual**
```bash
# Base Sepolia
npx hardhat verify --network baseSepolia 0xCONTRACT_ADDRESS

# Celo Alfajores
npx hardhat verify --network celoAlfajores 0xCONTRACT_ADDRESS
```

## 📊 Resultados del Deployment

Después del deployment exitoso, verás algo como:

```
🚀 Deploying ReMi Token contracts...

📦 Deploying to Base Sepolia...
✅ ReMi Token deployed to Base Sepolia: 0x1234...5678

📦 Deploying to Celo Alfajores...
✅ ReMi Token deployed to Celo Alfajores: 0x8765...4321

🔍 Verifying contracts...
✅ Base Sepolia contract verified
✅ Celo Alfajores contract verified

🎉 Deployment completed!
Base Sepolia: 0x1234...5678
Celo Alfajores: 0x8765...4321
📄 Deployment info saved to deployment.json
```

## 🔄 Actualizar Variables de Entorno

Después del deployment, actualiza tu `.env.local`:

```env
NEXT_PUBLIC_REMI_TOKEN_BASE=0x1234...5678
NEXT_PUBLIC_REMI_TOKEN_CELO=0x8765...4321
```

## 🧪 Testing

### **Ejecutar Tests**
```bash
npm run test
```

### **Cobertura de Tests**
```bash
npm run coverage
```

## 🔍 Verificar en Exploradores

### **Base Sepolia**
- [Base Sepolia Explorer](https://sepolia.basescan.org)
- Busca tu dirección de contrato

### **Celo Alfajores**
- [Celo Alfajores Explorer](https://alfajores.celoscan.io)
- Busca tu dirección de contrato

## 💰 Funciones del Contrato

### **Funciones Principales**
- `completeTask(taskId, priority)` - Completar tarea y recibir recompensa
- `rewardFarcasterShare()` - Recompensa por compartir en Farcaster
- `completeWeeklyGoal(goalId)` - Completar meta semanal
- `getUserStats(user)` - Obtener estadísticas del usuario

### **Recompensas**
- **Tarea Baja**: 10 REMI
- **Tarea Media**: 20 REMI
- **Tarea Alta**: 30 REMI
- **Tarea Urgente**: 50 REMI
- **Compartir Farcaster**: 5 REMI
- **Meta Semanal**: 100 REMI
- **Bonus de Racha**: Hasta 50 REMI extra

## 🛠️ Troubleshooting

### **Error: Insufficient Funds**
```bash
# Obtener más tokens de testnet
# Base Sepolia: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
# Celo Alfajores: https://faucet.celo.org/alfajores
```

### **Error: Network Not Found**
```bash
# Verificar que MetaMask tenga las redes configuradas
# Base Sepolia: Chain ID 84532
# Celo Alfajores: Chain ID 44787
```

### **Error: Contract Verification Failed**
```bash
# Verificar manualmente en el explorador
# O reintentar con: npm run verify:base
```

## 📝 Notas Importantes

1. **Seguridad**: Nunca compartas tu PRIVATE_KEY
2. **Backup**: Guarda las direcciones de contrato en un lugar seguro
3. **Testing**: Siempre prueba en testnet antes de mainnet
4. **Gas**: Mantén suficiente ETH/CELO para gas fees

## 🔗 Enlaces Útiles

- [Base Documentation](https://docs.base.org/)
- [Celo Documentation](https://docs.celo.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

---

**¡Tu contrato ReMi está listo para ser usado! 🎉** 