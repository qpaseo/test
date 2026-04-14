// concept.routes.ts

import { Router } from "express";
import { ConceptController } from "../controllers/concept.controller";
import { AuthMiddleware } from "../../../common/middlewares/auth.middleware";

/**
 * Concept Routes (DI Version)
 */
export class ConceptRoutes {
  constructor(
    private readonly controller: ConceptController,
    private readonly authMiddleware: AuthMiddleware,
  ) {}

  build(): Router {
    const router = Router();

    /**
     * GET /concepts
     */
    router.get("/", this.authMiddleware.auth, this.controller.getConceptList);

    /**
     * GET /concepts/:id
     */
    router.get(
      "/:id",
      this.authMiddleware.auth,
      this.controller.getConceptById,
    );

    return router;
  }
}
