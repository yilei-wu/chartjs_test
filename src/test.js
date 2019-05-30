//
//
// var test = document.getElementById("test")
//
// $(function () {
//     var ctx = $('#myChart');
//     var chart = new Chart(ctx, {
//         // The type of chart we want to create
//         type: 'line',
//
//         // The data for our dataset
//         data: {
//             labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//             datasets: [{
//                 label: 'My First dataset',
//                 backgroundColor: 'rgb(91,255,108)',
//                 borderColor: 'rgb(255, 99, 132)',
//                 data: [0, 10, 5, 2, 20, 30, 45]
//             },
//                 {
//                     label: 'My Second dataset',
//                     backgroundColor: 'rgb(56,162,255)',
//                     borderColor: 'rgb(160,18,255)',
//                     data: [3, 14, 2, 70, 25, 70, 85]
//                 }]
//         },
//
//         // Configuration options go here
//         options: {}
//     });
//
//     jQuery("#Button1").click(function () {
//         var name = $("#TextName").val();
//         $("#name").text(name);
//     });
//
//     var beginner = $('<div>java beginner</div>');
//     $('.hello .hi').text('hihihihihihihi').after(beginner);
//
//     $(document)
// });



function f(keyword) {
    // language=JQuery-CSS
    // var keyword = document.getElementById("search_bar").value;
    // var keyword = word;

    console.log(keyword);

    var ws = new WebSocket("ws://localhost:9000/ws");
    var data = {
        "dataset": "twitter.ds_tweet",
        "filter": [
            {
                "field": "text",
                "relation": "contains",
                "values": [keyword]
            }
        ],
        "unnest": [{"hashtags": "tag"}],
        "group": {
            "by": [
                {"field": "tag"}
            ],
            "aggregate": [
                {
                    "field": "*",
                    "apply": {
                        "name": "count"
                    },
                    "as": "count"
                }
            ]
        },
        "select": {
            "order": ["-count"],
            "limit": 10,
            "offset": 0
        }
    }


    ws.onopen = function (event) {
        console.log("CONNECTING")
        ws.send(JSON.stringify(data))
    }
    ws.onmessage = function (event) {
        updateGraph(event.data);
        console.log(event.data);
        ws.close()
    }
    ws.onclose = function (ev) {
        console.log("CLOSING")
    }

}

let hashtag_container = $('<div class="card text-white bg-primary hashtag_card col-sm-2">\n' +
    '            <div class="card-body hashtag_body">\n' +
    '                <h5 class="card-title" id="name"></h5>\n' +
    '                <h5 class="card-text" id="count"></h5>\n' +
    '            </div>\n' +
    '        </div>');

function updateGraph(dat) {
    var data = JSON.parse(dat);
    let hashtagName = [];
    let hashtagCnt = [];
    console.log(data);
    for (var i = 0; i < data[0].length; i++){
        let current = hashtag_container.clone();
        current.find('#name').text(data[0][i]["tag"]);
        current.find('#count').text(data[0][i]["count"]);
        hashtagName.push(data[0][i]["tag"]);
        hashtagCnt.push(data[0][i]["count"]);
        $('#hashtags').append(current);
    }



    let canvas = $('#demo');
    var chart = new Chart(canvas, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: hashtagName,
            datasets: [{
                label: 'number',
                data: hashtagCnt,
                backgroundColor: 'rgb(21,127,251)'
            }]
        },

        // Configuration options go here
        options: {
            title: {
                display: true,
                text: 'Test Histogram',
                fontSize: 20
            },

            scales: {
                "yAxes":[{
                    "ticks": {
                        "beginAtZero":true
                    }
                }]
            }
        }
    });
}

var test = '[[{"tag":"happy","count":4},{"tag":"HumpDay","count":2},{"tag":"tonight","count":2},{"tag":"bestfriends","count":2},{"tag":"GoldenGlobes","count":2},{"tag":"usa","count":2},{"tag":"Dems","count":2},{"tag":"Repost","count":2},{"tag":"GoPackGo","count":1},{"tag":"Bengals50","count":1}]]';

$(function () {
    $('#search_form').submit(function (event) {
        event.preventDefault();
        let data = $('#search_form').serialize();
        let urlParams = new URLSearchParams(data);
        f(urlParams.get('word'))
    });
});

var terminal_query = "curl -H \"Content-Type: application/json\" --data @test.json http://localhost:9000/berry"

function keyworkd_search() {
    
}