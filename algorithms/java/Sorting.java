import java.util.Arrays;
import java.util.Random;

/** Five classic comparison sorts, each in place except merge sort. */
public class Sorting {

    /** Swap two slots. */
    private static void swap(int[] a, int i, int j) {
        int t = a[i];
        a[i] = a[j];
        a[j] = t;
    }

    /** Bubble sort: repeated neighbour swaps push the largest value to the end.
     *  O(n^2) time, O(1) space. Adaptive with the swapped flag, so nearly sorted input is O(n). */
    static void bubble(int[] a) {
        for (int end = a.length - 1; end > 0; end--) {
            boolean swapped = false;
            for (int i = 0; i < end; i++) {
                if (a[i] > a[i + 1]) {
                    swap(a, i, i + 1);
                    swapped = true;
                }
            }
            if (!swapped) {
                return;
            }
        }
    }

    /** Selection sort: find the minimum of the unsorted tail and put it at the front.
     *  O(n^2) time in every case, O(1) space, at most n-1 swaps. */
    static void selection(int[] a) {
        for (int i = 0; i < a.length - 1; i++) {
            int min = i;
            for (int j = i + 1; j < a.length; j++) {
                if (a[j] < a[min]) {
                    min = j;
                }
            }
            if (min != i) {
                swap(a, i, min);
            }
        }
    }

    /** Insertion sort: grow a sorted prefix, shifting larger values right to make room.
     *  O(n^2) worst case, O(n) on sorted input, O(1) space. Good for small arrays. */
    static void insertion(int[] a) {
        for (int i = 1; i < a.length; i++) {
            int key = a[i];
            int j = i - 1;
            while (j >= 0 && a[j] > key) {
                a[j + 1] = a[j];
                j--;
            }
            a[j + 1] = key;
        }
    }

    /** Merge sort: split in half, sort both, merge the runs.
     *  O(n log n) time in every case, O(n) extra space, stable. */
    static void merge(int[] a) {
        if (a.length < 2) {
            return;
        }
        mergeRange(a, new int[a.length], 0, a.length - 1);
    }

    private static void mergeRange(int[] a, int[] buffer, int lo, int hi) {
        if (lo >= hi) {
            return;
        }
        int mid = lo + (hi - lo) / 2;
        mergeRange(a, buffer, lo, mid);
        mergeRange(a, buffer, mid + 1, hi);

        System.arraycopy(a, lo, buffer, lo, hi - lo + 1);
        int left = lo;
        int right = mid + 1;
        for (int k = lo; k <= hi; k++) {
            if (left > mid) {
                a[k] = buffer[right++];
            } else if (right > hi) {
                a[k] = buffer[left++];
            } else if (buffer[left] <= buffer[right]) {
                a[k] = buffer[left++];
            } else {
                a[k] = buffer[right++];
            }
        }
    }

    /** Quick sort with the middle element as pivot.
     *  O(n log n) average, O(n^2) worst case when pivots keep splitting badly, O(log n) stack. */
    static void quick(int[] a) {
        quickRange(a, 0, a.length - 1);
    }

    private static void quickRange(int[] a, int lo, int hi) {
        if (lo >= hi) {
            return;
        }
        int pivot = a[lo + (hi - lo) / 2];
        int i = lo;
        int j = hi;
        while (i <= j) {
            while (a[i] < pivot) {
                i++;
            }
            while (a[j] > pivot) {
                j--;
            }
            if (i <= j) {
                swap(a, i, j);
                i++;
                j--;
            }
        }
        quickRange(a, lo, j);
        quickRange(a, i, hi);
    }

    public static void main(String[] args) {
        int[] base = new int[12];
        Random random = new Random(42);
        for (int i = 0; i < base.length; i++) {
            base[i] = random.nextInt(100);
        }
        System.out.println("input       " + Arrays.toString(base));

        int[][] copies = new int[5][];
        for (int i = 0; i < copies.length; i++) {
            copies[i] = base.clone();
        }

        bubble(copies[0]);
        System.out.println("bubble      " + Arrays.toString(copies[0]));
        selection(copies[1]);
        System.out.println("selection   " + Arrays.toString(copies[1]));
        insertion(copies[2]);
        System.out.println("insertion   " + Arrays.toString(copies[2]));
        merge(copies[3]);
        System.out.println("merge       " + Arrays.toString(copies[3]));
        quick(copies[4]);
        System.out.println("quick       " + Arrays.toString(copies[4]));

        int[] expected = base.clone();
        Arrays.sort(expected);
        for (int[] copy : copies) {
            if (!Arrays.equals(copy, expected)) {
                throw new AssertionError("sort produced a wrong result");
            }
        }
        System.out.println("all five match Arrays.sort");
    }
}
