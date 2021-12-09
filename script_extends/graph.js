let chartAm;
// constanta value to determine limit of data from source, max wrong number
const SOURCE_LIMIT = 30;
const MAX_LIMIT = 300;
const TIME_IN_SECONDS = 5;

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((_dataset, index) => {
        let _random = Math.floor(Math.random() * 500);

        _random *= Math.round(Math.random()) ? 1 : -1;
        _dataset.data.push(_random);

        if (_random > MAX_LIMIT) {
            // send email here
            chart.data.datasets[index].backgroundColor[_dataset.data.length - 1] = 'red';
        } else {
            chart.data.datasets[0].backgroundColor[_dataset.data.length - 1] = 'blue';
            chart.data.datasets[1].backgroundColor[_dataset.data.length - 1] = 'yellow';
        }
    });

    chart.update();
}

async function getDataSource() {
    const path = window.location.href.split('/').splice(0, 4).join('/');
    const labels = [];
    const dataset1 = [];
    const dataset2 = [];
    const colors = [];

    $.get(`${path}/logic_trend/api.php?limit=${SOURCE_LIMIT}`, function(response) {
        for(let data of response) {
            colors.push(data.status);
            labels.push(data.datetime);
            dataset1.push(+data.dataset_1);
            dataset2.push(+data.dataset_2);
        }

        const _colorsBlue = colors.filter((m, index) => { return index % 2 == 0});
        const _colorsYellow = colors.filter((m, index) => { return index % 2 == 1});
        //
        const _blueRed = _colorsBlue.map((m) => m ? 'blue': 'blue');
        const _yellowRed = _colorsYellow.map((m) => m ? 'yellow': 'yellow');

        const _data = {
            labels,
            datasets: [
                {
                    label: 'Miliampere differenz',
                    data: dataset1,
                    borderColor: 'blue',
                    backgroundColor: _blueRed,
                },
                {
                    label: 'Miliampere differenz T2',
                    data: dataset2,
                    borderColor: 'yellow',
                    backgroundColor: _yellowRed,
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
                    x: {
                        // max: 10,
                    },
                    y: {
                        // suggestedMax: 10
                        // max: 10,
                    }
                }
            },
        };

        chartAm = setData($('#chartAm'), _config);
    });
}

function setData(chart, data) {
    const _chart = new Chart(chart, data);
    // hide loader
    $("#loader").hide();
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
        await getDataSource();
        statusLoaded = true
    }
}, TIME_IN_SECONDS * 1000);