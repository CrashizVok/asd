# ListIterator insert and set

Java command · Lists

Edits a list at the cursor while walking it. add inserts before the cursor, set replaces the last element returned by next.

## Syntax

```java
ListIterator<T> it = list.listIterator(); it.add(v); it.set(v)
```

## Example

```java
LinkedList<Task> agenda = new LinkedList<>();
agenda.add(new Task("print arrivals", 2));
agenda.add(new Task("close till", 1));

ListIterator<Task> it = agenda.listIterator();
while (it.hasNext()) {
    Task task = it.next();
    if (task.priority() >= 2) {
        it.add(new Task("check " + task.name(), task.priority()));
    }
    if (task.name().equals("close till")) {
        it.set(new Task("close till and count cash", task.priority()));
    }
}

System.out.println(agenda);
```

## Details

`list.listIterator(size)` starts at the end, so `hasPrevious` and `previous` walk backwards. That is the only cheap reverse walk on a list.

The same work with `list.add` inside a for-each loop throws `ConcurrentModificationException`, because the list changes outside the loop's own cursor. Removal through `it.remove()` is legal for the same reason.
