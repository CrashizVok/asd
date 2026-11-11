# getOrDefault

Java command · Maps

Returns the stored value or the fallback when the key is missing. Removes a null check from counting code.

## Syntax

```java
map.getOrDefault(key, fallback)
```

## Example

```java
Map<String, Integer> countByCity = new HashMap<>();
countByCity.put("Budapest", 3);

// Missing keys count as zero, so no branch is needed.
int vienna = countByCity.getOrDefault("Vienna", 0);
System.out.println(vienna);   // 0
```
