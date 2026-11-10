/** Recursion basics: one direct self-call, one memoized, one with two branches. */
public class Recursion {

    /** Factorial: n! = n * (n-1)! with 0! = 1.
     *  O(n) calls, O(n) stack. Overflows long past 20!, so the demo stops low. */
    static long factorial(int n) {
        if (n < 0) {
            throw new IllegalArgumentException("n must be non-negative");
        }
        return n <= 1 ? 1 : n * factorial(n - 1);
    }

    /** Memoized Fibonacci: store solved values so each n is computed once.
     *  O(n) time, O(n) space for the cache and the stack. */
    static long fibonacci(int n) {
        if (n < 0) {
            throw new IllegalArgumentException("n must be non-negative");
        }
        return fibonacci(n, new long[n + 1]);
    }

    private static long fibonacci(int n, long[] memo) {
        if (n <= 1) {
            return n;
        }
        if (memo[n] != 0) {
            return memo[n];
        }
        memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
        return memo[n];
    }

    /** Tower of Hanoi: move n-1 disks to the spare peg, move the last disk, move the rest back.
     *  Always 2^n - 1 moves, O(2^n) time, O(n) stack. */
    static void hanoi(int n, char from, char to, char spare, StringBuilder moves) {
        if (n == 0) {
            return;
        }
        hanoi(n - 1, from, spare, to, moves);
        moves.append(from).append("->").append(to).append(' ');
        hanoi(n - 1, spare, to, from, moves);
    }

    /** Digit sum: strip the last digit with n % 10 and recurse on n / 10.
     *  O(number of digits) time, same stack depth. */
    static int digitSum(int n) {
        n = Math.abs(n);
        return n < 10 ? n : n % 10 + digitSum(n / 10);
    }

    /** String reverse: last character in front of the reversed prefix.
     *  O(n^2) because every substring copy is O(n); O(n) stack. */
    static String reverse(String s) {
        if (s.length() <= 1) {
            return s;
        }
        return s.charAt(s.length() - 1) + reverse(s.substring(0, s.length() - 1));
    }

    public static void main(String[] args) {
        System.out.println("5!            = " + factorial(5));
        System.out.println("0!            = " + factorial(0));

        System.out.print("fib 0..10     = ");
        for (int i = 0; i <= 10; i++) {
            System.out.print(fibonacci(i) + (i < 10 ? " " : "\n"));
        }
        System.out.println("fib 90        = " + fibonacci(90));

        StringBuilder moves = new StringBuilder();
        hanoi(3, 'A', 'C', 'B', moves);
        System.out.println("hanoi 3 moves = " + moves.toString().trim());
        System.out.println("move count    = " + moves.toString().trim().split(" ").length);

        System.out.println("digit sum 90210 = " + digitSum(90210));
        System.out.println("reverse abcdef  = " + reverse("abcdef"));

        if (factorial(5) != 120 || fibonacci(10) != 55 || digitSum(90210) != 12
                || !reverse("abcdef").equals("fedcba")) {
            throw new AssertionError("recursion result mismatch");
        }
        System.out.println("all recursion results as expected");
    }
}
