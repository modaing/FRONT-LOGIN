import { Editor } from '@tinymce/tinymce-react';

// TinyMCE so the global var exists
// eslint-disable-next-line no-unused-vars
import tinymce from 'tinymce/tinymce';
// DOM model
import 'tinymce/models/dom/model';
// Theme
import 'tinymce/themes/silver';
// Toolbar icons
import 'tinymce/icons/default';
// Editor styles
import 'tinymce/skins/ui/oxide/skin.min.css';

// importing the plugin js
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/help/js/i18n/keynav/en.js';
import 'tinymce/plugins/image';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/save';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';

// importing plugin resources
import 'tinymce/plugins/emoticons/js/emojis';

// Content styles, including inline UI like fake cursors
/* eslint import/no-webpack-loader-syntax: off */
import contentCss from '!!raw-loader!tinymce/skins/content/default/content.min.css';
import contentUiCss from '!!raw-loader!tinymce/skins/ui/oxide/content.min.css';

export default function TinyEditor(props) {
    const { init, ...rest } = props;

    const moveToNextEditableElement = (doc, currentElement) => {
        const allEditableElements = doc.querySelectorAll('input, td[contenteditable="true"], div[contenteditable="true"]');
        const currentIndex = Array.prototype.indexOf.call(allEditableElements, currentElement);

        if (currentIndex < allEditableElements.length - 1) {
            const nextElement = allEditableElements[currentIndex + 1];
            if (nextElement) {
                nextElement.focus();
            } else {
                console.log('다음이 없다');
            }
        }
    };

    return (
        <Editor
            init={{

                skin: false,
                content_css: false,
                content_style: [
                    contentCss,
                    contentUiCss,
                    init.content_style || '',
                    `
                body {
                    contenteditable: false;
                    
                }
                
                #wholeForm {
                    margin-top: 50px;
                }
                table {
                    border-collapse: collapse;
                    width: 100%;
                    border: 1px solid black;
                    table-layout:fixed
                }
            
                tr{
                    height: 70px;
                }
            
                #sup_table {
                    height: 400px;
                }
            
                #sideTable {
                    margin-bottom: 50px;
                }
            
                th,
                td {
                    border: 1px solid #dddddd;
                    text-align: left;
                    padding: 8px;
                    border: 1px solid black;
                    box-sizing: border-box;
                    white-space: normal;
                }
                td{
                    word-break: break-all;
                }
            
                th {
                    background-color: #e7e6e6;
                    width: 150px;
                    text-align: center;
                }
            
            
                .exp_date {
                    text-align: left;
                }
            
                th:first-child,
                td:first-child:not(.exp_date):not(.sup_itemname):not(.sup_price) {
                    text-align: center;
                }
            
                td {
                    padding-left: 10px;
                    padding-right: 10px;
                }
            
                #rei_content {
                    height: 200px;
                }
            
                #abs_reason {
                    height: 200px;
                }
            
                #orders {
                    height: 150px;
                }
            
                #date {
                    margin-top: 80px;
                    margin-bottom : 80px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    height: 50px;
                }
            
                #useDetail {
                    width: calc(20% * 1.6);
                }
            
                #usePrice {
                    width: calc(20% * 1.2);
                }
                #sup_table #sup_header{
                    height: 35px;
                }
                .purchasePrice{
                    height : 35px;
                }
                #purchasePricetr{
                    height: 35px;
                }
                .sup_itemname{
                    text-align : left;
                }
                .sup_price{
                    text-align: right;
                }
                .sup_itemAmount{
                    text-align: right;
                }
            
                #ovt_warning{
                color: red;
                font-weight: 1000;
                }
                #ovt_table td{
                text-align: center;
                }
                .nonContent{
                    height:500px;
                }
                .mce-content-body{
                    scrollbar-color : rgb(241, 255, 190) black;
                },
                .tox-editor-container{
                    z-index: 0;
                }
                .tox:not(.tox-tinymce-inline) .tox-editor-header:not(.tox-editor-dock-transition){
                    z-index: 0;
                }
                .tox .tox-editor-header{
                    z-index: 0;
                }
                .tox-tinymce-aux{
                    z-index:0 !important;
                }
                textarea{
                    width: 100%;
                    resize: none;
                    height: 100%;
                    border: none;
                    font-size: 15px;
                    padding-left: 10px;
                    outline: none;
                }
                
                `
                ].join('\n'),
                plugins: [
                    'advlist', 'anchor', 'autolink', 'autosave', 'charmap', 'code', 'codesample', 'directionality',
                    'emoticons', 'fullscreen', 'help', 'image', 'importcss', 'insertdatetime', 'link', 'lists',
                    'media', 'nonbreaking', 'pagebreak', 'preview', 'quickbars', 'save', 'searchreplace',
                    'table', 'visualblocks', 'visualchars', 'wordcount'
                ],
                toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                height: 1000,
                menubar: false,
                // forced_root_block: 'div',     //기본 블록 요소 설정
                branding: false,
                elementpath: false,
                statusbar: false,
                apiKey: 'rycrpdzecr2jsi6ynnzcievvp4toluceiawzt0dgpbuzkkpk',
                setup: (editor) => {
                    editor.on('init', () => {
                        const doc = editor.getDoc();

                        const dateDiv = doc.querySelector('#date div');
                        if (dateDiv) {
                            dateDiv.innerHTML = '';
                            const currentDate = new Date().toLocaleDateString();
                            dateDiv.textContent = currentDate;
                            console.log(`editor 1 date inserted : ${currentDate}`);
                        }

                        const formElements = doc.querySelectorAll('input, td div[contenteditable="true"], div[contenteditable="true"]');
                        formElements.forEach(element => {
                            element.setAttribute('contenteditable', 'true');
                        });

                        doc.body.querySelectorAll('*:not(input):not(td div[contenteditable="true"]):not(div[contenteditable="true"])').forEach(element => {
                            element.setAttribute('contenteditable', 'false');
                        });
                    });

                    editor.on('keydown', (e) => {
                        if ((e.key === 'Backspace' || e.key === 'Delete') && editor.selection) {
                            const selectedNode = editor.selection.getNode();
                            
                            if (selectedNode.nodeName === 'TD') {
                                e.preventDefault();
                                console.log('Prevented deletion of TD');
                    
                                const range = editor.selection.getRng();
                                const startOffset = range.startOffset;
                                const endOffset = range.endOffset;
                                const isCollapsed = range.collapsed;
                    
                                if (isCollapsed && startOffset === 0 && e.key === 'Backspace') {
                                    // If at the start of the TD and Backspace is pressed
                                    editor.selection.setContent('');
                                } else if (isCollapsed && endOffset === selectedNode.textContent.length && e.key === 'Delete') {
                                    // If at the end of the TD and Delete is pressed
                                    editor.selection.setContent('');
                                } else {
                                    // Default behavior for other cases
                                    editor.selection.setContent('');
                                }
                            }
                        }
                        if (e.key === 'Tab') {
                            e.preventDefault();
                            moveToNextEditableElement(editor.getDoc(), editor.selection.getNode());
                        }
                    });

                    editor.on('BeforeExecCommand', (e) => {
                        if ((e.command === 'Delete' || e.command === 'Backspace') && editor.selection) {
                            const selectedNode = editor.selection.getNode();
                            if (selectedNode.nodeName === 'TD') {
                                e.preventDefault();
                                console.log('Prevented deletion of TD on command');
                    
                                const range = editor.selection.getRng();
                                const startOffset = range.startOffset;
                                const endOffset = range.endOffset;
                                const isCollapsed = range.collapsed;
                    
                                if (isCollapsed && startOffset === 0 && e.command === 'Delete') {
                                    // If at the start of the TD and Delete command is executed
                                    editor.selection.setContent('');
                                } else if (isCollapsed && endOffset === selectedNode.textContent.length && e.command === 'Backspace') {
                                    // If at the end of the TD and Backspace command is executed
                                    editor.selection.setContent('');
                                } else {
                                    // Default behavior for other cases
                                    editor.selection.setContent('');
                                }
                            }
                        }
                    });
                }
            }}
            {...rest}
        />
    );
}
