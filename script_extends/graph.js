let chartAm;
let dataGlobal = {};
// 1st loaded data
let statusLoaded = false;

// constanta value to determine limit of data from source, max wrong number
const SOURCE_LIMIT = 30;
const MAX_LIMIT = 300;
const TIME_IN_SECONDS = 5;

// components
const _content = $('#content');
const _loader = $("#loader");
const _reset = $("#resetButton");
const _optionBar = $("#optionBar");

/**
 * 
 * @param {chart data} chart 
 * @param {array} label 
 * @param {array} data 
 */
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach(async(_dataset, index) => {
        let _random = Math.floor(Math.random() * 400);
        _random *= Math.round(Math.random()) ? 1 : -1;
        _dataset.data.push(_random);

        // check by index
        if(_random > MAX_LIMIT && index == 0) {
            // set to red
            chart.data.datasets[0].backgroundColor[_dataset.data.length - 1] = 'red';
            // send email here
            await sendMail({time: label, point: data});
            return;
        } 
        
        if(_random > MAX_LIMIT && index == 1) {
            // set to red
            chart.data.datasets[1].backgroundColor[_dataset.data.length - 1] = 'red';
            // send email here
            await sendMail({time: label, point: data});
            return;
        }
        
        // otherwise
        chart.data.datasets[0].backgroundColor[_dataset.data.length] = 'blue';
        chart.data.datasets[1].backgroundColor[_dataset.data.length - 1] = 'yellow';
    });

    chart.update();
}

/**
 * return data_source from excel
 */
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

        const _colorsBlue = colors.filter((m, index) => { return index % 1 == 0});
        const _colorsYellow = colors.filter((m, index) => { return index % 1 == 0});
        //
        const _blueRed = _colorsBlue.map((m) => m ? 'blue': 'blue');
        const _yellowRed = _colorsYellow.map((m) => m ? 'yellow': 'yellow');

        const _data = {
            labels,
            datasets: [
                {
                    label: 'MA differenz T1',
                    data: dataset1,
                    borderColor: 'blue',
                    backgroundColor: _blueRed,
                },
                {
                    label: 'MA differenz T2',
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
                        position: 'top'
                    },
                    title: {
                        color: 'white',
                        display: true,
                        text: 'Stormdiffrenzmessung Linie P14'
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: 'white',
                        }
                        // max: 10,
                    },
                    y: {
                        ticks: {
                            color: 'white',
                        }
                        // suggestedMax: 10
                        // max: 10,
                    }
                }
            },
        };

        chartAm = setData($('#chartAm'), _config);
        dataGlobal = _data
    });
}

function setData(chart, data) {
    const _chart = new Chart(chart, data);

    _content.show();
    _loader.hide();
    return _chart;
}

/**
 * Clear chart data and get back from data_source
 */
async function resetData() {
    // set attribute for loader and content
    _content.hide();
    _loader.show();

    // empty data
    dataGlobal = {}
    statusLoaded = false
        
    chartAm.destroy();
    chartAm = null
}

/**
 * 
 * @param {Object} data 
 */
async function sendMail(data) {
    const path = window.location.href.split('/').splice(0, 4).join('/');

    await $.post(`${path}/logic_trend/mail.php`, {data: JSON.stringify(data)}, function(response) {
        console.log(response);
    });
}

setInterval(async() => {
    if (statusLoaded && chartAm) {
        const _date = new Date();
        const _random = Math.floor(Math.random() * 400);
        const _dateNow = `${_date.getDate()}/${_date.getMonth() + 1}/${_date.getFullYear()}`;
        const _timeNow = `${_date.getHours()}:${_date.getMinutes()}:${_date.getSeconds()}`;
        const _labels = _dateNow + " " + _timeNow;

        addData(chartAm, _labels, _random);
    }

    if (chartAm == null && !statusLoaded) {
        await getDataSource();
        statusLoaded = true
    }
}, TIME_IN_SECONDS * 1000);

// filter-logical
$('#dateRange').daterangepicker({}, function(start, end, label) {
    const _start = start.format('DD/MM/YYYY');
    const _end = end.format('DD/MM/YYYY');

    // check if the data already initialize
    if (dataGlobal) {
        const _label = [...dataGlobal.labels];
        const _datapoints1 = [...dataGlobal.datasets[0].data];
        const _datapoints2 = [...dataGlobal.datasets[1].data];

        const _indexStartDate = _label.map((m) => m.split(" ")[0]).findIndex((val) => {
            const inMoment = moment(val);
            return inMoment.isSameOrAfter(_start);
        });
        const _indexEndDate = _label.map((m) => m.split(" ")[0]).findIndex((val) => {
            const inMoment = moment(val);
            return !inMoment.isSameOrBefore(_end) && moment(_end).isSameOrAfter(_start);
        });

        const _filterLabel = _label.slice(_indexStartDate);
        const _filterData1 = _datapoints1.slice(_indexStartDate);
        const _filterData2 = _datapoints2.slice(_indexStartDate);

        // call chart
        chartAm.config.data.labels = _filterLabel;
        chartAm.config.data.datasets[0].data = _filterData1;
        chartAm.config.data.datasets[1].data = _filterData2;
        // update the chart
        chartAm.update();
    }
});

// reset-call in action
_reset.click(function() { resetData() });
// change bar-type
_optionBar.on('change', function() {
    chartAm.config.type = this.value;
    chartAm.update();
});