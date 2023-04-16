import React, { useRef, useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';

const Background = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalWrapper = styled.div`
  width: 400px;
  height: 500px;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: #fff;
  color: #000;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  z-index: 10;
  border-radius: 10px;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.8;
  color: #141414;

  p {
    margin-bottom: 1rem;
  }

  input {
    width: 392px;
  }

  textarea {
    width: 392px;
    height: 200px;
  }

  button {
    padding: 10px 24px;
    background: #141414;
    color: #fff;
    border: none;
  }
`;

const CloseModalButton = styled(MdClose)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
`;

export const Modal = ({ showModal, setShowModal }) => {
    const modalRef = useRef();

    const closeModal = e => {
        if (modalRef.current === e.target) {
        setShowModal(false);
        }
    };

    const keyPress = useCallback(
        e => {
        if (e.key === 'Escape' && showModal) {
            setShowModal(false);
            console.log('I pressed');
        }
        },
        [setShowModal, showModal]
    );

    useEffect(
        () => {
        document.addEventListener('keydown', keyPress);
        return () => document.removeEventListener('keydown', keyPress);
        },
        [keyPress]
    );

    const addData = () => {
        const userId = document.getElementById('uid').value
        const title = document.getElementById('title').value
        const body = document.getElementById('body').value

        fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title,
          body: body,
          userId: userId
        })
      })
        .then((result) => result.json())
        .then((result) => {
          if (result) {
            global?.window && window.confirm(`successfully add a new row`)
          } else {
            global?.window &&
              window.confirm(
                `Failed to add a new row, please check all of the columns have been filled out correctly`
              )
          }
        })
    }

    return (
        <>
        {showModal ? (
            <Background onClick={closeModal} ref={modalRef}>
                <ModalWrapper showModal={showModal}>
                <ModalContent>
                    <label>userId:</label><input id='uid'></input>
                    <label>title:</label><input id='title'></input>
                    <label>body:</label><textarea id='body'></textarea>
                    <button onClick={addData}>Add Now</button>
                </ModalContent>
                <CloseModalButton
                    aria-label='Close modal'
                    onClick={() => setShowModal(prev => !prev)}
                />
                </ModalWrapper>
            </Background>
        ) : null}
        </>
    );
};
