// import React from "react";

// export const PDFViewer = ({ themeId }) => {
//     return (
//         <div style={{ height: '800px' }}>
//             <iframe
//                 src={`http://localhost:8081/themes/${themeId}/getpdf/`}
//                 width="100%"
//                 height="100%"
//                 style={{ border: 'none' }}
//                 title="PDF Viewer"
//             />
//             <p>If PDF doesn't appear, <a href={`http://localhost:8081/themes/${themeId}/getpdf/`} target="_blank">open it directly</a></p>
//         </div>
//     );
// };

import { Document, Page } from 'react-pdf';
import { useState } from 'react';

export const PDFViewer = ({ themeId }) => {
    const [numPages, setNumPages] = useState(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div>
            <Document
                file={`http://localhost:8081/themes/${themeId}/getpdf/`}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                {Array.from(new Array(numPages), (el, index) => (
                    <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
            </Document>
        </div>
    );
};

export default PDFViewer;
