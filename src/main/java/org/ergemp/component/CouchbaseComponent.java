package org.ergemp.component;

import com.couchbase.client.core.error.DocumentNotFoundException;
import com.couchbase.client.java.Bucket;
import com.couchbase.client.java.Cluster;
import com.couchbase.client.java.Collection;
import com.couchbase.client.java.json.JsonObject;
import com.couchbase.client.java.kv.GetResult;
import com.couchbase.client.java.kv.MutationResult;
import com.couchbase.client.java.query.QueryResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CouchbaseComponent {

    @Value("${couchbase.server}")
    private String couchbaseServer;

    @Value("${couchbase.username}")
    private String couchbaseUsername;

    @Value("${couchbase.password}")
    private String couchbasePassword;

    @Value("${couchbase.bucket}")
    private String couchbaseBucket;

    private Collection getCollection(){
        Cluster cluster = Cluster.connect(couchbaseServer, couchbaseUsername, couchbasePassword);
        // get a bucket reference
        Bucket bucket = cluster.bucket(couchbaseBucket);
        // get a collection reference
        Collection collection = bucket.defaultCollection();
        //AsyncCollection asynccollection = collection.async();
        return collection;
    }

    private Cluster getCluster(){
        Cluster cluster = Cluster.connect(couchbaseServer, couchbaseUsername, couchbasePassword);
        // get a bucket reference
        Bucket bucket = cluster.bucket(couchbaseBucket);
        return cluster;
    }

    public void write(String gId, JsonObject gObject){
        Collection coll = getCollection();
        // Upsert Document
        MutationResult upsertResult = coll.upsert(
                gId,
                gObject
        );
    }

    public JsonObject read(String gId){
        Collection coll = getCollection();
        JsonObject obj = null;
        try {
            GetResult getResult = coll.get(gId);
            obj = getResult.contentAsObject();
        } catch (DocumentNotFoundException ex) {
            //System.out.println("Document not found!");
        }
        finally {
            return obj;
        }
    }

    public List<JsonObject> runSql(String gSql){
        Cluster clu = getCluster();

        QueryResult result = clu.query("select \"Hello World\" as greeting");
        return result.rowsAsObject();
        //System.out.println(result.rowsAsObject());
    }
}
