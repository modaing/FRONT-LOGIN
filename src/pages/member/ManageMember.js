import { decodeJwt } from "../../utils/tokenUtils";
import manageMemberCSS from './ManageMember.module.css';
import { useNavigate, Link } from 'react-router-dom';
import { callShowAllMemberListAPI, callDownloadExcelFileAPI } from "../../apis/MemberAPICalls";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

const ManageMember = () => {
    const navigate = useNavigate();
    const [allMemberInfo, setAllMemberInfo] = useState([]);
    const [filteredMemberInfo, setFilteredMemberInfo] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [search, setSearch] = useState('');
    const [searchField, setSearchField] = useState('none');
    const searchButtonRef = useRef(null);

    // Fetch member lists
    const fetchMemberLists = async () => {
        try {
            const memberLists = await callShowAllMemberListAPI();
            if (Array.isArray(memberLists)) {
                const formattedMembers = memberLists.map(member => ({
                    ...member,
                    employedDate: formatDate(member.employedDate)
                }));
                setAllMemberInfo(formattedMembers);
                console.log('formatted members:', formattedMembers);
                setFilteredMemberInfo(formattedMembers); // Initially show all members
                console.log('filteredMemberInfo:',filteredMemberInfo);
            } else {
                console.error('member list is not an array:', memberLists);
            }
        } catch (error) {
            console.error('구성원 리스트 불러 오는데 오류가 발생했습니다:', error);
        }
    };

    const formatDate = (dateArray) => {
        if (Array.isArray(dateArray) && dateArray.length === 3) {
            const [year, month, day] = dateArray;

            const formattedMonth = String(month).padStart(2, '0');
            const formattedDay = String(day).padStart(2, '0');

            return `${year}-${formattedMonth}-${formattedDay}`;
        } else {
            return dateArray;
        }
    }

    // Download Excel file
    const handleDownloadExcelFile = async () => {
        try {
            const downloadList = await callDownloadExcelFileAPI();
            const blob = new Blob([downloadList], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'MemberInfo.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading excel file');
        }
    };

    // Sorting function
    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getValueForSorting = (value) => {
        if (sortConfig.key === 'periodOfWork') {
            return parseFloat(value) || 0;
        }
        return value;
    };

    const sortedMembers = useMemo(() => {
        let sortableMembers = [...filteredMemberInfo];
    
        if (sortConfig.key !== null) {
            sortableMembers.sort((a, b) => {
                const valueA = getValueForSorting(a[sortConfig.key]);
                const valueB = getValueForSorting(b[sortConfig.key]);
    
                if (valueA < valueB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (valueA > valueB) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
    
        return sortableMembers;
    }, [filteredMemberInfo, sortConfig]);
    
    

    useEffect(() => {
        const fetchData = async () => {
            await fetchMemberLists();
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

    const handleSearch = () => {
        if (searchField === 'none') {
            setFilteredMemberInfo(allMemberInfo);
            return;
        }
    
        let results;
        const lowerCaseSearch = search.toLowerCase();
    
        if (searchField === 'name') {
            results = allMemberInfo.filter(member => 
                member.name.toLowerCase().includes(lowerCaseSearch)
            );
        } else if (searchField === 'memberId') {
            results = allMemberInfo.filter(member =>
                String(member.memberId).toLowerCase().includes(lowerCaseSearch)
            );
        } else {
            results = [];
        }
    
        setFilteredMemberInfo(results);
    };

    const handleNameClick = (member) => {
        console.log('member:', member);
        navigate(`${member.memberId}`);
    };

    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>구성원 관리</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item">조직</li>
                        <li className="breadcrumb-item active">구성원 관리</li>
                    </ol>
                </nav>
            </div>

            <div className={`row ${manageMemberCSS.flexedBox}`}>
                <div className={`col-lg-6 ${manageMemberCSS.cardStyle}`}>
                    <div className={`card ${manageMemberCSS.innerStyle}`}>
                        <div className={manageMemberCSS.contentStyle1}>
                            <div className={manageMemberCSS.firstBox}>
                                <div>검색어</div>
                                <select 
                                    className={manageMemberCSS.selectBox} 
                                    value={searchField} 
                                    onChange={(e) => setSearchField(e.target.value)}
                                >   
                                    <option value="none">- 선택 -</option>
                                    <option value="name">이름</option>
                                    <option value="memberId">사번</option>
                                </select>
                                <input 
                                    className={manageMemberCSS.inputBox}
                                    placeholder="검색어를 입력해주세요"
                                    type="text" 
                                    value={search} 
                                    onChange={(e) => setSearch(e.target.value)} 
                                />
                                <button className={manageMemberCSS.searchButton} onClick={handleSearch} ref={searchButtonRef}>검색</button>
                            </div>
                        </div>
                    </div>
                    <div className={manageMemberCSS.buttonClass}>
                        <button className={`notice-cancel-button ${manageMemberCSS.insertButton}`} type='button' onClick={() => navigate('/registerMember')}>구성원 등록</button>
                        {/* <button className={`notice-insert-button ${manageMemberCSS.cancelButton}`}>삭제</button> */}
                    </div>
                </div>
            </div>

            <div className={`row ${manageMemberCSS.flexedBox}`}>
                <div>
                    <div className="card">
                        <div className={manageMemberCSS.contentStyle2}>
                            <button className={manageMemberCSS.downloadButton} onClick={handleDownloadExcelFile}>전체 다운로드</button>
                            {/* <hr className={manageMemberCSS.horizontalLine} /> */}
                        </div>
                        <div className={manageMemberCSS.tableDecoration}>
                            {filteredMemberInfo.length === 0 ? (
                                <div className={manageMemberCSS.noResult}>결과 없는데요... 돌아가</div>
                            ) : (
                            <table className={`table table-hover`}>
                                <thead>
                                    <tr>
                                        <th onClick={() => sortData('memberId')}>
                                            <span>사번</span><i className="bx bxs-sort-alt" />
                                        </th>
                                        <th onClick={() => sortData('name')}>
                                            <span>이름</span><i className="bx bxs-sort-alt" />
                                        </th>
                                        <th onClick={() => sortData('departmentDTO.departName')}>
                                            <span>부서</span><i className="bx bxs-sort-alt" />
                                        </th>
                                        <th onClick={() => sortData('positionDTO.positionName')}>
                                            <span>직급</span><i className="bx bxs-sort-alt" />
                                        </th>
                                        <th onClick={() => sortData('employedDate')}>
                                            <span>입사일</span><i className="bx bxs-sort-alt" />
                                        </th>
                                        <th onClick={() => sortData('periodOfWork')}>
                                            <span>근속년수</span><i className="bx bxs-sort-alt" />
                                        </th>
                                        <th onClick={() => sortData('memberStatus')}>
                                            <span>상태</span><i className="bx bxs-sort-alt" />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {sortedMembers.map((member, index) => ( */}
                                    {/* {allMemberInfo.filter((member) => {
                                        return search.toLowerCase() === '' ? member : member.name.toLowerCase().includes(search) ||
                                        search.toLowerCase() === '' ? member : member.memberId.toLowerCase().includes(search);
                                    }).map((member, index) => ( */}
                                    {sortedMembers.map((member,index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className={manageMemberCSS.memberProfile} onClick={() => handleNameClick(member)}>
                                                    {member.memberId}
                                                </div>
                                            </td>
                                            <td>
                                                <div className={manageMemberCSS.memberProfile} onClick={() => handleNameClick(member)}>
                                                    {member.name}
                                                </div>
                                            </td>
                                            <td>{member.departmentDTO.departName}</td>
                                            <td>{member.positionDTO.positionName}</td>
                                            <td>{member.employedDate}</td>
                                            <td>{member.periodOfWork}</td>
                                            <td>{member.memberStatus}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ManageMember;