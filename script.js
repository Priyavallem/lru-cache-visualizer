class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.map = new Map();

        this.head = new Node(0, 0); 
        this.tail = new Node(0, 0); 

        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    remove(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    addToFront(node) {
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next.prev = node;
        this.head.next = node;
    }

    get(key) {
        if (!this.map.has(key)) {
            return -1;
        }

        let node = this.map.get(key);
        this.remove(node);
        this.addToFront(node);

        return node.value;
    }

    put(key, value) {
        if (this.map.has(key)) {
            let node = this.map.get(key);
            node.value = value;
            this.remove(node);
            this.addToFront(node);
        } else {
            if (this.map.size === this.capacity) {
                let lru = this.tail.prev;
                this.remove(lru);
                this.map.delete(lru.key);
            }

            let newNode = new Node(key, value);
            this.addToFront(newNode);
            this.map.set(key, newNode);
        }
    }

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

function createCache() {
    const cap = parseInt(document.getElementById("capacityInput").value);

    if (isNaN(cap) || cap <= 0) {
        alert("Please enter a valid capacity");
        return;
    }

    cache = new LRUCache(cap);
    updateCacheUI();
}

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
