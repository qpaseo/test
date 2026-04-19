import app from "./app";
import { initializeDatabase } from "./config/db/db";
import { ENV } from "./config/env";
import { initMonthlyFinancesJob } from "./jobs/monthlyFinancesJob";

app.listen(ENV.PORT, async () => {
  console.log(`Server running on port ${ENV.PORT}`);
  await initializeDatabase();
  await initMonthlyFinancesJob();
});
