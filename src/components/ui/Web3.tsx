import { useState } from 'react';
import Inheritance from './Inheritance';

const Web3 = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
    const [showInheritance, setShowInheritance] = useState(false);

  const connectWallet = () => {
    setIsConnected(true);
  };

  const mintRoom = () => {
    setIsMinting(true);
    setTimeout(() => {
      setIsMinting(false);
      alert('Room minted successfully!');
    }, 2000);
  };

  const setupInheritance = () => {
    setShowInheritance(true);
  };

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-4">
      {isConnected ? (
        <div className="flex flex-col items-end p-4 bg-base-200 rounded-lg shadow-lg">
          <p className="font-bold">Wallet Connected</p>
          <p>Balance: 0.5 ETH</p>
          <p>NFTs: 3</p>
        </div>
      ) : (
        <button className="btn btn-primary" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
      <button className="btn btn-secondary" onClick={mintRoom} disabled={!isConnected || isMinting}>
        {isMinting ? 'Minting...' : 'Mint this room as NFT'}
      </button>
      <button className="btn btn-accent" onClick={setupInheritance} disabled={!isConnected}>
        Set up inheritance
      </button>
      {showInheritance && <Inheritance onClose={() => setShowInheritance(false)} />}
    </div>
  );
};

export default Web3;
