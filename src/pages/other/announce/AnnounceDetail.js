import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ancDetailAPI } from '../../../apis/other/announce/AncAPICalls';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../../css/other/announce/ancDetail.css';

function AnnounceDetail() {

    const cardTitleStyle = {
        marginLeft: '30px',
    };
    const contentStyle = {
        marginLeft: '100px',
    };

    const marginStyle = {
        marginBottom: '20px'
    }

    const { ancNo } = useParams();
    const [announceDetail, setAnnounceDetail] = useState(null);
    const [announceDetailFiles, setAnnounceDetailFiles] = useState([]);

    useEffect(() => {
        const getAnnounceDetail = async () => {
            try {
                const data = await ancDetailAPI(ancNo);
                setAnnounceDetail(data.announce);
                setAnnounceDetailFiles(data.files);
            } catch (error) {
                console.error(error);
            }
        };
        getAnnounceDetail();
    }, [ancNo]);

    const downloadFile = (fileName, fileContent) => {
        const binary = atob(fileContent);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>공지사항 상세</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item">기타</li>
                        <li className="breadcrumb-item"><Link to="/announcements">공지사항</Link></li>
                        <li className="breadcrumb-item active">상세보기</li>
                    </ol>
                </nav>
            </div>
            <div className="col-lg-12">
                <div className="card">
                    <h5 className="card-title" style={cardTitleStyle}>Notice</h5>
                    <div className="content" style={contentStyle}>
                        {announceDetail && (
                            <React.Fragment>
                                <div className="row mb-3">
                                    <label htmlFor="inputText" className="col-sm-1 col-form-label">제목</label>
                                    <div className="col-sm-10">
                                        <textarea className="textarea" readOnly value={announceDetail.ancTitle} />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputText" className="col-sm-1 col-form-label">작성일</label>
                                    <div className="col-sm-10">
                                        <textarea className="textarea" readOnly value={announceDetail.ancDate} />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputText" className="col-sm-1 col-form-label">작성자</label>
                                    <div className="col-sm-10">
                                        <textarea className="textarea" readOnly value={announceDetail.ancWriter} />
                                    </div>
                                </div>
                                {announceDetailFiles && announceDetailFiles.map((file, index) => (
                                    <div className="row mb-3" key={file.fileNo}>
                                        <label htmlFor="inputText" className="col-sm-1 col-form-label">파일</label>
                                        <div className="col-sm-10">
                                            <div>
                                                <textarea readOnly className="textarea-file">{file.fileName}</textarea>
                                                <button className="downloadButton" onClick={() => downloadFile(file.fileName, file.fileContent)}>다운로드</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <label htmlFor="inputText" className="col-sm-2 col-form-label">본문</label>
                                <div className="row mb-7" style={marginStyle}>
                                    <div className="col-sm-1"></div>
                                    <div className="col-sm-10" >
                                        <textarea className="textareaContent" readOnly value={announceDetail.ancContent}></textarea>
                                    </div>
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default AnnounceDetail;
