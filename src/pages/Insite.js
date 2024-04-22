import { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

    function Insite() {

        const [chart, setChart] = useState(false);

        const pageTitleStyle = {
            marginBottom: '20px',
            marginTop: '20px'
        };

        const cardTitleStyle = {
            marginLeft: '20px'
        };

        const cardSubTitleStyle = {
            marginLeft: '20px',
            fontSize: '25px',
            marginTop: '-30px'
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
            const pieChart = new Chart(document.getElementById('pieChart2'), {
                    plugins: [ChartDataLabels],
                    type: 'pie',
                    data: {
                        labels: ['1', '2', '3'],
                        datasets: [{
                            label: 'My First Dataset',
                            data: [300, 50, 100],
                            backgroundColor: ['rgb(173, 216, 230)', 'rgb(70, 130, 180)', 'rgb(119, 136, 153)'],
                        }],
                    },
                    options: {
                        plugins: {
                            legend: { // 범례 사용 안 함
                                display: true,
                            },
                            tooltip: { // 기존 툴팁 사용 안 함
                                enabled: true
                            },
                            animation: { // 차트 애니메이션 사용 안 함 (옵션)
                                duration: 0,
                            },
                            datalabels: { // datalables 플러그인 세팅
                                formatter: function (value, context) {
                                    var idx = context.dataIndex; // 각 데이터 인덱스

                                    // 출력 텍스트
                                    return context.chart.data.labels[idx] + '팀'  + '\n'  + value + '명';
                                },
                                align: 'end',
                                anchor: 'center',
                                textAlign: 'center', // 텍스트 가운데 정렬
                                font: { // font 설정
                                    weight: 'bold',
                                    size: '12px',
                                },
                                color: '#222', // font color
                            },
                        }
                    }
                }
            );
            setChart(true);

            return () => {
                pieChart.destroy();
            };
        }, []);


        useEffect(() => {
            // Chart.js 그래프 생성
            const doughnutChart = new Chart(document.querySelector('#doughnutChart'), {
                type: 'doughnut',
                data: {
                    labels: ['도넛', '도넛', '도넛'],
                    datasets: [{
                        label: 'My First Dataset',
                        data: [300, 50, 100],

                        backgroundColor: ['rgb(100, 99, 132)',
                            'rgb(200, 162, 235)', 'rgb(100, 99, 200)'],
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
                            {/* 큰 차트를 넣는 영역 */}
                            <canvas id="pieChart" options="options" style={chartStyle}></canvas>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card">
                                    <h5 className="card-title" style={cardTitleStyle}>Small Chart 1</h5>
                                    <h5 className="card-title" style={cardSubTitleStyle}>sub-title</h5>
                                    {/* 작은 차트를 넣는 영역 */}
                                    <canvas id="doughnutChart" options="options" style={chartStyles}></canvas>
                                </div>
                            </div>
                            <div className="col-lg-12 mt-4">
                                <div className="card" style={cardStyle}>
                                    <h5 className="card-title" style={cardTitleStyle}>Small Chart 2</h5>
                                    <h5 className="card-title" style={cardSubTitleStyle}>sub-title</h5>
                                    {/* 작은 차트를 넣는 영역 */}
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