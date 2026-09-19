import { Check, File, FileText, Presentation } from "lucide-react";

const fileTypes = {
    pdf: { label: "PDF", Icon: FileText },
    txt: { label: "TXT", Icon: FileText },
    docx: { label: "DOCX", Icon: FileText },
    pptx: { label: "PPTX", Icon: Presentation },
};

export default function DocumentCard({ document }) {
    const extension = (document.file_type || document.filename.split(".").pop()).toLowerCase();
    const { label, Icon } = fileTypes[extension] || { label: "FILE", Icon: File };

    return <div className="document-card">
        <span className={`document-icon document-icon-${extension}`}><Icon size={21} /><span>{label}</span></span>
        <div className="document-card-info"><strong title={document.filename}>{document.filename}</strong><span>{label} document · Ready to chat</span></div>
        <Check size={16} className="document-ready" aria-label="Uploaded successfully" />
    </div>;
}
