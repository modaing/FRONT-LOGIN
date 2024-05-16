import { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { callDepartmentDetailListAPI } from '../../apis/DepartmentAPICalls';
// import { SET_PAGENUMBER } from '../../modules/DepartmentAndPositionModule';
import departmentAndPositionCSS from './departmentAndPosition.module.css';
import { callPositionDetailListAPI } from '../../apis/PositionAPICalls';

function DepartmentAndPosition() {
    // const { leaveInfo, submitPage } = useSelector(state => state.leaveReducer);
    // const { number, content, totalPages } = submitPage || {};
    const [filteredDepartInfo, setFilteredDepartInfo] = useState([]);
    const [filteredPositionInfo, setFilteredPositionInfo] = useState([]);
    const navigate = useNavigate();
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [position, setPosition] = useState([]);
    const [department, setDepartment] = useState([]);
    const searchButtonRef = useRef(null);

    const dispatch = useDispatch();


    const fetchDepartmentDetails = async () => {
        try {
            const departmentDetailList = await callDepartmentDetailListAPI();
            if (Array.isArray(departmentDetailList)) {
                const departmentInfo = departmentDetailList.map(department => ({
                    ...department
                }));
                setDepartment(departmentInfo);
                setFilteredDepartInfo(departmentInfo);
                console.log('department info:', departmentInfo);
            } else {
                console.error ('department details is not an array:', departmentDetailList);
            }
        } catch (error) {
            console.error('부서 리스트를 불러 오는데 오류가 발생했습니다:', error);
        }
    }

    const fetchPositionDetails = async() => {
        try {
            const positionDetailList = await callPositionDetailListAPI();
            if (Array.isArray(positionDetailList)) {
                const positionInfo = positionDetailList.map(position => ({
                    ...position
                }));
                setPosition(positionInfo);
                setFilteredPositionInfo(positionInfo);
                console.log('position info:',positionInfo);
            } else {
                console.error('position details is not an array:', positionDetailList);
            }
        } catch (error) {
            console.error('직급 리스트를 불러 오는데 오류가 발생했습니다:', error);
        }
    }

    useEffect(() => {
        const fetchData = async() => {
            await fetchDepartmentDetails();
            await fetchPositionDetails();
        };
        fetchData();

    }, []);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                searchButtonRef.current.click();
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    }

    const getValueForSorting = (value) => {
        if (sortConfig.key === '') {
            return parseFloat(value) || 0;
        }
        return value;
    }

    const sortedDepartment = useMemo(() => {
        let sortableDepartment = [...filteredDepartInfo];

        if (sortConfig.key !== null) {
            sortableDepartment.sort((a,b) => {
                const valueA = getValueForSorting(a[sortConfig.key]);
                const valueB = getValueForSorting(b[sortConfig.key]);

                if (valueA < valueB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }

                if (valueA > valueB)  {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortableDepartment;
    }, [filteredDepartInfo, sortConfig]);

    const sortedPosition = useMemo(() => {
        let sortablePosition = [...filteredPositionInfo];

        if (sortConfig.key !== null) {
            sortablePosition.sort((a,b) => {
                const valueA = getValueForSorting(a[sortConfig.key]);
                const valueB = getValueForSorting(b[sortConfig.key]);

                if (valueA < valueB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }

                if (valueA > valueB)  {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortablePosition;
    }, [filteredPositionInfo, sortConfig]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         await fetchDepartmentDetails();
    //         await fetchPositionDetails();
    //     };
    
    //     const handleKeyPress = (event) => {
    //         if (event.key === 'Enter') {
    //             searchButtonRef.current.click();
    //         }
    //     };
    
    //     fetchData();
    //     document.addEventListener('keydown', handleKeyPress);
    
    //     return () => {
    //         document.removeEventListener('keydown', handleKeyPress);
    //     };
    // }, [fetchDepartmentDetails, fetchPositionDetails]);    

    // const handlePrevPage = () => {
    //     if (number > 0) {
    //         dispatch({ type: SET_PAGENUMBER, payload: number - 1 });
    //     }
    // };

    // const handleNextPage = () => {
    //     if (number < totalPages - 1) {
    //         dispatch({ type: SET_PAGENUMBER, payload: number + 1 });
    //     }
    // };

    // const handlePageChange = page => dispatch({ type: SET_PAGENUMBER, payload: page });

    return (
        <main id="main" className={`main ${departmentAndPositionCSS.mainPage}`}>
            <div className="pagetitle">
                <h1>구성원 관리</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item">조직</li>
                        <li className="breadcrumb-item active">부서 및 직급 관리</li>
                    </ol>
                </nav>
            </div>
            <div className={`col-lg-12 ${departmentAndPositionCSS.bothPages}`}>
                <div className={`card ${departmentAndPositionCSS.firstPage}`}>
                    <div className={departmentAndPositionCSS.firstBox}>
                        <div className={departmentAndPositionCSS.innerBox}>
                            <div className={departmentAndPositionCSS.searchDepart}>부서명 겁색</div>
                            <input 
                                className={departmentAndPositionCSS.inputBox}
                                placeholder=" 부서명"
                                type="text" 
                                // value={search} 
                                // onChange={(e) => setSearch(e.target.value)} 
                            />
                            <button className={departmentAndPositionCSS.searchButton} ref={searchButtonRef}>검색</button>
                        </div>
                        <div className={departmentAndPositionCSS.buttonClass}>
                            <button className={departmentAndPositionCSS.registerButton}>등록</button>
                            <button className={departmentAndPositionCSS.deleteButton}>삭제</button>
                        </div>
                    </div>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th onClick={() => sortData('departName')}>
                                    <span>부서명</span><i className="bx bxs-sort-alt" />
                                </th>
                                <th>
                                    <span>인원수</span>
                                </th>
                                <th>
                                    <span>부서명 변경</span>
                                </th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {sortedDepartment.map((department,index) => (
                            <tr key={index}>
                                <td>
                                    <div className={departmentAndPositionCSS.memberProfile}>
                                        {department.departName}
                                    </div>
                                </td>
                                <td>
                                    <div className={departmentAndPositionCSS.memberProfile}>
                                        {department.noOfPeople}
                                    </div>
                                </td>
                                <td>변경</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* <nav>
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
                    </nav> */}
                </div>

                <div className={`card ${departmentAndPositionCSS.secondPage}`}>
                    <div className={departmentAndPositionCSS.firstBox}>
                        <div className={departmentAndPositionCSS.innerBox}>
                            <div className={departmentAndPositionCSS.searchDepart}>직급명 겁색</div>
                            <input 
                                className={departmentAndPositionCSS.inputBox}
                                placeholder=" 직급명"
                                type="text"  
                            />
                            <button className={departmentAndPositionCSS.searchButton} ref={searchButtonRef}>검색</button>
                        </div>
                        <div className={departmentAndPositionCSS.buttonClass}>
                            <button className={departmentAndPositionCSS.registerButton}>등록</button>
                            <button className={departmentAndPositionCSS.deleteButton}>삭제</button>
                        </div>
                    </div>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th onClick={() => sortData('positionName')}>
                                    <span>직급명</span><i className="bx bxs-sort-alt" />
                                </th>
                                <th>
                                    <span>인원수</span>
                                </th>
                                <th>
                                    <span>직급명 변경</span>
                                </th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPosition.map((position,index) => (
                            <tr key={index}>
                                <td>
                                    <div className={departmentAndPositionCSS.memberProfile}>
                                        {position.positionName}
                                    </div>
                                </td>
                                <td>
                                    <div className={departmentAndPositionCSS.memberProfile}>
                                        {position.positionLevel}
                                    </div>
                                </td>
                                <td>변경</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* <nav>
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
                    </nav> */}
                </div>
            </div>
        </main>
    );
}

export default DepartmentAndPosition;