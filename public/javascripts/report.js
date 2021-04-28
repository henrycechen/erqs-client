window.onload = function () {
    // initialize

    element('link-grade').setAttribute('href', `http://localhost:8082/dashboard?username=${provideCookie('USERNAME')}&password=${provideCookie('PASSWORD')}`);
    element('link-report').setAttribute('href', `http://localhost:8082/dashboard/report?username=${provideCookie('USERNAME')}&password=${provideCookie('PASSWORD')}`);


    fetch(`http://localhost:8082/dashboard/get-grades-by-sid?sid=${provideCookie('ID')}`)
        .then(resp => resp.json())
        .then(grades => {
            fetch('http://localhost:8082/dashboard/get-modules')
                .then(resp => resp.json())
                .then(modules => {

                    let moduleList = [];
                    let scoreList = [];

                    let yearList = [];

                    for (let i = 0; i < modules.length; i++) {
                        // module list
                        let div = create('div');
                        div.innerText = `${provideModuleName(grades[i]['mid'], modules)} - Semester ${grades[i]['semester']} (${grades[i]['year']})`;
                        moduleList.push(`${provideModuleName(grades[i]['mid'], modules)}`);
                        element('module-list').appendChild(div);

                        // grade list
                        let tr = create('tr');
                        let td1 = create('td');
                        td1.innerText = provideModuleName(grades[i].mid, modules);
                        let td2 = create('td');
                        td2.innerText = grades[i].grade;
                        scoreList.push(grades[i].grade);
                        tr.appendChild(td1);
                        tr.appendChild(td2);
                        element('grade-table').appendChild(tr);

                        if (yearList.find(year => year === grades[i]['year']) === undefined) {
                            yearList.push(grades[i]['year']);
                        }
                    }

                    drawAChart('academic-performance-chart', provideConfig(moduleList, scoreList, 'Total Academic Performance', '#3987ed'))


                    for (let i = 0; i < yearList.length; i++) {

                        // chart column
                        let c = document.createElement('canvas');
                        c.setAttribute('id', `chart-${yearList[i]}`);
                        c.setAttribute('width', '400');
                        c.setAttribute('height', '400');
                        element('chart-column-root').appendChild(c);

                        let chartLabels = [];
                        let chartData = [];

                        for (let j = 0; j < grades.length; j++) {
                            if (yearList[i] === grades[j]['year']) {
                                chartLabels.push(provideModuleName(grades[j]['mid'], modules));
                                chartData.push(grades[j]['grade'])
                            }
                        }

                        drawAChart(`chart-${yearList[i]}`, provideConfig(chartLabels, chartData, `Academic Performance of ${yearList[i]}`, '#80c2b6'))

                    }
                })
        });

    // logout button
    element('btn-logout').onclick = function () {
        window.location = 'http://localhost:8082/login';
    };

    // toggle button 0
    element('btn-toggle-0').onclick = function () {
        element('chart-column-total').style.display = 'none';
        element('chart-column-root').style.display = 'flex'
    };

    // toggle button 1
    element('btn-toggle-1').onclick = function () {
        element('chart-column-total').style.display = 'block';
        element('chart-column-root').style.display = 'none'
    };
};

function provideConfig(labels, data, title, color) {

    return {
        type: 'bar',
        data: {
            labels: labels, // ['module 1', 'module 2', 'module 3']
            datasets: [{
                data: data, // ['60', '60', '60']
                backgroundColor: color,
                borderWidth: 1,
                datalabels: {
                    color: '#000000',
                    anchor: "end",
                    align: "end",
                    offset: 0
                }
            }],
        },
        plugins: ['ChartDataLabels'],
        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        padding: 1,
                        fontStyle: 'normal',
                        fontColor: '#000000',
                        labelString: 'Score'
                    },
                    ticks: {
                        fontStyle: 'normal',
                        fontColor: '#000000',
                        beginAtZero: true
                    },
                }],
                xAxes: [{
                    ticks: {
                        fontStyle: 'normal',
                        fontColor: '#000000'
                    },
                }]
            },
            title: {
                display: true,
                padding: 24,
                fontSize: 16,
                fontStyle: 'normal',
                fontColor: '#000000',
                text: title
            },
            legend: {
                display: false
            },
            responsive: false, // temporary changed to true here
            maintainAspectRatio: false, // temporary changed to true here
        }
    }

}

function drawAChart(chartId, config) {

    new Chart(document.getElementById(chartId), config);

}