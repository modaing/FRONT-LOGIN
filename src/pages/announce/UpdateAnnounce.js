import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ancUpdateAPI, ancDetailAPI } from '../../apis/other/announce/AncAPICalls';
import { decodeJwt } from '../../utils/tokenUtils';
import '../../css/common.css';

function UpdateAnnounce() {
    const navigate = useNavigate();
    const [announceDetailFiles, setAnnounceDetailFiles] = useState(null);
    const [announceDetails, setAnnounceDetails] = useState(null);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const { ancNo } = useParams();
    const quillRef = useRef();

    let memberId = 0;
    let name = '';

    const isLogin = window.localStorage.getItem("accessToken");
    let decoded = null;

    if (isLogin !== undefined && isLogin !== null) {
        const decodedTokenInfo = decodeJwt(window.localStorage.getItem("accessToken"));
        decoded = decodedTokenInfo.role;

        memberId = decodedTokenInfo.memberId;
        name = decodedTokenInfo.name;
    }

    const insertButton = {
        backgroundColor: '#112D4E',
        color: 'white',
        borderRadius: '15px',
        padding: '10px 20px',
        cursor: 'pointer',
        marginRight: '15px'
    };

    const cancelButton = {
        backgroundColor: '#ffffff',
        color: 'black',
        border: '1px solid #D5D5D5',
        borderRadius: '15px',
        padding: '10px 20px',
        cursor: 'pointer',
        marginRight: '15px'
    };

    const buttonClass = {
        marginTop: '20px',
        marginBottom: '20px',
        marginRight: '100px',
        textAlign: 'right'
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const htmlContent = content;

        try {
            const data = await ancUpdateAPI(ancNo, { ancTitle: title, ancWriter: name, ancContent: htmlContent });
            navigate('/announces');
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        const getAnnounceDetail = async () => {
            try {
                const data = await ancDetailAPI(ancNo);
                if (data.files && data.files.length > 0) {
                    // 파일이 있는 경우
                    setAnnounceDetails(data.announce);
                    setAnnounceDetailFiles(data.files);
                    setTitle(data.announce.ancTitle); // 제목 채우기
                    setContent(data.announce.ancContent); // 내용 채우기
                } else {
                    // 파일이 없는 경우
                    setAnnounceDetails(data);
                    setTitle(data.ancTitle); // 제목 채우기
                    setContent(data.ancContent); // 내용 채우기
                }
            } catch (error) {
                console.error(error);
            }
        };
        getAnnounceDetail();
    }, [ancNo]);

    console.log('check',announceDetails);

    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>공지사항 수정</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item">기타</li>
                        <li className="breadcrumb-item active">공지사항</li>
                    </ol>
                </nav>
            </div>
            <div className="col-lg-12">
                <div className="card">
                    <h5 className="card-title">Notice</h5>
                    <div className="content">
                    {announceDetails && (
                        <form onSubmit={handleSubmit} charset="UTF-8">
                            <div className="row mb-3">
                                <label htmlFor="inputText" className="col-sm-1 col-form-label">제목</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="inputText" placeholder="제목을 입력해주세요" value={title} onChange={(e) => setTitle(e.target.value)} />
                                </div>
                            </div>
                            <label htmlFor="inputText" className="col-sm-2 col-form-label">본문</label>
                            <div className="row mb-7">
                                <div className="col-sm-1"></div>
                                <div className="col-sm-10">
                                    <ReactQuill
                                        ref={quillRef}
                                        value={content}
                                        onChange={setContent}
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, false] }],
                                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                                ['link', 'image', 'video'],
                                                [{ 'color': [] }, { 'background': [] }],
                                                ['clean']
                                            ],
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={buttonClass}>
                                <button className="notice-cancel-button" type='button' style={cancelButton} onClick={() => navigate('/announces')}>취소</button>
                                <button className="notice-insert-button" style={insertButton}>수정</button>
                            </div>
                        </form>
                    )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default UpdateAnnounce;
