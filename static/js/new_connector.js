let supportedPlugins = ["io.debezium.connector.postgresql.PostgresConnector",
                        "org.apache.kafka.connect.file.FileStreamSinkConnector",
                        "org.apache.kafka.connect.file.FileStreamSourceConnector",
                        "io.confluent.connect.jdbc.JdbcSinkConnector",
                        "io.debezium.connector.oracle.OracleConnector"]

function fillPluginList(gDivId){
    let plugins;
    let retVal = "";
    retVal += "<label style='display:block' for='pluginList'>Select Plugin: </label>";
    retVal += "<select class='form-control' name='pluginList' id='pluginList' onChange='buildBuilder()'>";
    retVal += "<option value=''> Select Option ...</option>";

    $.ajax({
        url: kafkaConnectHost + "/connector-plugins",
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
                             "<input class='form-control' type='text' id='connectorName' />" +
                             "<small id='connectorNameHelp' class='form-text text-muted'>The name of the connector</small> <br/><br/> " +
                             "<label style='display:block' for='fileName'>File Name</label>" +
                             "<input class='form-control' type='text' id='fileName' />" +
                             "<small id='connectorNameHelp' class='form-text text-muted'>Full path of the file to read from</small> <br/><br/> " +
                             "<label style='display:block' for='topicName'>Topic Name</label>" +
                             "<input class='form-control' type='text' id='topicName' />" +
                             "<small id='connectorNameHelp' class='form-text text-muted'>Topic to write to</small> <br/><br/> " +
                             "<label style='display:block' for='desc'>Description</label>" +
                             "<textarea class='form-control' id='desc' name='desc' rows='4' cols='50' maxlength='150'></textarea><br/><br/>" +
                             "<input class='form-control' type='button' value='Create' onClick='createFileStreamSourceConnector()'>" +
                             "<br/><br/>" +
                             "</div>"
                             ;

let fileSinkTemplateHtml = "<div style='float:left;margin-right:20px;'>" +
                             "<label style='display:block' for='connectorName'>Connector Name</label>" +
                             "<input class='form-control' type='text' id='connectorName' />" +
                             "<small id='connectorNameHelp' class='form-text text-muted'>The name of the connector</small> <br/><br/> " +
                             "<label style='display:block' for='fileName'>File Name</label>" +
                             "<input class='form-control' type='text' id='fileName' />" +
                             "<small id='connectorNameHelp' class='form-text text-muted'>Full path of the file to write to</small> <br/><br/> " +
                             "<label style='display:block' for='topicName'>Topic Name</label>" +
                             "<input class='form-control' type='text' id='topicName' />" +
                             "<small id='connectorNameHelp' class='form-text text-muted'>Topic to read from</small> <br/><br/> " +
                             "<label style='display:block' for='desc'>Description</label>" +
                             "<textarea class='form-control' id='desc' name='desc' rows='4' cols='50' maxlength='150'></textarea><br/><br/>" +
                             "<input class='form-control' type='button' value='Create' onClick='createFileStreamSinkConnector()'>" +
                             "<br/><br/>" +
                             "</div>"
                             ;

let postgresSourceTemplateHtml = "<div style='float:left;margin-right:20px;'>" +
                             "<label style='display:block' for='connectorName'>Connector Name</label>" +
                             "<input class='form-control' type='text' id='connectorName' />" +
                             "<small id='connectorNameHelp' class='form-text text-muted'>The name of the connector</small> <br/><br/> " +
                             "<label style='display:block' for='hostName'>Host Name</label>" +
                             "<input class='form-control' type='text' id='hostName' />" +
                             "<small id='connectorNameHelp' class='form-text text-muted'>Hostname of the source database to be replicated to kafka</small> <br/><br/> " +
                             "<label style='display:block' for='port'>Port</label>" +
                             "<input class='form-control' type='text' id='port' />" +
                             "<small id='connectorNameHelp' class='form-text text-muted'>Port of the database listener</small> <br/><br/> " +
                             "<label style='display:block' for='userName'>User Name</label>" +
                             "<input class='form-control' type='text' id='userName' /><br/><br/>" +
                             "<label style='display:block' for='password'>Password</label>" +
                             "<input class='form-control' type='password' id='password' /><br/><br/>" +
                             "<label style='display:block' for='dbName'>Database Name</label>" +
                             "<input class='form-control' type='text' id='dbName' /><br/><br/>" +
                             "<label style='display:block' for='serverName'>Server Name</label>" +
                             "<input class='form-control' type='text' id='serverName' />" +
                             "<small id='connectorNameHelp' class='form-text text-muted'>Logical name, will be used to create topics to distinguish different databases</small> <br/><br/> " +
                             "<label style='display:block' for='tableIncludeList'>Table Include List</label>" +
                             "<input class='form-control' type='text' id='tableIncludeList' />" +
                             "<small id='connectorNameHelp' class='form-text text-muted'>Table to be captures should be in schema_name.table_name format. </small> " +
                             "<small id='connectorNameHelp' class='form-text text-muted'>Multiple tables may be entered with comma separated</small> <br/><br/> " +
                             "<label style='display:block' for='desc'>Description</label>" +
                             "<textarea class='form-control' id='desc' name='desc' rows='4' cols='50' maxlength='150'></textarea><br/><br/>" +
                             "<input class='form-control' type='button' value='Create' onClick='createPostgresSourceConnector()'>" +
                             "<br/><br/>" +
                             "</div>"
                             ;

let jdbcSinkTemplateHtml = "<div style='float:left;margin-right:20px;'>" +
                             "<label style='display:block' for='connectorName'>Connector Name</label>" +
                             "<input class='form-control' type='text' id='connectorName' />" +
                             "<small id='connectorNameHelp' class='form-text text-muted'>The name of the connector</small> <br/><br/> " +
                             "<label style='display:block' for='dialectName'>Dialect Name</label>" +
                             "<select class='form-control' name='pluginList' id='dialectName'>" +
                             "<option value='OracleDatabaseDialect'>OracleDatabaseDialect</option>" +
                             "<option value='PostgreSqlDatabaseDialect'>PostgreSqlDatabaseDialect</option>" +
                             "</select>" +
                             "<small id='connectorNameHelp' class='form-text text-muted'>Select the target database dialect.</small> <br/><br/> " +
                             "<label style='display:block' for='jdbcUrl'>JDBC Url</label>" +
                             "<input class='form-control' type='text' id='jdbcUrl' />" +
                             "<small id='connectorNameHelp' class='form-text text-muted'>Jdbc connection url for the target database</small> " +
                             "<small id='connectorNameHelp' class='form-text text-muted'>Templates can be found in the Info section</small> <br/><br/> " +
                             "<label style='display:block' for='userName'>User Name</label>" +
                             "<input class='form-control' type='text' id='userName' />" +
                             "<small id='connectorNameHelp' class='form-text text-muted'>Target Database Username</small> <br/><br/> " +
                             "<label style='display:block' for='password'>Password</label>" +
                             "<input class='form-control' type='password' id='password' />" +
                             "<small id='connectorNameHelp' class='form-text text-muted'>Target Database Password</small> <br/><br/> " +
                             "<label style='display:block' for='tableNameFormat'>Table Name Format</label>" +
                             "<input class='form-control' type='text' id='tableNameFormat' />" +
                             "<small id='connectorNameHelp' class='form-text text-muted'>Table name on the target database</small> <br/><br/> " +
                             "<label style='display:block' for='pkFields'>PK Fields</label>" +
                             "<input class='form-control' type='text' id='pkFields' />" +
                             "<small id='connectorNameHelp' class='form-text text-muted'>PK field name(s), For multiple fields, enter comma separated</small> <br/><br/>" +
                             "<label style='display:block' for='topics'>Topics</label>" +
                             "<input class='form-control' type='text' id='topics' />" +
                             "<small id='connectorNameHelp' class='form-text text-muted'>Kafka Topic to read from </small>" +
                             "<small id='connectorNameHelp' class='form-text text-muted'>The topic debezium writes the cdc records </small> <br/><br/> " +
                             "<label style='display:block' for='desc'>Description</label>" +
                             "<textarea class='form-control' id='desc' name='desc' rows='4' cols='50' maxlength='150'></textarea><br/><br/>" +
                             "<input class='form-control' type='button' value='Create' onClick='createJdbcSinkConnector()'>" +
                             "<br/><br/>" +
                             "</div>"
                             ;

let jdbcSinkInfoTemplateHtml =  "<br/><br/><h5>Postgres JDBC Template</h5><br/><br/><p>jdbc:postgresql://database_host:database_port/database_name</p>" +
                                "<br/><br/><h5>Oracle JDBC Template</h5><br/><br/><p>jdbc:oracle:thin:@database_host:database_port:database_name</p>"
                                ;

let postgresSourceInfoTemplateHtml =    "<br/><br/>" +
                                        "<h5>Create Postgres Debezium User</h5>" +
                                        "<br/><br/>" +
                                        "<p><pre>" +
                                        "--create the debezium user <br/>" +
                                        "create role debezium with replication login;<br/>" +
                                        "alter role debezium with password 'debezium';<br/>" +
                                        "grant usage on schema public to debezium;<br/>" +
                                        "grant all privileges on database postgres to debezium;<br/>" +
                                        " <br/><br/>" +
                                        "--grant the ownership of the table to debezium<br/>" +
                                        "grant debezium to postgres;<br/>" +
                                        "alter table mytable owner to debezium;<br/>" +
                                        "</pre></p>" +
                                        " <br/><br/>" +
                                        "<h5>Configure Database</h5>" +
                                        "<br/><br/>" +
                                        "<p><pre>" +
                                        "set wal_level to logical <br/>" +
                                        "<br/><br/>" +
                                        "--pg_hba.conf<br/>" +
                                        "local   replication     debezium                          trust<br/>" +
                                        "host    replication     debezium  127.0.0.1/32            trust<br/>" +
                                        "host    replication     debezium  ::1/128                 trust<br/>" +
                                        "</pre></p>"
                                ;

let oracleSourceInfoTemplateHtml =
                                   "<br/><br/>" +
                                   "<h5>Create Oracle Debezium User</h5>" +
                                   "<br/><br/>" +
                                   "<p><pre>" +
                                   "CREATE USER DEBEZIUM <br/>" +
                                   "IDENTIFIED BY password <br/>" +
                                   "PROFILE DEFAULT <br/>" +
                                   "ACCOUNT UNLOCK; <br/>" +
                                   "-- 2 Roles for DEBEZIUM <br/>" +
                                   "GRANT EXECUTE_CATALOG_ROLE TO DEBEZIUM; <br/>" +
                                   "GRANT SELECT_CATALOG_ROLE TO DEBEZIUM; <br/>" +
                                   "ALTER USER DEBEZIUM DEFAULT ROLE ALL; <br/>" +
                                   "-- 9 System Privileges for DEBEZIUM <br/>" +
                                   "GRANT CREATE SEQUENCE TO DEBEZIUM; <br/>" +
                                   "GRANT CREATE SESSION TO DEBEZIUM; <br/>" +
                                   "GRANT CREATE TABLE TO DEBEZIUM; <br/>" +
                                   "GRANT FLASHBACK ANY TABLE TO DEBEZIUM; <br/>" +
                                   "GRANT LOGMINING TO DEBEZIUM; <br/>" +
                                   "GRANT SELECT ANY DICTIONARY TO DEBEZIUM; <br/>" +
                                   "GRANT SELECT ANY TABLE TO DEBEZIUM; <br/>" +
                                   "GRANT SELECT ANY TRANSACTION TO DEBEZIUM; <br/>" +
                                   "GRANT UNLIMITED TABLESPACE TO DEBEZIUM; <br/>" +
                                   "-- 11 Object Privileges for DEBEZIUM <br/>" +
                                   "GRANT EXECUTE ON SYS.DBMS_LOGMNR TO DEBEZIUM; <br/>" +
                                   "GRANT EXECUTE ON SYS.DBMS_LOGMNR_D TO DEBEZIUM; <br/>" +
                                   "GRANT SELECT ON SYS.V_$ARCHIVED_LOG TO DEBEZIUM; <br/>" +
                                   "GRANT SELECT ON SYS.V_$ARCHIVE_DEST_STATUS TO DEBEZIUM; <br/>" +
                                   "GRANT SELECT ON SYS.V_$DATABASE TO DEBEZIUM; <br/>" +
                                   "GRANT SELECT ON SYS.V_$LOG TO DEBEZIUM; <br/>" +
                                   "GRANT SELECT ON SYS.V_$LOGFILE TO DEBEZIUM; <br/>" +
                                   "GRANT SELECT ON SYS.V_$LOGMNR_CONTENTS TO DEBEZIUM; <br/>" +
                                   "GRANT SELECT ON SYS.V_$LOGMNR_LOGS TO DEBEZIUM; <br/>" +
                                   "GRANT SELECT ON SYS.V_$LOGMNR_PARAMETERS TO DEBEZIUM; <br/>" +
                                   "GRANT SELECT ON SYS.V_$LOG_HISTORY TO DEBEZIUM; <br/>" +
                                   "</pre></p>" +
                                   " <br/><br/>" +
                                   "<h5>Configure Database</h5>" +
                                   "<br/><br/>" +
                                   "<p><pre>" +
                                   "alter database archivelog;<br/>" +
                                   "alter database add supplemental log data;<br/>" +
                                   "alter table table_name add supplemental log data (all) columns;<br/>" +
                                   "</pre></p>"


let oracleSourceTemplateHtml =  "<div style='float:left;margin-right:20px;'>" +
                                "<label style='display:block' for='connectorName'>Connector Name</label>" +
                                "<input class='form-control' type='text' id='connectorName' />" +
                                "<small id='connectorNameHelp' class='form-text text-muted'>The name of the connector</small> <br/><br/> " +
                                "<label style='display:block' for='hostName'>Host Name</label>" +
                                "<input class='form-control' type='text' id='hostName' />" +
                                 "<small id='connectorNameHelp' class='form-text text-muted'>Hostname of the source database to be replicated to kafka</small> <br/><br/> " +
                                "<label style='display:block' for='port'>Port</label>" +
                                "<input class='form-control' type='text' id='port' />" +
                                "<small id='connectorNameHelp' class='form-text text-muted'>Port of the database listener</small> <br/><br/> " +
                                "<label style='display:block' for='userName'>User Name</label>" +
                                "<input class='form-control' type='text' id='userName' /><br/><br/>" +
                                "<label style='display:block' for='password'>Password</label>" +
                                "<input class='form-control' type='password' id='password' /><br/><br/>" +
                                "<label style='display:block' for='dbName'>Database Name</label>" +
                                "<input class='form-control' type='text' id='dbName' /><br/><br/>" +
                                "<label style='display:block' for='schemaName'>Schema Name</label>" +
                                "<input class='form-control' type='text' id='schemaName' /><br/><br/>" +
                                "<label style='display:block' for='serverName'>Server Name</label>" +
                                "<input class='form-control' type='text' id='serverName' />" +
                                "<small id='connectorNameHelp' class='form-text text-muted'>Logical name, will be used to create topics to distinguish different databases</small> <br/><br/> " +
                                "<label style='display:block' for='tableIncludeList'>Table Include List</label>" +
                                "<input class='form-control' type='text' id='tableIncludeList' />" +
                                "<small id='connectorNameHelp' class='form-text text-muted'>Table to be captures should be in schema_name.table_name format. </small> " +
                                "<small id='connectorNameHelp' class='form-text text-muted'>Multiple tables may be entered with comma separated</small> <br/><br/> " +
                                "<label style='display:block' for='desc'>Description</label>" +
                                "<textarea class='form-control' id='desc' name='desc' rows='4' cols='50' maxlength='150'></textarea><br/><br/>" +
                                "<input class='form-control' type='button' value='Create' onClick='createOracleSourceConnector()'>" +
                                "<br/><br/>" +
                                "</div>"
                                ;

function createFileStreamSourceConnector(){
    obj = file_source_json ;

    obj.name = $("#connectorName").val();
    obj.config["connector.class"] = "org.apache.kafka.connect.file.FileStreamSourceConnector";
    obj.config.file = $("#fileName").val();
    obj.config.topic = $("#topicName").val();

    alert (JSON.stringify(obj));
    console.log(obj);
    requestNewConnector(obj);
}

function createFileStreamSinkConnector(){
    obj = file_source_json ;

    obj.name = $("#connectorName").val();
    obj.config["connector.class"] = "org.apache.kafka.connect.file.FileStreamSinkConnector";
    obj.config.file = $("#fileName").val();
    obj.config.topics = $("#topicName").val();

    alert (JSON.stringify(obj));
    console.log(obj);
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
    console.log(obj);
    requestNewConnector(obj);
}

function createOracleSourceConnector(){
    obj = oracle_source_json ;

    obj.name = $("#connectorName").val();
    obj.config["connector.class"] = "io.debezium.connector.oracle.OracleConnector";
    obj.config["database.hostname"] = $("#hostName").val();
    obj.config["database.port"] = $("#port").val();
    obj.config["database.user"] = $("#userName").val();
    obj.config["database.password"] = $("#password").val();
    obj.config["database.dbname"] = $("#dbName").val();
    obj.config["database.schema"] = $("#schemaName").val();
    obj.config["database.server.name"] = $("#serverName").val();
    obj.config["table.include.list"] = $("#tableIncludeList").val();

    obj.config["database.history.kafka.bootstrap.servers"] = bootStrapServers;
    obj.config["bootstrap.servers"] = bootStrapServers;
    obj.config["database.history.kafka.topic"] = $("#serverName").val() + ".schema-changes";

    alert (JSON.stringify(obj));
    console.log(obj);
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
    console.log(obj);
    requestNewConnector(obj);
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
        else if(selectedItem === "io.debezium.connector.oracle.OracleConnector") {
            $("#newConnectorForm").html(oracleSourceTemplateHtml);
            $("#newConnectorInfo").html(oracleSourceInfoTemplateHtml);
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
        url: kafkaConnectHost + "/connectors",
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(gObj),
        async: false,
        success: function(result) {

            //alert("connector created");

            connectorDetail = {"name": "", "description":""};
            connectorDetail.name = $("#connectorName").val();
            connectorDetail.description = $("#desc").val();

            $.ajax({
                url: api + "/connectorDetail",
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(connectorDetail),
                async: false,
                success: function(result) {
                    alert("connector created");
                    window.location.href = "connectors.html";
                },
                error: function (jqXHR, exception) {
                    alert (jqXHR.responseText);
                }
            });

            //window.location.href = "connectors.html";
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
                           		"plugin.name": "pgoutput",
                           		"time.precision.mode": "connect",
                           		"snapshot.mode": "initial",
                           		"publication.autocreate.mode": "filtered"
                           	}
                           }

let oracle_source_json = {
                           "name": "",
                           "config": {
                             "connector.class": "io.debezium.connector.oracle.OracleConnector",
                             "snapshot.locking.mode": "none",
                             "database.user": "",
                             "database.dbname": "",
                             "database.server.name": "",
                             "database.hostname": "",
                             "database.schema": "",
                             "database.password": "",
                             "database.port": "",
                             "database.oracle.version": "19",
                             "tasks.max": "1",
                             "database.connection.adapter": "logminer",
                             "database.history.kafka.bootstrap.servers": "",
                             "database.history.kafka.topic": "trdev.schema-changes",
                             "database.history.skip.unparseable.ddl": "true",
                             "database.history.store.only.captured.tables.ddl": "true",
                             "bootstrap.servers": "",
                             "log.mining.strategy": "online_catalog",
                             "table.include.list": "",
                             "snapshot.lock.timeout.ms": "5000",
                             "snapshot.mode": "initial",
                             "time.precision.mode": "connect",
                             "decimal.handling.mode": "double"
                           }
                         }

let jdbc_sink_json = {
                       "name": "",
                       "config": {
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



