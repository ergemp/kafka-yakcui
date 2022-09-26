package org.ergemp.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletContext;
import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api")
public class ExamplesController {

    @Autowired
    ServletContext context;

    @GetMapping("getQueryParam1")
    public String helloUser1(@RequestParam String username) {

        //http://localhost:8081/api/getQueryParam1?username=ergem -> 200
        //http://localhost:8081/api/getQueryParam1 -> 400

        return "Hello " + username ;
    }

    @GetMapping("getQueryParam2")
    public String helloUser2(@RequestParam(name = "id") String fooId, @RequestParam String username) {

        //http://localhost:8081/api/getQueryParam2?username=ergem&id=2 -> 200
        //http://localhost:8081/api/getQueryParam2? -> 400

        return "Hello " + username + " id=" + fooId ;
    }


    @GetMapping("getQueryParam3")
    public String helloUser3(@RequestParam(required=false, name="id") String fooId, @RequestParam String username) {

        //http://localhost:8081/api/getQueryParam3?username=ergem -> 200 -> id = null
        //http://localhost:8081/api/getQueryParam3? -> 400

        return "Hello " + username + " id=" + fooId ;
    }

    @GetMapping("getQueryParam4")
    public String helloUser4(@RequestParam(required=false, name="id", defaultValue="3") String fooId, @RequestParam String username) {

        //http://localhost:8081/api/getQueryParam4?username=ergem -> 200 -> id = 3
        //http://localhost:8081/api/getQueryParam4? -> 400

        return "Hello " + username + " id=" + fooId ;
    }

    @GetMapping("getQueryParam5")
    public String helloUser5(@RequestParam Map<String,String> allParams) {

        //http://localhost:8081/api/getQueryParam5?username=ergem&param2=ttt -> 200 -> Parameters are [username=ergem, param2=ttt]

        //return "Parameters are " + allParams.entrySet();

        String retVal = "";

        Iterator it = allParams.entrySet().iterator();

        while (it.hasNext()) {
            Map.Entry<String, String> entry = (Map.Entry<String, String>)it.next();
            retVal = retVal + entry.getValue() + " , ";
        }
        return retVal;
    }

    @GetMapping("getQueryParam6")
    public String helloUser6(@RequestParam List<String> id) {

        //http://localhost:8081/api/getQueryParam6?id=1,2,3 -> IDs are [1, 2, 3]
        //http://localhost:8081/api/getQueryParam6?id=1&id=2&id=3 -> IDs are [1, 2, 3]
        //http://localhost:8081/api/getQueryParam6 -> 400

        return "IDs are " + id.toString() ;
    }

    @GetMapping("getQueryParam7")
    public String helloUser7(@RequestParam List<String> id) {

        //http://localhost:8081/api/getQueryParam6?id=1,2,3 -> IDs are [1, 2, 3]
        //http://localhost:8081/api/getQueryParam6?id=1&id=2&id=3 -> IDs are [1, 2, 3]
        //http://localhost:8081/api/getQueryParam6 -> 400

        return "IDs are " + id.toString() ;
    }

    @GetMapping("getHeader1")
    public ResponseEntity<String> getHeader1(@RequestHeader("accept-language") String language) {
        return new ResponseEntity<String>(language, HttpStatus.OK);
    }

    @GetMapping("getHeader2")
    public ResponseEntity<String> getHeader2(@RequestHeader Map<String, String> headers) {

        headers.forEach((key, value) -> {
            //retVal += value + ",";
        });

        return ResponseEntity.status(HttpStatus.OK).body(headers.toString());
    }

    @GetMapping("getHeader3")
    public ResponseEntity<String> getHeader3(@RequestHeader HttpHeaders headers) {
        InetSocketAddress host = headers.getHost();
        String url = "http://" + host.getHostName() + ":" + host.getPort();
        return new ResponseEntity<String>(String.format("Base URL = %s", url), HttpStatus.OK);
        //return ResponseEntity.status(HttpStatus.OK).body(headers.toString());
    }

    @GetMapping("getHeader4")
    public ResponseEntity<String> getHeader4(@RequestHeader(name = "accept-language") String language) {
        return new ResponseEntity<String>(language, HttpStatus.OK);
    }

    @GetMapping("getHeader5")
    public ResponseEntity<String> getHeader5(@RequestHeader(name = "accept-language", required=false) String language) {
        return new ResponseEntity<String>(language, HttpStatus.OK);
    }

    @GetMapping("getHeader6")
    public ResponseEntity<String> getHeader6(@RequestHeader(name = "accept-language", defaultValue="tr") String language) {
        return new ResponseEntity<String>(language, HttpStatus.OK);
    }

