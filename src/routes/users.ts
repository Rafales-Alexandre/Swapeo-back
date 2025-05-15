import { Router } from "express";
import { getAllUsers } from "../events";
import { getUserHistory } from "../events";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e + "" });
  }
});

router.get("/:address", async (req, res) => {
    try {
      const { address } = req.params;
      const history = await getUserHistory(address);
      res.json(history);
    } catch (e) {
      res.status(500).json({ error: e + "" });
    }
  });

export default router;
