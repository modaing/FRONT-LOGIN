import React, { useState, useRef, useEffect } from 'react';
import insertStyles from '../../css/approval/insertApproval.css';
import { Editor } from '@tinymce/tinymce-react';
import 'react-quill/dist/quill.snow.css';
import SelectFormComponent from '../../components/approvals/SelectFormComponent';
import TinyEditor from '../../components/approvals/TinyEditor';


const ApprovalInsert = () => {

    const [formContent, setFormContent] = useState('');
    const editorRef = useRef(null);

    const handleSelectForm = (selectedForm) => {
        console.log('Selected Form : ', selectedForm);
        if (selectedForm && selectedForm.formShape) {
            const htmlContent = selectedForm.formShape;
            setFormContent(htmlContent); // 선택된 폼의 내용을 설정
            
            if (editorRef.current) {
                editorRef.current.setContent(htmlContent);
                setEditableElements(editorRef.current.getDoc());
            }
        }
    };

    const handleEditorChange = (content) => {
        setFormContent(content);                    //에디터 내용이 변경될 떄 상태 업데이트
    };

    const handleSubmit = () => {
        const formData = {
            content: formContent,
        };
        console.log('기안 완료 : ', formData);
    };

    const setEditableElements = (doc) => {
    const formElements = doc.querySelectorAll('input, td, div[contenteditable="true"]');
    formElements.forEach(element => {
        element.setAttribute('contenteditable', 'true');
    });
    doc.body.querySelectorAll('*:not(input):not(td):not(div[contenteditable="true"])').forEach(element => {
        element.setAttribute('contenteditable', 'false');
    });

    const titleInput = doc.querySelector('#titleform input');
    if (titleInput) {
        titleInput.addEventListener('click', () => {
            titleInput.focus();
        });
        titleInput.setAttribute('contenteditable', 'true');
    }
};

    useEffect(() => {
        if(editorRef.current) {
            const doc = editorRef.current.getDoc();
            setEditableElements(doc);
            const dateDiv = doc.querySelector('#date div');
            console.log('dateDiv : ' + dateDiv);
            if(dateDiv){
                dateDiv.innerHTML = '';
                const currentDate = new Date().toLocaleDateString();
                dateDiv.textContent = currentDate;
                console.log(`dateDiv date :  + ${currentDate}`);
                console.log('dateDiv textContent : ' + dateDiv.textContent);
            }
        }
    }, []);
   

    return (
        <>
            <main id="main" className="main">
                <div className="pageTop">
                    <div className="pagetitle">
                        <h1>결재 기안하기</h1>
                        <nav>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="/">Home</a></li>
                                <li className="breadcrumb-item">전자결재</li>
                                <li className="breadcrumb-item active">결재 기안하기</li>
                            </ol>

                        </nav>
                    </div>
                    <div className="tempSave">
                        <button>임시저장</button>
                    </div>
                </div>
                <div className="bigContent">
                    <div className="middleContent">
                        <div className="insertAppSide left" >
                            <SelectFormComponent onSelectForm={handleSelectForm} />
                            <div className="chooseApprover">

                            </div>
                            <div className="approvers">

                            </div>
                            <div className="referencers">

                            </div>
                        </div>
                        <div className="insertAppSide right">
                            <TinyEditor  
                                onInit={(evt, editor) => {
                                    editorRef.current = editor;
                                    setEditableElements(editor.getDoc());
                                    const dateDiv = editor.getDoc().querySelector('#date div');

                                    if(dateDiv){
                                        const currentDate = new Date().toLocaleDateString();
                                        dateDiv.textContent = currentDate;
                                        console.log(`editor : Current date inserted : ${currentDate}`);
                                    }
                                }}
                                value={formContent}
                                onEditorChange={handleEditorChange}
                                init={{
                                    menubar: false,
                                    plugins: [
                                        'advlist autolink lists link image charmap print preview anchor',
                                        'searchreplace visualblocks code fullscreen',
                                        'insertdatetime media table paste code help wordcount'
                                    ],
                                    toolbar: 'undo redo | formatselect | bold italic backcolor | ' +
                                        'alignleft aligncenter alignright alignjustify | ' +
                                        'bullist numlist outdent indent | removeformat | help',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                    setup: (editor) => {
                                        editor.on('init', () => {
                                            setEditableElements(editor.getDoc());
                                            const dateDiv = editor.getDoc().querySelector('#date div');
                                            if (dateDiv) {
                                                const currentDate = new Date().toLocaleDateString();
                                                dateDiv.textContent = currentDate;
                                                console.log(`setup : Current date inserted : ${currentDate}`);
                                            }
                                        });
                                    },
                                    height: 1200
                                }}
                            />
                        </div>
                    </div>
                    <div className="insertAppButtons">
                        <button>취소</button>
                        <button onClick={handleSubmit}>등록</button>
                    </div>
                </div>
            </main>

        </>
    )

}
export default ApprovalInsert;