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

//if (process.argv.length !== 5) {
//  console.info(HELP);
//  process.exit(1);
//}

//mintInscription(process.argv[2], process.argv[3], process.argv[4]);

async function mintInscription(creatorAccountId, tick, supply) {
  const near = await connect({ ...config, keyStore });


  try{
      const account = await near.account(creatorAccountId);

//      const account = await near.account(creatorAccountId);


  return await account.functionCall({
       contractId: "inscription.near",
        methodName: "inscribe",
          args: {
    p: "nrc-20",
    op: "mint",
    tick: tick,
    amt: supply

  },
          gas:10000000000000,
            attachedDeposit:0

        });

   }
   catch(e){
        console.log(creatorAccountId +": "+e);
        console.error('FULL ERROR', e)
        }


}
