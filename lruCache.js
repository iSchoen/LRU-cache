/*
 * The first thing I did was look up what an LRU cache was because I had forgotten after our conversation!
 * I figured that if I looked up the problem from a site that used an LRU cache as a toy problem,
 * that I would get as little information as possible beforehand, while having a good idea of what an LRU cache was.
 * So I looked up LRU cache and found the first toy problem in the search results from leet code - https://leetcode.com/problems/lru-cache/
 *
 * The following is the toy problem provided from that link:
 */

/*
 * Design and implement a data structure for Least Recently Used (LRU) cache. It should support the following operations: get and put.
 *
 * get(key) - Get the value (will always be positive) of the key if the key exists in the cache, otherwise return -1.
 * put(key, value) - Set or insert the value if the key is not already present. When the cache reached its capacity, it should invalidate the least recently used item before inserting a new item.
 *
 * The cache is initialized with a positive capacity.
 *
 * Follow up:
 * Could you do both operations in O(1) time complexity?
 *
 * Example:
 *
 * LRUCache cache = new LRUCache( 2 [> capacity <] );
 *
 * cache.put(1, 1);
 * cache.put(2, 2);
 * cache.get(1);       // returns 1
 * cache.put(3, 3);    // evicts key 2
 * cache.get(2);       // returns -1 (nt found)
 * cache.put(4, 4);    // evicts key 1
 * cache.get(1);       // returns -1 (not found)
 * cache.get(3);       // returns 3
 * cache.get(4);       // returns 4
 */

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.size = 0;
    this.items = {};
    this.mostRecentlyUsedKey = null;
    this.leastRecentlyUsedKey = null;
  }

  get(key) {
    if (!this.items.hasOwnProperty(key)) {
      return "-1";
    }

    const item = this.items[key];

    if (item.prevKey == null && item.nextKey != null) {
      this.leastRecentlyUsedKey = item.nextKey;
    }

    this.markValueAsMostRecent(key);

    return this.items[key];
  }

  put(key, value) {
    if (this.capacityExceeded()) {
      this.deleteLeastRecentlyUsedItem();
    }

    const existingValue = this.items[key] || {};

    if (existingValue.key == null) {
      this.size += 1;
    }

    const newValue = {
      ...existingValue,
      key,
      value,
      prevKey: this.mostRecentlyUsedKey,
      nextKey: null
    };

    this.items[key] = newValue;

    this.markValueAsMostRecent(key);

    if (this.leastRecentlyUsedKey == null) {
      this.leastRecentlyUsedKey = key;
    }
  }

  markValueAsMostRecent(key) {
    const item = this.items[key];

    const { prevKey, nextKey } = item;

    if (prevKey == null) {
      this.leastRecentlyUsedKey = nextKey;
    } else {
      this.items[prevKey].nextKey = nextKey;
    }

    if (nextKey != null) {
      this.items[nextKey].prevKey = prevKey;
    }

    item.prevKey = this.mostRecentlyUsedKey || null;
    item.nextKey = null;

    if (this.mostRecentlyUsedKey) {
      this.items[this.mostRecentlyUsedKey].nextKey = key;
    }

    this.mostRecentlyUsedKey = item.key;
  }

  deleteLeastRecentlyUsedItem() {
    const newLeastRecentlyUsedKey = this.leastRecentlyUsedKey
      ? this.items[this.leastRecentlyUsedKey].nextKey
      : null;

    if (newLeastRecentlyUsedKey != null) {
      this.items[newLeastRecentlyUsedKey].prevKey = null;
    }

    delete this.items[this.leastRecentlyUsedKey];

    this.leastRecentlyUsedKey = newLeastRecentlyUsedKey;
  }

  capacityExceeded(key) {
    return !this.items.hasOwnProperty(key) && this.size >= this.capacity;
  }
}
