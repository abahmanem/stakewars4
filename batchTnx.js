const { connect, transactions, keyStores } = require("near-api-js");
const fs = require("fs");
const path = require("path");
const homedir = require("os").homedir();

const CREDENTIALS_DIR = ".near-credentials";
const CONTRACT_NAME = "inscription.near";

const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);


const config = {
  keyStore,
  networkId: "statelessnet",
  nodeUrl: "https://rpc.statelessnet.nearone.org",
};


async function sendTransactions(acc) {
 try {
  const near = await connect({ ...config, keyStore });
  const account = await near.account(acc);
  const args = {p: "nrc-20",op: "mint",tick: "abahmane-meme",amt: 100};
  const  actions = []

  for(let i=0;i<100;i++)
        {
                actions.push(transactions.functionCall("inscribe", Buffer.from(JSON.stringify(args)), 1000000000000, 0));
        }


    const result = await account.signAndSendTransaction({
     receiverId: CONTRACT_NAME,
      actions,

    });
    console.log(result);
  } catch (e) {
    console.log("Error:"+acc, e);
  }

}

let i = 0;
while (i < 2500) {
let acc = "nnn"+i+".abahmane.statelessnet";
sendTransactions(acc);
i++;
}
