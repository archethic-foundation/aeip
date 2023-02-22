type Keychain = {
    services: Array<Service>,
}

enum Curve {
    ed25519 = 'ed25519',
}

enum HashAlgorithm {
    sha256 = 'sha256',
}

type Service = {
    name: String,
    derivationPath: number,
    curve: Curve,
    hashAlgo: HashAlgorithm,
}

type Transaction = {

}



abstract class Archethic {


}