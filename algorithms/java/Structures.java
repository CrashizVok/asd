import java.util.ArrayList;
import java.util.List;

/** Four hand written data structures, each generic where generics make sense. */
public class Structures {

    /** Shared chain node for the queue and the linked list. */
    static class Node<T> {
        T value;
        Node<T> next;
        Node(T value) { this.value = value; }
    }

    /** Stack, LIFO, on top of ArrayList. push/pop/peek O(1) amortized, O(n) space. */
    static class Stack<T> {
        private final List<T> items = new ArrayList<>();
        void push(T value) { items.add(value); }
        T pop() {
            if (items.isEmpty()) throw new IllegalStateException("stack is empty");
            return items.remove(items.size() - 1);
        }
        T peek() {
            if (items.isEmpty()) throw new IllegalStateException("stack is empty");
            return items.get(items.size() - 1);
        }
        int size() { return items.size(); }
    }

    /** Queue, FIFO, a singly linked chain with head and tail pointers.
     *  offer/poll/peek O(1), O(n) space. */
    static class Queue<T> {
        private Node<T> head;
        private Node<T> tail;
        private int size;
        void offer(T value) {
            Node<T> node = new Node<>(value);
            if (tail == null) head = tail = node;
            else { tail.next = node; tail = node; }
            size++;
        }
        T poll() {
            if (head == null) throw new IllegalStateException("queue is empty");
            T value = head.value;
            head = head.next;
            if (head == null) tail = null;
            size--;
            return value;
        }
        T peek() {
            if (head == null) throw new IllegalStateException("queue is empty");
            return head.value;
        }
        int size() { return size; }
    }

    /** Singly linked list: append, remove by value, reverse, snapshot.
     *  Append/remove O(n), reverse O(n), O(n) space. */
    static class LinkedList<T> {
        private Node<T> head;
        private int size;
        void addLast(T value) {
            Node<T> node = new Node<>(value);
            if (head == null) head = node;
            else {
                Node<T> cursor = head;
                while (cursor.next != null) cursor = cursor.next;
                cursor.next = node;
            }
            size++;
        }

        boolean remove(T value) {
            Node<T> prev = null;
            for (Node<T> cursor = head; cursor != null; cursor = cursor.next) {
                if (cursor.value.equals(value)) {
                    if (prev == null) head = cursor.next;
                    else prev.next = cursor.next;
                    size--;
                    return true;
                }
                prev = cursor;
            }
            return false;
        }

        void reverse() {
            Node<T> prev = null;
            for (Node<T> cursor = head; cursor != null; ) {
                Node<T> next = cursor.next;
                cursor.next = prev;
                prev = cursor;
                cursor = next;
            }
            head = prev;
        }

        List<T> toList() {
            List<T> out = new ArrayList<>();
            for (Node<T> cursor = head; cursor != null; cursor = cursor.next) out.add(cursor.value);
            return out;
        }

        int size() { return size; }
    }

    /** Binary search tree of ints: insert, contains, in-order walk.
     *  Height h gives O(h) operations; a sorted insert order degrades the tree to O(n). */
    static class BinarySearchTree {
        private static class Node {
            int value;
            Node left;
            Node right;

            Node(int value) { this.value = value; }
        }

        private Node root;
        private int size;

        void insert(int value) { root = insert(root, value); }

        private Node insert(Node node, int value) {
            if (node == null) { size++; return new Node(value); }
            if (value < node.value) node.left = insert(node.left, value);
            else if (value > node.value) node.right = insert(node.right, value);
            return node;
        }

        boolean contains(int value) {
            for (Node cursor = root; cursor != null; ) {
                if (value == cursor.value) return true;
                cursor = value < cursor.value ? cursor.left : cursor.right;
            }
            return false;
        }

        List<Integer> inOrder() {
            List<Integer> out = new ArrayList<>();
            inOrder(root, out);
            return out;
        }

        private void inOrder(Node node, List<Integer> out) {
            if (node == null) return;
            inOrder(node.left, out);
            out.add(node.value);
            inOrder(node.right, out);
        }

        int size() { return size; }
    }

    public static void main(String[] args) {
        Stack<String> stack = new Stack<>();
        stack.push("a"); stack.push("b"); stack.push("c");
        System.out.println("stack pop    " + stack.pop() + " then peek " + stack.peek());

        Queue<Integer> queue = new Queue<>();
        queue.offer(1); queue.offer(2); queue.offer(3);
        System.out.println("queue poll   " + queue.poll() + " then peek " + queue.peek());

        LinkedList<String> list = new LinkedList<>();
        list.addLast("one"); list.addLast("two"); list.addLast("three");
        list.remove("two");
        list.reverse();
        System.out.println("list         " + list.toList());

        BinarySearchTree tree = new BinarySearchTree();
        for (int value : new int[] {50, 30, 70, 20, 40, 60, 80}) tree.insert(value);
        System.out.println("bst in-order " + tree.inOrder() + " size " + tree.size());
        System.out.println("contains 40  " + tree.contains(40) + ", contains 45 " + tree.contains(45));

        if (stack.size() != 2 || queue.size() != 2 || list.size() != 2 || tree.size() != 7
                || !tree.inOrder().equals(List.of(20, 30, 40, 50, 60, 70, 80))) {
            throw new AssertionError("structure result mismatch");
        }
        System.out.println("all structures behave as expected");
    }
}
