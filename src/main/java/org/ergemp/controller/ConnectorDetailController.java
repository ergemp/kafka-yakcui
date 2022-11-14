package org.ergemp.controller;

import org.ergemp.component.ConnectorDetailComponent;
import org.ergemp.model.ConnectorDetailModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class ConnectorDetailController {

    public ConnectorDetailComponent detailComponent = new ConnectorDetailComponent();

    @GetMapping("/api/connectorDetails")
    public ResponseEntity getControllerDetails() {

        List<ConnectorDetailModel> details =  detailComponent.getConnectors();

        ResponseEntity retVal = ResponseEntity.status(HttpStatus.OK).body(details.toString());
        return retVal;
    }

    @GetMapping("/api/connectorDetail")
    public ResponseEntity addControllerDetail(@RequestParam String connectorName) {

        ConnectorDetailModel detail =  detailComponent.getConnector(connectorName);

        ResponseEntity retVal = ResponseEntity.status(HttpStatus.OK).body(detail.toString());
        return retVal;
    }

    @PostMapping("/api/connectorDetail")
    public ResponseEntity addControllerDetail(@RequestBody ConnectorDetailModel connector) {

        detailComponent.addConnector(connector.getName(), connector.getDescription());
        ResponseEntity retVal = ResponseEntity.status(HttpStatus.OK).body(connector.toString());
        return retVal;
    }

    @DeleteMapping("/api/connectorDetail")
    public ResponseEntity deleteControllerDetail(@RequestBody ConnectorDetailModel connector) {

        detailComponent.deleteConnector(connector.getName());
        ResponseEntity retVal = ResponseEntity.status(HttpStatus.OK).body(connector.toString());
        return retVal;
    }

}
