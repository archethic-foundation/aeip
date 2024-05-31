
enum Curve {
    ed25519 = 'ed25519',
    P256 = 'P256',
    secp256k1 = 'secp256k1',
}

enum HashAlgorithm {
    sha256 = 'sha256',
    sha512 = 'sha512',
    sha3_256 = 'sha3-256',
    sha3_512 = 'sha3-512',
    blake2b = 'blake2b',
}

enum UserTypeTransaction {
    keychain = 'keychain',
    keychain_access = 'keychain_access',
    transfer = 'transfer',
    hosting = 'hosting',
    token = 'token',
    data = 'data',
    contract = 'contract',
}

enum NetworkTypeTransaction {
    node = 'node',
    node_shared_secrets = 'node_shared_secrets',
    origin_shared_secrets = 'origin_shared_secrets',
    beacon = 'beacon',
    beacon_summary = 'beacon_summary',
    oracle = 'oracle',
    oracle_summary = 'oracle_summary',
    code_proposal = 'code_proposal',
    code_approval = 'code_approval',
    node_rewards = 'node_rewards',
}

type Service = {
    name: String,
    derivationPath: number,
    curve: Curve,
    hashAlgo: HashAlgorithm,
}

type Address = {
    address: string, // Hexadecimal
}

type Balance = {
    token: TokenBalance[],
    uco: number
}

type TokenBalance = {
    address: Address,
    amount: number,
    tokenId: number,
}

type CrossValidationStamp = {
    nodePubliKey: string,
    signature: string, // Hexadecimal
}

type Data = {
    code: string,
    content: string,
    ledger: Ledger,
    ownerships: Ownership[],
    recipients: Address[],
}

type Ledger = {
    token: TokenLedger,
    uco: UcoLedger,
}

type TokenLedger = {
    transfers: TokenTransfer[],
}

type TokenTransfer = {
    amount: number,
    to: Address,
    tokenAddress: Address,
    tokenId: number,
}

type UcoLedger = {
    transfers: UcoTransfer[],
}

type UcoTransfer = {
    amount: number,
    to: Address,
}

type Ownership = {
    authorizedPublicKeys: AuthorizedKey[],
    secret: string, // Hexadecimal
}

type AuthorizedKey = {
    encryptedSecretKey: string, // hexadecimal
    publicKey: string
}

type TransactionInput = {
    amount: number,
    from: Address,
    spent: boolean,
    timestamp: number,
    tokenAddress: Address,
    tokenId: number,
    type: string,
}

type ValidationStamp = {
    ledgerOperation: LedgerOperation,
    timestamp: number,
}

type LedgerOperation = {
    fee: number,
    unspentOutputs: UnspentOutput[],
}

type UnspentOutput = {
    amount: number,
    from: Address,
    timestamp: number,
    tokenAddress: Address,
    tokenId: number,
    type: string,
    version: number,
}

type Transaction = {
    address: Address,
    balance: Balance,
    chainLength: number,
    rossValidationStamps: CrossValidationStamp[];
    data: Data;
    inputs: TransactionInput[];
    originSignature: string;
    previousAddress: Address;
    previousPublicKey: string;
    previousSignature: string;
    type: string;
    validationStamp: ValidationStamp;
    version: number;
}

type Keychain = {
    version: number,
    services: Array<Service>,
}

abstract class Archethic {


}