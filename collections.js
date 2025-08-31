(function(global){
  function encodeCollection(name, terms){
    return encodeURIComponent(btoa(JSON.stringify({ name, terms })));
  }
  function decodeCollection(encoded){
    return JSON.parse(atob(decodeURIComponent(encoded)));
  }
  if (typeof module !== 'undefined' && module.exports){
    module.exports = { encodeCollection, decodeCollection };
  } else {
    global.encodeCollection = encodeCollection;
    global.decodeCollection = decodeCollection;
  }
})(this);
