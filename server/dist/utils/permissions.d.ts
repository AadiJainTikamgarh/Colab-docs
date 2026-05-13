declare const isOwners: (userId: string, docId: string) => Promise<boolean>;
declare const canViewDocument: (userId: string, docId: string) => Promise<boolean>;
declare const canEditDocument: (userId: string, docId: string) => Promise<boolean>;
export { isOwners, canViewDocument, canEditDocument };
//# sourceMappingURL=permissions.d.ts.map