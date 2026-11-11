# Throwable hierarchy

Java command · Exceptions

Every catchable failure is a Throwable. Error is fatal, Exception splits into checked and unchecked branches.

## Syntax

```java
Throwable -> Error / Exception -> RuntimeException
```

## Example

```java
// Data shape: e.getClass(), e.getMessage(), e.getCause(), e.getStackTrace()
class HierarchyDemo {
    static void unchecked() {
        try {
            Object value = null;
            value.toString();
        } catch (RuntimeException e) {
            // RuntimeException and its subclasses need no throws clause.
            System.out.println(e.getClass().getSimpleName()); // NullPointerException
            System.out.println(e.getMessage());               // may be null
            System.out.println(e.getCause());                 // null unless wrapped
        }
    }

    // A checked type is part of the method contract.
    static void checked() throws java.io.IOException {
        throw new java.io.IOException("disk unavailable");
    }
}
```

## Details

The compiler only forces handling for the checked branch. Error and RuntimeException are unchecked, so a method can throw them without declaring anything. IOException, SQLException, and InterruptedException are checked and must be caught or declared.

When you catch, put the narrowest type first. A catch for Exception before IOException is a compile error because the second clause can never be reached.
