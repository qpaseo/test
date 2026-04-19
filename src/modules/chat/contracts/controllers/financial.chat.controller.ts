import { Response } from "express";
import { AuthenticatedRequest } from "../../../types/dto/response/basic.response";

export interface IFsChatController {
  //getRoomList(req: AuthenticatedRequest, res: Response): Promise<void>;

  getRoomDetail(req: AuthenticatedRequest, res: Response): Promise<void>;

  streamChat(req: AuthenticatedRequest, res: Response): Promise<void>;

  completeChat(req: AuthenticatedRequest, res: Response): Promise<void>;

  updateRoom(req: AuthenticatedRequest, res: Response): Promise<void>;
}
