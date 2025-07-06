import { ethers } from 'ethers';

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// ABI for RemiToken contract (simplified for the main functions)
const REMI_TOKEN_ABI = [
  "function completeTask(uint256 taskId, string memory priority) external",
  "function rewardFarcasterShare() external",
  "function completeWeeklyGoal(uint256 goalId) external",
  "function getUserStats(address user) external view returns (uint256 tasksCompleted, uint256 streak, uint256 balance, uint256 weeklyGoals)",
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "event TaskCompleted(address indexed user, uint256 taskId, uint256 reward)",
  "event StreakBonus(address indexed user, uint256 streak, uint256 bonus)",
  "event FarcasterShare(address indexed user, uint256 reward)",
  "event WeeklyGoal(address indexed user, uint256 goalId, uint256 reward)"
];

// Contract addresses (deployed contracts)
const CONTRACT_ADDRESSES = {
  baseSepolia: process.env.NEXT_PUBLIC_REMI_TOKEN_BASE || "0x2bd8AbEB2F5598f8477560C70c742aFfc22912de",
  celoAlfajores: process.env.NEXT_PUBLIC_REMI_TOKEN_CELO || "0x321a83089D68c37c2Ee4Df00cC30B4D330f0399B"
};

// RPC URLs
const RPC_URLS = {
  baseSepolia: "https://sepolia.base.org",
  celoAlfajores: "https://alfajores-forno.celo-testnet.org"
};

export interface UserStats {
  tasksCompleted: number;
  streak: number;
  balance: number;
  weeklyGoals: number;
}

export interface TaskCompletionResult {
  success: boolean;
  reward: number;
  transactionHash?: string;
  error?: string;
}

export class RemiContractService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract;
  private network: 'baseSepolia' | 'celoAlfajores';

  constructor(network: 'baseSepolia' | 'celoAlfajores') {
    this.network = network;
    this.provider = new ethers.JsonRpcProvider(RPC_URLS[network]);
    this.contract = new ethers.Contract(
      CONTRACT_ADDRESSES[network],
      REMI_TOKEN_ABI,
      this.provider
    );
  }

  /**
   * Connect wallet to the contract
   */
  async connectWallet(): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.signer = await this.provider.getSigner();
        this.contract = this.contract.connect(this.signer) as ethers.Contract;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return false;
    }
  }

  /**
   * Complete a task and receive rewards
   */
  async completeTask(taskId: number, priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'): Promise<TaskCompletionResult> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const tx = await this.contract.completeTask(taskId, priority);
      const receipt = await tx.wait();

      // Get the reward from the event
      const signerAddress = await this.signer!.getAddress();
      const event = receipt.logs.find((log: any) => 
        log.eventName === 'TaskCompleted' && 
        log.args.user.toLowerCase() === signerAddress.toLowerCase()
      );

      const reward = event ? Number(event.args.reward) : 0;

      return {
        success: true,
        reward,
        transactionHash: receipt.hash
      };
    } catch (error) {
      console.error('Error completing task:', error);
      return {
        success: false,
        reward: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Reward for sharing on Farcaster
   */
  async rewardFarcasterShare(): Promise<TaskCompletionResult> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const tx = await this.contract.rewardFarcasterShare();
      const receipt = await tx.wait();

      return {
        success: true,
        reward: 5, // FARCASTER_SHARE_REWARD
        transactionHash: receipt.hash
      };
    } catch (error) {
      console.error('Error rewarding Farcaster share:', error);
      return {
        success: false,
        reward: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Complete weekly goal
   */
  async completeWeeklyGoal(goalId: number): Promise<TaskCompletionResult> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const tx = await this.contract.completeWeeklyGoal(goalId);
      const receipt = await tx.wait();

      return {
        success: true,
        reward: 100, // WEEKLY_GOAL_REWARD
        transactionHash: receipt.hash
      };
    } catch (error) {
      console.error('Error completing weekly goal:', error);
      return {
        success: false,
        reward: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(userAddress: string): Promise<UserStats | null> {
    try {
      const stats = await this.contract.getUserStats(userAddress);
      return {
        tasksCompleted: Number(stats[0]),
        streak: Number(stats[1]),
        balance: Number(stats[2]),
        weeklyGoals: Number(stats[3])
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return null;
    }
  }

  /**
   * Get token balance
   */
  async getBalance(userAddress: string): Promise<number> {
    try {
      const balance = await this.contract.balanceOf(userAddress);
      return Number(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      return 0;
    }
  }

  /**
   * Transfer tokens
   */
  async transfer(toAddress: string, amount: number): Promise<boolean> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const tx = await this.contract.transfer(toAddress, amount);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error transferring tokens:', error);
      return false;
    }
  }

  /**
   * Get contract address
   */
  getContractAddress(): string {
    return CONTRACT_ADDRESSES[this.network];
  }

  /**
   * Get network name
   */
  getNetwork(): string {
    return this.network;
  }
}

// Factory function to create contract service
export function createRemiContract(network: 'baseSepolia' | 'celoAlfajores'): RemiContractService {
  return new RemiContractService(network);
}

// Utility function to get network info
export function getNetworkInfo(network: 'baseSepolia' | 'celoAlfajores') {
  return {
    name: network === 'baseSepolia' ? 'Base Sepolia' : 'Celo Alfajores',
    chainId: network === 'baseSepolia' ? 84532 : 44787,
    rpcUrl: RPC_URLS[network],
    contractAddress: CONTRACT_ADDRESSES[network],
    explorer: network === 'baseSepolia' 
      ? 'https://sepolia.basescan.org' 
      : 'https://alfajores.celoscan.io'
  };
} 