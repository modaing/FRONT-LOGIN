import React, { useState, useEffect } from 'react';
import '../../css/note/noteLists.css';
import { Link } from 'react-router-dom';
import { decodeJwt } from '../../utils/tokenUtils';
import { useSelector, useDispatch } from 'react-redux';
import { callPutReceiceNotesAPI, callReceiveNotesAPI } from '../../apis/NoteAPICalls';

const ReceiveNoteList = () => {
    const { receiveNoteList } = useSelector(state => state.noteReducer);
    const dispatch = useDispatch();
    const [selectAll, setSelectAll] = useState(false);
    const [checkboxes, setCheckboxes] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    
    const token = window.localStorage.getItem("accessToken");
    const memberInfo = decodeJwt(token);
    const profilePic = memberInfo.imageUrl;
    const memberId = memberInfo.memberId;

    useEffect(() => {
        if (!receiveNoteList) {
            dispatch(callReceiveNotesAPI(0, 10, 'sort', 'DESC', memberId, memberId));
        } else if (receiveNoteList.notes) {
            const initialCheckboxes = Array(receiveNoteList.notes.length).fill(false);
            setCheckboxes(initialCheckboxes);
        }
    }, [dispatch, memberId, receiveNoteList]);

    const { notes, currentPage, totalPages } = receiveNoteList || {};

    const handleCheckboxChange = (index) => {
        if (notes && notes.length > index) {
            const newCheckboxes = [...checkboxes];
            newCheckboxes[index] = !newCheckboxes[index];
            setCheckboxes(newCheckboxes);
            if (newCheckboxes[index]) {
                setSelectedItems(prevSelectedItems => [...prevSelectedItems, index]);
            } else {
                setSelectedItems(prevSelectedItems => prevSelectedItems.filter(item => item !== index));
            }

            console.log('Selected noteNo:', notes[index].noteNo);
        } else {
            console.error("Notes array or its length is undefined");
        }
    };

    const toggleSelectAll = () => {
        const newSelectAll = !selectAll;
        if (notes) {
            setSelectAll(newSelectAll);
            setCheckboxes(Array(notes.length).fill(newSelectAll));
            setSelectedItems(newSelectAll ? notes.map((_, index) => index) : []);
        }
    };

    const handleDeleteSelectedItems = () => {
        if (notes && Array.isArray(notes)) { // notes 배열이 존재하고 배열인지 확인
            selectedItems.forEach(index => {
                if (index >= 0 && index < notes.length) { // index가 유효한지 확인
                    const noteNo = notes[index].noteNo;
                    dispatch(callPutReceiceNotesAPI(noteNo, 'Y', 'N'));
                }
            });
            window.location.reload();
            setCheckboxes(Array(notes.length).fill(false));
            setSelectedItems([]);
        }
    };

    useEffect(() => {
        const goToPrevPage = () => {
            if (currentPage > 1) {
                dispatch(callReceiveNotesAPI(currentPage - 1));
            } else {
                dispatch(callReceiveNotesAPI(0, 10, 'sort', 'DESC', memberId, memberId));
            }
        };

        const goToNextPage = () => {
            if (currentPage < totalPages) {
                dispatch(callReceiveNotesAPI(currentPage + 1));
            }
        };

        const prevButton = document.querySelector('.bx-chevron-left');
        const nextButton = document.querySelector('.bx-chevron-right');

        if (prevButton) {
            prevButton.addEventListener('click', goToPrevPage);
        }

        if (nextButton) {
            nextButton.addEventListener('click', goToNextPage);
        }

        return () => {
            if (prevButton) {
                prevButton.removeEventListener('click', goToPrevPage);
            }
            if (nextButton) {
                nextButton.removeEventListener('click', goToNextPage);
            }
        };
    }, [dispatch, memberId, currentPage, totalPages]);


    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>받은 쪽지함</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item">기타</li>
                        <li className="breadcrumb-item active">쪽지</li>
                    </ol>
                </nav>
            </div>
            <div className="col-lg-12">
                <div className="card">
                    <div className="ancListContent">
                        <div className="row">
                            <div className="col-lg-2" style={{ borderRight: '1px solid #ccc' }}>
                                <div style={{ marginTop: '50px' }}>
                                    <Link to="/" className='sendMailBtn' type='button'>Compose</Link>
                                    <Link to="/sendNoteList" className="sidebar-fake">
                                        <i className="bi bi-envelope" style={{ marginRight: '10px' }}></i><span>Sent</span>
                                    </Link>
                                    <Link to="/receiveNoteList" className="sidebar-fake">
                                        <i className="bi bi-cursor" style={{ marginRight: '10px' }}></i><span>Receive</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-lg-10">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th className="first-column"> <input className="checkbox-custom" type="checkbox" checked={selectAll} onChange={toggleSelectAll} /></th>
                                            <th className="second-column-top">
                                                <div style={{ marginBottom: '-2px', marginLeft: '-25px' }}>
                                                <Link to="/" className="bi bi-trash" style={{ fontSize: '1.3rem', color: '#a1a1a1', background: 'none' }} onClick={handleDeleteSelectedItems}></Link>
                                                    <Link to="/" className="bi bi-envelope" style={{ fontSize: '1.2rem', color: '#808080', background: 'none', marginLeft: '20px' }}></Link>
                                                </div>
                                            </th>
                                            <th className="third-column"></th>
                                            <th className="fourth-column"></th>
                                            <th className="fifth-column">
                                                <i className="bx bx-chevron-left arrow-icon" style={{ background: 'none', marginRight: '10%' }}></i>
                                                <i className="bx bx-chevron-right arrow-icon" style={{ background: 'none', fontweight: 'bold0', marginRight: '-20%' }}></i>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {notes?.map((note, index) => (
                                            <tr key={index}>
                                                <td className="first-column">
                                                    <input
                                                        className="checkbox-custom"
                                                        type="checkbox"
                                                        checked={checkboxes[index]}
                                                        onChange={() => handleCheckboxChange(index)}
                                                    />
                                                </td>
                                                <td className="second-column"><img src={profilePic} alt="Profile" className="rounded-circle" /></td>
                                                <td className="third-column">{note.senderId}</td>
                                                <td className="fourth-column">{note.noteTitle}</td>
                                                <td className="fifth-column">{note.sendNoteDate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ReceiveNoteList;