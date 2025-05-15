import { Router } from "express";
import { getSwapsCount, getAllSwaps } from "../events";
const router = Router();

router.get("/count", async (req, res) => {
  try {
    const count = await getSwapsCount();
    res.json({ count });
  } catch (e) {
    res.status(500).json({ error: e + "" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { tA, tB } = req.query as { tA?: string, tB?: string };
    const swaps = await getAllSwaps(tA, tB);
    res.json(swaps.map(evt => ({
      txHash: evt.transactionHash,
      blockNumber: evt.blockNumber,
      user: evt.args?.u,
      inToken: evt.args?.inT,
      outToken: evt.args?.outT,
      amountIn: evt.args?.amtIn?.toString(),
      amountOut: evt.args?.amtOut?.toString()
    })));
  } catch (e) {
    res.status(500).json({ error: e + "" });
  }
});

export default router;
