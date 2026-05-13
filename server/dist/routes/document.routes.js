import { Router } from "express";
import { authorization } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validator.middleware";
import { createDocumentValidator, updateDocumentValidator, addCollaborationValidator, } from "../validators/validators";
import { createDocument, getDocumentById, getUserDocuments, addCollaboration, updateDocument, deleteDocument, removeCollaboration, } from "../controllers/document.controllers";
/**
 * POST   /documents
GET    /documents
GET    /documents/:id
PUT    /documents/:id
DELETE /documents/:id
POST   /documents/:id/collaborators
DELETE /documents/:id/collaborators/:userId

 */
const router = Router();
router
    .route("/")
    .post(authorization, createDocumentValidator(), validate, createDocument);
router.route("/").get(authorization, getUserDocuments);
router.route("/:docId").get(authorization, getDocumentById);
router
    .route("/:docId")
    .put(authorization, updateDocumentValidator(), validate, updateDocument);
router.route("/:docId").delete(authorization, deleteDocument);
router
    .route("/:docId/collaborators")
    .post(authorization, addCollaborationValidator(), validate, addCollaboration);
router
    .route("/:docId/collaborators/:collaboratorId")
    .delete(authorization, removeCollaboration);
export default router;
//# sourceMappingURL=document.routes.js.map