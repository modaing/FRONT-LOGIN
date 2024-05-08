import React, { useEffect, useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { ancInsertAPI } from '../../../apis/other/announce/AncAPICalls';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import ReactMarkdown from 'react-markdown';
import { stateToHTML } from 'draft-js-export-html';

function InsertAnnounce() {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [previewContent, setPreviewContent] = useState(''); // HTML 미리보기

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

        // EditorState를 HTML 문자열로 변환
        const htmlContent = stateToHTML(editorState.getCurrentContent());

        const formData = new FormData();
        formData.append('announceDTO', new Blob([JSON.stringify({ ancTitle: title, ancWriter: 'user', ancContent: htmlContent })], { type: 'application/json' }));
        formData.append('files', file);

        console.log(formData);

        try {
            const data = await ancInsertAPI(formData);
            console.log(data);
            // 등록 성공 시 처리
        } catch (error) {
            console.error(error);
            // 등록 실패 시 처리
        }
    };

    const handleChangeFile = (e) => {
        setFile(e.target.files[0]);
    };

    useEffect(() => {
        // Editor 컴포넌트 로드 완료 처리
        // 마크다운을 HTML로 변환하여 미리보기 업데이트
        const plainTextContent = editorState.getCurrentContent().getPlainText();
        const markdownContent = `# \n${plainTextContent}`; 
        remark().use(remarkHtml).process(markdownContent, function (err, file) {
            if (err) throw err;
            setPreviewContent(String(file));
        });
    }, [editorState, title]);

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
                                    <input type="text" className="form-control" id="inputText" placeholder="제목을 입력해주세요" value={title} onChange={(e) => setTitle(e.target.value)} />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="inputText" className="col-sm-1 col-form-label">파일</label>
                                <div className="col-sm-10">
                                    <input className="form-control" type="file" id="formFile" multiple onChange={handleChangeFile} />
                                </div>
                            </div>
                            <label htmlFor="inputText" className="col-sm-2 col-form-label">본문</label>
                            <div className="row mb-7">
                                <div className="col-sm-1"></div>
                                <div className="col-sm-10">
                                    <Editor
                                        editorState={editorState}
                                        onEditorStateChange={setEditorState}
                                        wrapperStyle={{ height: '500px', border: '1px solid #ccc', borderRadius: '15px', overflow: 'hidden' }}
                                        toolbar={{ options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'] }}
                                    />
                                    {/* 마크다운으로 변환하여 보여주는 부분 */}
                                    <ReactMarkdown>{previewContent}</ReactMarkdown>
                                </div>
                            </div>
                            <div style={buttonClass}>
                                <button className="notice-cancel-button" style={cancelButton}>취소하기</button>
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