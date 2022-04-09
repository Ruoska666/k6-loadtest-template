let DEBUG = true;
let CHANNEL = '${__ENV.CHANNEL}';
let K6_HOST = '${__ENV.K6_HOSTNAME}';
let K6_NOTIFICATION_URL = '${__ENV.K6_NOTIFICATION_URL}';
let DESCRIPTION = '${__ENV.DESCRIPTION}';
let API_URL = '${__ENV.API_URL}';
let JIRATICKET = '${__ENV.JIRATICKET}';

import http from 'k6/http';

import { get_by_id_query } from './requests/get_by_id';

export function query_scenario() {return get_by_id_query(DEBUG, API_URL)}

export function setup() {
    let data = {host: K6_HOST, port: 6565, channel: CHANNEL, description: DESCRIPTION, jiraticket: JIRATICKET};

    let response = http.post(
        K6_NOTIFICATION_URL,
        JSON.stringify(data),
        {headers: {'Content-Type': 'application/json'}},
    );

    console.log("API_URL: " + API_URL);
    console.log("CHANNEL: " + CHANNEL);
    console.log("K6_HOST: " + K6_HOST);
    console.log("K6_NOTIFICATION_URL " + K6_NOTIFICATION_URL);
}

export let options = {
    discardResponseBodies : true,
    scenarios : {
        query_scenario: {
            excutor : 'ramping-arrival-rate',
            exec : 'query_scenario',
            startRate : 0,
            timeUnit: '1s',
            preAllocatedVUs : 500,
            maxVUs: 30000,
            stages: [
                {target: 100 , duration: '10m'},
                {target: 100 , duration: '5m'},
                {target: 200 , duration: '10m'},
                {target: 200 , duration: '5m'},
                {target: 500 , duration: '10m'},
                {target: 100 , duration: '5m'}
            ]
        }
    },
}