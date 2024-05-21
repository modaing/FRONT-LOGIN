import React, { useState, useEffect } from 'react';
import '../../css/note/noteLists.css';
import { Link, useNavigate } from 'react-router-dom';
import { decodeJwt } from '../../utils/tokenUtils';
import { useSelector, useDispatch } from 'react-redux';
import { callPutReceiceNotesAPI, callReceiveNotesAPI } from '../../apis/NoteAPICalls';
import { callMemberListAPI } from '../../apis/ChattingAPICalls';
import SendNoteForm from './SendNoteForm';
import NoteDetail from './NoteDetail';
import Modal from './modal';

const ReceiveNoteList = () => {
    const { receiveNoteList } = useSelector(state => state.noteReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [checkboxes, setCheckboxes] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [members, setMembers] = useState([]);

    const token = window.localStorage.getItem("accessToken");
    const memberInfo = decodeJwt(token);
    const memberId = memberInfo.memberId;

    useEffect(() => {
        callMemberListAPI()
            .then(response => {
                setMembers(response.data);
            })
            .catch(error => {
                console.error('Error fetching members:', error);
            });
    }, []);

    useEffect(() => {
        if (!receiveNoteList) {
            dispatch(callReceiveNotesAPI(0, 10, 'noteNo', 'DESC', memberId, memberId));
        } else if (receiveNoteList.notes) {
            setCheckboxes(Array(receiveNoteList.notes.length).fill(false));
        }
    }, [dispatch, memberId, receiveNoteList]);

    const { notes, currentPage, totalPages } = receiveNoteList || {};

    const handleCheckboxChange = index => {
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
        document.body.classList.add('note-modal');
    };

    const closeForm = () => {
        setIsFormOpen(false);
        document.body.classList.remove('note-modal');
    };

    const openNoteDetailModal = index => {
        setSelectedNote(notes[index]);
    };

    const closeNoteDetailModal = () => {
        setSelectedNote(null);
    };


    const handleUpdateConfirm = async () => {
        
        await Promise.all(selectedItems.map(async index => {
            if (index >= 0 && index < notes.length) {
                const noteNo = notes[index].noteNo;
                const sendDeleteYn = notes[index].sendDeleteYn  === 'N' ? 'N' : 'Y';
                await dispatch(callPutReceiceNotesAPI(noteNo, 'Y', sendDeleteYn));
            }
        }));
        await dispatch(callReceiveNotesAPI(currentPage, 10, 'noteNo', 'DESC', memberId, memberId));
        setCheckboxes(Array(notes.length).fill(false));
        setSelectedItems([]);
        setIsUpdateModalOpen(false);
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            dispatch(callReceiveNotesAPI(currentPage - 1, 10, 'noteNo', 'DESC', memberId, memberId));
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            dispatch(callReceiveNotesAPI(currentPage + 1, 10, 'noteNo', 'DESC', memberId, memberId));
        }
    };

    const handlePageChange = pageNumber => {
        dispatch(callReceiveNotesAPI(pageNumber, 10, 'noteNo', 'DESC', memberId, memberId));
    };

    const findUserName = senderId => {
        const member = members.find(member => member.memberId === senderId);
        return member ? `${member.name} (${senderId})` : null;
    };

    const findUserPhoto = senderId => {
        const memberPhoto = members.find(member => member.memberId === senderId);
        return memberPhoto ? `/img/${memberPhoto.imageUrl}` : null;
    };

    const paginationStyle = {
        display: 'flex',
        justifyContent: 'center',
    };

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
                    <div className="ancListContent" style={{ backgroundColor: isFormOpen ? '#f1f3f5' : 'transparent' }}>
                        <div className="row">
                            <div className="col-lg-2" style={{ borderRight: '1px solid #ccc' }}>
                                <div style={{ marginTop: '50px' }}>
                                    <Link to="#" className="sendMailBtn" type="button" onClick={openForm}>쪽지 보내기</Link>
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
                                                            <Link to="#" className="bi bi-envelope" style={{ fontSize: '1.2rem', color: '#808080', background: 'none', marginLeft: '20px' }}></Link>
                                                        </div>
                                                    </th>
                                                    <th className="third-column">받을 사원</th>
                                                    <th className="fourth-column">제목</th>
                                                    <th className="fifth-column">받은 날짜</th>
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
                                                                {findUserPhoto(note.senderId) && <img src={findUserPhoto(note.senderId)} alt="Profile" className="rounded-circle" />}
                                                            </td>
                                                            <td className="third-column" style={{ fontSize: '14px' }} onClick={() => openNoteDetailModal(index)}>{findUserName(note.senderId)}</td>
                                                            <td className="fourth-column" onClick={() => openNoteDetailModal(index)}>{note.noteTitle}</td>
                                                            <td className="fifth-column" onClick={() => openNoteDetailModal(index)}>{note.sendNoteDate}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>받은 쪽지가 없습니다</td>
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
            {selectedNote && <NoteDetail note={selectedNote} onClose={closeNoteDetailModal} showResponseButton={true} />}
            <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} onConfirm={handleUpdateConfirm} />
        </main>
    );
}

export default ReceiveNoteList;