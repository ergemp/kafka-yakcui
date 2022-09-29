/*
<label for="cars">Choose a car:</label>

<select name="cars" id="cars">
  <option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
  <option value="mercedes">Mercedes</option>
  <option value="audi">Audi</option>
</select>
*/

let supportedPlugins = ["org.apache.kafka.connect.file.FileStreamSinkConnector","org.apache.kafka.connect.file.FileStreamSourceConnector"]

function fillPluginList(gDivId){
    let plugins;
    let retVal = "<label for='pluginList'>Select Plugin: </label>";
    retVal += "<select name='pluginList' id='pluginList' onChange='buildBuilder()'>";
    retVal += "<option value=''> Select Option ...</option>";

    $.ajax({
        url: "http://localhost:8083/connector-plugins",
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

function buildBuilder(){
    let selectedItem = $('#pluginList').find(":selected").val();

    if (selectedItem !== "") {
        alert(selectedItem);
    }
}