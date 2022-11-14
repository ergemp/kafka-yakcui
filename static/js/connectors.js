let connectorsData = [];
let selectedConnector;

const popupContentTemplate = function () {
    return("<pre>" + getConnectorStatusResponse(selectedConnector) + "</pre>");

    /*
    return $('<div>').append(
      $(`<p>Connector Name: <span>${selectedConnector.name}</span></p>`)
    );
    */
  };


const popup = $('#popup').dxPopup({
    contentTemplate: popupContentTemplate,
    width: 400,
    height: 500,
    container: '.dx-viewport',
    showTitle: true,
    title: 'Information',
    visible: false,
    dragEnabled: false,
    hideOnOutsideClick: true,
    showCloseButton: false,
    position: {
      at: 'center',
      my: 'center',
    },
    toolbarItems: [{
      widget: 'dxButton',
      toolbar: 'bottom',
      location: 'before',
      options: {
        text: 'Details',
        onClick() {
            //alert("go to connector_details.html");
            window.location.href = '/connector_details.html?name=' + selectedConnector;
          /*
          const message = `Email is sent to ${employee.FirstName} ${employee.LastName}`;
          DevExpress.ui.notify({
            message,
            position: {
              my: 'center top',
              at: 'center top',
            },
          }, 'success', 3000);
          */
        },
      },
    }, {
      widget: 'dxButton',
      toolbar: 'bottom',
      location: 'after',
      options: {
        text: 'Delete',
        onClick() {
          alert("will delete");
        },
      },
    }],
  }).dxPopup('instance');

function ConnectorModel(name, workerid, type, status) {
    this.name = name;
    this.workerid = workerid;
    this.type = type;
    this.status = status;
    this.type = "";
    this.class = "";
}

function ConnectorModel() {
    this.name = "";
    this.workerid = "";
    this.type = "";
    this.status = "";
    this.class = "";
}

function fillClusterInfo(){
        $('#clusterId').dxDataGrid({
            dataSource: kafkaConnectHost,
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
                window.location.href = 'connector_details.html?name=' + data.name;
                //selectedConnector = data.name;
                //popup.show();
              }
            },
            columns: [
                    {
                      dataField: 'class',
                      width: 80,
                      allowFiltering: false,
                      allowSorting: false,
                      cellTemplate(container, options) {
                        $('<div>')
                          .append($('<img>', { alt:"tt", width:"60" ,src: "img/" + options.value +".png" }))
                          .appendTo(container);
                      }
                    },
                    { dataField:"name", cssClass:"cellMiddleClass"},
                    { dataField:"workerid", cssClass:"cellMiddleClass"},
                    { dataField:"type", cssClass:"cellMiddleClass"},
                    {
                        dataField: "status",
                        cssClass:"cellMiddleClass",
                        width: 100,
                        allowFiltering: false,
                        allowSorting: false,
                        cellTemplate(container, options) {
                            let styling = "";
                            if (options.value === "RUNNING") {
                                styling = "display: inline-block; background-color: green; color: white";
                            }
                            else if (options.value === "FAILED") {
                                styling = "display: inline-block; background-color: red; color: white";
                            }
                            else if (options.value === "PAUSED"){
                                styling = "display: inline-block; background-color: orange; color: white";
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

function getConnectorConfig(gConnector, connectorName){

        $.ajax({
           url: kafkaConnectHost + "/connectors/"+connectorName+"",
           type: 'GET',
           dataType: 'json',
           async: false,
           success: function(result) {
                connector.class = result.config["connector.class"];
           }
       });

       return gConnector;
}

function getConnectorStatus(gConnector, connectorName){
        //connector = new ConnectorModel();
        $.ajax({
           url: kafkaConnectHost + "/connectors/"+connectorName+"/status",
           type: 'GET',
           dataType: 'json',
           async: false,
           success: function(result) {
                gConnector.name = result.name;
                gConnector.workerid = result.tasks[0].worker_id;
                gConnector.type = result.type;
                gConnector.status = result.tasks[0].state;
           }
       });
       return gConnector;
}

function getConnectors(){
    $.ajax({
        url: kafkaConnectHost + "/connectors",
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function(result) {
            for(var r in result) {
                connector = new ConnectorModel();
                connector = getConnectorStatus(connector, result[r]);
                connector = getConnectorConfig(connector, result[r]);
                connectorsData.push(connector);
                /*
                $.ajax({
                   url: kafkaConnectHost + "/connectors/"+result[r]+"/status",
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
               */
            }
        }
    });
    return connectorsData;
    //console.log(connectorsData);
}

function getConnectorStatusResponse(gConnectorName) {
    let retVal;
    $.ajax({
        url: kafkaConnectHost + "/connectors/" + gConnectorName + "/status",
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function(result) {
            retVal = result;
        }
    });
    return JSON.stringify(retVal, null, 2);
}

