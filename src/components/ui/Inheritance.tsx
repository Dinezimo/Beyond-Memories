import React from 'react';

interface InheritanceProps {
  onClose: () => void;
}

const Inheritance: React.FC<InheritanceProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-base-100 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Set Up Inheritance</h2>
        <p className="mb-4">This is a mock smart contract interface to simulate the digital inheritance process.</p>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Heir's Wallet Address</span>
          </label>
          <input type="text" placeholder="0x..." className="input input-bordered" />
        </div>

        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Activation Condition</span>
          </label>
          <select className="select select-bordered">
            <option>Time-based (e.g., 1 year)</option>
            <option>Verification-based (e.g., manual confirmation)</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary">Confirm Inheritance</button>
        </div>
      </div>
    </div>
  );
};

export default Inheritance;
