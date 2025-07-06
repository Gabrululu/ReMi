# ReMi Token - Deployment Information

## Contract Addresses

### Base Sepolia Testnet
- **Contract Address**: `0x2bd8AbEB2F5598f8477560C70c742aFfc22912de`
- **Network**: Base Sepolia
- **Chain ID**: 84532
- **Explorer**: https://sepolia.basescan.org/address/0x2bd8AbEB2F5598f8477560C70c742aFfc22912de
- **Deployed**: 2025-07-06T04:14:39.735Z
- **Status**: ✅ Verified

### Celo Alfajores Testnet
- **Contract Address**: `0x321a83089D68c37c2Ee4Df00cC30B4D330f0399B`
- **Network**: Celo Alfajores
- **Chain ID**: 44787
- **Explorer**: https://alfajores.celoscan.io/address/0x321a83089D68c37c2Ee4Df00cC30B4D330f0399B
- **Deployed**: 2025-07-06T05:55:40.109Z
- **Status**: ✅ Verified

## Environment Variables

Add these to your `.env.local` file:

```env
# Contract Addresses
NEXT_PUBLIC_REMI_TOKEN_BASE=0x2bd8AbEB2F5598f8477560C70c742aFfc22912de
NEXT_PUBLIC_REMI_TOKEN_CELO=0x321a83089D68c37c2Ee4Df00cC30B4D330f0399B

# RPC URLs
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://sepolia.base.org
NEXT_PUBLIC_CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
```

## Contract Features

### Token Information
- **Name**: ReMi Token
- **Symbol**: REMI
- **Decimals**: 18

### Reward System
- **Base Task Reward**: 10 REMI
- **Priority Multipliers**:
  - LOW: 1x (10 REMI)
  - MEDIUM: 2x (20 REMI)
  - HIGH: 3x (30 REMI)
  - URGENT: 5x (50 REMI)

### Bonus Rewards
- **Farcaster Share**: 5 REMI
- **Weekly Goal**: 100 REMI
- **Streak Bonuses**:
  - 3-6 days: +10 REMI
  - 7-13 days: +20 REMI
  - 14-29 days: +30 REMI
  - 30+ days: +50 REMI

## Network Configuration

### Base Sepolia
- **RPC URL**: https://sepolia.base.org
- **Chain ID**: 84532
- **Currency**: ETH
- **Block Explorer**: https://sepolia.basescan.org

### Celo Alfajores
- **RPC URL**: https://alfajores-forno.celo-testnet.org
- **Chain ID**: 44787
- **Currency**: CELO
- **Block Explorer**: https://alfajores.celoscan.io

## Testing the Contract

### Complete a Task
```javascript
// Complete a task with HIGH priority
await contract.completeTask(1, "HIGH");
```

### Share on Farcaster
```javascript
// Get reward for sharing
await contract.rewardFarcasterShare();
```

### Complete Weekly Goal
```javascript
// Complete weekly goal
await contract.completeWeeklyGoal(1);
```

### Check User Stats
```javascript
// Get user statistics
const stats = await contract.getUserStats(userAddress);
console.log("Tasks completed:", stats.tasksCompleted);
console.log("Current streak:", stats.streak);
console.log("Balance:", stats.balance);
console.log("Weekly goals:", stats.weeklyGoals);
```

## Next Steps

1. ✅ Deploy contracts to testnets
2. ✅ Verify contracts on block explorers
3. 🔄 Update frontend with contract addresses
4. 🔄 Test contract interactions
5. 🔄 Integrate with Farcaster API
6. 🔄 Deploy frontend to production 