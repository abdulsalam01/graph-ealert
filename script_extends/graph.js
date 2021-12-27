let chartAm1, chartAm2;
let dataGlobal = {chart1: {}, chart2: {}};
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
function addData(chart, label, data, colorDef = 'blue') {
    chart.data.labels.push(label);
    chart.data.datasets.forEach(async(_dataset, index) => {
        let _random = Math.floor(Math.random() * 400);
        _random *= Math.round(Math.random()) ? 1 : -1;
        _dataset.data.push(_random);

        if(_random > MAX_LIMIT) {
            // set to red
            chart.data.datasets[0].backgroundColor[_dataset.data.length - 1] = 'red';
            // send email here
            await sendMail({time: label, point: data, tumbler: (colorDef === 'blue' ? 1 : 2)});
            return;
        } 
                
        // otherwise
        chart.data.datasets[0].backgroundColor[_dataset.data.length - 1] = colorDef;
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

        const _data_1 = {
            labels,
            datasets: [
                {
                    label: 'MA differenz T1',
                    data: dataset1,
                    borderColor: 'blue',
                    backgroundColor: ['blue'],
                }
            ]
        }

        const _config_1 = {
            type: 'bar',
            data: _data_1,
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
        // deep-clone
        const _data_2 = JSON.parse(JSON.stringify(_data_1)); 
        const _config_2 = JSON.parse(JSON.stringify(_config_1));
        // re-init
        _data_2.datasets[0] = {
            label: 'MA differenz T2',
            data: dataset2,
            borderColor: 'yellow',
            backgroundColor: ['yellow'],
        }
        _config_2.data = _data_2;

        //
        chartAm1 = setData($('#chartAm-1'), _config_1);
        chartAm2 = setData($('#chartAm-2'), _config_2);

        // set to chart-data
        dataGlobal.chart1 = _data_1;
        dataGlobal.chart2 = _data_2;
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
    dataGlobal = {chart1: {}, chart2: {}};
    statusLoaded = false;
    
    chartAm1.destroy();
    chartAm2.destroy();
    // set null
    chartAm1 = null;
    chartAm2 = null;
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

/**
 * filtering chart
 * @param {Chart Object} chart 
 * @param {Object} data 
 */
function filter(chart, data, params = {}) {
    const _label = [...data.labels];
    const _datapoints1 = [...data.datasets[0].data];

    const _indexStartDate = _label.map((m) => m.split(" ")[0]).findIndex((val) => {
        const inMoment = moment(val);
        return inMoment.isSameOrAfter(params._start);
    });
    const _indexEndDate = _label.map((m) => m.split(" ")[0]).findIndex((val) => {
        const inMoment = moment(val);
        return !inMoment.isSameOrBefore(params._end) && moment(params._end).isSameOrAfter(params._start);
    });

    const _filterLabel = _label.slice(_indexStartDate);
    const _filterData1 = _datapoints1.slice(_indexStartDate);

    // call chart
    chart.config.data.labels = _filterLabel;
    chart.config.data.datasets[0].data = _filterData1;
    // update the chart
    chart.update();
}

/**
 * change chart-type
 * @param {Chart Object} chart 
 * @param {String} type 
 */
function toType(chart, type) {
    chart.config.type = type;
    chart.update();
}

setInterval(async() => {
    if (statusLoaded && chartAm1 && chartAm2) {
        const _date = new Date();
        const _random = Math.floor(Math.random() * 400);
        const _dateNow = `${_date.getDate()}/${_date.getMonth() + 1}/${_date.getFullYear()}`;
        const _timeNow = `${_date.getHours()}:${_date.getMinutes()}:${_date.getSeconds()}`;
        const _labels = _dateNow + " " + _timeNow;

        addData(chartAm1, _labels, _random, 'blue');
        addData(chartAm2, _labels, _random, 'yellow');
    }

    if (chartAm1 == null && chartAm2 == null && !statusLoaded) {
        await getDataSource();
        statusLoaded = true
    }
}, TIME_IN_SECONDS * 1000);

// filter-logical
$('#dateRange').daterangepicker({}, function(start, end, label) {
    const _start = start.format('DD/MM/YYYY');
    const _end = end.format('DD/MM/YYYY');

    // check if the data-1 already initialize
    if (dataGlobal.chart1) {
        filter(chartAm1, dataGlobal.chart1, {_start, _end});
    }

    // check if the data-2 already initializ    
    if (dataGlobal.chart2) {
        filter(chartAm2, dataGlobal.chart2, {_start, _end});
    }
});

// reset-call in action
_reset.click(function() { resetData() });
// change bar-type
_optionBar.on('change', function() {
    toType(chartAm1, this.value);
    toType(chartAm2, this.value);
});