const HELP = `Please run this script in the following format:
    node deployInscription.js CREATOR_ACCOUNT.statelessnet tick supply
`;

const {Contract, connect, KeyPair, keyStores, utils } = require("near-api-js");
const path = require("path");
const homedir = require("os").homedir();
const CREDENTIALS_DIR = ".near-credentials";
const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const config = {
  keyStore,
  networkId: "statelessnet",
  nodeUrl: "https://rpc.statelessnet.nearone.org/",
};

if (process.argv.length !== 5) {
  console.info(HELP);
  process.exit(1);
}

deployInscription(process.argv[2], process.argv[3], process.argv[4]);

async function deployInscription(creatorAccountId, tick, supply) {
  const near = await connect({ ...config, keyStore });
  const account = await near.account(creatorAccountId);


  await account.functionCall({
       contractId: "inscription.near",
        methodName: "inscribe",
          args: {
    p: "nrc-20",
    op: "deploy",
    tick: tick,
    amt: supply

  },
          gas:300000000000000,
            attachedDeposit:0

        });

}
