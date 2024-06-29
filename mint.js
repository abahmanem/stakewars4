const nearAPI = require('near-api-js');
const sha256 = require('js-sha256');
const fs = require("fs");
//this is required if using a local .env file for private key
require('dotenv').config();
//statelessnet
// configure accounts, network, and amount of NEAR to send
// the amount is converted into yoctoNEAR (10^-24) using a near-api-js utility

const networkId = 'statelessnet';

// sets up a NEAR API/RPC provider to interact with the blockchain
const provider = new nearAPI.providers
  .JsonRpcProvider(`https://rpc.statelessnet.nearone.org`);



function getPrivateKey(account) {

var obj = JSON.parse(fs.readFileSync('/root/.near-credentials/statelessnet/'+account+'.json', 'utf8'));
return obj.private_key;
}

async function mint(account) {
  console.log('min transaction with ...:  '+account);
try {
   // creates keyPair used to sign transaction
   const privateKey = getPrivateKey(account)
   const keyPair = nearAPI.KeyPair.fromString(privateKey);


  // gets sender's public key
  const publicKey = keyPair.getPublicKey();

  // gets sender's public key information from NEAR blockchain
  const accessKey = await provider.query(
    `access_key/${account}/${publicKey.toString()}`, ''
  );

  // checks to make sure provided key is a full access key
  if(accessKey.permission !== 'FullAccess') {
    return console.log(
      `Account [ ${sender} ] does not have permission to send tokens using key: [ ${publicKey} ]`
    );
  }

  // each transaction requires a unique number or nonce
  // this is created by taking the current nonce and incrementing it
  const nonce = accessKey.nonce+1;

  //
  const actions = [
  nearAPI.transactions.functionCall(
    "inscribe",
    Buffer.from(JSON.stringify({p: "nrc-20",op: "mint",tick: "abahmane-meme",amt: 100})),
    10000000000000,
    0
  )
];
// converts a recent block hash into an array of bytes
  // this hash was retrieved earlier when creating the accessKey (Line 26)
  // this is required to prove the tx was recently constructed (within 24hrs)
  const recentBlockHash = nearAPI.utils.serialize.base_decode(accessKey.block_hash);

  // create transaction
  const transaction = nearAPI.transactions.createTransaction(
    account,
    publicKey,
    "inscription.near",
    nonce,
    actions,
    recentBlockHash
  );


  console.log('singin tnx for account :'+account);

  // before we can sign the transaction we must perform three steps...
  // 1) serialize the transaction in Borsh
  const serializedTx = nearAPI.utils.serialize.serialize(
    nearAPI.transactions.SCHEMA.Transaction,
    transaction
  );
  // 2) hash the serialized transaction using sha256
  const serializedTxHash = new Uint8Array(sha256.sha256.array(serializedTx));
  // 3) create a signature using the hashed transaction
  const signature = keyPair.sign(serializedTxHash);

  // now we can sign the transaction :)
  const signedTransaction = new nearAPI.transactions.SignedTransaction({
    transaction,
    signature: new nearAPI.transactions.Signature({
      keyType: transaction.publicKey.keyType,
      data: signature.signature
    })
  });

    console.log('sending tnx for account :'+account);
  // send the transaction!

    // encodes signed transaction to serialized Borsh (required for all transactions)
    const signedSerializedTx = signedTransaction.encode();
    // sends transaction to NEAR blockchain via JSON RPC call and records the result
    const result = await provider.sendJsonRpc(
      'broadcast_tx_commit',
      [Buffer.from(signedSerializedTx).toString('base64')]
    );
    // console results :)
    console.log('Transaction Results: ', result.transaction);
    console.log('--------------------------------------------------------------------------------------------');
    console.log('OPEN LINK BELOW to see transaction in NEAR Explorer!');
    console.log(`$https://legacy.explorer.${networkId}.near.org/transactions/${result.transaction.hash}`);
    console.log('--------------------------------------------------------------------------------------------');
  } catch(error) {
    console.log(account + "   "+error);
  }
}

let i = 0;
while (i < 2900) {
mint("nnn"+i+".abahmane.statelessnet");
i++;
}
