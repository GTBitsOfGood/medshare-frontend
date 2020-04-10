import React, { useState } from 'react';
import { FileDrop } from 'react-file-drop';
import './FileDrop.css';
import styled from 'styled-components';
import { uploadFiles } from '../httpApi';

const Button = styled.button`
  margin-top: 10px;
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

const DropUpload = () => {
  const [message, setMessage] = useState('');
  const [boxDrop, setBoxDrop] = useState(false);
  const [enableButton, setEnableButton] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState(null);
  const fileInput = React.createRef();

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

  const frameDrop = () => {
    if (boxDrop === false) {
      setMessage('Please drop your file in the box!');
    }
  };

  const handleDrop = files => {
    console.log(files);
    setBoxDrop(true);
    setMessage('Uploading.....');
    setFilesToUpload(files);
    const filename = files[0];
    const objectURL = window.URL.createObjectURL(filename);
    if (filename) {
      setMessage(<a href={objectURL}> {filename.name}</a>);
      setEnableButton(true);
    }
  };

  const handleSubmit = () => {
    const filesSubmitted = fileInput.current.files;
    setBoxDrop(true);
    setMessage('Uploading.....');
    setFilesToUpload(filesSubmitted);
    const filename = filesSubmitted[0];
    const objectURL = window.URL.createObjectURL(filename);
    if (filename) {
      setMessage(<a href={objectURL}> {filename.name}</a>);
      setEnableButton(true);
    }
  };

  const handleUpload = () => {
    setMessage('Uploading.....');
    uploadFiles(filesToUpload)
      .then(results => {
        if (results.status === 202) {
          setMessage('Upload Success!');
        } else if (results.status === 406) {
          console.log(results);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div id="fileUploadDiv">
      <FileDrop
        onFrameDragEnter={frameDragEnter}
        onFrameDragLeave={frameDragLeave}
        onFrameDrop={frameDrop}
        onDragOver={dragOver}
        onDragLeave={dragOverLeave}
        onDrop={files => handleDrop(files)}
      >
        <input type="file" id="fileInput" ref={fileInput} onChange={handleSubmit} />
        Drag Document or{' '}
        <button
          type="button"
          className="buttonLikeLink"
          onClick={() => {
            fileInput.current.click();
          }}
        >
          Browse
        </button>
        <svg
          id="uploadSVG"
          onClick={() => {
            fileInput.current.click();
          }}
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
      <Button type="submit" disabled={!enableButton} onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
};

export default DropUpload;
