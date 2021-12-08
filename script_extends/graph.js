const DATA_COUNT = 7;
const NUMBER_CFG = { count: DATA_COUNT, min: -100, max: 100 };

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug'];
const data = {
    labels: labels,
    datasets: [
        {
            label: 'Miliampere differenz',
            data: [100, 90, -20, 50, -60, 10, -80],
            borderColor: 'red',
            backgroundColor: 'red',
        },
        {
            label: 'Miliampere differenz T2',
            data: [50, -20, 100, 73, -20, -40, 80],
            borderColor: 'blue',
            backgroundColor: 'blue',
        }
    ]
};

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

const config = {
    type: 'bar',
    data: data,
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
    },
};

const chart = new Chart($('#chartAm'), config);

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset, index) => {
        const _random = Math.floor(Math.random() * 500);
        dataset.data.push(_random);

        if (_random > 300) {
            window.alert("lebih dari 300");
        }
    });

    chart.update();
}

async function getDataSource() {
    const path = window.location.href.split('/').splice(0, 4).join('/');
    const data = await $.get(`${path}/logic_trend/api.php`, function(response) {
        return response;
    });

    return data;
}

setInterval(async() => {
    const _date = new Date();
    const _random = Math.floor(Math.random() * 300);
    const _dateNow = `${_date.getFullYear()}-${_date.getMonth()}-${_date.getDate()} `;
    const _timeNow = `${_date.getHours()}:${_date.getMinutes()}:${_date.getSeconds()}`;
    const _labels = _dateNow + _timeNow;

    addData(chart, _labels, _random);
}, 5000);