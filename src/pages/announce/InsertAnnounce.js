import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { SHA256 } from 'crypto-js';
import { ancInsertAPI } from '../../apis/AncAPICalls';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import ReactMarkdown from 'react-markdown';
import { decodeJwt } from '../../utils/tokenUtils';
import '../../css/common.css';

function InsertAnnounce() {
    const navigate = useNavigate();
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [files, setFiles] = useState([]); // 파일 목록을 배열로 유지
    const [previewContent, setPreviewContent] = useState('');
    const quillRef = useRef();

    let memberId = 0; // const는 재할당 불가능 하므로, let으로 만들어주었음
    let name = '';


    const decodedTokenInfo = decodeJwt(window.localStorage.getItem("accessToken"));


    memberId = decodedTokenInfo.memberId; // 함수 내부에서 memberId 할당
    name = decodedTokenInfo.name;



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

    const handleChangeColor = (color) => {
        const quill = quillRef.current.getEditor();
        quill.format('color', color);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const htmlContent = content;

        const formData = new FormData();
        formData.append('announceDTO', new Blob([JSON.stringify({ ancTitle: title, ancWriter: name, ancContent: htmlContent })], { type: 'application/json' }));
        files.forEach(file => formData.append('files', file)); // 모든 파일을 FormData에 추가

        try {
            const data = await ancInsertAPI(formData);
            navigate('/announces');
        } catch (error) {
            console.error(error);
        }
    };

    const handleChangeFiles = (e) => {
        setFiles([...e.target.files]); // 모든 파일을 파일 목록에 추가
    };

    useEffect(() => {
        const plainTextContent = content.replace(/(<([^>]+)>)/gi, "");
        const markdownContent = `# \n${plainTextContent}`;
        remark().use(remarkHtml).process(markdownContent, function (err, file) {
            if (err) throw err;
            setPreviewContent(String(file));
        });
    }, [content, title]);

    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>공지사항 등록</h1>
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
                        <form onSubmit={handleSubmit} charset="UTF-8">
                            <div className="row mb-3">
                                <label htmlFor="inputText" className="col-sm-1 col-form-label">제목</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="inputText" placeholder="제목을 입력해주세요" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="inputText" className="col-sm-1 col-form-label">파일</label>
                                <div className="col-sm-10">
                                    <input className="form-control" type="file" id="formFile" multiple onChange={handleChangeFiles} />
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
                                    {/* <ReactMarkdown>{previewContent}</ReactMarkdown> */}
                                </div>
                            </div>
                            <div style={buttonClass}>
                                <button className="notice-cancel-button" type='button' style={cancelButton} onClick={() => navigate('/announces')}>취소하기</button>
                                <button className="notice-insert-button" style={insertButton}>등록하기</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default InsertAnnounce;
