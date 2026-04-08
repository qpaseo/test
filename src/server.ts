import app from "./app";
import { ENV } from "./config/env";
import { initMonthlyFinancesJob } from "./jobs/monthlyFinancesJob";

app.listen(ENV.PORT, async () => {
  console.log(`Server running on port ${ENV.PORT}`);
  await initMonthlyFinancesJob();
});
