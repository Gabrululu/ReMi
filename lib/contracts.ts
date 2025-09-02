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

// ABI for RemiProgress contract
const REMI_PROGRESS_ABI = [
  "function completeTask(uint256 taskId) external",
  "function completeGoal(uint256 goalId) external",
  "function bumpStreak() external",
  "function setMissionProgress(uint256 missionId, uint256 value) external",
  "function getProgreso(address user) external view returns (uint256 tareasCompletadas, uint256 metasCompletadas, uint256 rachaActual, uint256 ultimaFecha)",
  "function getProgresoMision(address user, uint256 missionId) external view returns (uint256)",
  "function getMisionSemanal(uint256 missionId) external view returns (string memory titulo, string memory descripcion, uint256 objetivo, uint256 recompensa, bool activa)",
  "function isTaskCompletedOnChain(address user, uint256 taskId) external view returns (bool)",
  "function setWeeklyMissions(uint256 weekId, string[] memory titulos, string[] memory descripciones, uint256[] memory objetivos, uint256[] memory recompensas) external",
  "function deactivateMission(uint256 missionId) external",
  "function resetUserStreak(address user) external",
  "event TaskCompleted(address indexed user, uint256 taskId, uint256 timestamp)",
  "event GoalCompleted(address indexed user, uint256 goalId, uint256 timestamp)",
  "event StreakUpdated(address indexed user, uint256 streak, uint256 timestamp)",
  "event MissionProgressed(address indexed user, uint256 missionId, uint256 value, uint256 timestamp)",
  "event WeeklyMissionsSet(uint256 weekId, uint256 timestamp)",
  "event UserRegistered(address indexed user, uint256 timestamp)"
];

// Contract addresses (deployed contracts)
const CONTRACT_ADDRESSES = {
  baseSepolia: {
    remiToken: process.env.NEXT_PUBLIC_REMI_TOKEN_BASE || "0x56018a39f418C8e4b138648e2D307F137b2Ec3d8",
    remiProgress: process.env.NEXT_PUBLIC_REMI_PROGRESS_BASE || "0xa89fb8A3f72C77cA15cfb8a1903f6Ef4D48bed82"
  },
  celoAlfajores: {
    remiToken: process.env.NEXT_PUBLIC_REMI_TOKEN_CELO || "0x321a83089D68c37c2Ee4Df00cC30B4D330f0399B",
    remiProgress: process.env.NEXT_PUBLIC_REMI_PROGRESS_CELO || "0x0000000000000000000000000000000000000000" // Placeholder
  }
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

export interface ProgressStats {
  tareasCompletadas: number;
  metasCompletadas: number;
  rachaActual: number;
  ultimaFecha: number;
}

export interface MisionSemanal {
  titulo: string;
  descripcion: string;
  objetivo: number;
  recompensa: number;
  activa: boolean;
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
      CONTRACT_ADDRESSES[network].remiToken,
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
    return CONTRACT_ADDRESSES[this.network].remiToken;
  }

  /**
   * Get network name
   */
  getNetwork(): string {
    return this.network;
  }
}

export class RemiProgressService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract;
  private network: 'baseSepolia' | 'celoAlfajores';

  constructor(network: 'baseSepolia' | 'celoAlfajores') {
    this.network = network;
    this.provider = new ethers.JsonRpcProvider(RPC_URLS[network]);
    this.contract = new ethers.Contract(
      CONTRACT_ADDRESSES[network].remiProgress,
      REMI_PROGRESS_ABI,
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
   * Complete a task on-chain (progress tracking)
   */
  async completeTask(taskId: number): Promise<boolean> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const tx = await this.contract.completeTask(taskId);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error completing task on-chain:', error);
      return false;
    }
  }

  /**
   * Complete a goal on-chain (progress tracking)
   */
  async completeGoal(goalId: number): Promise<boolean> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const tx = await this.contract.completeGoal(goalId);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error completing goal on-chain:', error);
      return false;
    }
  }

  /**
   * Bump user streak (once per day)
   */
  async bumpStreak(): Promise<boolean> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const tx = await this.contract.bumpStreak();
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error bumping streak:', error);
      return false;
    }
  }

  /**
   * Set mission progress
   */
  async setMissionProgress(missionId: number, value: number): Promise<boolean> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const tx = await this.contract.setMissionProgress(missionId, value);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error setting mission progress:', error);
      return false;
    }
  }

  /**
   * Get user progress stats
   */
  async getProgreso(userAddress: string): Promise<ProgressStats | null> {
    try {
      const stats = await this.contract.getProgreso(userAddress);
      return {
        tareasCompletadas: Number(stats[0]),
        metasCompletadas: Number(stats[1]),
        rachaActual: Number(stats[2]),
        ultimaFecha: Number(stats[3])
      };
    } catch (error) {
      console.error('Error getting progress:', error);
      return null;
    }
  }

  /**
   * Get mission progress for user
   */
  async getProgresoMision(userAddress: string, missionId: number): Promise<number> {
    try {
      const progreso = await this.contract.getProgresoMision(userAddress, missionId);
      return Number(progreso);
    } catch (error) {
      console.error('Error getting mission progress:', error);
      return 0;
    }
  }

  /**
   * Get weekly mission info
   */
  async getMisionSemanal(missionId: number): Promise<MisionSemanal | null> {
    try {
      const mision = await this.contract.getMisionSemanal(missionId);
      return {
        titulo: mision[0],
        descripcion: mision[1],
        objetivo: Number(mision[2]),
        recompensa: Number(mision[3]),
        activa: mision[4]
      };
    } catch (error) {
      console.error('Error getting weekly mission:', error);
      return null;
    }
  }

  /**
   * Check if task was completed on-chain
   */
  async isTaskCompletedOnChain(userAddress: string, taskId: number): Promise<boolean> {
    try {
      return await this.contract.isTaskCompletedOnChain(userAddress, taskId);
    } catch (error) {
      console.error('Error checking task completion:', error);
      return false;
    }
  }

  /**
   * Get contract address
   */
  getContractAddress(): string {
    return CONTRACT_ADDRESSES[this.network].remiProgress;
  }

  /**
   * Get network name
   */
  getNetwork(): string {
    return this.network;
  }
}

// Factory functions to create contract services
export function createRemiContract(network: 'baseSepolia' | 'celoAlfajores'): RemiContractService {
  return new RemiContractService(network);
}

export function createRemiProgressContract(network: 'baseSepolia' | 'celoAlfajores'): RemiProgressService {
  return new RemiProgressService(network);
}

// Utility function to get network info
export function getNetworkInfo(network: 'baseSepolia' | 'celoAlfajores') {
  return {
    name: network === 'baseSepolia' ? 'Base Sepolia' : 'Celo Alfajores',
    chainId: network === 'baseSepolia' ? 84532 : 44787,
    rpcUrl: RPC_URLS[network],
    contractAddresses: CONTRACT_ADDRESSES[network],
    explorer: network === 'baseSepolia' 
      ? 'https://sepolia.basescan.org' 
      : 'https://alfajores.celoscan.io'
  };
} 