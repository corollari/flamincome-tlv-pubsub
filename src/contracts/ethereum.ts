type NumericalString = string;
type Address = string;

type ContractMethod<ReturnType> = {
  call: (options?: {}, defaultBlock?: number) => Promise<ReturnType>;
};

interface ERC20Contract {
  methods: {
    decimals: () => ContractMethod<NumericalString>;
    totalSupply: () => ContractMethod<NumericalString>;
    allowance: (
      owner: Address,
      spender: Address
    ) => ContractMethod<NumericalString>;
    approve: (
      address: Address,
      amount: NumericalString
    ) => ContractMethod<void>;
    balanceOf: (address: Address) => ContractMethod<NumericalString>;
  };
}

interface ExtraVaultContract {
  methods: {
    balance: () => ContractMethod<NumericalString>;
    deposit: (amount: NumericalString) => ContractMethod<void>;
    depositAll: () => ContractMethod<void>;
    withdraw: (amount: NumericalString) => ContractMethod<void>;
    withdrawAll: () => ContractMethod<void>;
    token: () => ContractMethod<Address>;
    priceE18: () => ContractMethod<NumericalString>;
  };
}

export type VaultContract = ExtraVaultContract & ERC20Contract;
