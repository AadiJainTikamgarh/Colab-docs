import { persist } from "zustand/middleware";
import { create } from "zustand";
import api from "../services/api";
import type { Document } from "../context/documents.types";

interface DocumentState {
  lastDocumentId: string | null;
  lastDocument: Document | null;
  documents: Document[];
  isLoading: boolean;

  fetchUserDocuments: () => Promise<void>;
  setLastDocument: (document: Document) => void;
  createDocument: (title: string, data: any) => Promise<void>;
  updateDocument: (docId: string, data: any) => Promise<void>;
  getDocumentById: (docId: string) => Promise<void>;
  deleteDocument: (docId: string) => Promise<void>;
  addCollaborator: (
    docId: string,
    collaboratorEmail: string,
    role: "viewer" | "editor"
  ) => Promise<void>;
  removeCollaborator: (docId: string, collaboratorId: string) => Promise<void>;
}

const useDocumentStore = create<DocumentState>()(
  persist(
    (set, get) => ({
      lastDocumentId: null,
      lastDocument: null,
      documents: [],
      isLoading: false,

      fetchUserDocuments: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get<{ data: { docs: Document[] } }>(
            "/documents"
          );

          set({ documents: response.data?.data?.docs, isLoading: false });
        } catch (error) {
          console.log(error);
          set({ isLoading: false });
        }
      },

      setLastDocument: (document: Document) => {
        set({ lastDocument: document, lastDocumentId: document._id });
      },

      createDocument: async (title: string, data: any) => {
        set({ isLoading: true });
        try {
          // TODO: Implement create logic
          const response = await api.post<{ data: { docs: Document } }>(
            "/documents",
            {
              title,
              data,
            }
          );
          set({
            documents: [...get().documents, response.data?.data?.docs],
          });
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          console.log(error);
        }
      },

      updateDocument: async (docId: string, data: any) => {
        set({ isLoading: true });
        try {
          const response = await api.put<{ data: { docs: Document } }>(
            `/documents/${docId}`,
            {
              data,
            }
          );
          set({
            documents: get().documents.map((doc) =>
              doc._id === docId ? response.data?.data?.docs : doc
            ),
            lastDocument: response.data?.data?.docs,
            lastDocumentId: response.data?.data?.docs._id,
          });
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          console.log(error);
        }
      },

      getDocumentById: async (docId: string) => {
        set({ isLoading: true });
        try {
          const response = await api.get<{ data: { docs: Document } }>(
            `/documents/${docId}`
          );
          console.log(response.data?.data?.docs);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          console.log(error);
        }
      },

      deleteDocument: async (docId: string) => {
        set({ isLoading: true });
        try {
          await api.delete<null>(`/documents/${docId}`);
          set({
            documents: get().documents.filter((doc) => doc._id !== docId),
          });
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          console.log(error);
        }
      },

      addCollaborator: async (
        docId: string,
        collaboratorEmail: string,
        role: "viewer" | "editor"
      ) => {
        set({ isLoading: true });
        try {
          const response = await api.post<{
            data: { docs: Document };
          }>(`/documents/${docId}/collaborators`, {
            collaboratorEmail,
            role,
          });
          set({
            documents: get().documents.map((doc) =>
              doc._id === docId ? response.data?.data?.docs : doc
            ),
            isLoading: false,
            lastDocument: response.data?.data?.docs,
            lastDocumentId: response.data?.data?.docs._id,
          });
        } catch (error) {
          set({ isLoading: false });
          console.log(error);
        }
      },

      removeCollaborator: async (docId: string, collaboratorId: string) => {
        set({ isLoading: true });
        try {
          const response = await api.delete<{ data: { docs: Document } }>(
            `/documents/${docId}/collaborators/${collaboratorId}`
          );
          set({
            documents: get().documents.map((doc) =>
              doc._id === docId ? response.data?.data?.docs : doc
            ),
            isLoading: false,
            lastDocument: response.data?.data?.docs,
            lastDocumentId: response.data?.data?.docs._id,
          });
        } catch (error) {
          set({ isLoading: false });
          console.log(error);
        }
      },
    }),
    {
      name: "document-storage",
    }
  )
);

export default useDocumentStore;
