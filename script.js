// Step 1: Create a Node (like Java class)
class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

// Step 2: LRU Cache Class
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.map = new Map();

        // Dummy head & tail (to simplify logic)
        this.head = new Node(0, 0); // MRU side
        this.tail = new Node(0, 0); // LRU side

        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    // Remove node from list
    remove(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    // Add node right after head (MRU)
    addToFront(node) {
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next.prev = node;
        this.head.next = node;
    }

    // GET operation
    get(key) {
        if (!this.map.has(key)) {
            return -1;
        }

        let node = this.map.get(key);
        this.remove(node);
        this.addToFront(node);

        return node.value;
    }

    // PUT operation
    put(key, value) {
        if (this.map.has(key)) {
            let node = this.map.get(key);
            node.value = value;
            this.remove(node);
            this.addToFront(node);
        } else {
            if (this.map.size === this.capacity) {
                // Remove LRU
                let lru = this.tail.prev;
                this.remove(lru);
                this.map.delete(lru.key);
            }

            let newNode = new Node(key, value);
            this.addToFront(newNode);
            this.map.set(key, newNode);
        }
    }

    // For visualization
    getCacheState() {
        let result = [];
        let curr = this.head.next;
        while (curr !== this.tail) {
            result.push({ key: curr.key, value: curr.value });
            curr = curr.next;
        }
        return result;
    }
}
let cache = null;

// Create cache with given capacity
function createCache() {
    const cap = parseInt(document.getElementById("capacityInput").value);

    if (isNaN(cap) || cap <= 0) {
        alert("Please enter a valid capacity");
        return;
    }

    cache = new LRUCache(cap);
    updateCacheUI();
}

// PUT operation from UI
function putValue() {
    if (!cache) {
        alert("Create cache first");
        return;
    }

    const key = document.getElementById("putKey").value;
    const value = document.getElementById("putValue").value;

    if (key === "" || value === "") {
        alert("Key and Value cannot be empty");
        return;
    }

    cache.put(key, value);
    updateCacheUI();
}

// GET operation from UI
function getValue() {
    if (!cache) {
        alert("Create cache first");
        return;
    }

    const key = document.getElementById("getKey").value;
    if (key === "") {
        alert("Key cannot be empty");
        return;
    }

    const result = cache.get(key);
    document.getElementById("getResult").innerText =
        result === -1 ? "Key not found" : "Value: " + result;

    updateCacheUI();
}

// Update cache visualization
function updateCacheUI() {
    const container = document.getElementById("cacheContainer");
    container.innerHTML = "";
    container.style.opacity = "0";

    setTimeout(() => {
        container.style.opacity = "1";
    }, 50);


    if (!cache) return;

    const state = cache.getCacheState();

    state.forEach(item => {
        const div = document.createElement("div");
        div.className = "cache-box";
        div.innerText = `${item.key} : ${item.value}`;
        container.appendChild(div);
    });
}
