import React, { useState } from 'react';

function FileUploader() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8080/api/books/upload', {
                method: 'POST',
                body: formData,
            });

            const text = await response.text();
            setMessage(text);
        } catch (error) {
            console.error('Upload failed:', error);
            setMessage('Upload failed.');
        }
    };

    return (
        <div className="file-uploader">
            <h3>Upload File (e.g., book video)</h3>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload}>Upload</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default FileUploader;