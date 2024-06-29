#!/bin/bash
# For loop with number range
for i in {0..45000}
do
        echo "create account $i"

  near account create-account fund-myself nnn"$i".abahmane.statelessnet '10.01 NEAR' autogenerate-new-keypair save-to-legacy-keychain sign-as abahmane.statelessnet network-config statelessnet sign-with-legacy-keychain send
done
