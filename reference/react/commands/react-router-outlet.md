# Outlet

React command · Layout

Marks where the matched child route renders inside a parent route element.

## Syntax

```jsx
<Outlet />
```

## Example

```jsx
function HotelsLayout() {
    return (
        <section>
            <h2>Hotels</h2>
            <nav><Link to="/hotels">All</Link></nav>
            {/* child route element goes here */}
            <Outlet />
        </section>
    );
}
```

## Details

A parent route renders once and its children swap inside the outlet, so shared chrome does not remount on navigation.

Forgetting `<Outlet />` is the most common nested route bug: the URL changes, the parent renders, the child never appears, and the route table looks correct.

`useOutletContext` passes a value from parent to child without prop drilling, but props on the child element are usually simpler.
