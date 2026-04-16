import app from "./app";
import cors from "cors";
import { initializeDatabase } from "./config/db/db";
import { ENV } from "./config/env";
import { initMonthlyFinancesJob } from "./jobs/monthly-finances-job";
import { buildContainer } from "./container";
import { initializeRedis } from "./config/redis";

const bootstrap = async () => {
  await initializeDatabase();
  await initializeRedis();

  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
      ],
      credentials: true,
    }),
  );

  const { authRoutes, userRoutes, conceptRoutes, chatRoutes, fsChatRoutes } =
    buildContainer();

  app.use("/auth", authRoutes);
  app.use("/user", userRoutes);
  app.use("/concepts", conceptRoutes);
  app.use("/chat", chatRoutes);
  app.use("/fs-chat", fsChatRoutes);

  await initMonthlyFinancesJob();

  app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
  });
};

bootstrap();
