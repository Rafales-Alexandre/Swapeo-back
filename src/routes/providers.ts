import { Router } from "express";
import { getAllProviders } from "../events";

const router = Router();

router.get("/", async (_, res) => {
  const providers = await getAllProviders();
  res.json(providers);
});

export default router;