    @PostMapping("getBody1")
    public String getBody1(@RequestBody PersonObject person) {

        return person.toString();

        /*
        * curl  --location --request POST 'localhost:8081/api/getBody1' \
                --header 'Content-Type: application/json' \
                --data-raw '{"firstName":"ergem","lastName":"p"}'

        responseBody -> {"firstName":"ergem","lastName":"p"}
        */
    }


    @GetMapping("responseEntity1")
    public ResponseEntity responseEntity1() {

        //http://localhost:8081/api/responseEntity1 -> 200 -> {"firstName":"ergem","lastName":"p"}

        PersonObject person = new PersonObject();
        person.setFirstName("ergem");
        person.setLastName("p");

        return ResponseEntity.status(HttpStatus.OK).body(person);
    }

    @GetMapping("responseEntity2")
    public ResponseEntity responseEntity2() {

        //http://localhost:8081/api/responseEntity1 -> 200 -> {"firstName":"ergem","lastName":"p"}

        PersonObject person = new PersonObject();
        person.setFirstName("ergem");
        person.setLastName("p");

        HttpHeaders headers = new HttpHeaders();
        headers.add("Custom-Header", "foo");

        ResponseEntity ret = new ResponseEntity("Body: Custom header set", headers, HttpStatus.OK);

        return ret;
    }

    @GetMapping("/getPathVar1/{id}")
    public ResponseEntity getPathVar1(@PathVariable String id) {
        return ResponseEntity.ok(id);
    }


    @PostMapping("/api/uploadFile")
    public ResponseEntity uploadFile(@RequestParam("file") MultipartFile file) {

        ResponseEntity retVal = ResponseEntity.status(HttpStatus.OK).body("OK");

        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("file cannot be null");
            }

            // Get the file and save it somewhere
            byte[] bytes = file.getBytes();
            String realPath = context.getRealPath("uploadDir");
            Path path = Paths.get(realPath + "/" + file.getOriginalFilename());
            Files.write(path, bytes);

            File uploadedFile = new File(realPath + "/" + file.getOriginalFilename());

            //UPLOAD TO BUNNY CDN PART
            /*
            OkHttpClient client = new OkHttpClient();
            MediaType mediaType = MediaType.parse("application/octet-stream");
            com.squareup.okhttp.RequestBody body = com.squareup.okhttp.RequestBody.create(mediaType, uploadedFile);

            Request request = new Request.Builder()
                    .url(RestConfig.cdnStorageLogoDir + file.getOriginalFilename())
                    .put(body)
                    .addHeader("Content-Type", "application/octet-stream")
                    .addHeader("AccessKey", RestConfig.cdnKey)
                    .build();

            Response response = client.newCall(request).execute();
            //https://app-staging-akila.b-cdn.net/61434b6b4e3fe0118075142b.jpeg


            if (response.isSuccessful()) {
                System.out.println(RestConfig.cdnPublishLogoDir + file.getOriginalFilename());
                System.out.print(response.message());
            }
            else {
                System.out.print(response.message());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("CDN upload fail");
            }
            */
        }
        catch (IOException e) {
            e.printStackTrace();
            retVal = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
        catch(Exception ex) {
            ex.printStackTrace();
            retVal = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
        finally {
            return retVal;
        }
        /*
            <!DOCTYPE html>
            <html >
            <body>

            <h1>Spring Boot file upload example</h1>

            <form method="POST" action="/uploadfile" enctype="multipart/form-data">
                <input type="file" name="file" /><br/><br/>
                <input type="text" name="text" /><br/><br/>
                <input type="submit" value="Submit" />
            </form>

            </body>
            </html>

            <script>
            var imageData = new FormData();
            input = document.getElementById("logo");
            imageData.append('file', input.files[0]);
            console.log("file " + imageData.get("file"));

            $.ajax({
                    url: restServer + "/rest/merchant/uploadlogo",
                    type: "POST",
                    enctype: 'multipart/form-data',
                    data: imageData ,
                    processData: false,
                    contentType: false,
                    cors: true,
                    mode: "cors",
                    crossDomain: true
                });
            </script>
        */
    }




    //
    // static:  non-static inner classes like this can only by instantiated using default,
    //          no-argument constructor
    //
    private static class PersonObject{
        String firstName = "";
        String lastName = "";

        public PersonObject(){

        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String toString(){
            ObjectMapper objectMapper = new ObjectMapper();
            String retVal = "";
            try {
                retVal = objectMapper.writeValueAsString(this);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
            finally {
                return retVal;
            }
        }
    }


}
