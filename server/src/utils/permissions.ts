import { documents } from "../models/document.models";

const isOwners = async (userId: string, docId: string) => {
  if (!userId || !docId) {
    return false;
  }

  const doc = await documents.findOne({ _id: docId, owner: userId });

  if (!doc) {
    return false;
  }

  return true;
};

const canViewDocument = async (userId: string, docId: string) => {
  if (!userId || !docId) {
    return false;
  }

  const owner = await isOwners(userId, docId);

  if (owner) {
    return true;
  }
  const doc = await documents.findOne({
    _id: docId,
    "collaborators.userId": userId,
    "collaborators.role": { $in: ["viewer"] },
  });

  if (!doc) {
    return false;
  }

  return true;
};

const canEditDocument = async (userId: string, docId: string) => {
  if (!userId || !docId) {
    return false;
  }
  const owner = await isOwners(userId, docId);
  if (owner) {
    return true;
  }
  const doc = await documents.findOne({
    _id: docId,
    "collaborators.userId": userId,
    "collaborators.role": { $in: ["editor"] },
  });
  if (!doc) {
    return false;
  }
  return true;
};

export { isOwners, canViewDocument, canEditDocument };
