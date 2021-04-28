window.onload = function () {

    // initialize
    fetch(`/dashboard/get-identity?username=${getParameterByName('username')}`)
        .then(resp => resp.json())
        .then(user => {
            setCookie('ID', user['id']);
            setCookie('USERNAME', user['username']);
            setCookie('PASSWORD', user['password']);
            element('link-grade').setAttribute('href', `http://localhost:8082/dashboard?username=${user['username']}&password=${user['password']}`);
            updateModuleList(user['id']);
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

                    fetch(`http://localhost:8082/dashboard/get-grades-by-lid?lid=${provideCookie('ID')}`)
                        .then(resp => resp.json())
                        .then(grades => {

                            while (element('module-list').firstChild) {
                                element('module-list').removeChild(element('module-list').firstChild);
                            }

                            while (element('grade-table').firstChild) {
                                element('grade-table').removeChild(element('grade-table').firstChild);
                            }

                            createTableHeadForLecturer();

                            let li = create('li');

                            li.setAttribute('id', `module-id-${module.id}-${findYearAndSemesterAndGradeByModuleId(module.id, grades)}`);
                            li.setAttribute('class', 'list-group-item');
                            li.innerText = module.name;
                            li.setAttribute('onclick', 'moduleClick(this)');

                            element('module-list').appendChild(li);


                        });


                }
            });

    };

    // clear button
    element('btn-clear').onclick = function () {

        element('input-module-name').value = '';

        updateModuleList(provideCookie('ID'));
    };

    // update button
    element('btn-update').onclick = function () {
        const scores = document.getElementsByClassName('score-input');
        for (let i = 0; i < scores.length; i++) {

            const gradeInfo = provideGradeInfo(scores[i].id);

            fetch(`/dashboard/update-grade?gid=${gradeInfo[0]}&mid=${gradeInfo[1]}&sid=${gradeInfo[2]}&lid=${gradeInfo[3]}&grade=${scores[i].value}&year=${gradeInfo[4]}&semester=${gradeInfo[5]}`)
                .then(resp => resp.json())
                .then(st => console.log(`@From: onclick-btn-update @Status: ${JSON.stringify(st)}`));

        }
    };

};

function updateModuleList(lid) {
    fetch(`/dashboard/get-grades-by-lid?lid=${lid}`)
        .then(resp => resp.json())
        .then(grades => {
            fetch('/dashboard/get-modules')
                .then(resp => resp.json())
                .then(modules => {

                    while (element('module-list').firstChild) {
                        element('module-list').removeChild(element('module-list').firstChild);
                    }

                    let midList = [];

                    let semesterList = [];

                    let yearList = [];

                    for (let i = 0; i < grades.length; i++) {
                        if (!midList.includes(grades[i].mid)) {
                            midList.push(grades[i].mid)
                        }

                        if (!semesterList.includes(grades[i].semester)) {
                            semesterList.push(grades[i].semester);
                        }

                        if (!yearList.includes(grades[i].year)) {
                            yearList.push(grades[i].year);
                        }
                    }


                    for (let i = 0; i < midList.length; i++) {
                        // module list
                        let li = create('li');
                        li.setAttribute('id', `module-id-${midList[i]}-${lid}`);
                        li.setAttribute('class', 'list-group-item');
                        li.innerText = `${provideModuleName(midList[i], modules)}`;
                        li.setAttribute('onclick', 'moduleClick(this)');
                        element('module-list').appendChild(li);

                    }

                })
        });
}

function moduleClick(el) {
    let modules = document.getElementsByClassName('list-group-item');
    for (let i = 0; i < modules.length; i++) {
        modules[i].setAttribute('class', 'list-group-item');
    }
    el.setAttribute('class', 'list-group-item active');
    updateModuleInfo(provideModuleIdAndLid(el.id)[0]);
    updateGradeTable(provideModuleIdAndLid(el.id));
}

function updateGradeTable(idArray) {
    fetch(`/dashboard/get-grades-by-mid?mid=${idArray[0]}`)
        .then(resp => resp.json())
        .then(grades => {


            while (element('grade-table').firstChild) {
                element('grade-table').removeChild(element('grade-table').firstChild);
            }


            createTableHeadForLecturer()


            for (let i = 0; i < grades.length; i++) {


                fetch(`/dashboard/get-user-by-uid?uid=${grades[i].sid}`).then(resp => resp.json()).then(student => {

                    let tr = create('tr');

                    let td0 = create('td'); // year
                    let td1 = create('td'); // semester
                    let td2 = create('td'); // student id
                    let td3 = create('td'); // student name
                    let td4 = create('td'); // grade

                    let input = create('input');

                    td0.innerText = grades[i].year;
                    td1.innerText = grades[i].semester;
                    td2.innerText = grades[i].sid;
                    td3.innerText = student.firstName + student.lastName;

                    // grade-${gid}-${mid}-${sid}-${lid}-${year}-${semester}
                    input.setAttribute('id', `grade-${grades[i].id}-${grades[i].mid}-${grades[i].sid}-${idArray[1]}-${grades[i].year}-${grades[i].semester}`);
                    input.setAttribute('class', 'score-input');
                    input.value = grades[i].grade;

                    td4.appendChild(input);

                    tr.appendChild(td0);
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tr.appendChild(td4);

                    element('grade-table').appendChild(tr);

                });


            }


        });
}

function createTableHeadForLecturer() {
    let tr0 = create('tr');

    let th0 = create('th'); // year
    let th1 = create('th'); // semester
    let th2 = create('th'); // student id
    let th3 = create('th'); // student name
    let th4 = create('th'); // grade

    th0.innerText = 'Year';
    th1.innerText = 'Semester';
    th2.innerText = 'Student ID';
    th3.innerText = 'Student Name';
    th4.innerText = 'Grade';

    tr0.appendChild(th0);
    tr0.appendChild(th1);
    tr0.appendChild(th2);
    tr0.appendChild(th3);
    tr0.appendChild(th4);

    element('grade-table').appendChild(tr0);
}
