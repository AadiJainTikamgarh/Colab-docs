import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { Save } from "lucide-react";
import useDocumentStore from "@/store/document.store";

function SaveButton() {
  const { editor } = useTiptapEditor();
  const { updateDocument, lastDocumentId } = useDocumentStore();

  const handleSave = () => {
    if (editor) {
      const content = editor.getJSON();
      updateDocument(lastDocumentId as string, content);
      console.log("Saving document:", content);
    }
  };

  return (
    <>
      <span className="mx-2 flex items-center gap-2" onClick={handleSave}>
        <Save className="w-4 h-4 text-neutral-500" />
        <span className="text-sm text-neutral-500">Save</span>
      </span>
    </>
  );
}

export default SaveButton;
