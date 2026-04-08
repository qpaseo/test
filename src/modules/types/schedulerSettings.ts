// modules/types/schedulerSettings.ts
import { RowDataPacket } from "mysql2/promise";

export interface SchedulerSettings extends RowDataPacket {
  last_run_date: Date;
}
