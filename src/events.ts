import { contract, provider } from "./contract";
import { EventLog } from "ethers";

export async function getAllPools() {
  const depositEvents = await contract.queryFilter(contract.filters.Deposit()) as EventLog[];
  const withdrawEvents = await contract.queryFilter(contract.filters.Withdraw()) as EventLog[];

  const poolsSet = new Set<string>();

  for (const evt of [...depositEvents, ...withdrawEvents]) {
    const t0 = evt.args?.t0 as string;
    const t1 = evt.args?.t1 as string;
    const [a, b] = t0.toLowerCase() < t1.toLowerCase() ? [t0, t1] : [t1, t0];
    poolsSet.add(`${a}_${b}`);
  }

  return Array.from(poolsSet).map((str) => {
    const [tA, tB] = str.split("_");
    return { tA, tB };
  });
}

export async function getAllUsers() {
  const depositEvents = await contract.queryFilter(contract.filters.Deposit()) as EventLog[];
  const swapEvents = await contract.queryFilter(contract.filters.Swap()) as EventLog[];
  const withdrawEvents = await contract.queryFilter(contract.filters.Withdraw()) as EventLog[];

  const addresses = new Set<string>();
  for (const evt of depositEvents) addresses.add(evt.args?.p as string);
  for (const evt of swapEvents) addresses.add(evt.args?.u as string);
  for (const evt of withdrawEvents) addresses.add(evt.args?.p as string);

  return Array.from(addresses);
}

export async function getSwapsCount() {
  const swapEvents = await contract.queryFilter(contract.filters.Swap()) as EventLog[];
  return swapEvents.length;
}

export async function getAllProviders() {
  const depositEvents = await contract.queryFilter(contract.filters.Deposit()) as EventLog[];
  const providers = new Set<string>();
  for (const evt of depositEvents) providers.add(evt.args?.p as string);
  return Array.from(providers);
}

export async function getAllSwaps(tA?: string, tB?: string) {
  const swapEvents = await contract.queryFilter(contract.filters.Swap()) as EventLog[];
  if (tA && tB) {
    const ta = tA.toLowerCase();
    const tb = tB.toLowerCase();
    return swapEvents.filter(e => {
      const inT  = (e.args?.inT as string).toLowerCase();
      const outT = (e.args?.outT as string).toLowerCase();
      return (
        (inT === ta && outT === tb) ||
        (inT === tb && outT === ta)
      );
    });
  }
  return swapEvents;
}

export async function getUserHistory(address: string) {
  const addr = address.toLowerCase();

  const depositEvents = await contract.queryFilter(contract.filters.Deposit()) as EventLog[];
  const swapEvents    = await contract.queryFilter(contract.filters.Swap()) as EventLog[];
  const withdrawEvents= await contract.queryFilter(contract.filters.Withdraw()) as EventLog[];

  const deposits  = depositEvents.filter(e => (e.args?.p as string).toLowerCase() === addr)
    .map(evt => ({
      type: "deposit",
      txHash: evt.transactionHash,
      blockNumber: evt.blockNumber,
      tokenA: evt.args?.t0,
      tokenB: evt.args?.t1,
      amountA: evt.args?.amt0?.toString(),
      amountB: evt.args?.amt1?.toString(),
    }));

  const swaps = swapEvents.filter(e => (e.args?.u as string).toLowerCase() === addr)
    .map(evt => ({
      type: "swap",
      txHash: evt.transactionHash,
      blockNumber: evt.blockNumber,
      inToken: evt.args?.inT,
      outToken: evt.args?.outT,
      amountIn: evt.args?.amtIn?.toString(),
      amountOut: evt.args?.amtOut?.toString(),
    }));

  const withdraws = withdrawEvents.filter(e => (e.args?.p as string).toLowerCase() === addr)
    .map(evt => ({
      type: "withdraw",
      txHash: evt.transactionHash,
      blockNumber: evt.blockNumber,
      tokenA: evt.args?.t0,
      tokenB: evt.args?.t1,
      amountA: evt.args?.amt0?.toString(),
      amountB: evt.args?.amt1?.toString(),
    }));

  const volume = {
    depositsA: deposits.reduce((acc, d) => acc + BigInt(d.amountA || 0), 0n).toString(),
    depositsB: deposits.reduce((acc, d) => acc + BigInt(d.amountB || 0), 0n).toString(),
    swapsIn:   swaps.reduce((acc, s) => acc + BigInt(s.amountIn || 0), 0n).toString(),
    swapsOut:  swaps.reduce((acc, s) => acc + BigInt(s.amountOut || 0), 0n).toString(),
    withdrawsA: withdraws.reduce((acc, w) => acc + BigInt(w.amountA || 0), 0n).toString(),
    withdrawsB: withdraws.reduce((acc, w) => acc + BigInt(w.amountB || 0), 0n).toString(),
  };

  return { deposits, swaps, withdraws, volume };
}

