function fillPlugins(divId){
        $("#" + divId).dxDataGrid({
            dataSource: kafkaConnectHost + "/connector-plugins",
            selection: {
              mode: 'single',
            },
            hoverStateEnabled: true,
            columns: [
                    "class",
                    "type",
                    "version"
                    ],
            showBorders: true
        });
}