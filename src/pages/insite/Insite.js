import { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useDispatch, useSelector } from 'react-redux';
import { callMemberDepartSelectAPI, callLeaveMemberSelectAPI, callCommuteMemberSelectAPI } from '../../apis/InsiteAPICalls';

function Insite() {
    const dispatch = useDispatch();
    const [totalMember, setTotalMember] = useState('');
    const [leaveMembers, setLeaveMembers] = useState('');
    const [workMembers, setWorkMembers] = useState('');
    const [noWorkMembers, noSetWorkMembers] = useState('');
    const [chart, setChart] = useState(false);
    const leaveCountsData = useSelector(state => state.insiteReducer.leaveMember);
    const departCountsData = useSelector(state => state.insiteReducer.memberDepart);
    const commuteMembersData = useSelector(state => state.insiteReducer.commuteMember);

    // promise all을 써서 한번에 데이터를 가져올 수 있게 함
    useEffect(() => {
        Promise.all([
            dispatch(callLeaveMemberSelectAPI()),
            dispatch(callMemberDepartSelectAPI()),
            dispatch(callCommuteMemberSelectAPI()),
        ]).then(([leaveData, departData, commuteData]) => {
            console.log('Leave Data:', leaveData);
            console.log('Depart Data:', departData);
            console.log('Commute Data:', commuteData);
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }, [dispatch]);

    // 2번 차트
    useEffect(() => {
        if (leaveCountsData && leaveCountsData.length > 0) {
            // 휴가자 수
            const totalMembers = leaveCountsData[0][0];
            const leaveCount = leaveCountsData[0][1];
            setLeaveMembers(leaveCount);
            setWorkMembers(totalMembers);
            renderDoughnutChart(leaveCount, totalMembers - leaveCount);
        }
    }, [leaveCountsData]);

    // 3번 차트
    useEffect(() => {
        if (departCountsData && departCountsData.length > 0) {
            const labels = departCountsData.map(item => item[0]); // 부서명
            const data = departCountsData.map(item => item[1]); // 직원 수
            const totalMembers = departCountsData.reduce((acc, curr) => acc + curr[1], 0);
            setTotalMember(totalMembers);
            renderPieChart(labels, data);
        }
    }, [departCountsData]);

    // 메인 차트
    useEffect(() => {
        if (commuteMembersData && commuteMembersData.length > 0) {
            
            const noWorkMembers = commuteMembersData[0][0];
            noSetWorkMembers(noWorkMembers)
            const totalMembers = commuteMembersData[0][1];
            const workMembers = totalMembers - noWorkMembers
            renderMainChart(noWorkMembers, workMembers);
        }
    }, [commuteMembersData]);


    
    /* 차트 */
    const renderDoughnutChart = (leaveCount, workMembers) => {
        const existingDoughnutChart = Chart.getChart('doughnutChart');
        if (existingDoughnutChart) {
            existingDoughnutChart.destroy();
        }
    
        const doughnutChart = new Chart(document.querySelector('#doughnutChart'), {
            type: 'doughnut',
            data: {
                labels: ['휴가자', '미휴가자'],
                datasets: [{
                    data: [leaveCount, workMembers], // 휴가자와 출근자 데이터 설정
                    backgroundColor: ['rgb(100, 99, 132)', 'rgb(200, 162, 235)'],
                    hoverOffset: 4,
                    labels: ['휴가자', '미휴가자'] // 데이터셋에 명 추가
                }]
            },
            options: {
                plugins: {
                    datalabels: {
                        formatter: (value, context) => {
                            const idx = context.dataIndex;
                            const labels = context.chart.data.labels;
                            return labels[idx] + '\n' + value + '명';
                        },
                        color: '#fff',
                        font: {
                            weight: 'bold',
                            size: '14px'
                        }
                    }
                }
            }
        });
    };
    
    const renderPieChart = (labels, data) => {
        const existingPieChart = Chart.getChart('pieChart2');
        if (existingPieChart) {
            existingPieChart.destroy();
        }
    
        // 이어서 새로운 차트를 생성하는 코드 작성
        const pieChart = new Chart(document.getElementById('pieChart2'), {
            plugins: [ChartDataLabels],
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['rgb(173, 216, 230)', 'rgb(70, 130, 180)', 'rgb(119, 136, 153)', 'rgb(119, 136, 180)'],
                    labels: labels // 데이터셋에 명 추가
                }],
            },
            options: {
                plugins: {
                    legend: {
                        display: true,
                    },
                    tooltip: {
                        enabled: true
                    },
                    animation: {
                        duration: 0,
                    },
                    datalabels: {
                        formatter: function (value, context) {
                            var idx = context.dataIndex;
                            return labels[idx] + '\n' + value + '명';
                        },
                        align: 'end',
                        anchor: 'center',
                        textAlign: 'center',
                        font: {
                            weight: 'bold',
                            size: '12px',
                        },
                        color: '#222',
                    },
                }
            }
        });
    };
    
    const renderMainChart = (noWorkMembers, workMembers) => {
        const existingPieChart = Chart.getChart('pieChart');
        if (existingPieChart) {
            existingPieChart.destroy();
        }
    
        const pieChart = new Chart(document.querySelector('#pieChart'), {
            type: 'pie',
            data: {
                labels: ['출근자', '미출근자'],
                datasets: [{
                    data: [noWorkMembers, workMembers],
                    backgroundColor: ['rgb(153,204,255)', 'rgb(051,102,153)'],
                    hoverOffset: 4,
                    labels: ['출근자', '미출근자']
                }]
            }
        });
        setChart(true);
    };
    

    const pageTitleStyle = {
        marginBottom: '20px',
        marginTop: '20px'
    };

    const cardTitleStyle = {
        marginLeft: '20px',
        fontWeight: 'bold'
    };

    const cardSubTitleStyle = {
        marginLeft: '20px',
        fontSize: '22px',
        marginTop: '-30px',
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false // 차트가 지정한 크기로 고정되도록 설정
    };

    const chartStyle = {
        maxHeight: '600px',
        marginBottom: '20px'
    }

    const chartStyles = {
        maxHeight: '220px',
        marginBottom: '20px'
    }

    const cardStyle = {
        marginTop: '-20px'
    }

    return (
        <main id="main" className="main">
            <div className="pagetitle" style={pageTitleStyle}>
                <h1>인사이트</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/static">Home</a></li>
                        <li className="breadcrumb-item">기타</li>
                        <li className="breadcrumb-item active">인사이트</li>
                    </ol>
                </nav>
            </div>
            <div className="row">
                <div className="col-lg-8">
                    <div className="card">
                        <h5 className="card-title" style={cardTitleStyle}>금일 출근 현황</h5>
                        <h5 className="card-title" style={cardSubTitleStyle}>금일 출근자 : {noWorkMembers}명</h5>
                        <canvas id="pieChart" options="options" style={chartStyle}></canvas>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <h5 className="card-title" style={cardTitleStyle}>금일 휴가 인원</h5>
                                <h5 className="card-title" style={cardSubTitleStyle}>금일 휴가자 : {leaveMembers}/{workMembers}명</h5>
                                <canvas id="doughnutChart" options="options" style={chartStyles}></canvas>
                            </div>
                        </div>
                        <div className="col-lg-12 mt-4">
                            <div className="card" style={cardStyle}>
                                <h5 className="card-title" style={cardTitleStyle}>팀 별 사원수</h5>
                                <h5 className="card-title" style={cardSubTitleStyle}>총 사원수 : {totalMember}명</h5>
                                <canvas id="pieChart2" options="options" style={chartStyles}></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Insite;