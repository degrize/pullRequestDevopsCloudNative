package model;

public class Notification {
    public User sender;
    public User[] receivers;
    public String message;

    /**
     * Default constructor required for Jackson serializer
     */
    public Notification() {
    }

    public Notification(User sender, User[] receivers, String message) {
        this.sender = sender;
        this.receivers = receivers;
        this.message = message;
    }

    @Override
    public String toString() {
        String receiversString = "[ ";
        for (User receiver : this.receivers) {
            receiversString += receiver + " && ";
        }
        receiversString += " ]";

        return "Sender: " + this.sender + "\n"
                + "Receivers: " + receiversString + "\n"
                + "Message: " + this.message;
    }
}
