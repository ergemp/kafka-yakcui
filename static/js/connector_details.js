let connectorConfigJson;
let connectorStatusJson;

function get(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}

function getConnectorConfig(gConnectorName) {
    let retVal;
    $.ajax({
        url: "http://localhost:8083/connectors/" + gConnectorName + "",
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function(result) {
            retVal = result;
        }
    });
    return JSON.stringify(retVal, null, 2);
}

function getConnectorStatus(gConnectorName) {
    let retVal;
    $.ajax({
        url: "http://localhost:8083/connectors/" + gConnectorName + "/status",
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function(result) {
            retVal = result;
        }
    });
    return JSON.stringify(retVal, null, 2);
}


// not used currently
// just for reference
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

function fillConnectorDetails(gConnectorConfig){

    let obj = JSON.parse(gConnectorConfig);
    let retVal = "";

    if (obj["config"]["connector.class"] === "FileStreamSource") {

        retVal += "<p style='display: inline;'> <h5>Connector Name:</h5> " + obj.name + "</p>" ;
        retVal += "<p style='display: inline;'> <h5>Connector Class:</h5> " + obj["config"]["connector.class"]  + "</p>" ;
        retVal += "<p style='display: inline;'> <h5>Connector Type:</h5> " + obj.type  + "</p>" ;

        if (obj.type === "source") {
            retVal +=  "<p> <h5>Source File:</h5> " + obj["config"]["connector.class"]  + "</p>" ;
            retVal +=  "<p> <h5>Target Topic:</h5>  " + obj["config"]["topic"]  + "</p>" ;
        }
        else if (obj.type === "sink") {
            retVal +=  "<p> <h5>Target File:</h5>  " + obj["config"]["connector.class"]  + "</p>" ;
            retVal +=  "<p> <h5>Source Topic:</h5>  " + obj["config"]["topic"]  + "</p>" ;
        }
    }
    return retVal;
}

function fillStatusDetails(gStatusDetails){

    let obj = JSON.parse(gStatusDetails);
    let retVal = "";

    if (obj.tasks[0].state === "RUNNING"){
        retVal +=  "<div style='width:77%;' ><p> <h5 style='background-color: green; color: white'>RUNNING</h5> </p></div>" ;
    }
    else {
        retVal +=  "<p> <h5> " + obj.tasks[0].state +  "</h5> </p> ";
    }


    /*
    if (obj["config"]["connector.class"] === "FileStreamSource") {

        retVal += "<p style='display: inline;'> <h5>Connector Name:</h5> " + obj.name + "</p>" ;
        retVal += "<p style='display: inline;'> <h5>Connector Class:</h5> " + obj["config"]["connector.class"]  + "</p>" ;
        retVal += "<p style='display: inline;'> <h5>Connector Type:</h5> " + obj.type  + "</p>" ;

        if (obj.type === "source") {
            retVal +=  "<p> <h5>Source File:</h5> " + obj["config"]["connector.class"]  + "</p>" ;
            retVal +=  "<p> <h5>Target Topic:</h5>  " + obj["config"]["topic"]  + "</p>" ;
        }
        else if (obj.type === "sink") {
            retVal +=  "<p> <h5>Target File:</h5>  " + obj["config"]["connector.class"]  + "</p>" ;
            retVal +=  "<p> <h5>Source Topic:</h5>  " + obj["config"]["topic"]  + "</p>" ;
        }
    }
    */
    return retVal;
}


function pauseConnector(gConnectorName) {
    $.ajax({
        url: "http://localhost:8083/connectors/" + gConnectorName + "/pause",
        type: 'PUT',
        dataType: 'json',
        async: false,
        success: function(result) {
        }
    });
    alert("connector paused");
    location.reload();
}

function resumeConnector(gConnectorName) {
    $.ajax({
        url: "http://localhost:8083/connectors/" + gConnectorName + "/resume",
        type: 'PUT',
        dataType: 'json',
        async: false,
        success: function(result) {
        }
    });
    alert("connector resumed");
    location.reload();
}

function restartConnector(gConnectorName) {
    $.ajax({
        url: "http://localhost:8083/connectors/" + gConnectorName + "/restart?includeTasks=true",
        type: 'POST',
        dataType: 'json',
        async: false,
        success: function(result) {
        }
    });
    alert("connector restarted");
    location.reload();
}

