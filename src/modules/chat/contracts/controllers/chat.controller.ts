import { Response } from "express";
import { AuthenticatedRequest } from "../../../types/dto/response/basic.response";

export interface IChatController {
  getRoomList(req: AuthenticatedRequest, res: Response): Promise<void>;

  getRoomDetail(req: AuthenticatedRequest, res: Response): Promise<void>;

  streamChat(req: AuthenticatedRequest, res: Response): Promise<void>;

  deleteRoom(req: AuthenticatedRequest, res: Response): Promise<void>;
}
