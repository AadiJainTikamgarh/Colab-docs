import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import {
  addCollaborationService,
  createDocumentService,
  deleteDocumentService,
  getDocumentByIdService,
  getUserDocumentService,
  removeDocumentCollaborationService,
  updateDocumentService,
} from "../services/document.services";

const createDocument = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.user as { _id: string };
  const { title, data } = req.body;

  const { docs } = await createDocumentService(title, _id, data);

  return res
    .status(201)
    .json(new ApiResponse(201, "Document created successfully", { docs }));
});

const getDocumentById = asyncHandler(async (req: Request, res: Response) => {
  const { docId } = req.params as { docId: string };
  const { _id } = req.user as { _id: string };

  const { docs } = await getDocumentByIdService(_id, docId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Documents fetched successfully", { docs }));
});

const getUserDocuments = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.user as { _id: string };

  const { docs } = await getUserDocumentService(_id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Documents fetched successfully", { docs: docs })
    );
});

const updateDocument = asyncHandler(async (req: Request, res: Response) => {
  const { data } = req.body;
  const { docId } = req.params as { docId: string };
  const { _id } = req.user as { _id: string };

  const { docs } = await updateDocumentService(_id, docId, data);

  return res
    .status(200)
    .json(new ApiResponse(200, "Document updated successfully", { docs }));
});

const addCollaboration = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.user as { _id: string };
  const { role, collaboratorId } = req.body;
  const { docId } = req.params as {
    docId: string;
  };

  const { docs } = await addCollaborationService(
    _id,
    docId,
    collaboratorId,
    role
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Collaboration added successfully", { docs }));
});

const deleteDocument = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.user as { _id: string };
  const { docId } = req.params as { docId: string };

  await deleteDocumentService(_id, docId);

  return res
    .status(204)
    .json(new ApiResponse(204, "Document deleted successfully"));
});

const removeCollaboration = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id } = req.user as { _id: string };
    const { docId, collaboratorId } = req.params as { docId: string; collaboratorId: string };

    const { docs } = await removeDocumentCollaborationService(
      _id,
      docId,
      collaboratorId
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Collaboration removed successfully", { docs })
      );
  }
);

export {
  createDocument,
  getDocumentById,
  getUserDocuments,
  updateDocument,
  addCollaboration,
  deleteDocument,
  removeCollaboration,
};
