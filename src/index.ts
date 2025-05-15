import express, { Request, Response } from "express";
import poolsRouter from "./routes/pools";
import swapsRouter from "./routes/swaps";
import usersRouter from "./routes/users";
import providersRouter from "./routes/providers";

const app = express();
const port = 3000;

app.get("/", (request, response) => {
    response.send("SwapeoDEX Backend OK");
  });

app.use("/pools", poolsRouter);
app.use("/swaps", swapsRouter);
app.use("/users", usersRouter);
app.use("/providers", providersRouter);

app.listen(port, () => {
  console.log(`SwapeoDEX backend listening on port ${port}`);
});
