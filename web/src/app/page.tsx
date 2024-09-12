'use client';
import dynamic from 'next/dynamic';
import {
  useBlockNumber,
  useAccount,
  useBalance,
  useContractRead,
  useContract,
  useContractWrite,
  useExplorer,
  useWaitForTransaction,
} from "@starknet-react/core";
import { BlockNumber } from "starknet";
import contractAbi from "../abis/abi_erc20.json";
import { useState, useMemo } from 'react';
import Image from 'next/image';
import starknetLogo from '../app/starknet-token-strk-logo.png';
import githubLogo from '../app/icons8-github-30.png';

const WalletBar = dynamic(() => import('../components/WalletBar'), { ssr: false })
const Page: React.FC = () => {

  // Step 1 --> Read the latest block -- Start
  const { data: blockNumberData, isLoading: blockNumberIsLoading, isError: blockNumberIsError } = useBlockNumber({
    blockIdentifier: 'latest' as BlockNumber
  });
  const workshopEnds = 180000;
  // Step 1 --> Read the latest block -- End

  // Step 2 --> Read your balance -- Start
  const { address: userAddress } = useAccount();
  const { isLoading: balanceIsLoading, isError: balanceIsError, error: balanceError, data: balanceData } = useBalance({
    address: userAddress,
    watch: true
  });
  // Step 2 --> Read your balance -- End

  // Step 3 --> Read from a contract -- Start
  const contractAddress = "0x02bb4b4624c05fdb0343af8a61a3dc8faf09ac9e1ae7f3fa13def8c8c73b0f0c";

  const { data: readData, refetch: dataRefetch, isError: readIsError, isLoading: readIsLoading, error: readError } = useContractRead({
    functionName: "total_supply",
    args: [],
    abi: contractAbi,
    address: contractAddress,
    watch: true,
  });
  // Step 3 --> Read from a contract -- End

  // Step 4 --> Write to a contract -- Start
  const [amount, setAmount] = useState(0);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //console.log("Form submitted with amount ", amount);
    // TO DO: Implement Starknet logic here
    writeAsync();
  };

  const { contract } = useContract({
    abi: contractAbi,
    address: contractAddress,
  });

  const calls = useMemo(() => {
    if (!userAddress || !contract) return [];
    return contract.populateTransaction["mint"]!(userAddress, {
      low: amount ? amount : 0,
      high: 0,
    });
  }, [contract, userAddress, amount]);

  const {
    writeAsync,
    data: writeData,
    isPending: writeIsPending,
  } = useContractWrite({
    calls,
  });

  const explorer = useExplorer();

  const { isLoading: waitIsLoading, isError: waitIsError, error: waitError, data: waitData } = useWaitForTransaction({ hash: writeData?.transaction_hash, watch: true })

  const LoadingState = ({ message }: { message: string }) => (
    <div className="flex items-center space-x-2">
      <div className="animate-spin">
        <svg className="h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <span>{message}</span>
    </div>
  );

  const buttonContent = () => {
    if (writeIsPending) {
      return <LoadingState message="Minting..." />;
    }

    if (waitIsLoading) {
      return <LoadingState message="Waiting for confirmation..." />;
    }

    if (waitData && waitData.status === "REJECTED") {
      return <LoadingState message="Transaction rejected..." />;
    }

    if (waitData) {
      return "Transaction confirmed";
    }

    return "Mint";
  };
  // Step 4 --> Write to a contract -- End

  // Step 5 --> Transfer tokens to a wallet -- Start
  const [transferAmount, setTransferAmount] = useState(0);
  const [recipientAddress, setRecipientAddress] = useState("");

  const handleTransfer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!recipientAddress) {
      console.error("Recipient address is required");
      return;
    }

    writeTransferAsync();
  };

  const transferCalls = useMemo(() => {
    if (!userAddress || !contract || !recipientAddress) return [];
    return contract.populateTransaction["transfer"]!(recipientAddress, {
      low: transferAmount ? transferAmount : 0,
      high: 0,
    });
  }, [contract, userAddress, recipientAddress, transferAmount]);

  const {
    writeAsync: writeTransferAsync,
    data: transferData,
    isPending: transferIsPending,
  } = useContractWrite({
    calls: transferCalls,
  });

  const {
    isLoading: transferWaitIsLoading,
    isError: transferWaitIsError,
    error: transferWaitError,
    data: transferWaitData,
  } = useWaitForTransaction({ hash: transferData?.transaction_hash, watch: true });

  const transferButtonContent = () => {
    if (transferIsPending) {
      return <LoadingState message="Transferring..." />;
    }

    if (transferWaitIsLoading) {
      return <LoadingState message="Waiting for confirmation..." />;
    }

    if (transferWaitData && transferWaitData.status === "REJECTED") {
      return <LoadingState message="Transaction rejected..." />;
    }

    if (transferWaitData) {
      return "Transaction confirmed";
    }

    return "Transfer Tokens";
  };
  // Step 5 --> Transfer tokens to a wallet -- End

  return (
    <div className="h-full min-h-full py-10 flex flex-col justify-center items-center text-white bg-indigo-950">
      <Image
        src={starknetLogo}
        alt="Starknet Logo"
        width={50}
        height={50}
      />
      <h1 className='text-3xl p-4 text-red-400'>Basecamp Starknet Brasil</h1>

      <div className="flex flex-row m-4 px-4 rounded-lg border border-indigo-600">
        <WalletBar />
      </div>

      {/* Step 1 --> Read the latest block -- Start */}
      {!blockNumberIsLoading && !blockNumberIsError && (
        <div
          className={`p-8  max-w-md m-4 rounded-lg text-center ${blockNumberData! < workshopEnds ? "bg-indigo-900 border-green-500 border" : "bg-indigo-900"}`}
        >
          <h3 className="text-2xl font-bold mb-2">Read the Blockchain</h3>
          <p className='py-2'>Current Block Number: <span className='border border-red-300 p-1 rounded-lg text-red-300'> {blockNumberData}</span></p>
          <p className='my-2 text-green-500 font-semibold text-lg'>{blockNumberData! < workshopEnds ? "We're live on Basecamp!" : "Workshop has ended!"} </p>
        </div>
      )}

      {/* Step 1 --> Read the latest block -- End */}

      <div className='flex flex-row min-w-min w-md min-h-44 '>
        {/* Step 2 --> Read your balance -- Start */}
        {!balanceIsLoading && !balanceIsError && (
          <div className={`p-4 w-full m-4 text-white bg-indigo-900 rounded-lg `}>
            <h3 className="text-xl font-bold mb-2">Read your Balance</h3>
            <p>Symbol: {balanceData?.symbol}</p>
            <p>Balance: {Number(balanceData?.formatted).toFixed(4)}</p>
          </div>
        )}

        {/* Step 2 --> Read your balance -- End */}

        {/* Step 3 --> Read from a contract -- Start */}
        <div className={`p-4 w-full m-4 text-white bg-indigo-900 rounded-lg`}>
          <h3 className="text-xl font-bold mb-2">Read your Contract</h3>
          <p className="text-white whitespace-nowrap">Total Supply: {readData?.toString()}</p>
          <div className="flex justify-center pt-4">
            <button
              onClick={() => dataRefetch()}
              className={`bg-slate-100 border rounded-lg border-black hover:bg-slate-300 text-black font-regular py-2 px-4`}
            >
              Refresh
            </button>
          </div>
        </div>
        {/* Step 3 --> Read from a contract -- End */}
      </div>

      {/* Step 4 --> Write to a contract -- Start */}
      <form onSubmit={handleSubmit} className="text-white  p-4 w-full max-w-md m-4 rounded-lg bg-indigo-900">
        <h3 className="text-2xl font-bold mb-2">Write to a Contract</h3>
        <h1 className='text-xl font-bold my-2'>Mint ERC20</h1>
        <div className='flex flex-row items-center gap-1'>
          <label
            htmlFor="amount"
            className="block text-sm font-medium leading-6 text-white"
          >
            Amount:
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(event) => setAmount(event.target.valueAsNumber)}
            className="block w-full px-3 py-2 text-sm leading-6 rounded-lg border-indigo-500 focus:outline-none focus:border-indigo-500 bg-indigo-800"
            style={{
              WebkitAppearance: 'none',
              MozAppearance: 'textfield'
            }}
          />
        </div>
        {writeData?.transaction_hash && (
          <a
            href={explorer.transaction(writeData?.transaction_hash)}
            target="_blank"
            className="text-green-500 hover:text-green-600 underline"
            rel="noreferrer">Check TX on {explorer.name}</a>
        )}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className={` text-black font-regular py-2 px-4 rounded-lg ${userAddress ? "bg-green-400 hover:bg-green-500" : "bg-indigo-900 border border-slate-500 text-slate-500"} `}
            disabled={!userAddress}
          >
            {buttonContent()}
          </button>
        </div>
      </form>

      {/* Step 4 --> Write to a contract -- End */}

      {/* Step 5 --> Transfer tokens to a wallet -- Start */}
      <form onSubmit={handleTransfer} className="text-white p-4 w-full max-w-md m-4 rounded-lg bg-indigo-900">
        <h3 className="text-2xl font-bold mb-2">Transfer Tokens</h3>
        <div className='flex flex-row items-center gap-1'>
          <label
            htmlFor="recipient"
            className="block text-sm font-medium leading-6 text-white"
          >
            Recipient Address:
          </label>
          <input
            type="text"
            id="recipient"
            value={recipientAddress}
            onChange={(event) => setRecipientAddress(event.target.value)}
            className="block w-full px-3 py-2 text-sm leading-6 rounded-lg border-indigo-500 focus:outline-none focus:border-indigo-500 bg-indigo-800"
          />
        </div>
        <div className='flex flex-row items-center gap-1 mt-4'>
          <label
            htmlFor="transferAmount"
            className="block text-sm font-medium leading-6 text-white"
          >
            Amount:
          </label>
          <input
            type="number"
            id="transferAmount"
            value={transferAmount}
            onChange={(event) => setTransferAmount(event.target.valueAsNumber)}
            className="block w-full px-3 py-2 text-sm leading-6 rounded-lg border-indigo-500 focus:outline-none focus:border-indigo-500 bg-indigo-800"
            style={{
              WebkitAppearance: 'none',
              MozAppearance: 'textfield'
            }}
          />
        </div>
        {transferData?.transaction_hash && (
          <a
            href={explorer.transaction(transferData?.transaction_hash)}
            target="_blank"
            className="text-green-500 hover:text-green-600 underline"
            rel="noreferrer">Check TX on {explorer.name}</a>
        )}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className={`text-black font-regular py-2 px-4 rounded-lg ${userAddress ? "bg-green-400 hover:bg-green-500" : "bg-indigo-900 border border-slate-500 text-slate-500"} `}
            disabled={!userAddress}
          >
            {transferButtonContent()}
          </button>
        </div>
      </form>
      {/* Step 5 --> Transfer tokens to a wallet -- End */}

      <div className='flex flex-row mt-10 items-center'>
        <a href="https://github.com/thomasdev5832" title="GitHub" className='hover:animate-spin'>
          <Image
            src={githubLogo}
            alt="Github Logo"
            width={30}
            height={30}
          />
        </a>
      </div>
    </div>
  );
};

export default Page;
