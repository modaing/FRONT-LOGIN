import React, { useState, useRef, useEffect } from 'react';
import styles from '../../css/approval/ApprovalInsert.module.css';
import { Editor } from '@tinymce/tinymce-react';
import SelectFormComponent from '../../components/approvals/SelectFormComponent';
import TinyEditor from '../../components/approvals/TinyEditor';
import UserInfoComponent from '../../components/approvals/UserInfoComponent';
import { decodeJwt } from '../../utils/tokenUtils';
import ApproverModal from '../../components/approvals/ApproverModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { submitApprovalAPI } from '../../apis/ApprovalAPI';
import { useDispatch } from 'react-redux';


const ApprovalInsert = () => {

    const [formContent, setFormContent] = useState('');
    const [selectedForm, setSelectedForm] = useState(null);
    const [yearFormNo, setYearFormNo] = useState('');
    const [isRemovingBogusBr, setIsRemovingBogusBr] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [approverLine, setApproverLine] = useState([]);
    const [referencerLine, setReferencerLine] = useState([]);
    const [title, setTitle] = useState('');
    const [titleError, setTitleError] = useState('');
    const [files, setFiles] = useState([]);
    const editorRef = useRef(null);
    const dispatch = useDispatch();

    const decodedToken = decodeJwt(window.localStorage.getItem('accessToken'));
    const memberId = decodedToken.memberId;

    const handleSelectForm = (selectedForm) => {

        setSelectedForm(selectedForm);          //선택된 폼을 상태로 저장 
        console.log('Selected Form : ', selectedForm);
        if (selectedForm && selectedForm.formShape) {
            const htmlContent = selectedForm.formShape;
            setFormContent(htmlContent); // 선택된 폼의 내용을 설정

            //결재 번호 생성
            const currentYear = new Date().getFullYear();
            const approvalNumber = `${currentYear}-${selectedForm.formNo}`;
            setYearFormNo(approvalNumber);

            if (editorRef.current) {
                editorRef.current.setContent(htmlContent);
                editorRef.current.undoManager.clear();  //히스토리 초기화
                setEditableElements(editorRef.current.getDoc());
                insertCurrentDate(editorRef.current.getDoc());
                removeBogusBrTags();
            }
        }
    };

    const handleEditorChange = (content) => {
        setFormContent(content);                    //에디터 내용이 변경될 떄 상태 업데이트
    };

    const handleFileChange = (e) => {
        // setAttachedFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files)]);
        setFiles([...files, ...e.target.files]);
    };

    const handleFileRemove = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    }

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;

        if(newTitle.length <= 50){
            setTitle(newTitle);
            setTitleError('');
        }
        else{
            setTitleError('제목은 50자를 초과할 수 없습니다.');
        }
    };

    /* const handleSubmit = () => {
        const formData = {
            content: formContent,
            selectedForm: selectedForm,
            approverLine: approverLine,
            referencerLine: referencerLine,
            attachedFiles: attachedFiles
        };
        console.log('기안 완료 : ', formData);
    }; */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (title.length > 50) {
            setTitleError('제목은 50자를 초과할 수 없습니다.');
            alert('제목은 50자를 초과할 수 없습니다.');
            return;
        }

        const formData = new FormData();

        //에디터 내용을 포함한 폼 데이터를 가져오기
        const editorContent = editorRef.current.getContent();


        formData.append('approvalContent', editorContent);
        formData.append('formNo', selectedForm.formNo);
        formData.append('approvalTitle', title);
        formData.append('approver', JSON.stringify(approverLine));
        formData.append('referencer', JSON.stringify(referencerLine));

        //파일 추가
        files.forEach(file => formData.append('multipartFile', file));

        try {
            await dispatch(submitApprovalAPI(formData));
            alert('전자결재가 성공적으로 등록되었습니다.');
        } catch (error) {
            alert('전자결재 등록에 실패했습니다.');
        }

    }

    const setEditableElements = (doc) => {
        const formElements = doc.querySelectorAll('input, td, div[contenteditable="true"]');
        formElements.forEach(element => {
            element.setAttribute('contenteditable', 'true');
        });
        doc.body.querySelectorAll('*:not(input):not(td):not(div[contenteditable="true"])').forEach(element => {
            element.setAttribute('contenteditable', 'false');
        });
    };

    const insertCurrentDate = (doc) => {
        const dateDiv = doc.querySelector('#date div');
        if (dateDiv) {
            const currentDate = new Date().toLocaleDateString();
            dateDiv.textContent = currentDate;
        }
    };

    const removeBogusBrTags = () => {
        if (editorRef.current && !isRemovingBogusBr) {
            setIsRemovingBogusBr(true);
            const doc = editorRef.current.getDoc();
            const bogusBrs = doc.querySelectorAll('br[data-mce-bogus="1"]');
            bogusBrs.forEach(br => br.remove());
            setIsRemovingBogusBr(false);
        }
    };

    const moveToNextEditableElement = (doc, currentElement) => {
        const allEditableElements = doc.querySelectorAll('input,  td[contenteditable="true"], div[contenteditable="true"]');
        const currentIndex = Array.prototype.indexOf.call(allEditableElements, currentElement);

        if (currentIndex < allEditableElements.length - 1) {

            const nextElement = allEditableElements[currentIndex + 1];

            if (nextElement) {
                if (nextElement.tagName === 'INPUT') {
                    nextElement.focus();
                } else {
                    const range = doc.createRange();
                    const sel = window.getSelection();
                    range.setStart(nextElement, 0);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        }
    };

    const openModal = () => {
        console.log('openModal 실행 ');
        setIsModalOpen(true);
        console.log('isModalOpen : ' + isModalOpen);
    };

    const closeModal = () => {
        console.log('closeModal 실행');
        setIsModalOpen(false);
        console.log('isModalOpen : ' + isModalOpen);
    };

    const handleSaveApprovers = (approverLine, referencerLine) => {
        setApproverLine(approverLine);
        setReferencerLine(referencerLine);
    }

    useEffect(() => {
        if (editorRef.current) {
            const doc = editorRef.current.getDoc();
            setEditableElements(doc);
            insertCurrentDate(doc);
            removeBogusBrTags();
        }
    }, []);



    return (
        <>
            <main id="main" className="main">
                <div className={styles.pageTop}>
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
                    <div className={styles.tempSave}>
                        <button>임시저장</button>
                    </div>
                </div>
                <div className={styles.bigContent}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.middleContent}>
                            <div className={styles.insertAppSideLeft} >
                                <SelectFormComponent onSelectForm={handleSelectForm} />
                                <div className={styles.chooseApprover}>
                                    <button className={styles.ApproversBtn} onClick={openModal}>
                                        결재선
                                        <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
                                    </button>
                                </div>
                                <div className={styles.LineBox}>
                                    <div className={styles.approvers}>
                                        <div className={styles.LineTitle}>결재선</div>
                                        <div className={styles.SelectBoxApproverLine} style={{ paddingLeft: '10px' }}>
                                            <table className={styles.SelectBoxApproverTable} style={{ textAlign: 'center' }}>
                                                <thead>
                                                    <tr>
                                                        <th>순번</th>
                                                        <th>부서</th>
                                                        <th>직급명</th>
                                                        <th>이름</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {approverLine.map((approver, index) => (
                                                        <tr key={approver.memberId} className={styles.approvalItem}>
                                                            <td style={{ width: '70px', marginLeft: '10px' }}>{index + 1}</td>
                                                            <td>{approver.departName}</td>
                                                            <td>{approver.positionName}</td>
                                                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{approver.name}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>
                                    <div className={styles.referencers}>
                                        <div className={styles.LineTitle}>참조선</div>
                                        <div className={styles.SelectBoxReferencerLine} style={{ paddingLeft: '10px' }}>
                                            <table className={styles.SelectBoxApproverTable} style={{ textAlign: 'center' }}>
                                                <thead>
                                                    <tr>
                                                        <th>순번</th>
                                                        <th>부서</th>
                                                        <th>직급명</th>
                                                        <th>이름</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {referencerLine.map((referencer, index) => (
                                                        <tr key={referencer.memberId} className={styles.approvalItem}>
                                                            <td style={{ width: '70px', marginLeft: '10px' }}>{index + 1}</td>
                                                            <td>{referencer.departName}</td>
                                                            <td>{referencer.positionName}</td>
                                                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{referencer.name}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.insertAppSideRight}>
                                <UserInfoComponent memberId={memberId} yearFormNo={yearFormNo} />
                                <div className={styles.approvalTitle}>
                                    <input type="text" name="approvalTitle" placeholder="제목" value={title} onChange={handleTitleChange} maxLength={50}/>
                                    {titleError && <div className={styles.titleError}>{titleError}</div>}
                                </div>
                                <TinyEditor
                                    onInit={(evt, editor) => {
                                        editorRef.current = editor;
                                        const doc = editor.getDoc();
                                        setEditableElements(doc);
                                        insertCurrentDate(doc);
                                        removeBogusBrTags();
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
                                                const doc = editor.getDoc();
                                                setEditableElements(doc);
                                                insertCurrentDate(doc);
                                                removeBogusBrTags();
                                            });
                                            editor.on('NodeChange', (e) => {
                                                if (e && e.element && e.element.nodeName === 'TD') {
                                                    console.log("setup NodeChange 실행");
                                                    const paras = e.element.getElementsByTagName('p');
                                                    for (let i = 0; i < paras.length; i++) {
                                                        while (paras[i].firstChild) {
                                                            paras[i].parentNode.insertBefore(paras[i].firstChild, paras[i]);
                                                        }
                                                        paras[i].parentNode.removeChild(paras[i]);
                                                    }
                                                }
                                            });

                                            editor.on('Change', () => {
                                                console.log("setup Change 실행 ")
                                                setTimeout(() => {
                                                    removeBogusBrTags();
                                                }, 100);
                                            });

                                            editor.on('BeforeExecCommand', (e) => {
                                                console.log('setup BeforeExecCommand 실행');
                                                if (e.command === 'InsertLineBreak' || e.command === 'mceInsertNewLine') {
                                                    setTimeout(() => {
                                                        removeBogusBrTags();
                                                    }, 100);
                                                }
                                            });
                                        },

                                        forced_root_block: 'div',
                                        invalid_elements: 'p',
                                    }}
                                />
                                <div className={styles.fileUpload}>
                                    <label htmlFor='fileUploadInput' className={styles.fileUploadLabel}>첨부파일</label>
                                    <input
                                        id="fileUploadInput"
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className={styles.fileUploadInput}
                                    />
                                    <div className={styles.fileList}>
                                        {files.map((file, index) => (
                                            <div key={index} className={styles.fileItem}>
                                                {file.name}
                                                <FontAwesomeIcon
                                                    icon={faTimes}
                                                    className={styles.removeFileIcon}
                                                    onClick={() => handleFileRemove(index)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.insertAppButtons}>
                            <button>취소</button>
                            <button type="submit" onClick={handleSubmit}>등록</button>
                        </div>
                    </form>
                    <ApproverModal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        onSave={handleSaveApprovers}
                        selectedApproverLine={approverLine}
                        selectedReferencerLine={referencerLine}
                    />
                </div>
            </main>

        </>
    )

}
export default ApprovalInsert;