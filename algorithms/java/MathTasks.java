import java.util.ArrayList;
import java.util.List;

/** Number theory and integer math, all with exact long arithmetic where it fits. */
public class MathTasks {

    /** Euclid's algorithm: gcd(a, b) = gcd(b, a mod b). O(log min(a, b)) time, O(1) space. */
    static long gcd(long a, long b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b != 0) {
            long remainder = a % b;
            a = b;
            b = remainder;
        }
        return a;
    }

    /** lcm from gcd: a * b / gcd. Divide before multiplying to limit overflow.
     *  O(log min(a, b)) time, O(1) space. */
    static long lcm(long a, long b) {
        if (a == 0 || b == 0) {
            return 0;
        }
        return Math.abs(a / gcd(a, b) * b);
    }

    /** Sieve of Eratosthenes: mark multiples of each prime.
     *  O(n log log n) time, O(n) space. Returns every prime up to limit inclusive. */
    static List<Integer> sieve(int limit) {
        List<Integer> primes = new ArrayList<>();
        if (limit < 2) {
            return primes;
        }
        boolean[] composite = new boolean[limit + 1];
        for (int p = 2; p * p <= limit; p++) {
            if (!composite[p]) {
                for (int multiple = p * p; multiple <= limit; multiple += p) {
                    composite[multiple] = true;
                }
            }
        }
        for (int i = 2; i <= limit; i++) {
            if (!composite[i]) {
                primes.add(i);
            }
        }
        return primes;
    }

    /** Fast exponentiation by squaring: halve the exponent, square the base.
     *  O(log exponent) multiplications, O(1) space. long overflows above 2^62. */
    static long power(long base, int exponent) {
        if (exponent < 0) {
            throw new IllegalArgumentException("exponent must be non-negative");
        }
        long result = 1;
        while (exponent > 0) {
            if ((exponent & 1) == 1) {
                result *= base;
            }
            base *= base;
            exponent >>= 1;
        }
        return result;
    }

    /** Prime test by trial division up to the square root.
     *  O(sqrt n) time, O(1) space. Fine for exam sized inputs, not for big integers. */
    static boolean isPrime(long n) {
        if (n < 2) {
            return false;
        }
        if (n % 2 == 0) {
            return n == 2;
        }
        for (long d = 3; d * d <= n; d += 2) {
            if (n % d == 0) {
                return false;
            }
        }
        return true;
    }

    /** Iterative Fibonacci: keep the last two values, no recursion and no memo table.
     *  O(n) time, O(1) space. long fits up to fib(92). */
    static long fibonacci(int n) {
        if (n < 0) {
            throw new IllegalArgumentException("n must be non-negative");
        }
        long previous = 0;
        long current = 1;
        for (int i = 0; i < n; i++) {
            long next = previous + current;
            previous = current;
            current = next;
        }
        return previous;
    }

    public static void main(String[] args) {
        System.out.println("gcd 48, 18     = " + gcd(48, 18));
        System.out.println("lcm 21, 6      = " + lcm(21, 6));
        System.out.println("primes to 30   = " + sieve(30));
        System.out.println("2^10           = " + power(2, 10));
        System.out.println("3^0            = " + power(3, 0));
        System.out.println("prime 97       = " + isPrime(97) + ", prime 91 = " + isPrime(91));
        System.out.println("fib 10         = " + fibonacci(10) + ", fib 50 = " + fibonacci(50));

        if (gcd(48, 18) != 6 || lcm(21, 6) != 42 || power(2, 10) != 1024
                || !isPrime(97) || isPrime(91) || fibonacci(10) != 55
                || sieve(30).size() != 10) {
            throw new AssertionError("math result mismatch");
        }
        System.out.println("all math results as expected");
    }
}
