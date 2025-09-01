const canvas = new fabric.Canvas("annotator-canvas");
let currentTool = null;
let drawingObject = null;
let startX, startY;

// Image loading
const imageLoader = document.getElementById("imageLoader");
imageLoader.addEventListener("change", handleImage, false);
function handleImage(e) {
  const reader = new FileReader();
  reader.onload = function (evt) {
    fabric.Image.fromURL(evt.target.result, function (img) {
      canvas.setWidth(img.width);
      canvas.setHeight(img.height);
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
    });
  };
  reader.readAsDataURL(e.target.files[0]);
}

// Tool buttons
const arrowBtn = document.getElementById("arrowTool");
const rectBtn = document.getElementById("rectTool");
const textBtn = document.getElementById("textTool");
arrowBtn.onclick = () => (currentTool = "arrow");
rectBtn.onclick = () => (currentTool = "rect");
textBtn.onclick = () => (currentTool = "text");

canvas.on("mouse:down", function (opt) {
  const pointer = canvas.getPointer(opt.e);
  startX = pointer.x;
  startY = pointer.y;
  if (currentTool === "rect") {
    drawingObject = new fabric.Rect({
      left: startX,
      top: startY,
      width: 0,
      height: 0,
      fill: "rgba(0,0,0,0)",
      stroke: "red",
      strokeWidth: 2,
    });
    canvas.add(drawingObject);
  } else if (currentTool === "arrow") {
    const points = [startX, startY, startX, startY];
    drawingObject = new fabric.Line(points, {
      strokeWidth: 2,
      stroke: "blue",
    });
    canvas.add(drawingObject);
  } else if (currentTool === "text") {
    const text = new fabric.IText("Text", {
      left: startX,
      top: startY,
      fill: "green",
    });
    canvas.add(text).setActiveObject(text);
    currentTool = null;
  }
});

canvas.on("mouse:move", function (opt) {
  if (!drawingObject) return;
  const pointer = canvas.getPointer(opt.e);
  if (currentTool === "rect") {
    const width = pointer.x - startX;
    const height = pointer.y - startY;
    drawingObject.set({
      width: width,
      height: height,
    });
    drawingObject.setCoords();
    canvas.renderAll();
  } else if (currentTool === "arrow") {
    drawingObject.set({ x2: pointer.x, y2: pointer.y });
    canvas.renderAll();
  }
});

canvas.on("mouse:up", function (opt) {
  if (currentTool === "arrow" && drawingObject) {
    const x1 = drawingObject.x1;
    const y1 = drawingObject.y1;
    const x2 = drawingObject.x2;
    const y2 = drawingObject.y2;
    const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    const triangle = new fabric.Triangle({
      left: x2,
      top: y2,
      originX: "center",
      originY: "center",
      width: 10,
      height: 15,
      angle: angle + 90,
      fill: "blue",
    });
    const group = new fabric.Group([drawingObject, triangle], {
      selectable: true,
    });
    canvas.remove(drawingObject);
    canvas.add(group);
  }
  drawingObject = null;
  currentTool = null;
});

// IndexedDB helper
function openDb(callback) {
  const request = indexedDB.open("annotation-db", 1);
  request.onupgradeneeded = function (e) {
    const db = e.target.result;
    db.createObjectStore("canvases");
  };
  request.onsuccess = function (e) {
    callback(e.target.result);
  };
}

document.getElementById("saveCanvas").onclick = function () {
  openDb(function (db) {
    const tx = db.transaction("canvases", "readwrite");
    tx.objectStore("canvases").put(canvas.toJSON(), "last");
  });
};

document.getElementById("loadCanvas").onclick = function () {
  openDb(function (db) {
    const tx = db.transaction("canvases");
    const req = tx.objectStore("canvases").get("last");
    req.onsuccess = function () {
      if (req.result) {
        canvas.loadFromJSON(req.result, canvas.renderAll.bind(canvas));
      }
    };
  });
};

document.getElementById("exportPng").onclick = function () {
  const dataURL = canvas.toDataURL({ format: "png" });
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "annotation.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
