import { EAS, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { EAS_ADDRESS, SCHEMA_REGISTRY_ADDRESS } from '../config/config';

export const useEAS = () => {
  const [eas, setEAS] = useState<EAS>();
  const [schemaRegistry, setSchemaRegistry] = useState<SchemaRegistry>();
  const [currentAddress, setCurrentAddress] = useState("");

  useEffect(() => {
    if (currentAddress) return;

    const init = async () => {
      if (!window.ethereum) {
        console.error("Ethereum provider not found");
        return;
      }
    
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Initialize the sdk with the address of the EAS Schema contract address
      const easInstance = new EAS(EAS_ADDRESS);
      const schemaRegistry = new SchemaRegistry(SCHEMA_REGISTRY_ADDRESS);
    
      // Use Web3Provider to interact with the user's Ethereum wallet
      // const provider = new ethers.Web3Provider(window.ethereum);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const address = await (await signer).getAddress();
    
      // Connects an ethers style provider/signingProvider to perform read/write functions.
      easInstance.connect(await signer); // allow clients to attest against freelancer's schema
      schemaRegistry.connect(await signer); // allow Freelancer to register their own reputation schema
      setEAS(easInstance);
      setSchemaRegistry(schemaRegistry);
      setCurrentAddress(address);
    };
    

    init();
  }, [eas, schemaRegistry, currentAddress]);

  return { eas, schemaRegistry, currentAddress };
};
