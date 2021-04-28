window.onload = function () {

    // initialize
    fetch(`http://localhost:8082/dashboard/get-identity?username=${getParameterByName('username')}`)
        .then(resp => resp.json())
        .then(user => {
            setCookie('ID', user['id']);
            setCookie('USERNAME', user['username']);
            setCookie('PASSWORD', user['password']);
            element('link-grade').setAttribute('href', `http://localhost:8082/dashboard?username=${user['username']}&password=${user['password']}`);
            element('link-report').setAttribute('href', `http://localhost:8082/dashboard/report?username=${user['username']}&password=${user['password']}`);
            updateModuleListAndGradeListBySid(user['id']);
        });

    // logout button
    element('btn-logout').onclick = function () {

        resetCookie('ID');
        resetCookie('USERNAME');
        resetCookie('PASSWORD');

        window.location = 'http://localhost:8082/login';
    };

    // search button
    element('btn-search').onclick = function () {
        // alert(element('input-module-name').value);
        fetch('http://localhost:8082/dashboard/get-module-by-moduleName', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: element('input-module-name').value})
        })
            .then(resp => resp.json())
            .then(module => {
                if (module.name === undefined) {

                    alert(`Unable to find module: ${element('input-module-name').value}`);

                } else {

                    fetch(`http://localhost:8082/dashboard/get-grades-by-sid?sid=${provideCookie('ID')}`)
                        .then(resp => resp.json())
                        .then(grades => {
                            while (element('module-list').firstChild) {
                                element('module-list').removeChild(element('module-list').firstChild);
                            }

                            while (element('grade-table').firstChild) {
                                element('grade-table').removeChild(element('grade-table').firstChild);
                            }

                            createTableHeadForStudent();

                            // module list
                            let div = create('div');
                            div.innerText = `${module.name} - Semester ${findYearAndSemesterAndGradeByModuleId(module.id, grades)[1]} (${findYearAndSemesterAndGradeByModuleId(module.id, grades)[0]}})`;
                            element('module-list').appendChild(div);

                            // grade list
                            let tr = create('tr');
                            let td0 = create('td'); // Module Name
                            let td1 = create('td'); // Year
                            let td2 = create('td'); // Semester
                            let td3 = create('td'); // Grade

                            td0.innerText = module.name;
                            td1.innerText = findYearAndSemesterAndGradeByModuleId(module.id, grades)[0];
                            td2.innerText = findYearAndSemesterAndGradeByModuleId(module.id, grades)[1];
                            td3.innerText = findYearAndSemesterAndGradeByModuleId(module.id, grades)[2];

                            tr.appendChild(td0);
                            tr.appendChild(td1);
                            tr.appendChild(td2);
                            tr.appendChild(td3);

                            element('grade-table').appendChild(tr);


                        });


                }
            });

    };

    // clear button
    element('btn-clear').onclick = function () {

        element('input-module-name').value = '';

        updateModuleListAndGradeListBySid(provideCookie('ID'));
    };

};

function updateModuleListAndGradeListBySid(id) {
    fetch(`http://localhost:8082/dashboard/get-grades-by-sid?sid=${id}`)
        .then(resp => resp.json())
        .then(grades => {
            fetch('http://localhost:8082/dashboard/get-modules')
                .then(resp => resp.json())
                .then(modules => {

                    while (element('module-list').firstChild) {
                        element('module-list').removeChild(element('module-list').firstChild);
                    }

                    while (element('grade-table').firstChild) {
                        element('grade-table').removeChild(element('grade-table').firstChild);
                    }

                    createTableHeadForStudent();

                    for (let i = 0; i < modules.length; i++) {
                        // module list
                        let div = create('div');
                        div.innerText = `${provideModuleName(grades[i]['mid'], modules)} - Semester ${grades[i]['semester']} (${grades[i]['year']})`;
                        element('module-list').appendChild(div);

                        // grade list
                        let tr = create('tr');
                        let td0 = create('td'); // Module Name
                        let td1 = create('td'); // Year
                        let td2 = create('td'); // Semester
                        let td3 = create('td'); // Grade

                        td0.innerText = provideModuleName(grades[i].mid, modules);
                        td1.innerText = grades[i].year;
                        td2.innerText = grades[i].semester;
                        td3.innerText = grades[i].grade

                        tr.appendChild(td0);
                        tr.appendChild(td1);
                        tr.appendChild(td2);
                        tr.appendChild(td3);

                        element('grade-table').appendChild(tr);
                    }

                })
        });

}

function findYearAndSemesterAndGradeByModuleId(mid, grades) {
    for (let i = 0; i < grades.length; i++) {
        if (mid === grades[i].mid) {
            return [grades[i].year, grades[i].semester, grades[i].grade];
        }
    }
}

function createTableHeadForStudent() {
    let tr0 = create('tr');

    let th0 = create('th'); // Module Name
    let th1 = create('th'); // Year
    let th2 = create('th'); // Semester
    let th3 = create('th'); // Grade

    th0.innerText = 'Module Name';
    th1.innerText = 'Year';
    th2.innerText = 'Semester';
    th3.innerText = 'Grade';

    tr0.appendChild(th0);
    tr0.appendChild(th1);
    tr0.appendChild(th2);
    tr0.appendChild(th3);

    element('grade-table').appendChild(tr0);
}




