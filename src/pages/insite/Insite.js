import { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useDispatch, useSelector } from 'react-redux';
import { callMemberDepartSelectAPI } from '../../apis/InsiteAPICalls';
import { fontWeight } from '@mui/system';

function Insite() {
    const dispatch = useDispatch();
    const [chart, setChart] = useState(false);
    const [departCounts, setDepartCounts] = useState([]);
    const [totalMember, setTotalMember] = useState('');

    const departCountsData = useSelector(state => state.insiteReducer);

    console.log(departCountsData.memberDepart)


    
    useEffect(() => {
        dispatch(callMemberDepartSelectAPI());
    }, [dispatch]);
    
    useEffect(() => {
        if (departCountsData.memberDepart && departCountsData.memberDepart.length > 0) {
            const labels = departCountsData.memberDepart.map(item => item[0]); // 부서명
            const data = departCountsData.memberDepart.map(item => item[1]); // 직원 수
            const totalMembers = departCountsData.memberDepart.reduce((acc, curr) => acc + curr[1], 0);

            setTotalMember(totalMembers);
            const pieChart = new Chart(document.getElementById('pieChart2'), {
                plugins: [ChartDataLabels],
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '',
                        data: data,
                        backgroundColor: ['rgb(173, 216, 230)', 'rgb(70, 130, 180)', 'rgb(119, 136, 153)', 'rgb(119, 136, 180)'],
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
    
            setChart(true);
    
            return () => {
                pieChart.destroy();
            };
        }
    }, [departCountsData]);
    


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
        fontSize: '25px',
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


    useEffect(() => {
        // Chart.js 그래프 생성
        const existingPieChart = Chart.getChart('pieChart');
        if (existingPieChart) {
            existingPieChart.destroy();
        }

        const pieChart = new Chart(document.querySelector('#pieChart'), {
            type: 'pie',
            data: {
                labels: ['1', '2', '3'],
                datasets: [{
                    label: 'My First Dataset',
                    data: [300, 50, 100],
                    backgroundColor: ['rgb(40, 99, 100)', 'rgb(40, 99, 190)', 'rgb(40, 99, 132)'],
                    hoverOffset: 4
                }]
            }
        });
        setChart(true);
    }, []);

    useEffect(() => {
        // Chart.js 그래프 생성
        const existingDoughnutChart = Chart.getChart('doughnutChart');
        if (existingDoughnutChart) {
            existingDoughnutChart.destroy();
        }

        const doughnutChart = new Chart(document.querySelector('#doughnutChart'), {
            type: 'doughnut',
            data: {
                labels: ['도넛', '도넛', '도넛'],
                datasets: [{
                    label: 'My First Dataset',
                    data: [300, 50, 100],
                    backgroundColor: ['rgb(100, 99, 132)', 'rgb(200, 162, 235)', 'rgb(100, 99, 200)'],
                    hoverOffset: 4
                }]
            }
        });
        setChart(true);
    }, []);







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
                        <h5 className="card-title" style={cardTitleStyle}>Main Chart</h5>
                        <h5 className="card-title" style={cardSubTitleStyle}>sub-title</h5>
                        <canvas id="pieChart" options="options" style={chartStyle}></canvas>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <h5 className="card-title" style={cardTitleStyle}>Small Chart 1</h5>
                                <h5 className="card-title" style={cardSubTitleStyle}>sub-title</h5>
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