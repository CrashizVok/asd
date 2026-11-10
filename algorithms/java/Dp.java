import java.util.Arrays;

/** Four dynamic programming classics, each built on an overlapping subproblem table. */
public class Dp {

    /** 0/1 knapsack: each item once, maximize value under a weight limit.
     *  dp[w] is the best value for capacity w, filled backwards so each item is used once.
     *  O(n * capacity) time, O(capacity) space. */
    static int knapsack(int[] weights, int[] values, int capacity) {
        int[] dp = new int[capacity + 1];
        for (int i = 0; i < weights.length; i++) {
            for (int w = capacity; w >= weights[i]; w--) {
                dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
            }
        }
        return dp[capacity];
    }

    /** Longest common subsequence: dp[i][j] is the LCS length of the two prefixes.
     *  Equal last characters extend the diagonal, otherwise take the better neighbour.
     *  O(n * m) time, O(n * m) space. */
    static int lcs(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];
        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[a.length()][b.length()];
    }

    /** Edit distance (Levenshtein): minimum insert, delete and replace steps.
     *  Costs: delete from a row above, insert from the left, replace from the diagonal.
     *  O(n * m) time, O(n * m) space. */
    static int editDistance(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];
        for (int i = 0; i <= a.length(); i++) {
            dp[i][0] = i;
        }
        for (int j = 0; j <= b.length(); j++) {
            dp[0][j] = j;
        }
        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],
                            Math.min(dp[i - 1][j], dp[i][j - 1]));
                }
            }
        }
        return dp[a.length()][b.length()];
    }

    /** Coin change, minimum number of coins for an amount.
     *  dp[x] = 1 + min over coins of dp[x - coin], 0 for amount 0, -1 when unreachable.
     *  O(amount * coins) time, O(amount) space. */
    static int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int x = 1; x <= amount; x++) {
            for (int coin : coins) {
                if (coin <= x) {
                    dp[x] = Math.min(dp[x], dp[x - coin] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }

    public static void main(String[] args) {
        int[] weights = {1, 3, 4, 5};
        int[] values = {1, 4, 5, 7};
        System.out.println("knapsack cap 7  = " + knapsack(weights, values, 7));
        System.out.println("lcs ABCBDAB / BDCABA = " + lcs("ABCBDAB", "BDCABA"));
        System.out.println("edit kitten / sitting = " + editDistance("kitten", "sitting"));
        System.out.println("edit same strings     = " + editDistance("same", "same"));
        System.out.println("coins 1,2,5 amount 11 = " + coinChange(new int[] {1, 2, 5}, 11));
        System.out.println("coins 2 amount 3      = " + coinChange(new int[] {2}, 3));

        if (knapsack(weights, values, 7) != 9 || lcs("ABCBDAB", "BDCABA") != 4
                || editDistance("kitten", "sitting") != 3
                || coinChange(new int[] {1, 2, 5}, 11) != 3
                || coinChange(new int[] {2}, 3) != -1) {
            throw new AssertionError("dp result mismatch");
        }
        System.out.println("all dp results as expected");
    }
}
