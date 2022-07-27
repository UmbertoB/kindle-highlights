import {useRef, useState} from "react";
import download from "../utils/download-file";
import {Button, UploadContainer} from "../styles/upload";
import {Container} from "../styles/globals";

export default function Upload() {
    const inputRef = useRef();
    const [filename, setFilename] = useState();
    const [mountedFile, setMountedFile] = useState();

    const onImport = async () => {
        const reader = new FileReader();
        const {files: [file]} = inputRef?.current;
        reader.readAsText(file);
        setFilename(file.name)
        setMountedFile(null);


        reader.onloadend = async ({target: {result: csv}}) => {
            const response = await fetch("/api/highlight", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({csv}),
            });
            const file = await response.blob();
            setMountedFile(file);
        };
    }

    const onClickToUpload = () => {
        inputRef.current.click();
    }

    const onClickToDownload = async () => {
        download(mountedFile, filename)
    }

    return (
        <Container>

            <UploadContainer>

                <Button onClick={onClickToUpload}>Upload</Button>
                <h3>{filename}</h3>
                <input style={{display: 'none'}} ref={inputRef} type="file" name="file" onChange={onImport}/>
                {mountedFile && <Button onClick={onClickToDownload}>Download</Button>}

            </UploadContainer>

        </Container>
    );
}
