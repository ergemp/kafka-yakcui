package org.ergemp.component;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.ergemp.model.ConnectorDetailModel;
import org.springframework.stereotype.Component;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class ConnectorDetailComponent {

    public List<ConnectorDetailModel> getConnectors(){

        List<ConnectorDetailModel> connectorDetails = new ArrayList<>();

        try{
            // create object mapper instance
            ObjectMapper mapper = new ObjectMapper();

            // convert JSON file to map
            List<Map<String, String>> descriptions = mapper.readValue(Paths.get("data/connectorDetails.json").toFile(), List.class);

            for (Map<String, String> entry : descriptions) {

                ConnectorDetailModel detail = new ConnectorDetailModel();

                detail.setName(entry.get("name"));
                detail.setDescription(entry.get("description"));

                connectorDetails.add(detail);
            }
        }
        catch(Exception ex){
            ex.printStackTrace();
        }
        finally {
            return connectorDetails;
        }
    }

    public ConnectorDetailModel getConnector(String gConnectorName){

        ConnectorDetailModel connectorDetail = new ConnectorDetailModel();

        try{
            // create object mapper instance
            ObjectMapper mapper = new ObjectMapper();

            // convert JSON file to map
            List<Map<String, String>> descriptions = mapper.readValue(Paths.get("data/connectorDetails.json").toFile(), List.class);

            for (Map<String, String> entry : descriptions) {

                if (entry.get("name").equalsIgnoreCase(gConnectorName)) {
                    connectorDetail.setName(entry.get("name"));
                    connectorDetail.setDescription(entry.get("description"));
                    break;
                }
            }
        }
        catch(Exception ex){
            ex.printStackTrace();
        }
        finally {
            return connectorDetail;
        }
    }

    public void addConnector(String gConnectorName, String gConnectorDescription){

        List<ConnectorDetailModel> connectorDetails = new ArrayList<>();

        try{
            // create object mapper instance
            ObjectMapper mapper = new ObjectMapper();

            // convert JSON file to map
            List<Map<String, String>> descriptions = mapper.readValue(Paths.get("data/connectorDetails.json").toFile(), List.class);

            Boolean found = false;
            for (Map<String, String> entry : descriptions) {

                ConnectorDetailModel connectorDetail = new ConnectorDetailModel();

                if (entry.get("name").equalsIgnoreCase(gConnectorName)) {
                    connectorDetail.setName(entry.get("name"));
                    connectorDetail.setDescription(gConnectorDescription);
                    found = true;
                }
                else {
                    connectorDetail.setName(entry.get("name"));
                    connectorDetail.setDescription(entry.get("description"));
                }
                connectorDetails.add(connectorDetail);
            }

            if (!found) {
                ConnectorDetailModel connectorDetail = new ConnectorDetailModel();
                connectorDetail.setName(gConnectorName);
                connectorDetail.setDescription(gConnectorDescription);
                connectorDetails.add(connectorDetail);
            }

            mapper.writeValue(Paths.get("data/connectorDetails.json").toFile(), connectorDetails);
        }
        catch(Exception ex){
            ex.printStackTrace();
        }
        finally {
        }
    }

    public void deleteConnector(String gConnectorName){

        List<ConnectorDetailModel> connectorDetails = new ArrayList<>();

        try{
            // create object mapper instance
            ObjectMapper mapper = new ObjectMapper();

            // convert JSON file to map
            List<Map<String, String>> descriptions = mapper.readValue(Paths.get("data/connectorDetails.json").toFile(), List.class);

            for (Map<String, String> entry : descriptions) {

                if (!entry.get("name").equalsIgnoreCase(gConnectorName)) {
                    ConnectorDetailModel connectorDetail = new ConnectorDetailModel();
                    connectorDetail.setName(entry.get("name"));
                    connectorDetail.setDescription(entry.get("description"));
                    connectorDetails.add(connectorDetail);
                }
            }

            mapper.writeValue(Paths.get("data/connectorDetails.json").toFile(), connectorDetails);
        }
        catch(Exception ex){
            ex.printStackTrace();
        }
        finally {
        }
    }



}
