function getClusterInfo(){
        $('#clusterId').dxDataGrid({
            dataSource: 'http://localhost:8083',
            columns: ['version', 'commit', 'kafka_cluster_id'],
            showBorders: true
        });
}

function fillConnectors(divId){
        $('#' + divId).dxDataGrid({
            dataSource: 'http://localhost:8083/connectors',
            columns: ['version', 'commit', 'kafka_cluster_id'],
            showBorders: true
        });
}