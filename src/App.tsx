import { useState, useEffect } from "react";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair, PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import "./App.css";

function App() {
  const [mnemonics, setMnemonics] = useState<string[]>([]);
  const [mnemonic, setMnemonic] = useState<string>("");
  const [seed, setSeed] = useState<string>("");
  const [wallets, setWallets] = useState<number>(0);
  const [publicKeys, setPublicKeys] = useState<PublicKey[]>([]);

  // Generate 12-word mnemonic
  const generateMnemonics = async () => {
    const newMnemonic = bip39.generateMnemonic(128);

    setMnemonic(newMnemonic);
    setMnemonics(newMnemonic.split(" "));
    const generated_seed = bip39.mnemonicToSeedSync(newMnemonic);
    setSeed(generated_seed.toString("hex"));
    console.log(mnemonics);
  };

  useEffect(() => {}, [mnemonics, wallets]);

  // Generate wallet from mnemonic
  const generateWallet = () => {
    const path = `m/44'/501'/${wallets}'/0'`;
    const derivedSeed = derivePath(path, seed).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);

    console.log("Seed: ", seed);
    console.log("Path: ", path);
    console.log("Derived Seed: ", derivedSeed);
    console.log("Secret: ", secret);
    console.log("Keypair: ", keypair);
    console.log("Public Key: ", keypair.publicKey.toString());
    console.log("Secret Key: ", keypair.secretKey);

    setWallets(wallets + 1);
    setPublicKeys([...publicKeys, keypair.publicKey]);
  };
  return (
    <>
      <div className="header-section">
        <h1>Solana Wallets Generator</h1>
        <p>Best solana wallet generator out there. (Source: trust me bro!!!)</p>
      </div>
      <div className="body-section">
        Create your solana wallet:{" "}
        <button
          onClick={generateMnemonics}
          disabled={mnemonics.length > 0 ? true : false}
        >
          Get Started
        </button>
        {mnemonics.length > 0 && (
          <div className="mnemonic-section">
            <h2>Mnemonic Phrase</h2>
            <span>Save This Mnemonic</span>
            <ol>
              {mnemonics.map((mnemonic, index) => (
                <li key={index + 1}>
                  {index + 1}. {mnemonic}
                </li>
              ))}
            </ol>

            <button onClick={generateWallet}>Add Wallet</button>
          </div>
        )}
        {publicKeys.length > 0 && (
          <div className="wallet-section">
            <h2>Wallets</h2>
            <span>Save This Wallet</span>
            <ol>
              {publicKeys.map((publicKey, index) => (
                <li key={index + 1}>
                  {index + 1}. {publicKey.toBase58()}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
