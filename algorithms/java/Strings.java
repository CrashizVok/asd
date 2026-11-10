import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;

/** String checks and counts: all O(n) or O(n log n) in the length of the input. */
public class Strings {

    /** Palindrome: compare characters from both ends. O(n) time, O(1) space.
     *  Only letters and digits count, so punctuation and case are ignored. */
    static boolean isPalindrome(String s) {
        int left = 0;
        int right = s.length() - 1;
        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
                left++;
            }
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
                right--;
            }
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    /** Anagram: same letters, different order. One count array, then check it returns to zero.
     *  O(n) time, O(1) space. Assumes Latin letters a to z. */
    static boolean isAnagram(String a, String b) {
        if (a.length() != b.length()) {
            return false;
        }
        int[] counts = new int[26];
        for (int i = 0; i < a.length(); i++) {
            counts[Character.toLowerCase(a.charAt(i)) - 'a']++;
            counts[Character.toLowerCase(b.charAt(i)) - 'a']--;
        }
        for (int count : counts) {
            if (count != 0) {
                return false;
            }
        }
        return true;
    }

    /** Character frequency in first-seen order. O(n) time, O(k) space for k distinct characters. */
    static Map<Character, Integer> charFrequency(String s) {
        Map<Character, Integer> counts = new LinkedHashMap<>();
        for (char c : s.toCharArray()) {
            counts.merge(c, 1, Integer::sum);
        }
        return counts;
    }

    /** Word frequency, case folded and sorted by word. O(n log w) for n words and w distinct. */
    static Map<String, Integer> wordFrequency(String text) {
        Map<String, Integer> counts = new TreeMap<>();
        for (String word : text.toLowerCase(Locale.ROOT).split("\\W+")) {
            if (!word.isEmpty()) {
                counts.merge(word, 1, Integer::sum);
            }
        }
        return counts;
    }

    /** Longest common prefix: shrink the candidate while the next word does not start with it.
     *  O(total characters) worst case, O(1) extra space. */
    static String longestCommonPrefix(String[] words) {
        if (words.length == 0) {
            return "";
        }
        String prefix = words[0];
        for (int i = 1; i < words.length; i++) {
            while (!words[i].startsWith(prefix)) {
                prefix = prefix.substring(0, prefix.length() - 1);
                if (prefix.isEmpty()) {
                    return "";
                }
            }
        }
        return prefix;
    }

    /** Caesar cipher: rotate letters by shift, keep case, leave other characters.
     *  O(n) time, O(n) space for the result. Negative shifts decode. */
    static String caesar(String s, int shift) {
        StringBuilder out = new StringBuilder(s.length());
        int step = ((shift % 26) + 26) % 26;
        for (char c : s.toCharArray()) {
            if (c >= 'a' && c <= 'z') {
                out.append((char) ('a' + (c - 'a' + step) % 26));
            } else if (c >= 'A' && c <= 'Z') {
                out.append((char) ('A' + (c - 'A' + step) % 26));
            } else {
                out.append(c);
            }
        }
        return out.toString();
    }

    public static void main(String[] args) {
        System.out.println("palindrome 'A man, a plan, a canal: Panama' = "
                + isPalindrome("A man, a plan, a canal: Panama"));
        System.out.println("palindrome 'exam' = " + isPalindrome("exam"));
        System.out.println("anagram listen/silent = " + isAnagram("listen", "silent"));
        System.out.println("anagram abc/abd = " + isAnagram("abc", "abd"));
        System.out.println("char freq 'banana' = " + charFrequency("banana"));
        System.out.println("word freq = " + wordFrequency("the cat and the dog and the end"));
        System.out.println("lcp flower/flow/flight = "
                + longestCommonPrefix(new String[] {"flower", "flow", "flight"}));
        String encrypted = caesar("Attack at dawn!", 3);
        System.out.println("caesar +3 = " + encrypted + ", back = " + caesar(encrypted, -3));

        if (!isPalindrome("A man, a plan, a canal: Panama") || isPalindrome("exam")
                || !isAnagram("listen", "silent")
                || !longestCommonPrefix(new String[] {"flower", "flow", "flight"}).equals("fl")
                || !caesar(encrypted, -3).equals("Attack at dawn!")) {
            throw new AssertionError("string result mismatch");
        }
        System.out.println("all string results as expected");
    }
}
