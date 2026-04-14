// import app from "./app";
// import { initializeDatabase } from "./config/db/db";
// import { ENV } from "./config/env";
// import { initMonthlyFinancesJob } from "./jobs/monthly-finances-job";

// app.listen(ENV.PORT, async () => {
//   console.log(`Server running on port ${ENV.PORT}`);
//   await initializeDatabase();
//   await initMonthlyFinancesJob();
// });

import app from "./app";
import { initializeDatabase } from "./config/db/db";
import { ENV } from "./config/env";
import { initMonthlyFinancesJob } from "./jobs/monthly-finances-job";
import { buildContainer } from "./container";

const bootstrap = async () => {
  await initializeDatabase();

  const { authRoutes, userRoutes } = buildContainer();

  app.use("/auth", authRoutes);
  app.use("/user", userRoutes);

  await initMonthlyFinancesJob();

  app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
  });
};

bootstrap();
