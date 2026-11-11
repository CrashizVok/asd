# equals and hashCode for a key

Java command · Keys

A key class must return equal hash codes for equal objects, or map and set lookups miss. A record generates both methods.

## Syntax

```java
equals(Object) and hashCode() over the same fields
```

## Example

```java
final class RoomKey {
    private final int hotelId;
    private final int roomNumber;

    RoomKey(int hotelId, int roomNumber) {
        this.hotelId = hotelId;
        this.roomNumber = roomNumber;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof RoomKey)) return false;
        RoomKey that = (RoomKey) other;
        return hotelId == that.hotelId && roomNumber == that.roomNumber;
    }

    @Override
    public int hashCode() {
        // Same fields as equals, same order.
        return Objects.hash(hotelId, roomNumber);
    }
}

Map<RoomKey, String> guestByRoom = new HashMap<>();
guestByRoom.put(new RoomKey(7, 101), "anna@example.com");
System.out.println(guestByRoom.get(new RoomKey(7, 101)));   // found
```

## Details

`Objects.hash` boxes its arguments, so a class hashed in a tight loop can use `31 * a + b` by hand instead. Correctness does not change.

Never change a field used by `hashCode` after the object enters a map or set. The entry stays in the old bucket and both `get` and `contains` stop finding it. `record` fields are final, which removes the risk.
