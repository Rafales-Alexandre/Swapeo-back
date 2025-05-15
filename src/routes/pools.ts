import { Router } from "express";
import { contract } from "../contract";
import { getAllPools } from "../events";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const pools = await getAllPools();
    const result = [];
    for (const { tA, tB } of pools) {
      const info = await contract.getPairInfo(tA, tB);
      result.push({
        token0: info[0],
        token1: info[1],
        reserveA: info[2].toString(),
        reserveB: info[3].toString(),
        totalLiquidity: info[4].toString(),
        accFeeA: info[5].toString(),
        accFeeB: info[6].toString(),
      });
    }
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e + "" });
  }
});

router.get("/:tA/:tB/providers", async (req, res) => {
  try {
    const { tA, tB } = req.params;
    const providers = await contract.getLPProviders(tA, tB);
    res.json(providers);
  } catch (e) {
    res.status(500).json({ error: e + "" });
  }
});

export default router;
