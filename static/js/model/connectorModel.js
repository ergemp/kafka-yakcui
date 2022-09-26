const connectorModel =  {
    "name" : "",
    "workerid": "",
    "type": "",
    "status" : "",
}

function fillDealModel(DealModel, filler) {
    if (filler["name"] !== undefined) {
        connectorModel["name"] = filler["name"];
    }

    if (filler["workerid"] !== undefined) {
        connectorModel["workerid"] = filler["workerid"];
    }

   if (filler["type"] !== undefined) {
       connectorModel["type"] = filler["type"];
   }

   if (filler["status"] !== undefined) {
       connectorModel["status"] = filler["status"];
   }
}