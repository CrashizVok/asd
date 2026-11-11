# LRU cache with LinkedHashMap

Java command · Caching

Keeps the most recently used entries up to a limit and drops the least recently used one. Access order plus one overridden method is the whole cache.

## Syntax

```java
new LinkedHashMap<>(capacity, 0.75f, true) { removeEldestEntry }
```

## Example

```java
class LruCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;

    LruCache(int capacity) {
        super(capacity, 0.75f, true);   // true = access order
        this.capacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;
    }
}

LruCache<String, Integer> prices = new LruCache<>(2);
prices.put("Danube View", 80);
prices.put("Alpen Hof", 95);
prices.get("Danube View");          // now the most recent
prices.put("City Inn", 60);         // evicts Alpen Hof
System.out.println(prices.keySet());
```

## Details

The third constructor argument is the switch: `true` tracks access order, `false` tracks insertion order. `removeEldestEntry` runs after every put and returns true to delete the head of the order.

The class is not thread safe. Wrap it in `Collections.synchronizedMap` only when every compound operation is also guarded, because a get followed by a put is two steps.
