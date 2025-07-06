import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';

export interface WalletConnectConfig {
  projectId: string;
  chains: number[];
  showQrModal?: boolean;
}

export class WalletConnectService {
  private provider: any = null;
  private config: WalletConnectConfig;

  constructor(config: WalletConnectConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    try {
      this.provider = await EthereumProvider.init({
        projectId: this.config.projectId,
        chains: this.config.chains,
        optionalChains: this.config.chains as [number, ...number[]],
        showQrModal: this.config.showQrModal ?? true,
        metadata: {
          name: 'ReMi - Social Agenda Web3',
          description: 'Tu agenda social con recompensas Web3',
          url: 'https://remi-app.vercel.app',
          icons: ['https://remi-app.vercel.app/icon.png'],
        },
      } as any);

      // Set up event listeners
      this.setupEventListeners();
    } catch (error) {
      console.error('Error initializing WalletConnect:', error);
      throw error;
    }
  }

  private setupEventListeners(): void {
    if (!this.provider) return;

    this.provider.on('connect', (params) => {
      console.log('WalletConnect connected:', params);
    });

    this.provider.on('disconnect', (params) => {
      console.log('WalletConnect disconnected:', params);
    });

    this.provider.on('chainChanged', (chainId) => {
      console.log('Chain changed:', chainId);
    });

    this.provider.on('accountsChanged', (accounts) => {
      console.log('Accounts changed:', accounts);
    });
  }

  async connect(): Promise<string[]> {
    if (!this.provider) {
      throw new Error('WalletConnect not initialized');
    }

    try {
      const accounts = await this.provider.connect();
      return accounts;
    } catch (error) {
      console.error('Error connecting to WalletConnect:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.provider) {
      throw new Error('WalletConnect not initialized');
    }

    try {
      await this.provider.disconnect();
    } catch (error) {
      console.error('Error disconnecting from WalletConnect:', error);
      throw error;
    }
  }

  async signMessage(message: string, address: string): Promise<string> {
    if (!this.provider) {
      throw new Error('WalletConnect not initialized');
    }

    try {
      const signature = await this.provider.request({
        method: 'personal_sign',
        params: [message, address],
      });
      return signature as string;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  }

  async sendTransaction(transaction: any): Promise<string> {
    if (!this.provider) {
      throw new Error('WalletConnect not initialized');
    }

    try {
      const hash = await this.provider.request({
        method: 'eth_sendTransaction',
        params: [transaction],
      });
      return hash as string;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  getProvider(): any {
    return this.provider;
  }

  isConnected(): boolean {
    return this.provider?.connected ?? false;
  }

  getAccounts(): string[] {
    return this.provider?.accounts ?? [];
  }

  getChainId(): number {
    return this.provider?.chainId ?? 1;
  }
}

// Create a singleton instance
let walletConnectService: WalletConnectService | null = null;

export function createWalletConnectService(config: WalletConnectConfig): WalletConnectService {
  if (!walletConnectService) {
    walletConnectService = new WalletConnectService(config);
  }
  return walletConnectService;
}

export function getWalletConnectService(): WalletConnectService | null {
  return walletConnectService;
} 