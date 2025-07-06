'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { createRemiContract, RemiContractService, UserStats, TaskCompletionResult } from '@/lib/contracts';

export function useRemiContract() {
  const { address } = useAccount();
  const chainId = useChainId();
  const [contractService, setContractService] = useState<RemiContractService | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine network based on current chain
  const getCurrentNetwork = useCallback(() => {
    if (!chainId) return 'baseSepolia';
    
    switch (chainId) {
      case 84532: // Base Sepolia
        return 'baseSepolia';
      case 44787: // Celo Alfajores
        return 'celoAlfajores';
      default:
        return 'baseSepolia';
    }
  }, [chainId]);

  // Initialize contract service
  useEffect(() => {
    const network = getCurrentNetwork();
    const service = createRemiContract(network);
    setContractService(service);
  }, [getCurrentNetwork]);

  // Load user stats when address changes
  useEffect(() => {
    if (contractService && address) {
      loadUserStats();
      loadBalance();
    }
  }, [contractService, address]);

  const loadUserStats = useCallback(async () => {
    if (!contractService || !address) return;

    try {
      setIsLoading(true);
      setError(null);
      const stats = await contractService.getUserStats(address);
      setUserStats(stats);
    } catch (err) {
      setError('Error loading user stats');
      console.error('Error loading user stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [contractService, address]);

  const loadBalance = useCallback(async () => {
    if (!contractService || !address) return;

    try {
      const userBalance = await contractService.getBalance(address);
      setBalance(userBalance);
    } catch (err) {
      console.error('Error loading balance:', err);
    }
  }, [contractService, address]);

  const completeTask = useCallback(async (taskId: number, priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'): Promise<TaskCompletionResult> => {
    if (!contractService) {
      return { success: false, reward: 0, error: 'Contract not initialized' };
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await contractService.completeTask(taskId, priority);
      
      if (result.success) {
        // Reload stats after successful completion
        await loadUserStats();
        await loadBalance();
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, reward: 0, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [contractService, loadUserStats, loadBalance]);

  const rewardFarcasterShare = useCallback(async (): Promise<TaskCompletionResult> => {
    if (!contractService) {
      return { success: false, reward: 0, error: 'Contract not initialized' };
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await contractService.rewardFarcasterShare();
      
      if (result.success) {
        await loadBalance();
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, reward: 0, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [contractService, loadBalance]);

  const completeWeeklyGoal = useCallback(async (goalId: number): Promise<TaskCompletionResult> => {
    if (!contractService) {
      return { success: false, reward: 0, error: 'Contract not initialized' };
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await contractService.completeWeeklyGoal(goalId);
      
      if (result.success) {
        await loadUserStats();
        await loadBalance();
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, reward: 0, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [contractService, loadUserStats, loadBalance]);

  const transfer = useCallback(async (toAddress: string, amount: number): Promise<boolean> => {
    if (!contractService) return false;

    try {
      setIsLoading(true);
      setError(null);
      
      const success = await contractService.transfer(toAddress, amount);
      
      if (success) {
        await loadBalance();
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [contractService, loadBalance]);

  const refresh = useCallback(() => {
    if (address) {
      loadUserStats();
      loadBalance();
    }
  }, [address, loadUserStats, loadBalance]);

  return {
    // State
    userStats,
    balance,
    isLoading,
    error,
    
    // Actions
    completeTask,
    rewardFarcasterShare,
    completeWeeklyGoal,
    transfer,
    refresh,
    
    // Info
    network: getCurrentNetwork(),
    contractAddress: contractService?.getContractAddress(),
    isConnected: !!address,
  };
} 