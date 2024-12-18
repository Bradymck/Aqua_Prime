import { Signer, Provider, Contract } from "ethers";
import { MoonstoneToken, MoonstoneTokenInterface } from "../typechain/MoonstoneToken";
import { MoonstoneToken__factory } from "../typechain/factories/MoonstoneToken__factory";

export class MoonstoneTokenFactory {
  static connect(address: string, signerOrProvider: Signer | Provider): MoonstoneToken {
    return MoonstoneToken__factory.connect(address, signerOrProvider);
  }
}
