package processor;

import org.eclipse.microprofile.reactive.messaging.Incoming;

import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;
import model.Notification;

import java.nio.charset.StandardCharsets;

@ApplicationScoped
public class NotifProcessor {
    @Incoming("fr-administration-mq")
    public void consume(byte[] messageFromQueue) {
        JsonObject json = new JsonObject(new String(messageFromQueue, StandardCharsets.UTF_8));
        Notification notification = json.mapTo(Notification.class);
        System.out.println(" [x] Received");
        System.out.println(notification);
    }
}