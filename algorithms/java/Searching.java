import java.util.Arrays;

/** Search routines for a sorted array, plus a linear scan for unsorted data. */
public class Searching {

    /** Linear search: check every slot until the target shows up.
     *  O(n) time, O(1) space. Works on unsorted data. Returns the index or -1. */
    static int linear(int[] a, int target) {
        for (int i = 0; i < a.length; i++) {
            if (a[i] == target) {
                return i;
            }
        }
        return -1;
    }

    /** Binary search, iterative: halve the range by comparing with the middle.
     *  O(log n) time, O(1) space. Requires sorted input. Returns any matching index or -1. */
    static int binaryIterative(int[] a, int target) {
        int lo = 0;
        int hi = a.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] == target) {
                return mid;
            }
            if (a[mid] < target) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return -1;
    }

    /** Binary search, recursive: same halving, the range travels in the call stack.
     *  O(log n) time, O(log n) stack space. */
    static int binaryRecursive(int[] a, int target) {
        return binaryRecursive(a, target, 0, a.length - 1);
    }

    private static int binaryRecursive(int[] a, int target, int lo, int hi) {
        if (lo > hi) {
            return -1;
        }
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) {
            return mid;
        }
        if (a[mid] < target) {
            return binaryRecursive(a, target, mid + 1, hi);
        }
        return binaryRecursive(a, target, lo, mid - 1);
    }

    /** Lower bound: first index whose value is not less than the target.
     *  O(log n) time, O(1) space. Returns a.length when every value is smaller.
     *  This is the insertion point, so duplicates land left of existing equal values. */
    static int lowerBound(int[] a, int target) {
        int lo = 0;
        int hi = a.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] < target) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return lo;
    }

    public static void main(String[] args) {
        int[] sorted = {2, 4, 4, 4, 7, 11, 19, 23, 31};
        System.out.println("sorted      " + Arrays.toString(sorted));

        System.out.println("linear 11   -> index " + linear(sorted, 11));
        System.out.println("linear 99   -> index " + linear(sorted, 99));
        System.out.println("binary it 7 -> index " + binaryIterative(sorted, 7));
        System.out.println("binary it 5 -> index " + binaryIterative(sorted, 5));
        System.out.println("binary rec 31 -> index " + binaryRecursive(sorted, 31));
        System.out.println("binary rec 1  -> index " + binaryRecursive(sorted, 1));

        System.out.println("lowerBound 4  -> index " + lowerBound(sorted, 4));
        System.out.println("lowerBound 5  -> index " + lowerBound(sorted, 5));
        System.out.println("lowerBound 40 -> index " + lowerBound(sorted, 40));

        if (linear(sorted, 11) != 5 || binaryIterative(sorted, 7) != 4
                || binaryRecursive(sorted, 31) != 8 || lowerBound(sorted, 4) != 1
                || lowerBound(sorted, 40) != sorted.length) {
            throw new AssertionError("search result mismatch");
        }
        System.out.println("all search results as expected");
    }
}
