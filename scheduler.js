const scheduler = (() => {
  let reads = [];
  let writes = [];
  let scheduled = false;

  function flush() {
    const r = reads;
    reads = [];
    for (const job of r) {
      try {
        job();
      } catch (e) {
        console.error(e);
      }
    }
    const w = writes;
    writes = [];
    for (const job of w) {
      try {
        job();
      } catch (e) {
        console.error(e);
      }
    }
    scheduled = false;
  }

  function schedule() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(flush);
    }
  }

  function read(fn) {
    if (writes.length) {
      console.warn(
        "Read scheduled after writes; consider batching reads before writes.",
      );
    }
    reads.push(fn);
    schedule();
  }

  function write(fn) {
    writes.push(fn);
    schedule();
  }

  return { read, write };
})();
