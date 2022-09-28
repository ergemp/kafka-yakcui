/*
const connectorModel =  {
    "name" : "",
    "workerId": "",
    "type": "",
    "status" : "",
}
*/
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
            window.location.href = 'http://localhost:8080/connector_details.html?name=' + selectedConnector;
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
}

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
                selectedConnector = data.name;
                popup.show();
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

function getConnectorStatusResponse(gConnectorName) {
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

