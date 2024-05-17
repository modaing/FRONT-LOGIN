import React, { useState, useEffect } from 'react';
import '../../css/note/noteLists.css';
import { Link, useNavigate } from 'react-router-dom';
import { decodeJwt } from '../../utils/tokenUtils';
import { useSelector, useDispatch } from 'react-redux';
import { callSendNotesAPI, callPutSendNotesAPI } from '../../apis/NoteAPICalls';
import { callMemberListAPI } from '../../apis/ChattingAPICalls';
import SendNoteForm from './SendNoteForm';
import NoteDetail from './NoteDetail';

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
    const token = window.localStorage.getItem("accessToken");
    const memberInfo = decodeJwt(token);
    const profilePic = memberInfo.imageUrl;
    const memberId = memberInfo.memberId;

    useEffect(() => {
        // 멤버 리스트를 가져오는 API 호출
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

    const handleDeleteSelectedItems = async () => {
        if (notes && Array.isArray(notes)) {
            await Promise.all(selectedItems.map(async index => {
                if (index >= 0 && index < notes.length) {
                    const noteNo = notes[index].noteNo;
                    await dispatch(callPutSendNotesAPI(noteNo, 'Y', 'N'));
                }
            }));
            await dispatch(callSendNotesAPI(currentPage, 10, 'noteNo'));
            setCheckboxes(Array(notes.length).fill(false));
            setSelectedItems([]);
            navigate('/sendNoteList');
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

    useEffect(() => {
        const goToPrevPage = () => {
            const nextPage = currentPage - 1;
            if (nextPage >= 0) {
                dispatch(callSendNotesAPI(nextPage, 10, 'noteNo'));
            }
        };

        const goToNextPage = () => {
            const nextPage = currentPage + 1;
            if (nextPage < totalPages) {
                dispatch(callSendNotesAPI(nextPage, 10, 'noteNo'));
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
    }, [dispatch, currentPage, totalPages]);

    const findUserName = (receiverId) => {
        // 멤버 리스트에서 receiverId와 동일한 memberId를 가진 멤버를 찾음
        const member = members.find(member => member.memberId === receiverId);
        // 해당 멤버가 존재하면 해당 멤버의 이름과 receiverId를 반환
        return member ? `${member.name} (${receiverId})` : null;
    };

    const findUserPhoto = (receiverId) => {
        const memberPhoto = members.find(member => member.memberId === receiverId);
        const imageUrl = memberPhoto ? memberPhoto.imageUrl : null;
        return imageUrl;
    };


    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>보낸 쪽지함</h1>
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
                                    <Link to="#" className="sendMailBtn" type="button" onClick={openForm}>Compose</Link>
                                    <Link to="/sendNoteList" className="sidebar-fake">
                                        <i className="bi bi-envelope" style={{ marginRight: '10px' }}></i><span>Sent</span>
                                    </Link>
                                    <Link to="/receiveNoteList" className="sidebar-fake">
                                        <i className="bi bi-cursor" style={{ marginRight: '10px' }}></i><span>Receive</span>
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
                                                            <Link to="/" className="bi bi-trash" style={{ fontSize: '1.3rem', color: '#a1a1a1', background: 'none' }} onClick={handleDeleteSelectedItems}></Link>
                                                            <Link to="/" className="bi bi-envelope" style={{ fontSize: '1.2rem', color: '#808080', background: 'none', marginLeft: '20px' }}></Link>
                                                        </div>
                                                    </th>
                                                    <th className="third-column">Receiver</th> {/* Receiver 추가 */}
                                                    <th className="fourth-column">Title</th>
                                                    <th className="fifth-column">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {notes?.map((note, index) => (
                                                    <tr key={note.noteNo} className="note-row" onClick={() => openNoteDetailModal(index)}>
                                                        <td className="first-column">
                                                            <input
                                                                className="checkbox-custom"
                                                                type="checkbox"
                                                                checked={checkboxes[index]}
                                                                onChange={() => handleCheckboxChange(index)}
                                                            />
                                                        </td>
                                                        <td className="second-column">
                                                            {findUserPhoto(note.receiverId) && <img src={findUserPhoto(note.receiverId)} alt="Profile" className="rounded-circle" />}
                                                        </td>
                                                        <td className="third-column" style={{ fontSize: '14px' }}>{findUserName(note.receiverId)}</td>
                                                        <td className="fourth-column">{note.noteTitle}</td>
                                                        <td className="fifth-column">{note.sendNoteDate}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </React.Fragment>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {selectedNote && <NoteDetail note={selectedNote} onClose={closeNoteDetailModal} showResponseButton={false} isSentNote={true} />}
        </main>
    );
}

export default SendNoteList;
