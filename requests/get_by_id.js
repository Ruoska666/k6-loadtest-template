import { group, check} from "k6";
import http from "k6/http";
import { SharedArray } from "k6/data";

var ammo_query = new SharedArray("ammo_query", function () {
    var f = JSON.parse(open("./../query_ammo.json"));
    console.log("PASSED AMMO: ")
    console.log(f)
    return f;
});

function params() {
    return {
        headers: {
            'accept': 'text/plain',
            'Content-Type': 'application/json',
            //'auth-token': 'some token'
        },
        responseType: 'text'
    };
}

const api_urls = [
    '',
    '',
    ''
]

export function get_by_id_query(dedug = false, api_url){
    group('name-your-api', function (){
        let data = ammo_query[Math.floor(Math.random() * ammo_query.length)];
        let api_url = api_urls[Math.floor(Math.random() * ammo_query.length)];
    
        function payload(data){
            return JSON.stringify(data);
        }
        let response = http.get(
            api_url, payload(data), params()
        );

        if (dedug) {
            console.log(JSON.stringify(response.body))
        }

        check(response, {
            'is status code 200': (r) => r.status === 200,
        })
    })
}