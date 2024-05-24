import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { callDepartmentDetailListAPI } from '../../apis/DepartmentAPICalls';
// import { SET_PAGENUMBER } from '../../modules/DepartmentAndPositionModule';
import DepartNameModal from './DepartNameModal';
import departmentAndPositionCSS from './departmentAndPosition.module.css';
import { callPositionDetailListAPI } from '../../apis/PositionAPICalls';
import DepartRegistModal from './DepartRegistModal';
import PositionRegisterModal from './PositionRegisterModal';
import PositionNameModal from './PositionNameModal';
import DepartDeleteModal from './DepartDeleteModal';
import PositionDeleteModal from './PositionDeleteModal';

function DepartmentAndPosition() {
    // const { leaveInfo, submitPage } = useSelector(state => state.leaveReducer);
    // const { number, content, totalPages } = submitPage || {};
    const [filteredDepartInfo, setFilteredDepartInfo] = useState([]);
    const [filteredPositionInfo, setFilteredPositionInfo] = useState([]);
    const navigate = useNavigate();
    const [departmentSortConfig, setDepartmentSortConfig] = useState({ key: null, direction: 'ascending' });
    const [positionSortConfig, setPositionSortConfig] = useState({ key: null, direction: 'ascending' });
    const [position, setPosition] = useState([]);
    const [department, setDepartment] = useState([]);
    const searchButtonRef1 = useRef(null);
    const searchButtonRef2 = useRef(null);
    const [changePositionNameModalVisible, setChangePositionNameModalVisible] = useState(false);
    const [registerDepartmentModalVisible, setRegisterDepartmentModalVisible] = useState(false);
    const [changeDepartmentNameModalVisible, setChangeDepartmentNameModalVisible] = useState(false);
    const [registerPositionModalVisible, setRegisterPositionModalVisible] = useState(false);
    const [deleteDepartmentModalVisible, setDeleteDepartmentModalVisible] = useState(false);
    const [deletePositionModalVisible, setDeletePositionModalVisible] = useState(false);
    const [departmentInfos, setDepartmentInfos] = useState('');
    const [positionInfos, setPositionInfos] = useState('');
    // const [currentPositionName, setCurrentPositionName] = useState('');
    // const [search, setSearch] = useState('');
    const [positionSearch, setPositionSearch] = useState('');
    const [departSearch, setDepartSearch] = useState('');

    const dispatch = useDispatch();


    /* 부서 정보 가져오기 */
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
                console.log('department:',department);
                console.log('filteredDepartInfo:', filteredDepartInfo);
            } else {
                console.error ('department details is not an array:', departmentDetailList);
            }
        } catch (error) {
            console.error('부서 리스트를 불러 오는데 오류가 발생했습니다:', error);
        }
    }

    /* 직급 정보 가져오기 */
    const fetchPositionDetails = async() => {
        try {
            const positionDetailList = await callPositionDetailListAPI();
            if (Array.isArray(positionDetailList)) {
                // const positionInfo = positionDetailList.map(position => ({
                //     ...position
                // }));
                setPosition(positionDetailList);
                setFilteredPositionInfo(positionDetailList);
                console.log('filteredPositionInfo:',filteredPositionInfo);
                // console.log('position info:',positionInfo);
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
                searchButtonRef1.current.click();
                searchButtonRef2.current.click();
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    const sortData1 = (key) => {
        let direction = 'ascending';
        if (departmentSortConfig.key === key && departmentSortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setDepartmentSortConfig({ key, direction });
    }

    const sortData2 = (key) => {
        let direction = 'ascending';
        if (positionSortConfig.key === key && positionSortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setPositionSortConfig({ key, direction });
    }

    const getValueForSorting = (value) => {
        if (positionSortConfig.key === 'positionLevel' || departmentSortConfig.key === 'noOfPeople') {
            return parseFloat(value) || 0;
        }
        return value;
    }

    /* 부서 정렬 */
    const sortedDepartment = useMemo(() => {
        let sortableDepartment = [...filteredDepartInfo];

        if (departmentSortConfig.key !== null) {
            sortableDepartment.sort((a,b) => {
                const valueA = getValueForSorting(a[departmentSortConfig.key]);
                const valueB = getValueForSorting(b[departmentSortConfig.key]);

                if (valueA < valueB) {
                    return departmentSortConfig.direction === 'ascending' ? -1 : 1;
                }

                if (valueA > valueB)  {
                    return departmentSortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortableDepartment;
    }, [filteredDepartInfo, departmentSortConfig]);

    /* 직급 정렬 */
    const sortedPosition = useMemo(() => {
        let sortablePosition = [...filteredPositionInfo];

        if (positionSortConfig.key !== null) {
            sortablePosition.sort((a,b) => {
                const valueA = getValueForSorting(a[positionSortConfig.key]);
                const valueB = getValueForSorting(b[positionSortConfig.key]);

                if (valueA < valueB) {
                    return positionSortConfig.direction === 'ascending' ? -1 : 1;
                }

                if (valueA > valueB)  {
                    return positionSortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortablePosition;
    }, [filteredPositionInfo, positionSortConfig]);

    /* 부서 검색 */
    const handleSearchForDepartment = () => {
        let results;
        if (departSearch.trim() === ''){
            setFilteredDepartInfo(department);
        } else {
            results = department.filter(department=> department.departName.toLowerCase().includes(departSearch.toLowerCase()));
            setFilteredDepartInfo(results);
        };
    }

    /* 직급 검색 */
    const handleSearchForPosition = () => {
        let results;
        if (positionSearch.trim() === '') {
            setFilteredPositionInfo(position);
        } else {
            results = position.filter(position => position.positionName.toLowerCase().includes(positionSearch.toLowerCase()));
            setFilteredPositionInfo(results);
        };
    }

    /* 모달창 띄우는 기능 구현 */
    const handlePositionNameChange = (position) => {
        setPositionInfos(position);
        setChangePositionNameModalVisible(true);
        window.history.replaceState(null, '', `/departmentAndPosition/${position.positionName}`)
    }

    const handleDepartmentNameChange = (department) => {
        setDepartmentInfos(department);
        setChangeDepartmentNameModalVisible(true);
        window.history.replaceState(null, '', `/departmentAndPosition/${department.departNo}`)
    }

    const handleDeletePosition = () => {
        setDeletePositionModalVisible(true);
    }

    const handleDeleteDepartment = () => {
        setDeleteDepartmentModalVisible(true);
    }

    const handleRegisterDepartment = () => {
        setRegisterDepartmentModalVisible(true);
    }

    const handleRegisterPosition = () => {
        setRegisterPositionModalVisible(true);
    }



    const handleCloseModal = () => {
        setDeletePositionModalVisible(false);
        setDeleteDepartmentModalVisible(false);
        setChangeDepartmentNameModalVisible(false);
        setChangePositionNameModalVisible(false);
        setRegisterDepartmentModalVisible(false);
        setRegisterPositionModalVisible(false);
    }

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
                                value={departSearch} 
                                onChange={(e) => setDepartSearch(e.target.value)} 
                            />
                            <button className={departmentAndPositionCSS.searchButton} onClick={handleSearchForDepartment} ref={searchButtonRef1}>검색</button>
                        </div>
                        <div className={departmentAndPositionCSS.buttonClass}>
                            <button className={departmentAndPositionCSS.registerButton} onClick={handleRegisterDepartment}>등록</button>
                            <button className={departmentAndPositionCSS.deleteButton} onClick={handleDeleteDepartment}>삭제</button>
                        </div>
                    </div>
                    {filteredDepartInfo.length === 0 ? (
                        <div className="noResult">
                        <i class="bi exclamation-circle"></i>
                        <div className="noResultBox">
                            <div className="noResultText1">검색결과 없음</div><br />
                            <div className="noResultText2">모든 단어의 맞춤법이 정확한지 확인하거나 다른 검색어로 검색해 보세요</div>
                        </div>
                    </div>
                    ): (
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th onClick={() => sortData1('departName')}>
                                    <span>부서명</span><i className="bx bxs-sort-alt" />
                                </th>
                                <th onClick={() => sortData1('noOfPeople')}>
                                    <span>인원수</span><i className="bx bxs-sort-alt" />
                                </th>
                                <th>
                                    <span>부서명 변경</span>
                                </th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {sortedDepartment.map((department,index) => (
                            <tr key={index}>
                                <td className={departmentAndPositionCSS.alignCenter}>
                                    <div className={departmentAndPositionCSS.memberProfile}>
                                        {department.departName}
                                    </div>
                                </td>
                                <td>
                                    <div className={departmentAndPositionCSS.memberProfile}>
                                        {department.noOfPeople}
                                    </div>
                                </td>
                                <td>
                                    <button className={departmentAndPositionCSS.changeButton} onClick={() => handleDepartmentNameChange(department)}>변경</button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                </div>

                <div className={`card ${departmentAndPositionCSS.secondPage}`}>
                    <div className={departmentAndPositionCSS.firstBox}>
                        <div className={departmentAndPositionCSS.innerBox}>
                            <div className={departmentAndPositionCSS.searchDepart}>직급명 겁색</div>
                            <input 
                                className={departmentAndPositionCSS.inputBox}
                                placeholder=" 직급명"
                                type="text"
                                value={positionSearch} 
                                onChange={(e) => setPositionSearch(e.target.value)} 
                            />
                            <button className={departmentAndPositionCSS.searchButton} onClick={handleSearchForPosition} ref={searchButtonRef2}>검색</button>
                        </div>
                        <div className={departmentAndPositionCSS.buttonClass}>
                            <button className={departmentAndPositionCSS.registerButton} onClick={handleRegisterPosition}>등록</button>
                            <button className={departmentAndPositionCSS.deleteButton} onClick={handleDeletePosition}>삭제</button>
                        </div>
                    </div>
                    {filteredPositionInfo.length === 0 ? (
                        <div className="noResult">
                        <i class="bi exclamation-circle"></i>
                        <div className="noResultBox">
                            <div className="noResultText1">검색결과 없음</div><br />
                            <div className="noResultText2">모든 단어의 맞춤법이 정확한지 확인하거나 다른 검색어로 검색해 보세요</div>
                        </div>
                    </div>
                    ): (
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th onClick={() => sortData2('positionName')}>
                                    <span>직급명</span><i className="bx bxs-sort-alt" />
                                </th>
                                <th onClick={() => sortData2('positionLevel')}>
                                    <span>직급 레벨</span><i className="bx bxs-sort-alt" />
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
                                <td>
                                    <button className={departmentAndPositionCSS.changeButton} onClick={() => handlePositionNameChange(position)}>변경</button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                </div>
            </div>
            <PositionDeleteModal visible={deletePositionModalVisible} onClose={handleCloseModal} positionInformation={positionInfos} />
            <DepartDeleteModal visible={deleteDepartmentModalVisible} onClose={handleCloseModal} departmentInformation={departmentInfos}/>
            <PositionRegisterModal visible={registerPositionModalVisible} onClose={handleCloseModal} positionInformation={positionInfos}/>
            <PositionNameModal visible={changePositionNameModalVisible} onClose={handleCloseModal} positionInformation={positionInfos} />
            <DepartRegistModal visible={registerDepartmentModalVisible} onClose={handleCloseModal} departmentInformation={departmentInfos} />
            <DepartNameModal visible={changeDepartmentNameModalVisible} onClose={handleCloseModal} departmentInformation={departmentInfos} />
        </main>
    );
}

export default DepartmentAndPosition;