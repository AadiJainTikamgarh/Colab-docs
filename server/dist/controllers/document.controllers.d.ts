import type { Request, Response } from "express";
declare const createDocument: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const getDocumentById: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const getUserDocuments: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const updateDocument: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const addCollaboration: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const deleteDocument: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const removeCollaboration: (req: Request, res: Response, next: import("express").NextFunction) => void;
export { createDocument, getDocumentById, getUserDocuments, updateDocument, addCollaboration, deleteDocument, removeCollaboration, };
//# sourceMappingURL=document.controllers.d.ts.map