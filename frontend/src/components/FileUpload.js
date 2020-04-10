import React from 'react';
import { FileDrop } from 'react-file-drop';
import './FileDrop.css';
import styled from 'styled-components';

const Button = styled.button`
  margin-top: 10px;
  width: 204px;
  height: 61px;
  background: #b3b3b3;
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
`;

const DropUpload = () => {
  const styles = { width: 704, height: 394 };
  const message = 'placeholder';
  const fileInput = React.createRef();
  return (
    <div style={styles}>
      <FileDrop
        onFrameDragEnter={event => console.log('onFrameDragEnter', event)}
        onFrameDragLeave={event => console.log('onFrameDragLeave', event)}
        onFrameDrop={event => console.log('onFrameDrop', event)}
        onDragOver={event => console.log('onDragOver', event)}
        onDragLeave={event => console.log('onDragLeave', event)}
        onDrop={(files, event) => console.log('onDrop!', files, event)}
      >
        <input type="file" id="fileInput" ref={fileInput} />
        Drag Document or{' '}
        <button
          type="button"
          id="fileInputButton"
          onClick={() => {
            fileInput.current.click();
          }}
        >
          Browse
        </button>
        <svg
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
      <Button>Upload</Button>
    </div>
  );
};

export default DropUpload;
