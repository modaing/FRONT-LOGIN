import React, { useState, useRef, useEffect } from 'react';
import insertStyles from '../../css/approval/insertApproval.css';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import SelectFormComponent from '../../components/approvals/SelectFormComponent';

/* const Block = Quill.import('blots/block');
class CustomBlock extends Block {}
CustomBlock.blotName = 'custom';
CustomBlock.tagName = 'DIV';
Quill.register(CustomBlock); */

const BlockEmbed = Quill.import('blots/block/embed');
class FormBlot extends BlockEmbed {
    static create(value) {
        let node = super.create();
        node.innerHTML = value;
        return node;
    }

    static value(node) {
        return node.innerHTML;
    }
}
FormBlot.blotName = 'form';
FormBlot.tagName = 'form';
Quill.register(FormBlot);


const ApprovalInsert = () => {

    const [formContent, setFormContent] = useState('');
    const quillRef = useRef(null);

    const handleSelectForm = (selectedForm) => {
        console.log('Selected Form : ', selectedForm);
        if (selectedForm && selectedForm.formShape) {
            const htmlContent = selectedForm.formShape;
            setFormContent(htmlContent); // 선택된 폼의 내용을 설정
            // if (quillRef.current) {
            //     const editor = quillRef.current.getEditor();
            //     editor.clipboard.dangerouslyPasteHTML(htmlContent); // HTML 콘텐츠를 직접 설정
            // }

            setTimeout( () => {
                if(quillRef.current){
                    const editor = quillRef.current.getEditor();
                    // editor.clipboard.dangerouslyPasteHTML(htmlContent);
                    // editor.root.innerHTML = htmlContent;        //잘됐음
                    const delta = editor.clipboard.convert(htmlContent);
                    editor.setContents(delta, 'silent');
                }
            }, 0);
        }
    };

    const handleFormContentChange = (content) => {
        setFormContent(content);                    //에디터 내용이 변경될 떄 상태 업데이트
    };

    const handleSubmit = () => {
        const formData = {
            content: formContent,
        };
        console.log('기안 완료 : ', formData);
    };

    useEffect(() => {
        if (quillRef.current && formContent) {
            console.log('ReactQuill instance : ', quillRef.current);
            console.log("quillRef.current.value" + quillRef.current.value);
            console.log("formContent : " + formContent);
            const editor = quillRef.current.getEditor();
            //  quillRef.current.getEditor().root.innerHTML = formContent; // HTML 콘텐츠를 직접 설정
            // console.log('quillRef.current.getEditor().root.innerHTML :' , quillRef.current.getEditor().root.innerHTML);
            
           /*  if(editor){
                editor.clipboard.dangerouslyPasteHTML(formContent);     // HTML 콘텐츠를 직접 설정
            } */
            // editor.root.innerHTML = formContent;        //잘됐음
            const delta = editor.clipboard.convert(formContent);
            editor.setContents(delta, 'silent');
            
            // editor.clipboard.dangerouslyPasteHTML('<p>메롱</p>');
            // editor.clipboard.dangerouslyPasteHTML('<p>이건왜되고</p>');
            // editor.clipboard.dangerouslyPasteHTML(quillRef.current);
        }
    }, [formContent]);

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video',
        'form'
    ];


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
                            <ReactQuill
                                ref={quillRef}
                                value={formContent}
                                onChange={handleFormContentChange}
                                theme="snow"
                                modules={modules}
                                formats={formats} 
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