# hook method

Java command · Abstract classes

An abstract method called from a final method in the parent. The parent fixes the skeleton, subclasses fill the gap.

## Syntax

```java
protected abstract void step();
```

## Example

```java
abstract class ImportJob {
    // The skeleton is final: order, logging and counting cannot be changed.
    final void run(String path) {
        System.out.println("start " + path);
        int rows = parse(path);
        afterParse(rows);
        System.out.println("done " + rows + " rows");
    }

    abstract int parse(String path);          // required, every subclass answers

    void afterParse(int rows) { }             // optional hook, empty by default
}

class CsvImport extends ImportJob {
    @Override int parse(String path) { return 120; }

    @Override void afterParse(int rows) {
        System.out.println("indexing " + rows + " rows");
    }
}

class SilentImport extends ImportJob {
    @Override int parse(String path) { return 4; }
}

new CsvImport().run("bookings.csv");
new SilentImport().run("cities.csv");
```

## Details

A required step is `abstract`; an optional step is a concrete method with an empty body. Subclasses override only what they need. The `final` method in the parent is what turns this into a template: every subclass runs the same sequence, and a new step is added in one place. If a hook must return a value, give it a default rather than making it abstract, or every subclass pays for a step it does not use.
