window.onload = function () {

    // initialize
    fetch(`http://localhost:8082/dashboard/get-identity?username=${getParameterByName('username')}`)
        .then(resp => resp.json())
        .then(user => {
            setCookie('ID', user['id']);
            setCookie('USERNAME', user['username']);
            setCookie('PASSWORD', user['password']);
            element('link-admin').setAttribute('href', `http://localhost:8082/dashboard?username=${user['username']}&password=${user['password']}`);
            updateModuleList();
        });

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

    // logout button
    element('btn-logout').onclick = function () {

        resetCookie('ID');
        resetCookie('USERNAME');
        resetCookie('PASSWORD');

        window.location = 'http://localhost:8082/login';
    };


};

function updateModuleList() {
    fetch(`/dashboard/get-grades`)
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
                        li.setAttribute('id', `module-id-${midList[i]}`);
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
    updateModuleInfo(provideModuleId(el.id));
}

function studentClick(el) {
    let classNames = el.className.split(' ');
    if (classNames.includes('active')) {
        el.setAttribute('class', 'list-group-item student-list');
    } else {
        el.setAttribute('class', 'list-group-item student-list active');
    }
}
