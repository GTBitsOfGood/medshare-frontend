import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { FileDrop } from 'react-file-drop';
import './FileUpload.css';
import styled from 'styled-components';
import { uploadFiles, getMostRecentUpload } from '../../httpApi';

const LastUploadText = styled.span`
  margin-top: 1.5rem;
  font-size: 16px;
  color: #069;
  width: 100%;
  text-align: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Button = styled.button`
  margin-top: 1rem;
  width: 204px;
  height: 61px;
  border: 1px solid #aeb2b4;
  box-sizing: border-box;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  font-family: Ubuntu;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  text-align: center;
  color: #ffffff;
  outline: none;
  ${props =>
    props.disabled
      ? `
          background: #b3b3b3;
        `
      : `
          background: #6396B3;
          :hover {
            cursor: pointer;
          }
        `};
  :focus {
    background: #4c7d9a;
  }
`;

const padDate = num => (num < 10 ? '0' + num : num);

const FileUpload = () => {
  const { authState } = useOktaAuth();
  const [lastUpload, setLastUpload] = useState(null);
  const [message, setMessage] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const fileInput = useRef(null);

  useEffect(() => {
    if (authState.accessToken) {
      getMostRecentUpload(authState.accessToken).then(resp => {
        const { jobStatus, finishedAt } = resp.data;
        const uploadInfo = {
          running: true,
          finishedAt
        };
        if (!jobStatus || jobStatus === 'FINISHED_SUCCESSFULLY' || jobStatus === 'FINISHED_WITH_ERRORS') {
          uploadInfo.running = false;
        }
        setLastUpload(uploadInfo);
      });
    }
  }, [authState]);

  const dragOver = () => {
    setMessage('Drop!');
  };

  const frameDragEnter = () => {
    setMessage('Drag your file here!');
  };

  const frameDragLeave = () => {
    setMessage('');
  };

  const dragOverLeave = () => {
    setMessage('Drag your file here!');
  };

  const handleDrop = files => {
    const firstFile = files[0];
    if (!firstFile) {
      return;
    }
    if (firstFile.type !== 'text/csv') {
      setMessage('You can only upload .csv files, please select another file');
    } else {
      setFileToUpload(firstFile);
      const objectURL = window.URL.createObjectURL(firstFile);
      setMessage(<a href={objectURL}>{firstFile.name}</a>);
    }
  };

  const triggerFileInput = () => {
    fileInput.current.click();
  };

  const handleSubmit = () => {
    handleDrop(fileInput.current.files);
  };

  const handleUploadClick = () => {
    setMessage('Uploading.....');
    const formData = new FormData();
    formData.append('productFile', fileToUpload);
    uploadFiles(authState.accessToken, formData)
      .then(() => {
        setMessage('Upload Success! Job might take some time to complete so check back later!');
      })
      .catch(err => {
        if (err.response.status === 406) {
          setMessage('There is an upload job currently running, please try again later');
        } else {
          setMessage('An unexpected error occured, please try again');
          console.log(err);
        }
      })
      .finally(() => {
        fileInput.current.value = null;
        setFileToUpload(null);
      });
  };

  const uploadText = useMemo(() => {
    if (!lastUpload) {
      return '';
    }
    if (lastUpload.running) {
      return 'Upload in progress... Please check back later';
    }
    const finishedAt = new Date(lastUpload.finishedAt);
    const dateString = `${padDate(finishedAt.getMonth())}/${padDate(finishedAt.getDate())} - ${padDate(
      finishedAt.getHours()
    )}:${padDate(finishedAt.getMinutes())} `;
    return `Last upload finished at: ${dateString}`;
  }, [lastUpload]);

  return (
    <Wrapper>
      <FileDrop
        onFrameDragEnter={frameDragEnter}
        onFrameDragLeave={frameDragLeave}
        onDragOver={dragOver}
        onDragLeave={dragOverLeave}
        onDrop={files => handleDrop(files)}
      >
        <input type="file" id="fileInput" ref={fileInput} onChange={handleSubmit} accept=".csv" />
        Drag Document or{' '}
        <button type="button" className="buttonLikeLink" onClick={triggerFileInput}>
          Browse
        </button>
        <svg
          id="uploadSVG"
          onClick={triggerFileInput}
          style={{ cursor: 'pointer' }}
          width="60"
          height="73"
          viewBox="0 0 60 73"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M37.3332 0.25H7.99984C3.9665 0.25 0.703171 3.5125 0.703171 7.5L0.666504 65.5C0.666504 69.4875 3.92984 72.75 7.96317 72.75H51.9998C56.0332 72.75 59.3332 69.4875 59.3332 65.5V22L37.3332 0.25ZM44.6665 51H33.6665V61.875H26.3332V51H15.3332V43.75H26.3332V32.875H33.6665V43.75H44.6665V51ZM33.6665 25.625V5.6875L53.8332 25.625H33.6665Z"
            fill="#6396B3"
            fillOpacity="0.61"
          />
        </svg>
        <span className="message"> {message} </span>
      </FileDrop>

      <Button type="submit" disabled={!fileToUpload || lastUpload.running} onClick={handleUploadClick}>
        Upload
      </Button>
      <LastUploadText>{uploadText}</LastUploadText>
    </Wrapper>
  );
};

export default FileUpload;
