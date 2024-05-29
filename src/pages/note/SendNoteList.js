import React, { useState, useEffect } from 'react';
import '../../css/note/noteLists.css';
import { Link, useNavigate } from 'react-router-dom';
import { decodeJwt } from '../../utils/tokenUtils';
import { useSelector, useDispatch } from 'react-redux';
import { callSendNotesAPI, callPutSendNotesAPI } from '../../apis/NoteAPICalls';
import { callMemberListAPI } from '../../apis/ChattingAPICalls';
import SendNoteForm from './SendNoteForm';
import NoteDetail from './NoteDetail';
import Modal from './modal';

const SendNoteList = () => {
    const { sendNoteList } = useSelector(state => state.noteReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectAll, setSelectAll] = useState(false);
    const [checkboxes, setCheckboxes] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [members, setMembers] = useState([]);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const token = window.localStorage.getItem("accessToken");
    const memberInfo = decodeJwt(token);
    const memberId = memberInfo.memberId;

    useEffect(() => {
        callMemberListAPI().then(response => {
            const responseData = response.data;
            setMembers(responseData);
        }).catch(error => {
            console.error('Error fetching members:', error);
        });
    }, []);

    useEffect(() => {
        if (!sendNoteList) {
            dispatch(callSendNotesAPI(0, 10, 'noteNo', 'DESC', memberId, memberId));
        } else if (sendNoteList.notes) {
            const initialCheckboxes = Array(sendNoteList.notes.length).fill(false);
            setCheckboxes(initialCheckboxes);
        }
    }, [dispatch, memberId, sendNoteList]);

    const { notes, currentPage, totalPages } = sendNoteList || {};

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


    const openForm = () => {
        setIsFormOpen(true);
        document.body.classList.add('modal-open');
    };

    const closeForm = () => {
        setIsFormOpen(false);
        document.body.classList.remove('modal-open');
    };

    const openNoteDetailModal = (index) => {
        setSelectedNote(notes[index]);
    };

    const closeNoteDetailModal = () => {
        setSelectedNote(null);
    };

    const handleUpdateConfirm = async () => {
        await Promise.all(selectedItems.map(async index => {
            if (index >= 0 && index < notes.length) {
                const noteNo = notes[index].noteNo;
                const receiveDeleteYn = notes[index].receiveDeleteYn === 'N' ? 'N' : 'Y';
                await dispatch(callPutSendNotesAPI(noteNo, 'Y', receiveDeleteYn));
            }
        }));
        await dispatch(callSendNotesAPI(currentPage, 10, 'noteNo'));
        setCheckboxes(Array(notes.length).fill(false));
        setSelectedItems([]);
        setIsUpdateModalOpen(false);
        navigate('/sendNoteList');
    };

    const handlePrevPage = () => {
        const nextPage = currentPage - 1;
        if (nextPage >= 0) {
            dispatch(callSendNotesAPI(nextPage, 10, 'noteNo'));
        }
    };

    const handleNextPage = () => {
        const nextPage = currentPage + 1;
        if (nextPage < totalPages) {
            dispatch(callSendNotesAPI(nextPage, 10, 'noteNo'));
        }
    };

    const handlePageChange = (page) => {
        dispatch(callSendNotesAPI(page, 10, 'noteNo'));
    };

    const findUserName = (receiverId) => {
        const member = members.find(member => member.memberId === receiverId);
        return member ? `${member.name} (${receiverId})` : null;
    };

    const findUserPhoto = (receiverId) => {
        const memberPhoto = members.find(member => member.memberId === receiverId);
        const imageUrl = memberPhoto ? memberPhoto.imageUrl : null;
        return `/img/${imageUrl}`;
    };


    const paginationStyle = {
        display: 'flex',
        justifyContent: 'center',
    };

    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>보낸 쪽지함</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item active">쪽지</li>
                    </ol>
                </nav>
            </div>
            <div className="col-lg-12">
                <div className="card">
                    <div className="ancListContent" style={{ backgroundColor: isFormOpen ? '#f1f3f5' : 'transparent' }}>
                        <div className="row">
                            <div className="col-lg-2" style={{ borderRight: '1px solid #ccc' }}>
                                <div style={{ marginTop: '50px' }}>
                                    <Link to="#" className="sendMailBtn" type="button" onClick={openForm}>쪽지 발송</Link>
                                    <Link to="/sendNoteList" className="sidebar-fake">
                                        <i className="bi bi-envelope" style={{ marginRight: '10px' }}></i><span>보낸 편지함</span>
                                    </Link>
                                    <Link to="/receiveNoteList" className="sidebar-fake">
                                        <i className="bi bi-cursor" style={{ marginRight: '10px' }}></i><span>받은 편지함</span>
                                    </Link>
                                </div>
                            </div>

                            <div className={`col-lg-10 ${isFormOpen ? 'form-open' : ''}`} style={{ height: isFormOpen ? '60vh' : 'auto' }}>
                                {isFormOpen ? (
                                    <SendNoteForm closeForm={closeForm} isFormOpen={isFormOpen} />
                                ) : (
                                    <React.Fragment>
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th className="first-column"> <input className="checkbox-custom" type="checkbox" checked={selectAll} onChange={toggleSelectAll} /></th>
                                                    <th className="second-column-top">
                                                        <div style={{ marginBottom: '-2px', marginLeft: '-25px' }}>
                                                            <Link to="#" className="bi bi-trash" style={{ fontSize: '1.3rem', color: '#a1a1a1', background: 'none' }} onClick={() => setIsUpdateModalOpen(true)}></Link>
                                                        </div>
                                                    </th>
                                                    <th className="third-column">받는 사원</th>
                                                    <th className="fourth-column">제목</th>
                                                    <th className="fifth-column">보낸 날짜</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {notes && notes.length > 0 ? (
                                                    notes.map((note, index) => (
                                                        <tr key={note.noteNo} className="note-row">
                                                            <td className="first-column">
                                                                <input
                                                                    className="checkbox-custom"
                                                                    type="checkbox"
                                                                    checked={checkboxes[index]}
                                                                    onChange={() => handleCheckboxChange(index)}
                                                                />
                                                            </td>
                                                            <td className="second-column" onClick={() => openNoteDetailModal(index)}>
                                                                {findUserPhoto(note.receiverId) && <img src={findUserPhoto(note.receiverId)} alt="Profile" className="rounded-circle" />}
                                                            </td>
                                                            <td className="third-column" style={{ fontSize: '14px' }} onClick={() => openNoteDetailModal(index)}>{findUserName(note.receiverId)}</td>
                                                            <td className="fourth-column" onClick={() => openNoteDetailModal(index)}>{note.noteTitle}</td>
                                                            <td className="fifth-column" onClick={() => openNoteDetailModal(index)}>{note.sendNoteDate}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>보낸 쪽지가 없습니다</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                        <nav style={paginationStyle}>
                                            <ul className="pagination">
                                                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                                    <button className="page-link" onClick={handlePrevPage}>◀</button>
                                                </li>
                                                {Array.from(Array(totalPages).keys()).map((page, index) => (
                                                    <li key={index} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                                        <button className="page-link" onClick={() => handlePageChange(page)}>
                                                            {page + 1}
                                                        </button>
                                                    </li>
                                                ))}
                                                <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                                    <button className="page-link" onClick={handleNextPage}>▶</button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </React.Fragment>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {selectedNote && <NoteDetail note={selectedNote} onClose={closeNoteDetailModal} showResponseButton={false} isSentNote={true} />}
            <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} onConfirm={handleUpdateConfirm} />
        </main>
    );
}

export default SendNoteList;