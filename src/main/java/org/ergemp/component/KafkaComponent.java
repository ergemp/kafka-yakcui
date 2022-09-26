package org.ergemp.component;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Properties;

@Component
public class KafkaComponent {

    @Value("${kafka.bootstrap.servers}")
    private String bootstrapServers;

    @Value("${kafka.topic.name}")
    private String topic;

    @Value("${kafka.client.id}")
    private String clientId;

    private Producer getProducer(){
        Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ProducerConfig.CLIENT_ID_CONFIG, clientId);  //client.id
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());  //key.serializer
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());  //value.serializer

        Producer producer = new KafkaProducer<String, String>(props);

        return producer;
    }

    public void sendMessage(String gMessage) {
        Producer producer = getProducer();
        ProducerRecord<String, String> record = new ProducerRecord<>(topic, gMessage);
        producer.send(record);
    }

    public void sendMessage(String topicName, String gMessage) {
        Producer producer = getProducer();
        ProducerRecord<String, String> record = new ProducerRecord<>(topicName, gMessage);
        producer.send(record);
    }
}
