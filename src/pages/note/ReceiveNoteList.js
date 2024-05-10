import React, { useState, useEffect } from 'react';
import '../../css/note/noteLists.css';
import { Link } from 'react-router-dom';
import { decodeJwt } from '../../utils/tokenUtils';
import { useSelector, useDispatch } from 'react-redux';
import { callReceiveNotesAPI, callSendNotesAPI } from '../../apis/NoteAPICalls';

const ReceiveNoteList = () => {
    const { receiveNoteList, sendNoteList } = useSelector(state => state.noteReducer);
    const dispatch = useDispatch();
    const [selectAll, setSelectAll] = useState(false);
    const [checkboxes, setCheckboxes] = useState(Array(10).fill(false));

    const token = window.localStorage.getItem("accessToken");
    const memberInfo = decodeJwt(token);
    const profilePic = memberInfo.imageUrl;
    const memberId = memberInfo.memberId;

    const toggleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setCheckboxes(checkboxes.map(() => newSelectAll));
    };

    const handleCheckboxChange = (index) => {
        const newCheckboxes = [...checkboxes];
        newCheckboxes[index] = !newCheckboxes[index];
        setCheckboxes(newCheckboxes);
    };

    useEffect(() => {
        dispatch(callReceiveNotesAPI(0, 10, 'sort', 'DESC', memberId, memberId));
    }, []);

    console.log('zz', receiveNoteList)

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
                    <div className="ancListContent" >
                        <div className="row" >
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
                                                    <Link to="/" className="bi bi-trash" style={{ fontSize: '1.3rem', color: '#a1a1a1', background: 'none' }}></Link>
                                                    <Link to="/" className="bi bi-envelope" style={{ fontSize: '1.2rem', color: '#808080', background: 'none', marginLeft: '20px' }}></Link>
                                                </div>
                                            </th>
                                            <th className="third-column"></th>
                                            <th className="fourth-column"></th>
                                            <th className="fifth-column">
                                                {/* <i onClick={goToPrevPage} className="bx bx-chevron-left arrow-icon" style={{ background: 'none', marginRight: '10%' }}></i>
                                                <i onClick={goToNextPage} className="bx bx-chevron-right arrow-icon" style={{ background: 'none', fonteight: 'bold0', marginRight: '-20%' }}></i> */}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {receiveNoteList?.notes?.map((note, index) => (
                                            <tr key={index}>
                                                <td className="first-column"><input className="checkbox-custom" type="checkbox" checked={checkboxes[index]} onChange={() => handleCheckboxChange(index)} /></td>
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
