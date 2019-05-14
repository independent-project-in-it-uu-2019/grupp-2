var totalt = Math.floor(Math.random() * 100) + 1;
var svarat = Math.floor(Math.random() * totalt) + 1;
var labels = [
    'Period 2 2015', 
    'Period 1 2016', 
    'Period 2 2016', 
    'Period 1 2017', 
    'Period 2 2017', 
    'Period 1 2018', 
    'Period 2 2018'
];

function createAntalSvarChart() {
    let inteSvarat = totalt - svarat;
    let data = [svarat, inteSvarat];

    $('#nrOfAnswers').text(svarat + ' / ' + totalt);

    let ctx = $('#antalSvarChart');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Svarat', 'Inte svarat'],
            datasets: [{
                data: data,
                backgroundColor: [
                    '#37BB83',
                    '#d8d8d8',
                ],
                hoverBackgroundColor: [
                    '#11AE6B',
                ],
                borderWidth: 0
            }]
        },
        options: {
            scales: {
                axes: {
                    display: false,
                },
                fontFamily: 'Muli',
                fontColor: '#666'
            },
            legend: {
                position: 'top',
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                            return previousValue + currentValue;
                        });
                        var currentValue = dataset.data[tooltipItem.index];
                        var percentage = Math.floor(((currentValue / total) * 100) + 0.5);
                        return ' ' + percentage + "%";
                    }
                }
            }
        }
    });
}

function createBetygsChart() {
    let ctx = $('#betygsChart');

    let uData = [];
    let threeData = [];
    let fourData = [];
    let fiveData = [];

    for (let i = 0; i < labels.length - 1; i++) {
        let total = Math.floor(Math.random() * 70) + 20;
        let u = Math.floor(Math.random() * total / 3);
        let three = Math.floor(Math.random() * (total - u));
        let four = Math.floor(Math.random() * (total - u - three));
        let five = total - u - three - four;

        uData[i] = u;
        threeData[i] = three;
        fourData[i] = four;
        fiveData[i] = five;
    }

    let u = Math.floor(Math.random() * totalt / 3);
    let three = Math.floor(Math.random() * (totalt - u));
    let four = Math.floor(Math.random() * (totalt - u - three));
    let five = totalt - u - three - four;

    uData[labels.length - 1] = u;
    threeData[labels.length - 1] = three;
    fourData[labels.length - 1] = four;
    fiveData[labels.length - 1] = five;

    var stackedBar = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'U',
                backgroundColor: "#666",
                data: uData
            }, {
                label: '3',
                backgroundColor: "#d8d8d8",
                data: threeData
            }, {
                label: '4',
                backgroundColor: 'rgba(17, 174, 107, 0.4)',
                data: fourData
            }, {
                label: '5',
                backgroundColor: "#11AE6B",
                data: fiveData
            }],
            borderWidth: 0
        },
        options: {
            scales: {
                xAxes: [{ stacked: true }],
                yAxes: [{ stacked: true }]
            },
            tooltips: {
                callbacks: {
                    label: (tooltipItem, data) => {
                        const datasetIndex = tooltipItem.datasetIndex;
                        const datasetLabel = data.datasets[datasetIndex].label;
                        // You can use two type values.
                        // `data.originalData` is raw values,
                        // `data.calculatedData` is percentage values, e.g. 20.5 (The total value is 100.0)
                        const originalValue = data.originalData[datasetIndex][tooltipItem.index];
                        const rateValue = data.calculatedData[datasetIndex][tooltipItem.index];
                        return ` ${datasetLabel}: ${rateValue}% (${originalValue} st)`;
                    }
                }
            },
            plugins: {
                datalabels: {
                    formatter: (_value, context) => {
                        const data = context.chart.data;
                        const { datasetIndex, dataIndex } = context;
                        return `${data.calculatedData[datasetIndex][dataIndex]}% (${data.originalData[datasetIndex][dataIndex]})`;
                    }
                },
                stacked100: { enable: true, replaceTooltipLabel: false }
            },
            legend: {
                position: 'top',
            },
        }
    });
}

function createNojdChart() {
    let ctx = $('#nojdChart');

    let data = [];
    for (let i = 0; i < labels.length; i++) {
        data.push(Math.floor(Math.random() * 5) + 1);
    }

    var stackedBar = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Genomsnittligt nöjdhetsbetyg',
                backgroundColor: "#11AE6B",
                borderColor: "#11AE6B",
                borderWidth: 2,
                lineTension: 0,
                pointBorderColor: "#11AE6B",
                data: data,
                fill: false,
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 5,
                pointHoverBorderWidth: 2,
                pointHoverBackgroundColor: '#FFFFFF',
                pointBackgroundColor: "#FFFFFF",

            }],
        },
        options: {
            responsive: true,
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem) {
                        return tooltipItem.yLabel;
                    }
                },
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            }
        }
    });
}

function createKursvarderatChart() {
    let ctx = $('#kursvarderatChart');

    var max = 100;
    let data = [];
    for (let i = 0; i < labels.length -1; i++) {
        data.push(Math.floor(Math.random() * max));
    }
    data.push((svarat/totalt) * 100);

    var stackedBar = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Andel registrerade studenter som kursvärderat',
                backgroundColor: "#11AE6B",
                borderColor: "#11AE6B",
                borderWidth: 2,
                lineTension: 0,
                pointBorderColor: "#11AE6B",
                data: data,
                fill: false,
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 5,
                pointHoverBorderWidth: 2,
                pointHoverBackgroundColor: '#FFFFFF',
                pointBackgroundColor: "#FFFFFF",

            }],
        },
        options: {
            responsive: true,
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem) {
                        return tooltipItem.yLabel;
                    },
                    label: function (tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var currentValue = dataset.data[tooltipItem.index];
                        var percentage = Math.floor(((currentValue / max) * 100));
                        return ' ' + percentage + "%";
                    },
                },
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: max,
                        callback: function (value) {
                            return (value / max * 100).toFixed(0) + '%'; // convert it to percentage
                        },
                    }
                }]
            }
        }
    });
}


createAntalSvarChart();
createBetygsChart();
createNojdChart();
createKursvarderatChart();
