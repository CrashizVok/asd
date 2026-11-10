import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.PriorityQueue;

/** Graph walks over an adjacency list of integer nodes. */
public class Graphs {

    private final int nodes;
    private final List<List<Integer>> adjacency;

    Graphs(int nodes) {
        this.nodes = nodes;
        this.adjacency = new ArrayList<>();
        for (int i = 0; i < nodes; i++) {
            adjacency.add(new ArrayList<>());
        }
    }

    /** Undirected edge, stored on both ends. O(1) per edge. */
    void addEdge(int u, int v) {
        adjacency.get(u).add(v);
        adjacency.get(v).add(u);
    }

    /** BFS from a start node, level by level. O(V + E) time, O(V) space. */
    List<Integer> bfs(int start) {
        List<Integer> order = new ArrayList<>();
        boolean[] seen = new boolean[nodes];
        Deque<Integer> queue = new ArrayDeque<>();
        seen[start] = true;
        queue.add(start);
        while (!queue.isEmpty()) {
            int node = queue.poll();
            order.add(node);
            for (int next : adjacency.get(node)) {
                if (!seen[next]) {
                    seen[next] = true;
                    queue.add(next);
                }
            }
        }
        return order;
    }

    /** DFS, iterative with an explicit stack. O(V + E) time, O(V) space.
     *  Recursive DFS is O(V) stack too and can blow the call stack on deep graphs. */
    List<Integer> dfs(int start) {
        List<Integer> order = new ArrayList<>();
        boolean[] seen = new boolean[nodes];
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(start);
        while (!stack.isEmpty()) {
            int node = stack.pop();
            if (seen[node]) {
                continue;
            }
            seen[node] = true;
            order.add(node);
            List<Integer> neighbours = adjacency.get(node);
            for (int i = neighbours.size() - 1; i >= 0; i--) {
                if (!seen[neighbours.get(i)]) {
                    stack.push(neighbours.get(i));
                }
            }
        }
        return order;
    }

    /** Dijkstra on the undirected weighted graph. The matrix holds 0 for no edge.
     *  O(E log V) with a PriorityQueue, O(V) space. Negative weights need Bellman-Ford. */
    static int[] dijkstra(int[][] weight, int source) {
        int n = weight.length;
        int[] dist = new int[n];
        java.util.Arrays.fill(dist, Integer.MAX_VALUE);
        dist[source] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        pq.add(new int[] {0, source});
        boolean[] done = new boolean[n];
        while (!pq.isEmpty()) {
            int[] top = pq.poll();
            int d = top[0];
            int u = top[1];
            if (done[u]) {
                continue;
            }
            done[u] = true;
            for (int v = 0; v < n; v++) {
                if (weight[u][v] > 0 && dist[u] + weight[u][v] < dist[v]) {
                    dist[v] = dist[u] + weight[u][v];
                    pq.add(new int[] {dist[v], v});
                }
            }
        }
        return dist;
    }

    /** Topological sort with Kahn's algorithm: repeatedly take a node with in-degree 0.
     *  O(V + E) time, O(V) space. Returns fewer than V nodes when the graph has a cycle. */
    static List<Integer> topological(int nodes, List<int[]> directedEdges) {
        List<List<Integer>> out = new ArrayList<>();
        for (int i = 0; i < nodes; i++) {
            out.add(new ArrayList<>());
        }
        int[] inDegree = new int[nodes];
        for (int[] edge : directedEdges) {
            out.get(edge[0]).add(edge[1]);
            inDegree[edge[1]]++;
        }
        Deque<Integer> ready = new ArrayDeque<>();
        for (int i = 0; i < nodes; i++) {
            if (inDegree[i] == 0) {
                ready.add(i);
            }
        }
        List<Integer> order = new ArrayList<>();
        while (!ready.isEmpty()) {
            int node = ready.poll();
            order.add(node);
            for (int next : out.get(node)) {
                if (--inDegree[next] == 0) {
                    ready.add(next);
                }
            }
        }
        return order;
    }

    public static void main(String[] args) {
        Graphs graph = new Graphs(6);
        graph.addEdge(0, 1);
        graph.addEdge(0, 2);
        graph.addEdge(1, 3);
        graph.addEdge(2, 3);
        graph.addEdge(3, 4);
        graph.addEdge(4, 5);
        System.out.println("bfs from 0   " + graph.bfs(0));
        System.out.println("dfs from 0   " + graph.dfs(0));

        int noEdge = 0;
        int[][] weight = {
            {0, 4, 1, noEdge, noEdge},
            {4, 0, 2, 5, noEdge},
            {1, 2, 0, 8, 10},
            {noEdge, 5, 8, 0, 2},
            {noEdge, noEdge, 10, 2, 0}
        };
        System.out.println("dijkstra 0   " + java.util.Arrays.toString(dijkstra(weight, 0)));

        List<int[]> tasks = List.of(new int[] {0, 1}, new int[] {0, 2},
                new int[] {1, 3}, new int[] {2, 3}, new int[] {3, 4});
        System.out.println("topo order   " + topological(5, tasks));

        int[] dist = dijkstra(weight, 0);
        if (graph.bfs(0).size() != 6 || graph.dfs(0).size() != 6
                || dist[4] != 10 || topological(5, tasks).size() != 5) {
            throw new AssertionError("graph result mismatch");
        }
        System.out.println("all graph results as expected");
    }
}
