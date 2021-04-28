/**
 * * * * * * * * * * * * * cookie * * * * * * * * * * * * *
 */
function setCookie(attrKey, attrValue) {
    document.cookie = `${attrKey}=${attrValue}`;
    console.log(`@From: setCookie(${attrKey}, ${provideCookie(attrKey)})`);
}

function provideCookie(attribute) {
    if (document.cookie === undefined || document.cookie === '') {
        console.error(`@From: provideCookie(${attribute}) @Error: No Cookie.`);
        return undefined;
    }
    if (document.cookie.split('; ').find(row => row.startsWith(`${attribute}=`)) === undefined) {
        console.error(`@From: provideCookie(${attribute}) @Error: Undefined Cookie.`);
        return undefined;
    }
    return document.cookie
        .split('; ')
        .find(row => row.startsWith(`${attribute}=`))
        .split('=')[1];
}

function resetCookie(attribute) {
    document.cookie = `${attribute}=`;
    console.log(`@From: resetCookie(${attribute})`);
}

/**
 * * * * * * * * * * * * * Utils * * * * * * * * * * * * *
 */

function element(elementId) {
    return document.getElementById(elementId);
}

function create(tagName) {
    return document.createElement(tagName);
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function findYearAndSemesterAndGradeByModuleId(mid, grades) {
    for (let i = 0; i < grades.length; i++) {
        if (mid === grades[i].mid) {
            return [grades[i].year, grades[i].semester, grades[i].grade];
        }
    }
}


/**
 * * * * * * * * * * * * * Content * * * * * * * * * * * * *
 */

function updateModuleInfo(mid) {
    fetch(`/dashboard/get-module-by-mid?mid=${mid}`)
        .then(resp => resp.json())
        .then(module => {

            element('module-id').innerText = `Module ID: ${module.id}`
            element('module-name').innerText = `Module Name: ${module.name}`
            element('module-full-grade').innerText = `Full Grade: ${module.fullGrade}`
        });
}

function provideModuleName(mid, modules) {
    let n = '';
    for (let i = 0; i < modules.length; i++) {
        if (mid === modules[i].id) {
            n = modules[i]['name'];
            break;
        }
    }
    return n;
}

function provideModuleId(elementId) {
    return elementId.split('-')[2];
}

function provideModuleIdAndLid(elementId) {
    return [elementId.split('-')[2], elementId.split('-')[3]];
}

function provideGradeInfo(elementId) {

    // 0: grade
    // -1: ${grades[i].id}
    // -2: ${grades[i].mid}
    // -3: ${grades[i].sid}
    // -4: ${idArray[1]}
    // -5: ${grades[i].year}
    // -6: ${grades[i].semester}

    return [
        elementId.split('-')[1], // 0: gid
        elementId.split('-')[2], // 1: mid
        elementId.split('-')[3], // 2: sid
        elementId.split('-')[4], // 3: lid
        elementId.split('-')[5], // 4: year
        elementId.split('-')[6], // 5: semester
    ];
}