let supportedPlugins = ["io.debezium.connector.postgresql.PostgresConnector",
                        "org.apache.kafka.connect.file.FileStreamSinkConnector",
                        "org.apache.kafka.connect.file.FileStreamSourceConnector",
                        "io.confluent.connect.jdbc.JdbcSinkConnector"]

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
                             "<label style='display:block' for='dbName'>Database Name</label>" +
                             "<input type='text' id='dbName' /><br/><br/>" +
                             "<label style='display:block' for='serverName'>Server Name</label>" +
                             "<input type='text' id='serverName' /><br/><br/>" +
                             "<label style='display:block' for='tableIncludeList'>Table Include List</label>" +
                             "<input type='text' id='tableIncludeList' /><br/><br/>" +
                             "<input type='button' value='Create' onClick='createPostgresSourceConnector()'>" +
                             "</div>"
                             ;

let jdbcSinkTemplateHtml = "<div style='float:left;margin-right:20px;'>" +
                             "<label style='display:block' for='connectorName'>Connector Name</label>" +
                             "<input type='text' id='connectorName' /><br/><br/>" +
                             "<label style='display:block' for='dialectName'>Dialect Name</label>" +
                             "<select name='pluginList' id='dialectName'>" +
                             "<option value='OracleDatabaseDialect'>OracleDatabaseDialect</option>" +
                             "<option value='PostgreSqlDatabaseDialect'>PostgreSqlDatabaseDialect</option>" +
                             "</select><br/><br/>" +
                             "<label style='display:block' for='jdbcUrl'>JDBC Url</label>" +
                             "<input type='text' id='jdbcUrl' /><br/><br/>" +
                             "<label style='display:block' for='userName'>User Name</label>" +
                             "<input type='text' id='userName' /><br/><br/>" +
                             "<label style='display:block' for='password'>Password</label>" +
                             "<input type='text' id='password' /><br/><br/>" +
                             "<label style='display:block' for='tableNameFormat'>Table Name Format</label>" +
                             "<input type='text' id='tableNameFormat' /><br/><br/>" +
                             "<label style='display:block' for='pkFields'>PK Fields</label>" +
                             "<input type='text' id='pkFields' /><br/><br/>" +
                             "<label style='display:block' for='topics'>Topics</label>" +
                             "<input type='text' id='topics' /><br/><br/>" +
                             "<input type='button' value='Create' onClick='createJdbcSinkConnector()'>" +
                             "</div>"
                             ;

let jdbcSinkInfoTemplateHtml =  "<h5>Postgres JDBC Template</h5><p>jdbc:postgresql://database_host:database_port/database_name</p>" +
                                "<h5>Oracle JDBC Template</h5><p>jdbc:oracle:thin:@database_host:database_port:database_name</p>"
                                ;

let postgresSourceInfoTemplateHtml =    "<h5>Create Postgres Debezium User</h5>" +
                                        "<p><pre>" +
                                        "--create the debezium user <br/>" +
                                        "create role debezium with password 'debezium';<br/>" +
                                        "alter role debezium with replication login;<br/>" +
                                        "grant usage on schema public to debezium;<br/>" +
                                        " <br/><br/>" +
                                        "--grant the ownership of the table to debezium<br/>" +
                                        "grant debezium to postgres;<br/>" +
                                        "alter table mytable owner to debezium;<br/>" +
                                        " <br/><br/>" +
                                        "--pg_hba.conf<br/>" +
                                        "local   replication     <youruser>                          trust<br/>" +
                                        "host    replication     <youruser>  127.0.0.1/32            trust<br/>" +
                                        "host    replication     <youruser>  ::1/128                 trust<br/>" +
                                        "</pre></p>"
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
    obj.config["database.hostname"] = $("#hostName").val();
    obj.config["database.port"] = $("#port").val();
    obj.config["database.user"] = $("#userName").val();
    obj.config["database.password"] = $("#password").val();
    obj.config["database.dbname"] = $("#dbName").val();
    obj.config["database.server.name"] = $("#serverName").val();
    obj.config["table.include.list"] = $("#tableIncludeList").val();

    alert (JSON.stringify(obj));

    requestNewConnector(obj);
}

function createJdbcSinkConnector(){
    obj = jdbc_sink_json ;

    obj.name = $("#connectorName").val();
    obj.config["connector.class"] = "io.confluent.connect.jdbc.JdbcSinkConnector";
    obj.config["dialect.name"] = $('#dialectName').find(":selected").val();
    obj.config["connection.url"] = $("#jdbcUrl").val();
    obj.config["connection.user"] = $("#userName").val();
    obj.config["connection.password"] = $("#password").val();
    obj.config["table.name.format"] = $("#tableNameFormat").val();
    obj.config["pk.fields"] = $("#pkFields").val();
    obj.config["topics"] = $("#topics").val();

    alert (JSON.stringify(obj));

    //requestNewConnector(obj);
}

function buildBuilder(){
    let selectedItem = $('#pluginList').find(":selected").val();

    if (selectedItem !== "") {
        if (selectedItem === "org.apache.kafka.connect.file.FileStreamSourceConnector") {
            $("#newConnectorForm").html(fileSourceTemplateHtml);
            $("#newConnectorInfo").html("");
        }
        else if(selectedItem === "org.apache.kafka.connect.file.FileStreamSinkConnector") {
            $("#newConnectorForm").html(fileSinkTemplateHtml);
            $("#newConnectorInfo").html("");
        }
        else if(selectedItem === "io.debezium.connector.postgresql.PostgresConnector") {
            $("#newConnectorForm").html(postgresSourceTemplateHtml);
            $("#newConnectorInfo").html(postgresSourceInfoTemplateHtml);
        }
        else if(selectedItem === "io.confluent.connect.jdbc.JdbcSinkConnector") {
            $("#newConnectorForm").html(jdbcSinkTemplateHtml);
            $("#newConnectorInfo").html(jdbcSinkInfoTemplateHtml);
        }
    }
    else {
        $("#newConnectorForm").html("");
        $("#newConnectorInfo").html("");
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
                           		"database.hostname": "",
                           		"database.port": "5432",
                           		"database.user": "debezium",
                           		"database.password": "debezium",
                           		"database.dbname": "",
                           		"database.server.name": "",
                           		"table.include.list": "",
                           		"plugin.name": "wal2json",
                           		"time.precision.mode": "connect",
                           		"snapshot.mode": "initial"
                           	}
                           }

let jdbc_sink_json = {
                       "name": "",
                       "config": {
                            "name": "",
                            "connector.class": "io.confluent.connect.jdbc.JdbcSinkConnector",
                            "tasks.max": "1",
                            "dialect.name": "",
                            "connection.url": "",
                            "connection.user": "debezium",
                            "connection.password": "debezium",
                            "table.name.format": "",
                            "pk.mode": "record_key",
                            "pk.fields": "",
                            "topics": "",
                            "transforms": "unwrap",
                            "transforms.unwrap.delete.handling.mode": "none",
                            "transforms.unwrap.drop.tombstones": "false",
                            "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",
                            "delete.enabled": "true",
                            "auto.evolve": "true",
                            "auto.create": "true",
                            "insert.mode": "upsert"
                       }
                     }





