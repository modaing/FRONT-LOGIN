import { useEffect, useState } from 'react';
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

function InsertAnnounce() {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [editorLoaded, setEditorLoaded] = useState(false);

    useEffect(() => {
        setEditorLoaded(true);
    }, []);

    const pageTitleStyle = {
        marginBottom: '20px',
        marginTop: '20px'
    };

    const cardTitleStyle = {
        marginLeft: '30px'
    };

    const contentStyle = {
        marginLeft: '100px'
    };

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

    const editorStyle = {
        border: '1px solid grey',
        borderRadius: '15px',
        height: '400px',

    }

    return (
        <main id="main" className="main">
            <div className="pagetitle" style={pageTitleStyle}>
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
                    <h5 className="card-title" style={cardTitleStyle}>Notice</h5>
                    <div className="content" style={contentStyle}>
                        <form>
                            <div className="row mb-3">
                                <label htmlFor="inputText" className="col-sm-1 col-form-label">제목</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="inputText"
                                        placeholder="제목을 입력해주세요" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="inputText" className="col-sm-1 col-form-label">파일</label>
                                <div className="col-sm-10">
                                    <input class="form-control" type="file" id="formFile" multiple></input>
                                </div>
                            </div>
                            <label htmlFor="inputText" className="col-sm-2 col-form-label">본문</label>
                            <div className="row mb-7">
                                <div className="col-sm-1"></div>
                                <div className="col-sm-10" >
                                    <Editor
                                        editorState={editorState}
                                        onEditorStateChange={setEditorState}
                                        wrapperStyle={{ height: '500px', border: '1px solid #ccc', borderRadius: '15px', overflow: 'hidden' }}
                                        toolbar={{
                                            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
                                            inline: {
                                                options: ['bold', 'italic', 'underline', 'strikethrough'],
                                            },
                                            blockType: {
                                                inDropdown: true,
                                                options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
                                            },
                                            fontSize: {
                                                options: [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96],
                                            },
                                            fontFamily: {
                                                options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
                                            },
                                            list: {
                                                inDropdown: true,
                                            },
                                            textAlign: {
                                                inDropdown: true,
                                            },
                                            colorPicker: {
                                                popupClassName: 'custom-color-picker',
                                            },
                                            link: {
                                                inDropdown: true,
                                            },
                                            history: {
                                                inDropdown: true,
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div style={buttonClass}>
                        <button className="notice-cancel-button" style={cancelButton}>취소하기</button>
                        <button className="notice-insert-button" style={insertButton}>등록하기</button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default InsertAnnounce;
