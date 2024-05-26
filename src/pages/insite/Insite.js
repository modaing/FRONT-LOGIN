import { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useDispatch, useSelector } from 'react-redux';
import { callMemberDepartSelectAPI, callLeaveCommuteCountsAPI, callMemberBirthdayCountsAPI } from '../../apis/InsiteAPICalls';
import { maxWidth } from '@mui/system';

function Insite() {
    const dispatch = useDispatch();
    const [totalMember, setTotalMember] = useState('');
    const [unCommuteMember, setUnCommuteMember] = useState('');
    const [todayCommuteCount, setTodayCommuteCount] = useState('');
    const [leaveCount, setLeaveCount] = useState('');
    const [chart, setChart] = useState(false);
    const departCountsData = useSelector(state => state.insiteReducer.memberDepart);
    const leaveCommuteData = useSelector(state => state.insiteReducer.leaveCommuteCounts);
    const memberBirthdayData = useSelector(state => state.insiteReducer.memberBirthdayCounts);

    // promise all을 써서 한번에 데이터를 가져올 수 있게 함
    useEffect(() => {
        Promise.all([
            dispatch(callMemberDepartSelectAPI()),
            dispatch(callLeaveCommuteCountsAPI()),
            dispatch(callMemberBirthdayCountsAPI())
        ]).then(([departData, leaveCommuteData, memberBirthdayData]) => {
            console.log('Depart Data:', departData);
            console.log('leaveCommute Data:', leaveCommuteData);
            console.log('memberBirthday Data:', memberBirthdayData);
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }, [dispatch]);

    // 메인차트 -> 휴가자 + 출근자
    useEffect(() => {
        if (leaveCommuteData != null) {
            const { leaveCount, todayCommuteCount, totalMemberCount } = leaveCommuteData;
            const unCommuteMemberCount = totalMemberCount - leaveCount - todayCommuteCount;

            setUnCommuteMember(unCommuteMemberCount);
            setTodayCommuteCount(todayCommuteCount);
            setLeaveCount(leaveCount)
            renderMainChart(leaveCount, todayCommuteCount, unCommuteMemberCount);
        } else {
            console.log('Leave Commute Data is empty or undefined.');
        }
    }, [leaveCommuteData]);


    useEffect(() => {
        if (memberBirthdayData && memberBirthdayData.length > 0) {

            const existingChart = Chart.getChart('barChart');
            if (existingChart) {
                existingChart.destroy();
            }

            const monthData = {}; // 월별 데이터를 저장할 객체
            const birthdaysThisWeek = {}; // 이번 주 생일자 정보를 저장할 객체
            const thisWeekNames = []; // 이번 주 생일자 이름을 저장할 배열
            const todaysBirthdays = []; // 오늘 생일자 목록을 저장할 배열

            // 현재 날짜를 가져오는 함수
            const today = new Date().toLocaleDateString();

            // 함수: 월 숫자를 해당 월 이름으로 변환
            const getMonthName = month => {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return monthNames[parseInt(month) - 1];
            };

            // birthdaysList 변수를 먼저 선언
            const birthdaysList = document.getElementById('birthdaysList');
            // 이후 코드에 birthdaysList를 사용하는 부분을 이동

            // 데이터 가공
            memberBirthdayData.forEach(item => {
                const month = item[0]; // 월 데이터
                const birthdayCount = item[1]; // 월별 생일자 수
                const name = item[2]; // 해당 월에 생일을 맞이한 사람의 이름
                const birthday = new Date(item[3]); // 해당 월에 생일을 맞이한 사람의 생일

                // 생일이 오늘과 일치하는 경우 오늘 생일자 목록에만 추가
                if (birthday.getMonth() === new Date().getMonth() && birthday.getDate() === new Date().getDate()) {
                    // 중복되는 이름인지 확인하고 없으면 추가
                    if (!todaysBirthdays.includes(name)) {
                        todaysBirthdays.push(name); // 오늘 생일자 목록에 추가
                    }
                } else {
                    // 오늘 생일자가 아닌 경우에만 thisWeekNames에 추가
                    // 중복되는 이름인지 확인하고 없으면 추가
                    if (!thisWeekNames.includes(name)) {
                        thisWeekNames.push(name);
                        const abbreviatedNames = thisWeekNames.join(', '); // 쉼표 추가하는 부분
                        const li = document.createElement('li');
                        li.textContent = `금주 생일자 : ${abbreviatedNames}`;
                        birthdaysList.appendChild(li);
                    }
                }

                // 중복된 데이터 제외하고 월별 생일자 수 계산
                if (!monthData[month]) {
                    monthData[month] = {
                        month: getMonthName(month), // 월 이름으로 변경
                        birthdayCount: 0 // 초기값은 0으로 설정
                    };
                }
                // 중복된 데이터가 있을 때만 생일자 수를 1 증가시킴
                if (birthdayCount > 0) {
                    monthData[month].birthdayCount += 1;
                }

                // 중복된 데이터 제외하고 해당 월에 생일을 맞이한 사람의 이름과 생일 데이터 추가
                if (name && birthday && !birthdaysThisWeek[month]) {
                    birthdaysThisWeek[month] = [];
                }
                if (!todaysBirthdays.includes(name) && !thisWeekNames.includes(name)) {
                    thisWeekNames.push(name);
                }
            });

            const thisMonthBirthdayCount = memberBirthdayData.reduce((acc, item) => {
                const month = item[0];
                const birthdayCount = item[1];
                acc[month] = birthdayCount;
                return acc;
            }, {});

            // 바 차트 생성
            const ctx = document.getElementById('barChart').getContext('2d');
            const labels = [];
            const birthdayCounts = [];

            // 월별 데이터를 순회하면서 labels와 birthdayCounts 배열에 데이터 추가
            for (let i = 1; i <= 12; i++) {
                const monthName = getMonthName(i);
                labels.push(monthName);
                birthdayCounts.push(thisMonthBirthdayCount[i] || 0);
            }

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '월 별 생일자',
                        data: birthdayCounts,
                        backgroundColor: [
                            'rgba(0, 0, 255, 0.2)',      // Blue
                            'rgba(65, 105, 225, 0.2)',   // Royal Blue
                            'rgba(0, 191, 255, 0.2)',    // Deep Sky Blue
                            'rgba(30, 144, 255, 0.2)',   // Dodger Blue
                            'rgba(70, 130, 180, 0.2)',   // Steel Blue
                            'rgba(25, 25, 112, 0.2)',    // Midnight Blue
                            'rgba(0, 206, 209, 0.2)',    // Dark Turquoise
                            'rgba(32, 178, 170, 0.2)',   // Light Sea Green
                            'rgba(95, 158, 160, 0.2)',   // Cadet Blue
                            'rgba(176, 224, 230, 0.2)',  // Powder Blue
                            'rgba(135, 206, 250, 0.2)',  // Light Sky Blue
                            'rgba(70, 130, 180, 0.2)'    // Sky Blue

                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            if (birthdaysList) { // 엘리먼트가 존재하는지 확인
                birthdaysList.innerHTML = ''; // 기존 리스트 초기화

                // 금주 생일자 목록 출력
                const li = document.createElement('li');
                if (thisWeekNames.length > 0) {
                    const abbreviatedNames = thisWeekNames.join(', ').replace(/^, /, ''); // 맨 앞의 쉼표 제거
                    li.textContent = `금주 생일자 : ${abbreviatedNames}`;
                } else {
                    li.textContent = `금주 생일자 : -`;
                }
                birthdaysList.appendChild(li);

                // 오늘 생일자 목록 출력
                if (todaysBirthdays.length > 0) {
                    const todayLi = document.createElement('li');
                    todayLi.textContent = `금일 생일자 : ${todaysBirthdays.join(', ')}`;
                    todayLi.style.color = '#6B66FF'; // 원하는 색상으로 변경하세요
                    birthdaysList.appendChild(todayLi);
                } else {
                    const todayLi = document.createElement('li');
                    todayLi.textContent = `금일 생일자 : -`;
                    birthdaysList.appendChild(todayLi);
                }

                // 오늘 생일자 목록 출력
                const todaysBirthdaysList = document.getElementById('todaysBirthdaysList');
                if (todaysBirthdaysList) {
                    todaysBirthdaysList.innerHTML = ''; // 기존 리스트 초기화
                    todaysBirthdays.forEach(name => {
                        const li = document.createElement('li');
                        li.textContent = name;
                        todaysBirthdaysList.appendChild(li); // 금일 생일자 목록에 추가
                    });
                }
            }
        }
    }, [memberBirthdayData]);


    // 숫자로 표시된 월을 이름으로 변경하는 함수
    function getMonthName(monthNumber) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthNames[parseInt(monthNumber) - 1];
    }

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


    const renderPieChart = (labels, data) => {
        const existingPieChart = Chart.getChart('pieChart2');
        if (existingPieChart) {
            existingPieChart.destroy();
        }

        const pieChart = new Chart(document.getElementById('pieChart2'), {
            plugins: [ChartDataLabels],
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['rgb(173, 216, 230)', 'rgb(70, 130, 180)', 'rgb(119, 136, 153)', 'rgb(119, 136, 180)'],
                    labels: labels
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


    const renderMainChart = (leaveCounts, todayCommuteCount, unCommuteMemberCount) => {
        const existingPieChart = Chart.getChart('pieChart');
        if (existingPieChart) {
            existingPieChart.destroy();
        }

        const pieChart = new Chart(document.querySelector('#pieChart'), {
            type: 'pie',
            data: {
                labels: ['출근자', '미출근자', '휴가자'],
                datasets: [{
                    data: [todayCommuteCount, unCommuteMemberCount, leaveCounts],
                    backgroundColor: ['rgb(135, 206, 250)', 'rgb(70, 130, 180)', 'rgb(30, 144, 255)'],
                    hoverOffset: 4
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: true
                    },
                    datalabels: {
                        formatter: (value, context) => {
                            const idx = context.dataIndex;
                            const labels = ['출근자', '미출근자', '휴가자'];
                            return labels[idx] + '\n' + value + '명';
                        },
                        align: 'end',
                        anchor: 'center',
                        textAlign: 'center',
                        color: '#222',
                        font: {
                            weight: 'bold',
                            size: '12px',
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
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

    const cardSubTitleStyle2 = {
        marginLeft: '20px',
        fontSize: '20px',
        marginTop: '-30px',
    };

    const cardSubTitleStyle3 = {
        marginLeft: '20px',
        fontSize: '20px',
        marginTop: '-42px',
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false // 차트가 지정한 크기로 고정되도록 설정
    };

    const chartStyle = {
        maxHeight: '600px',
        marginBottom: '10px'
    }

    const chartStyles = {
        maxHeight: '220px',
        marginBottom: '15px'
    }

    const barChartStyles = {
        maxHeight: '220px',
        marginBottom: '41px',
        marginLeft: '10px',
        maxWidth: '400px',
        marginTop: '10px'
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
                        <h6 className="card-title" style={cardSubTitleStyle2}>금일 미출근자 : {unCommuteMember}명</h6>
                        <h6 className="card-title" style={cardSubTitleStyle3}>금일 휴가자 : {leaveCount}명 / 금일 출근자 : {todayCommuteCount}명</h6>
                        <canvas id="pieChart" options="options" style={chartStyle}></canvas>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <h5 className="card-title" style={cardTitleStyle}>월별, 주별, 일별 생일자 현황 </h5>
                                <h5 style={{ listStyleType: 'none', marginLeft: '20px', marginTop: '-15px', color: '#163a63', fontSize: '20px' }} id="birthdaysList"></h5>
                                <canvas id="barChart" options="options" style={barChartStyles}></canvas>
                            </div>
                        </div>
                        <div className="col-lg-12 mt-4">
                            <div className="card" style={cardStyle}>
                                <h5 className="card-title" style={cardTitleStyle}>팀 별 사원수 현황</h5>
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