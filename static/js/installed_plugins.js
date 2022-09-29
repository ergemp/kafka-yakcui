function fillPlugins(divId){
        $("#" + divId).dxDataGrid({
            dataSource: "http://localhost:8083/connector-plugins",
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