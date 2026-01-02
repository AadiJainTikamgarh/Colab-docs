import { documents } from "../models/document.models";
import { users } from "../models/user.models";
import ApiError from "../utils/ApiError";

const createDocumentService = async (
  title: string,
  ownerId: string,
  data: any = {}
) => {
  if (!title) {
    throw new ApiError(404, "title of document is required");
  }

  if (!ownerId) {
    throw new ApiError(403, "Forbidden request");
  }

  const docs = await documents.create({
    title: title,
    owner: ownerId,
    content: data,
  });

  await docs.save({ validateBeforeSave: false });

  return { docs };
};

const getUserDocumentService = async (userId: string) => {
  if (userId) {
    throw new ApiError(401, "userId required");
  }

  const docs = await documents.find({ owner: userId });

  return { docs: docs };
};

const getDocumentByIdService = async (userId: string, docId: string) => {
  if (!userId || !docId) {
    throw new ApiError(404, "All details are required");
  }

  const docs = await documents.findOne({ owner: userId, _id: docId });

  return { docs };
};

const updateDocumentService = async (
  userId: string,
  docId: string,
  data: any
) => {
  if (!userId || !docId) {
    throw new ApiError(404, "All details are required");
  }

  const docs = await documents.findOne({ _id: docId, owner: userId });

  if (!docs) {
    throw new ApiError(404, "Document not found");
  }

  docs.content = data;

  await docs.save({ validateBeforeSave: false });

  return { docs };
};

const addCollaborationService = async (
  userId: string,
  docId: string,
  collaboratorId: string,
  role: "viewer" | "editor"
) => {
  if (!userId || !docId || !collaboratorId || !role) {
    throw new ApiError(404, "All fields are required");
  }

  if (role !== "viewer" && role !== "editor") {
    throw new ApiError(400, "Role must be either viewer or editor");
  }

  if (collaboratorId === userId) {
    throw new ApiError(400, "Owner cannot be added as collaborator");
  }

  const collaboratorUser = await users.findById(collaboratorId);

  if (!collaboratorUser) {
    throw new ApiError(404, "Collaborator user not found");
  }

  const existingCollaborator = await documents.findOne({
    "collaborators.userId": collaboratorId,
    _id: docId,
  });

  if (existingCollaborator) {
    throw new ApiError(400, "User is already a collaborator");
  }

  const docs = await documents.findOne({ _id: docId, owner: userId });

  if (!docs) {
    throw new ApiError(404, "Document not found");
  }

  docs.collaborators = [
    ...docs.collaborators,
    { userId: collaboratorId, role: role },
  ];

  await docs.save({ validateBeforeSave: false });

  return { docs };
};

const deleteDocumentService = async (userId: string, docId: string) => {
  if (!userId || !docId) {
    throw new ApiError(404, "All fields are required");
  }

  await documents.findOneAndDelete({ owner: userId, _id: docId });
};

const removeDocumentCollaborationService = async (
  userId: string,
  docId: string,
  collaboratorId: string
) => {
  if (!userId || !docId || !collaboratorId) {
    throw new ApiError(404, "All fields are required");
  }

  const collaboratorUser = await users.findById(collaboratorId);

  if (!collaboratorId) {
    throw new ApiError(404, "Collaborator user not found");
  }

  const docs = await documents.findOneAndUpdate(
    { owner: userId, _id: docId },
    { $pull: { collaborators: { userId: collaboratorId } } }
  );

  return { docs };
};

export {
  createDocumentService,
  getUserDocumentService,
  getDocumentByIdService,
  updateDocumentService,
  addCollaborationService,
  deleteDocumentService,
  removeDocumentCollaborationService,
};
