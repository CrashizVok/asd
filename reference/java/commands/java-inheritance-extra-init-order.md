# initialization order

Java command · Constructors

Static blocks run once per class, parent first. Instance blocks and constructors run on every object, top of the hierarchy first.

## Syntax

```java
static { }   { }   Constructor() { }
```

## Example

```java
class Parent {
    static { System.out.println("1 parent static"); }
    { System.out.println("3 parent instance"); }
    Parent() { System.out.println("4 parent constructor"); }
}

class Child extends Parent {
    static { System.out.println("2 child static"); }
    { System.out.println("5 child instance"); }
    Child() {                                       // super() runs before this body
        System.out.println("6 child constructor");
    }
}

new Child();
// 1 parent static, 2 child static, 3 parent instance,
// 4 parent constructor, 5 child instance, 6 child constructor
```

## Details

Static blocks run at first use, and the parent class is initialised before the child, so the parent block prints first. Per object the order is parent instance block, parent constructor body, child instance block, child constructor body. That order is why a method called from a parent constructor sees child fields at their default values, not at the values the child declares.
