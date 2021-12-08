let chartAm;
const MAX_LIMIT = 300;
const actions = [
    {
        name: 'Randomize',
        handler(chart) {
            chart.data.datasets.forEach(dataset => {
                dataset.data = Utils.numbers({ count: chart.data.labels.length, min: -100, max: 100 });
            });
            chart.update();
        }
    },
    {
        name: 'Add Dataset',
        handler(chart) {
            const data = chart.data;
            const dsColor = Utils.namedColor(chart.data.datasets.length);
            const newDataset = {
                label: 'Dataset ' + (data.datasets.length + 1),
                backgroundColor: Utils.transparentize(dsColor, 0.5),
                borderColor: dsColor,
                borderWidth: 1,
                data: Utils.numbers({ count: data.labels.length, min: -100, max: 100 }),
            };
            chart.data.datasets.push(newDataset);
            chart.update();
        }
    },
    {
        name: 'Add Data',
        handler(chart) {
            const data = chart.data;
            if (data.datasets.length > 0) {
                data.labels = Utils.months({ count: data.labels.length + 1 });

                for (let index = 0; index < data.datasets.length; ++index) {
                    data.datasets[index].data.push(Utils.rand(-100, 100));
                }

                chart.update();
            }
        }
    },
    {
        name: 'Remove Dataset',
        handler(chart) {
            chart.data.datasets.pop();
            chart.update();
        }
    },
    {
        name: 'Remove Data',
        handler(chart) {
            chart.data.labels.splice(-1, 1); // remove the label first

            chart.data.datasets.forEach(dataset => {
                dataset.data.pop();
            });

            chart.update();
        }
    }
];

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset, index) => {
        const _random = Math.floor(Math.random() * 500);
        dataset.data.push(_random);

        if (_random > MAX_LIMIT) {
            // send email here
        }
    });

    chart.update();
}

function getDataSource() {
    const path = window.location.href.split('/').splice(0, 4).join('/');
    const labels = [];
    const dataset1 = [];
    const dataset2 = [];

    $.get(`${path}/logic_trend/api.php`, function(response) {
        for(let data of response) {
            labels.push(data.datetime);
            dataset1.push(+data.dataset_1);
            dataset2.push(+data.dataset_2);
        }

        const _data = {
            labels,
            datasets: [
                {
                    label: 'Miliampere differenz',
                    data: dataset1,
                    borderColor: 'blue',
                    backgroundColor: 'blue',
                },
                {
                    label: 'Miliampere differenz T2',
                    data: dataset2,
                    borderColor: 'yellow',
                    backgroundColor: 'yellow',
                }
            ]
        }

        const _config = {
            type: 'bar',
            data: _data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Stormdifferenzmessung Tumbler'
                    }
                },
                scales: {
                    xAxes: [{
                        ticks: {
                          maxTicksLimit: 10
                        }
                    }]
                }
            },
        };

        chartAm = setData($('#chartAm'), _config);
    });
}

function setData(chart, data) {
    const _chart = new Chart(chart, data);
    return _chart;
}


// 1st loaded data
let statusLoaded = false;
setInterval(async() => {
    if (statusLoaded) {
        const _date = new Date();
        const _random = Math.floor(Math.random() * 300);
        const _dateNow = `${_date.getDate()}/${_date.getMonth()}/${_date.getFullYear()}`;
        const _timeNow = `${_date.getHours()}:${_date.getMinutes()}:${_date.getSeconds()}`;
        const _labels = _dateNow + _timeNow;

        addData(chartAm, _labels, _random);
    }

    if (chartAm == null && !statusLoaded) {
        chartAm = await getDataSource();
        statusLoaded = true
    }
}, 5000);