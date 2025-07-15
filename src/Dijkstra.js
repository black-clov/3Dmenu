// dijkstra.js
export function dijkstra(start, end, nodes, connections) {
    const distances = {};
    const previous = {};
    Object.keys(nodes).forEach((node) => {
        distances[node] = Infinity;
        previous[node] = null;
    });
    distances[start] = 0;

    const queue = [{ node: start, dist: 0 }];

    while (queue.length) {
        queue.sort((a, b) => a.dist - b.dist);
        const { node: current } = queue.shift();

        if (current === end) break;

        (connections[current] || []).forEach((neighbor) => {
            const [x1, y1, z1] = nodes[current];
            const [x2, y2, z2] = nodes[neighbor];
            const segmentDistance = Math.sqrt(
                Math.pow(x1 - x2, 2) +
                Math.pow(y1 - y2, 2) +
                Math.pow(z1 - z2, 2)
            );
            const alt = distances[current] + segmentDistance;
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                previous[neighbor] = current;
                queue.push({ node: neighbor, dist: alt });
            }
        });
    }

    const path = [];
    let node = end;
    while (previous[node]) {
        path.unshift(node);
        node = previous[node];
    }
    if (distances[end] !== Infinity) {
        path.unshift(start);
    }
    return path;
}
