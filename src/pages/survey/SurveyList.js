import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { callInsertSurvey, callInsertSurveyResponse, callSelectSurveyListAPI } from '../../apis/SurveyAPICalls';
import { SET_PAGENUMBER } from '../../modules/SurveyModule';
import SurveyModal from './SurveyModal';
import { decodeJwt } from '../../utils/tokenUtils';
import { renderSurveyList } from '../../utils/SurveyUtil';
import '../../css/survey/SurveyList.css'
import '../../css/common.css'
import SurveyInsertModal from './SurveyInsertModal';


function SurveyList() {
    const { page } = useSelector(state => state.surveyReducer);
    const { number, content, totalPages } = page || {};
    const [properties, setProperties] = useState('surveyNo');
    const [direction, setDirection] = useState('DESC');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInsertModalOpen, setIsInsertModalOpen] = useState(false);
    const [survey, setServey] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const memberId = decodeJwt(window.localStorage.getItem("accessToken")).memberId;
    const name = decodeJwt(window.localStorage.getItem("accessToken")).name;

    const dispatch = useDispatch();

    // 조회 관련 핸들러
    const handlePageChange = page => dispatch({ type: SET_PAGENUMBER, payload: page });

    const handlePrevPage = () => {
        if (number > 0) {
            dispatch({ type: SET_PAGENUMBER, payload: number - 1 });
        }
    };

    const handleNextPage = () => {
        if (number < totalPages - 1) {
            dispatch({ type: SET_PAGENUMBER, payload: number + 1 });
        }
    };

    const handleSort = (propertie) => {
        setProperties(propertie);
        setDirection(direction === 'DESC' ? 'ASC' : 'DESC');
    }

    // CUD 관련 핸들러
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleInsertOpenModal = () => {
        setIsInsertModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsInsertModalOpen(false);
    };

    const handleInsertResponse = response => {
        const requestData = {
            surveyAnswer: response,
            memberId
        };
        dispatch(callInsertSurveyResponse(requestData));
    };

    const handleInsertSurvey = ({ title, start, end, answerFilter }) => {
        const requestData = {
            surveyDTO: {
                surveyTitle: title,
                surveyStartDate: start,
                surveyEndDate: end,
                memberId
            },
            answers: answerFilter
        };
        console.log(requestData);
        dispatch(callInsertSurvey(requestData));
    };

    useEffect(() => {
        setIsLoading(true);
        dispatch(callSelectSurveyListAPI(number, properties, direction, memberId))
            .finally(() => setIsLoading(false));
    }, [number, properties, direction]);


    return <>
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>수요조사</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    </ol>
                </nav>
                <div className="leaveHeader">
                    <div> </div>
                    <span className="insertSurvey" onClick={handleInsertOpenModal} >수요조사 등록</span>
                </div>
            </div>
            <div className="col-lg-12">
                <div className="card">
                    <div className="surveyListContent" >
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('surveyNo')}>
                                        <span>번호</span><i className="bx bxs-sort-alt"></i>
                                    </th>

                                    <th onClick={() => handleSort('surveyTitle')} style={{ width: '20%' }}>
                                        <span>제목</span><i className="bx bxs-sort-alt"></i>
                                    </th>

                                    <th><span>시작 일자</span></th>

                                    <th><span>마감 일자</span></th>

                                    <th><span>작성자</span></th>

                                    <th><span></span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    // 로딩 중이면 로딩 메시지 표시
                                    isLoading ? (
                                        <tr>
                                            <td colSpan="6" className="loadingText"></td>
                                        </tr>
                                    ) : (
                                        // 로딩 중이 아니면 실제 데이터 표시
                                        renderSurveyList(content, handleOpenModal, setServey)
                                    )}
                            </tbody>
                        </table>

                        <nav >
                            <ul className="pagination">

                                <li className={`page-item ${number === 0 && 'disabled'}`}>
                                    <button className="page-link" onClick={handlePrevPage}>◀</button>
                                </li>

                                {[...Array(totalPages).keys()].map((page, index) => (
                                    <li key={index} className={`page-item ${number === page && 'active'}`}>
                                        <button className="page-link" onClick={() => {
                                            console.log('[page]', page);
                                            handlePageChange(page)
                                        }}>
                                            {page + 1}
                                        </button>
                                    </li>
                                ))}

                                <li className={`page-item ${number === totalPages - 1 && 'disabled'}`}>
                                    <button className="page-link" onClick={handleNextPage}>▶</button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </main>
        <SurveyModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleInsertResponse} survey={survey} />
        <SurveyInsertModal isOpen={isInsertModalOpen} onClose={handleCloseModal} onSave={handleInsertSurvey} name={name} />

    </>
}

export default SurveyList;