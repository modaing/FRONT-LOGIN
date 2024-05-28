import '../../css/member/hierarchyTree.css';
import { callShowAllMemberListAPI } from '../../apis/MemberAPICalls';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HierarchyTree() {

    const [zoomLevel, setZoomLevel] = useState(1);
    const [organizationalChart, setOrganizationalChart] = useState({ departments: {}, positions: {} });
    const [expandedDepartments, setExpandedDepartments] = useState({});
    const navigate = useNavigate();

    const handleZoomIn = () => {
        setZoomLevel(prevZoomLevel => Math.min(prevZoomLevel + 0.2, 1.6));
    };

    const handleZoomOut = () => {
        setZoomLevel(prevZoomLevel => Math.max(prevZoomLevel - 0.1, 0.6));
    };

    const handleZoomReturn = () => {
        setZoomLevel(1);
    };

    const handleNameClick = (member) => {
        navigate(`/ManageMember/${member.memberId}`);
    };

    const handleDepartmentClick = (departName) => {
        setExpandedDepartments(prevState => ({
            ...prevState,
            [departName]: !prevState[departName]
        }));
    };

    useEffect(() => {
        const fetchMemberLists = async () => {
            try {
                const memberLists = await callShowAllMemberListAPI();
                if (Array.isArray(memberLists)) {
                    const formattedMembers = memberLists.map(member => ({
                        ...member,
                        employedDate: formatDate(member.employedDate)
                    }));
                    const chartData = createOrganizationalChart(formattedMembers);
                    
                    const initialExpandedDepartments = Object.keys(chartData.departments).reduce((acc, dept) => {
                        acc[dept] = true; // set all departments to be expanded by default
                        return acc;
                    }, {});
    
                    setOrganizationalChart(chartData);
                    setExpandedDepartments(initialExpandedDepartments);
                } else {
                    console.error('Member list is not an array:', memberLists);
                }
            } catch (error) {
                console.error('Error fetching member list:', error);
            }
        };
    
        fetchMemberLists();
    }, []);
    

    const formatDate = (dateArray) => {
        if (Array.isArray(dateArray) && dateArray.length === 3) {
            const [year, month, day] = dateArray;
            return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        } else {
            return dateArray;
        }
    };

    const createOrganizationalChart = (memberLists) => {
        const chart = { departments: {}, positions: {} };
    
        memberLists.forEach(member => {
            const { departmentDTO, positionDTO, name, memberId, employedDate } = member;
            const { departName } = departmentDTO;
            const { positionName, positionLevel } = positionDTO;
    
            if (positionName === '대표이사') {
                if (!chart.positions[positionName]) {
                    chart.positions[positionName] = [];
                }
                chart.positions[positionName].push({ name, positionName, memberId, positionLevel, employedDate });
            } else {
                if (!chart.departments[departName]) {
                    chart.departments[departName] = [];
                }
                if (!chart.positions[positionName]) {
                    chart.positions[positionName] = [];
                }
    
                chart.departments[departName].push({ name, positionName, memberId, positionLevel, employedDate });
                chart.positions[positionName].push({ name, departName, positionName, memberId, positionLevel, employedDate });
            }
        });
    
        // Sort the members within each department by positionLevel and then by employedDate
        Object.values(chart.departments).forEach(members => {
            members.sort((a, b) => {
                // Sort by positionLevel
                if (parseInt(a.positionLevel, 10) !== parseInt(b.positionLevel, 10)) {
                    return parseInt(a.positionLevel, 10) - parseInt(b.positionLevel, 10);
                }
                // If positionLevel is the same, sort by employedDate
                const dateA = new Date(a.employedDate);
                const dateB = new Date(b.employedDate);
                return dateA - dateB;
            });
        });
    
        // Sort the members within each position by positionLevel and then by employedDate
        Object.values(chart.positions).forEach(members => {
            members.sort((a, b) => {
                // Sort by positionLevel
                if (parseInt(a.positionLevel, 10) !== parseInt(b.positionLevel, 10)) {
                    return parseInt(a.positionLevel, 10) - parseInt(b.positionLevel, 10);
                }
                // If positionLevel is the same, sort by employedDate
                const dateA = new Date(a.employedDate);
                const dateB = new Date(b.employedDate);
                return dateA - dateB;
            });
        });
    
        return chart;
    };

    // const renderBranch = (members) => {
    //     if (!Array.isArray(members)) return null;

    //     return members.map((member, index) => (
    //         <div key={index} className="branchItem">
    //             <div className="box">
    //                 <div className="box-content" onClick={() => handleNameClick(member)}>
    //                     <span className={`positionTitle ${getPositionClass(member.positionName)}`}>{member.positionName}</span>
    //                     <span className='memberName'>{member.name}</span>
    //                 </div>
    //             </div>
    //         </div>
    //     ));
    // };

    const renderBranch = (members) => {
        if (!Array.isArray(members)) return null;
    
        // Calculate representative director's position
        const repPosition = members.find(member => member.positionName === '대표이사');
        const repElement = document.getElementById(repPosition.memberId);
        const repPositionRect = repElement.getBoundingClientRect();
        const repPositionX = repPositionRect.left + repPositionRect.width / 2;
        const repPositionY = repPositionRect.top + repPositionRect.height;
    
        // Render SVG lines connecting 대표이사 to departments
        const lines = Object.entries(organizationalChart.departments).map(([departName, deptMembers]) => {
            // Calculate department's position
            const deptPosition = deptMembers.find(member => member.positionName === '부서장');
            const deptElement = document.getElementById(deptPosition.memberId);
            const deptPositionRect = deptElement.getBoundingClientRect();
            const deptPositionX = deptPositionRect.left + deptPositionRect.width / 2;
            const deptPositionY = deptPositionRect.top;
    
            // Render SVG line connecting 대표이사 to the department
            return (
                <line
                    key={`${repPosition.memberId}-${departName}`}
                    x1={repPositionX}
                    y1={repPositionY}
                    x2={deptPositionX}
                    y2={deptPositionY}
                    stroke="#000"
                    strokeWidth="2"
                />
            );
        });
    
        return (
            <div className="branchItem">
                {lines}
                {members.map((member, index) => (
                    <div key={index} className="box" id={member.memberId}>
                        <div className="box-content" onClick={() => handleNameClick(member)}>
                            <span className={`positionTitle ${getPositionClass(member.positionName)}`}>{member.positionName}</span>
                            <span className='memberName'>{member.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };
      

    const getPositionClass = (positionName) => {
        // Define CSS classes based on position names
        switch (positionName) {
            case '대표이사':
                return 'positionTitle--representative';
            case '부장':
                return 'positionTitle--head';
            case '차장':
                return 'positionTitle--viceHead';
            case '과장':
                return 'positionTitle--manager';
            default:
                return '';
        }
    };

    const renderPositions = () => {
        const predefinedPositions = ['대표이사', '부장', '차장', '과장'];
    
        return (
            <div className="positionsContainer">
                {predefinedPositions.map((position, index) => {
                    const members = organizationalChart.positions[position];
                    if (!members) return null;

                    if (position === '대표이사') {
                        // Render 대표이사 in its current style
                        return (
                            <div key={index} className="positionWrapper">
                                <div className="flexedMembers">{renderBranch(members)}</div>
                            </div>
                        );
                    } else {
                        // Render 부장, 차장, 과장 in the same style as departments
                        const groupedByDepartment = members.reduce((acc, member) => {
                        if (!acc[member.departName]) {
                        acc[member.departName] = [];
                        }
                        acc[member.departName].push(member);
                        return acc;
                        }, {});
                        return (
                            <div key={index} className="positionWrapper horizontal">
                                {Object.entries(groupedByDepartment).map(([departName, members], index) => (
                                    <div key={index} className="department">
                                        <div className="departBox" onClick={() => handleDepartmentClick(departName)}>
                                            <h2>{departName}</h2>
                                        </div>
                                        {expandedDepartments[departName] && <div className="branch">{renderBranch(members)}</div>}
                                    </div>
                                ))}
                            </div>
                        );
                    }
                })}
            </div>
        );
    };
    
    const renderDepartments = () => {
        const totalWidth = window.innerWidth; // Get the total width of the viewport
        const departmentCount = Object.keys(organizationalChart.departments).length;
        const departmentWidth = 300; // Width of each department item
        const departmentsPerRow = Math.floor(totalWidth / departmentWidth); // Calculate the number of departments per row
    
        const visibleDepartments = Object.entries(organizationalChart.departments).slice(0, departmentsPerRow); // Slice the departments based on the number of departments per row
    
        return (
            <div className="departmentsContainer">
                {visibleDepartments.map(([departName, members]) => (
                    <div key={departName} className="department">
                        <div className="departBox" onClick={() => handleDepartmentClick(departName)}>
                            <h2>{departName}</h2>
                        </div>
                        {expandedDepartments[departName] && <div className="branch">{renderBranch(members)}</div>}
                    </div>
                ))}
            </div>
        );
    };
    
    return (
        <main id="main" className="main2Pages">
            <div className='firstPage'>
                <div className="pagetitle">
                    <h1>조직도</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item">조직</li>
                            <li className="breadcrumb-item active">조직도</li>
                        </ol>
                    </nav>
                </div>
                <div className="rowStyle card columnStyle">
                    <div className="zoomControls">
                        <i
                            style={{ cursor: 'pointer' }}
                            className="ri ri-zoom-in-line ri-2x p-2"
                            onClick={handleZoomIn}
                        ></i>
                        <i
                            style={{ cursor: 'pointer' }}
                            className="ri ri-zoom-out-line ri-2x p-2"
                            onClick={handleZoomOut}
                        ></i>
                        {zoomLevel !== 1 && (
                            <i
                                style={{ cursor: 'pointer' }}
                                className="ri  ri-refresh-line ri-2x p-2"
                                onClick={handleZoomReturn}
                            ></i>
                        )}
                    </div>
    
                    <div className="chartContainer" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center', transition: 'transform 0.3s' }}>
                        {/* Render your organizational chart content here */}
                        <div className="flexedUpperPositions">
                            {renderPositions()}
                        </div>
                        <div className="departmentsContainer">
                            {renderDepartments()}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default HierarchyTree;