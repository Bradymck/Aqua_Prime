import React, { useState, useEffect } from 'react';
import { useConfig } from '../ConfigProvider';
import { ethers } from 'ethers';
import { useAccount, useContractWrite, useContractRead } from 'wagmi';

interface SubscriptionManagerProps {
  onSubscriptionChange?: (isSubscribed: boolean) => void;
}

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({
  onSubscriptionChange
}) => {
  const { address } = useAccount();
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    isSubscribed: boolean;
    endTime: number;
    hasTrialClaimed: boolean;
  }>({
    isSubscribed: false,
    endTime: 0,
    hasTrialClaimed: false
  });

  const { data: subscriptionData } = useContractRead({
    address: process.env.NEXT_PUBLIC_SUBSCRIPTION_CONTRACT as `0x${string}`,
    abi: ['function subscriptions(address) view returns (uint256, uint256, bool, uint256)'],
    functionName: 'subscriptions',
    args: [address],
    watch: true
  });

  const { writeAsync: startTrial } = useContractWrite({
    address: process.env.NEXT_PUBLIC_SUBSCRIPTION_CONTRACT as `0x${string}`,
    abi: ['function startTrial()'],
    functionName: 'startTrial'
  });

  const { writeAsync: purchaseSubscription } = useContractWrite({
    address: process.env.NEXT_PUBLIC_SUBSCRIPTION_CONTRACT as `0x${string}`,
    abi: ['function purchaseSubscription(uint256)'],
    functionName: 'purchaseSubscription'
  });

  useEffect(() => {
    if (subscriptionData) {
      const [startTime, endTime, hasTrialClaimed, moonstoneAllowance] = subscriptionData;
      setSubscriptionStatus({
        isSubscribed: endTime.toNumber() > Date.now() / 1000,
        endTime: endTime.toNumber(),
        hasTrialClaimed: hasTrialClaimed
      });
    }
  }, [subscriptionData]);

  return (
    <div className="subscription-manager">
      {!subscriptionStatus.isSubscribed && !subscriptionStatus.hasTrialClaimed && (
        <div className="trial-offer">
          <h3>Start Your Free Trial</h3>
          <p>Get one AI companion and 100 Moonstone free!</p>
          <button 
            onClick={() => startTrial()}
            className="trial-button"
          >
            Start Trial
          </button>
        </div>
      )}
      
      {!subscriptionStatus.isSubscribed && subscriptionStatus.hasTrialClaimed && (
        <div className="subscription-offer">
          <h3>Continue Your Journey</h3>
          <p>Subscribe to unlock full access!</p>
          <div className="subscription-options">
            <button 
              onClick={() => purchaseSubscription({ args: [1] })}
              className="subscribe-button"
            >
              1 Month - 9.99 ETH
            </button>
            <button 
              onClick={() => purchaseSubscription({ args: [3] })}
              className="subscribe-button premium"
            >
              3 Months - 24.99 ETH
            </button>
          </div>
        </div>
      )}
      
      {subscriptionStatus.isSubscribed && (
        <div className="subscription-status">
          <h3>Active Subscription</h3>
          <p>Expires: {new Date(subscriptionStatus.endTime * 1000).toLocaleDateString()}</p>
        </div>
      )}
      
      <style jsx>{`
        .subscription-manager {
          padding: 1.5rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .trial-button, .subscribe-button {
          width: 100%;
          padding: 0.75rem;
          margin: 0.5rem 0;
          border-radius: 0.5rem;
          background: #6366f1;
          color: white;
          transition: all 0.3s ease;
        }
        .subscribe-button.premium {
          background: #4f46e5;
        }
        .subscription-status {
          text-align: center;
          color: #4f46e5;
        }
      `}</style>
    </div>
  );
}; 