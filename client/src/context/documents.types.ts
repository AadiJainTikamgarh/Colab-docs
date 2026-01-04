// src/services/document.api.ts

export interface Collaborator {
  _id: string;
  name: string;
  email: string;
  role: "viewer" | "editor";
  addedAt: string;
}

export interface Document {
  docs: any;
  _id: string;
  title: string;
  ownerId: string;
  collaborators: Collaborator[];
  content: Record<string, any>;
  version: number;
  createdAt: string;
  updatedAt: string;
}
