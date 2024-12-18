import { ethers } from 'ethers';

// Define the ABI
const MoonstoneTokenABI = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "id", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "data", type: "bytes" }
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "tokenIds", type: "uint256[]" }],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

export interface MoonstoneToken extends ethers.BaseContract {
  mint(to: string, id: ethers.BigNumberish, amount: ethers.BigNumberish, data: string): Promise<ethers.ContractTransactionResponse>;
  burn(tokenIds: ethers.BigNumberish[]): Promise<ethers.ContractTransactionResponse>;
}

export const MoonstoneToken__factory = {
  connect(address: string, signerOrProvider: ethers.Signer | ethers.Provider): MoonstoneToken {
    return new ethers.Contract(address, MoonstoneTokenABI, signerOrProvider) as unknown as MoonstoneToken;
  },
  
  createInterface(): ethers.Interface {
    return new ethers.Interface(MoonstoneTokenABI);
  },

  async deploy(signer: ethers.Signer): Promise<MoonstoneToken> {
    const factory = new ethers.ContractFactory(MoonstoneTokenABI, '0x...', signer);
    const contract = await factory.deploy();
    return contract.waitForDeployment() as Promise<MoonstoneToken>;
  }
};

