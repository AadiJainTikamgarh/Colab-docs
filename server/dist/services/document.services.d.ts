declare const createDocumentService: (title: string, ownerId: string, data?: any) => Promise<{
    docs: import("mongoose").Document<unknown, {}, Mongoose.IDocument, {}, import("mongoose").DefaultSchemaOptions> & Mongoose.IDocument & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    };
}>;
declare const getUserDocumentService: (userId: string) => Promise<{
    docs: (import("mongoose").Document<unknown, {}, Mongoose.IDocument, {}, import("mongoose").DefaultSchemaOptions> & Mongoose.IDocument & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[];
}>;
declare const getDocumentByIdService: (userId: string, docId: string) => Promise<{
    docs: (import("mongoose").Document<unknown, {}, Mongoose.IDocument, {}, import("mongoose").DefaultSchemaOptions> & Mongoose.IDocument & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null;
}>;
declare const updateDocumentService: (userId: string, docId: string, data: any) => Promise<{
    docs: import("mongoose").Document<unknown, {}, Mongoose.IDocument, {}, import("mongoose").DefaultSchemaOptions> & Mongoose.IDocument & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    };
}>;
declare const addCollaborationService: (userId: string, docId: string, collaboratorEmail: string, role: "viewer" | "editor") => Promise<{
    docs: import("mongoose").Document<unknown, {}, Mongoose.IDocument, {}, import("mongoose").DefaultSchemaOptions> & Mongoose.IDocument & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    };
}>;
declare const deleteDocumentService: (userId: string, docId: string) => Promise<void>;
declare const removeDocumentCollaborationService: (userId: string, docId: string, collaboratorId: string) => Promise<{
    docs: (import("mongoose").Document<unknown, {}, Mongoose.IDocument, {}, import("mongoose").DefaultSchemaOptions> & Mongoose.IDocument & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null;
}>;
export { createDocumentService, getUserDocumentService, getDocumentByIdService, updateDocumentService, addCollaborationService, deleteDocumentService, removeDocumentCollaborationService, };
//# sourceMappingURL=document.services.d.ts.map