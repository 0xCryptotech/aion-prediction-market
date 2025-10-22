import React from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Wallet, Copy, LogOut, ExternalLink } from 'lucide-react';

const ConnectWallet = () => {
  const { account, balance, aionBalance, connect, disconnect, isConnecting, isConnected } = useWallet();

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(account);
    // You can add a toast notification here
  };

  if (!isConnected) {
    return (
      <Button
        onClick={connect}
        disabled={isConnecting}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        data-testid="connect-wallet-btn"
      >
        <Wallet className="mr-2 h-4 w-4" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-purple-500/50 hover:border-purple-500"
          data-testid="wallet-menu-trigger"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {truncateAddress(account)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80" data-testid="wallet-dropdown">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium leading-none">Your Wallet</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{truncateAddress(account)}</p>
              <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-6 w-6 p-0">
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">ETH Balance</span>
            <span className="text-sm font-medium">{balance ? parseFloat(balance).toFixed(4) : '0.00'} ETH</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">AION Balance</span>
            <span className="text-sm font-medium text-purple-600">
              {aionBalance ? aionBalance.aion_balance.toLocaleString() : '0'} AION
            </span>
          </div>
          {aionBalance && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Staked</span>
                <span className="text-sm font-medium">{aionBalance.staked_amount.toLocaleString()} AION</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Earned Rewards</span>
                <span className="text-sm font-medium text-green-600">
                  {aionBalance.earned_rewards.toLocaleString()} AION
                </span>
              </div>
            </>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => window.open(`https://etherscan.io/address/${account}`, '_blank')}
          className="cursor-pointer"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={disconnect} className="cursor-pointer text-red-600" data-testid="disconnect-wallet">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConnectWallet;