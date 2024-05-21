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

    // const insertCurrentDate = (doc) => {
    //     const dateDiv = doc.querySelector('#date div');
    //     if(dateDiv){
    //         const currentDate = new Date().toLocaleDateString();
    //         dateDiv.textContent = currentDate;
    //     }
    // };

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
                #titleform {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 50px;
                    margin-bottom: 80px;
                    position: relative;
                }
                /*  .input-container {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    position: relative;
                }
                .input-container:not(input){
                    pointer-events: none;
                }  */
                #titleform input {
                    width: 400px;
                    border: none;
                    border-bottom: 2px solid black;
                    height: 50px;
                    font-size: 20px;
                    text-align: center;
                    outline: none;
                    background: transparent;
                }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        border: 1px solid black;
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
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        height: 150px;
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
                    `
                ].join('\n'),
                plugins: [
                  'advlist', 'anchor', 'autolink', 'autosave', 'charmap', 'code', 'codesample', 'directionality',
                  'emoticons', 'fullscreen', 'help', 'image', 'importcss', 'insertdatetime', 'link', 'lists',
                  'media', 'nonbreaking', 'pagebreak', 'preview', 'quickbars', 'save', 'searchreplace',
                  'table', 'visualblocks', 'visualchars', 'wordcount'
                ],
                toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                height: 1200,
                menubar: false,
                forced_root_block: 'div',     //기본 블록 요소 설정
                branding: false,
                elementpath: false,
                statusbar: false,
                apiKey:'rycrpdzecr2jsi6ynnzcievvp4toluceiawzt0dgpbuzkkpk',
                 setup: (editor) => {
                     editor.on('init', () => {
                         const doc = editor.getDoc();

                         const dateDiv = doc.querySelector('#date div');
                         if(dateDiv){
                            dateDiv.innerHTML = '';
                            const currentDate = new Date().toLocaleDateString();
                            dateDiv.textContent = currentDate;
                            console.log(`editor 1 date inserted : ${currentDate}`);
                         }

                         
                //         insertCurrentDate(doc);     //현재 날짜 삽입
                //         // const titleForm = doc.querySelector('#titleform');
                         const formElements = doc.querySelectorAll('input, td, div[contenteditable="true"]');
                         const titleInput = doc.querySelector('#titleform input');

                //         // if (titleForm) {
                //         //     while (titleForm.firstChild) {
                //         //         titleForm.removeChild(titleForm.firstChild);
                //         //     }
                //         //     titleForm.innerHTML = '<div class="input-container"><input type="text" id="title" placeholder="제목"></div>';
                //         // }

                         formElements.forEach(element => {
                             element.setAttribute('contenteditable', 'true');
                         });

                        doc.body.querySelectorAll('*:not(input):not(td):not(div[contenteditable="true"])').forEach(element => {
                            element.setAttribute('contenteditable', 'false');
                            console.log("contenteditable : false 로 만듬 ")
                        });

                //         //제목 input 포커스 설정
                        if(titleInput){
                            titleInput.addEventListener('click', () => {
                                titleInput.focus();
                            });
                            titleInput.setAttribute('contenteditable', 'true');
                        }
                     });
                    }

                //         editor.on('click', (e) => {
                //             const target = e.target;
                //             if (!target.matches('input, td, div[contenteditable="true"]')) {
                //                 e.preventDefault();
                //                 e.stopImmediatePropagation();
                //             }
                //         });
                //     });
                // }
            }}
            {...rest}
        />
    );
}
