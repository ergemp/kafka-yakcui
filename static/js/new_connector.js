/*
<label for="cars">Choose a car:</label>

<select name="cars" id="cars">
  <option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
  <option value="mercedes">Mercedes</option>
  <option value="audi">Audi</option>
</select>
*/

let supportedPlugins = ["io.debezium.connector.postgresql.PostgresConnector",
                        "org.apache.kafka.connect.file.FileStreamSinkConnector",
                        "org.apache.kafka.connect.file.FileStreamSourceConnector"]

function fillPluginList(gDivId){
    let plugins;
    let retVal = "<label style='display:block' for='pluginList'>Select Plugin: </label>";
    retVal += "<select name='pluginList' id='pluginList' onChange='buildBuilder()'>";
    retVal += "<option value=''> Select Option ...</option>";

    $.ajax({
        url: "http://localhost:8083/connector-plugins",
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function(result) {
            for(var r in result) {
                //supportedPlugins.includes(result[r].class)
                if (supportedPlugins.indexOf(result[r].class) >= 0) {
                    retVal += "<option value='" + result[r].class + "'> " + result[r].class + " </option>";
                }
                else {
                }
            }
        }
    });

    retVal += "</select>";
    $("#"+gDivId).html(retVal);
}

let fileSourceTemplateHtml = "<div style='float:left;margin-right:20px;'>" +
                             "<label style='display:block' for='connectorName'>Connector Name</label>" +
                             "<input type='text' id='connectorName' /><br/><br/>" +
                             "<label style='display:block' for='fileName'>File Name</label>" +
                             "<input type='text' id='fileName' /><br/><br/>" +
                             "<label style='display:block' for='topicName'>Topic Name</label>" +
                             "<input type='text' id='topicName' /><br/><br/>" +
                             "<input type='button' value='Create' onClick='createFileStreamSourceConnector()'>" +
                             "</div>"
                             ;

let fileSinkTemplateHtml = "<div style='float:left;margin-right:20px;'>" +
                             "<label style='display:block' for='connectorName'>Connector Name</label>" +
                             "<input type='text' id='connectorName' /><br/><br/>" +
                             "<label style='display:block' for='fileName'>File Name</label>" +
                             "<input type='text' id='fileName' /><br/><br/>" +
                             "<label style='display:block' for='topicName'>Topic Name</label>" +
                             "<input type='text' id='topicName' /><br/><br/>" +
                             "<input type='button' value='Create' onClick='createFileStreamSinkConnector()'>" +
                             "</div>"
                             ;

let postgresSourceTemplateHtml = "<div style='float:left;margin-right:20px;'>" +
                             "<label style='display:block' for='connectorName'>Connector Name</label>" +
                             "<input type='text' id='connectorName' /><br/><br/>" +
                             "<label style='display:block' for='hostName'>Host Name</label>" +
                             "<input type='text' id='hostName' /><br/><br/>" +
                             "<label style='display:block' for='port'>Port</label>" +
                             "<input type='text' id='port' /><br/><br/>" +
                             "<label style='display:block' for='userName'>User Name</label>" +
                             "<input type='text' id='userName' /><br/><br/>" +
                             "<label style='display:block' for='password'>Password</label>" +
                             "<input type='text' id='password' /><br/><br/>" +
                             "<input type='button' value='Create' onClick='createPostgresSourceConnector()'>" +
                             "</div>"
                             ;

function createFileStreamSourceConnector(){
    obj = file_source_json ;

    obj.name = $("#connectorName").val();
    obj.config["connector.class"] = "org.apache.kafka.connect.file.FileStreamSourceConnector";
    obj.config.file = $("#fileName").val();
    obj.config.topic = $("#topicName").val();

    alert (JSON.stringify(obj));

    requestNewConnector(obj);
}

function createFileStreamSinkConnector(){
    obj = file_source_json ;

    obj.name = $("#connectorName").val();
    obj.config["connector.class"] = "org.apache.kafka.connect.file.FileStreamSinkConnector";
    obj.config.file = $("#fileName").val();
    obj.config.topics = $("#topicName").val();

    alert (JSON.stringify(obj));

    requestNewConnector(obj);
}

function createPostgresSourceConnector(){
    obj = postgres_source_json ;

    obj.name = $("#connectorName").val();
    obj.config["connector.class"] = "io.debezium.connector.postgresql.PostgresConnector";


    alert (JSON.stringify(obj));

    //requestNewConnector(obj);
}

function buildBuilder(){
    let selectedItem = $('#pluginList').find(":selected").val();

    if (selectedItem !== "") {
        if (selectedItem === "org.apache.kafka.connect.file.FileStreamSourceConnector") {
            $("#newConnectorForm").html(fileSourceTemplateHtml);
        }
        else if(selectedItem === "org.apache.kafka.connect.file.FileStreamSinkConnector") {
            $("#newConnectorForm").html(fileSinkTemplateHtml);
        }
        else if(selectedItem === "io.debezium.connector.postgresql.PostgresConnector") {
            $("#newConnectorForm").html(postgresSourceTemplateHtml);
        }
    }
}

function requestNewConnector(gObj){

    $.ajax({
        url: "http://localhost:8083/connectors",
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(gObj),
        async: false,
        success: function(result) {
            alert("connector created");
            window.location.href = "http://localhost:8080";
        },
        error: function (jqXHR, exception) {
            alert (jqXHR.responseText);
        }
    });

}

let file_source_json = {
                         "name": "",
                         "config":
                         {
                           "connector.class": "",
                           "tasks.max": 1,
                           "file": "",
                           "topic": ""
                         }
                       }

let file_sink_json =   {
                         "name": "",
                         "config":
                         {
                           "connector.class": "",
                           "tasks.max": 1,
                           "file": "",
                           "topics": ""
                         }
                       }

let postgres_source_json = {
                           	"name": "",
                           	"config": {
                           		"connector.class": "io.debezium.connector.postgresql.PostgresConnector",
                           		"database.hostname": "10.0.0.13",
                           		"database.port": "5432",
                           		"database.user": "debezium_user",
                           		"database.password": "password",
                           		"database.dbname": "akila",
                           		"database.server.name": "stage.akila",
                           		"table.include.list": "akila_admin",
                           		"plugin.name": "wal2json",
                           		"time.precision.mode": "connect",
                           		"snapshot.mode": "initial"
                           	}
                           }
