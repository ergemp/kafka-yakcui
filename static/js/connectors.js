/*
const connectorModel =  {
    "name" : "",
    "workerId": "",
    "type": "",
    "status" : "",
}
*/

function ConnectorModel(name, workerid, type, status) {
    this.name = name;
    this.workerid = workerid;
    this.type = type;
    this.status = status;
}

let connectorsData = [];

function fillClusterInfo(){
        $('#clusterId').dxDataGrid({
            dataSource: 'http://localhost:8083',
            columns: ['version', 'commit', 'kafka_cluster_id'],
            showBorders: true
        });
}

function fillConnectors(divId, gConnectorsData){
        $("#" + divId).dxDataGrid({
            dataSource: gConnectorsData,
            selection: {
              mode: 'single',
            },
            hoverStateEnabled: true,
            onSelectionChanged(selectedItems) {
              const data = selectedItems.selectedRowsData[0];
              if (data) {
                alert(JSON.stringify(data));
              }
            },
            columns: [
                    "name",
                    "workerid",
                    "type",
                    {
                        dataField: "status",
                        width: 100,
                        allowFiltering: false,
                        allowSorting: false,
                        cellTemplate(container, options) {
                            let styling = "";
                            if (options.value === "RUNNING") {
                                styling = "display: inline-block; background-color: green; color: white";
                            }
                            else if (options.value === "FAILED") {
                                bgColor = "display: inline-block; background-color: red; color: white";
                            }
                            else {

                            }

                            $('<div>')
                              .append($('<p style="' + styling + '"> ' + options.value + ' </p>'))
                              .appendTo(container);
                        }
                    }
                    ],
            showBorders: true
        });
}

function getConnectors(){
    $.ajax({
        url: "http://localhost:8083/connectors",
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function(result) {
            for(var r in result) {
                $.ajax({
                   url: "http://localhost:8083/connectors/"+result[r]+"/status",
                   type: 'GET',
                   dataType: 'json',
                   async: false,
                   success: function(result) {
                        connectorsData.push(new ConnectorModel(result.name,
                                                            result.tasks[0].worker_id,
                                                            result.type,
                                                            result.tasks[0].state));
                   }
               });
            }
        }
    });
    return connectorsData;
    //console.log(connectorsData);
}