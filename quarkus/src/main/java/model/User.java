package model;

public class User {
    public String firstname;
    public String lastname;
    public String email;

    /**
     * Default constructor required for Jackson serializer
     */
    public User() {
    }

    public User(String firstname, String lastname, String email) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
    }

    @Override
    public String toString() {
        return this.firstname + " " + this.lastname + " - [" + this.email + "]";
    }
}
