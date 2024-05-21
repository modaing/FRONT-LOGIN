import { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useDispatch, useSelector } from 'react-redux';
import { callMemberDepartSelectAPI } from '../../apis/InsiteAPICalls';

function DepartInsite() {
    const dispatch = useDispatch();
    const [chart, setChart] = useState(false);
    const [totalMember, setTotalMember] = useState('');
    const departCountsData = useSelector(state => state.insiteReducer.memberDepart);

    console.log(departCountsData)

    useEffect(() => {
        dispatch(callMemberDepartSelectAPI());
    }, [dispatch]);

    useEffect(() => {
        if (departCountsData && departCountsData.length > 0) {
            const labels = departCountsData.map(item => item[0]); // 부서명
            const data = departCountsData.map(item => item[1]); // 직원 수
            const totalMembers = departCountsData.reduce((acc, curr) => acc + curr[1], 0);

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

    return (
        <div className="col-lg-12 mt-4">
            <div className="card" style={cardStyle}>
                <h5 className="card-title" style={cardTitleStyle}>팀 별 사원수</h5>
                <h5 className="card-title" style={cardSubTitleStyle}>총 사원수 : {totalMember}명</h5>
                {departCountsData && departCountsData.length > 0 ? (
                    <canvas id="pieChart2" options="options" style={chartStyles}></canvas>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    )

}

export default DepartInsite;