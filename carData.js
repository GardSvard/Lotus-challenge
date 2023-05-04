'use strict'

const pre = document.getElementById("preData");

let url = "https://cors-anywhere.herokuapp.com/https://crashviewer.nhtsa.dot.gov/CrashAPI/analytics/GetInjurySeverityCounts?fromCaseYear=2020&toCaseYear=2023&state=28&format=json";


let httpRequest = new XMLHttpRequest();
httpRequest.open("GET", url);
httpRequest.onload = handleResponse;
let headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/111.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'cross-site',
    'TE': 'trailers'
};

try {
    httpRequest.send();
} catch (error) {
    console.log(error);
}

function handleResponse() {
    let sum = 0;
    let jsonObj = JSON.parse(httpRequest.responseText).Results[0];
    for (let i=0; i<jsonObj.length; i++) {
        sum += jsonObj[i].TotalFatalCounts;
    }
    pre.innerHTML = 'Fatal car crashes this decade in Texas: ' + sum.toString();
}