import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
dotenv.config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const RPC_URL = process.env.RPC_URL!;

const abiPath = path.join(__dirname, "abi", "SwapeoDEX.json");
const abi = JSON.parse(fs.readFileSync(abiPath, "utf-8")).abi;

export const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

export const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
