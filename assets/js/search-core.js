(function(root, factory){
  if(typeof module === 'object' && module.exports){
    module.exports = factory(require('fuse.js'));
  }else{
    root.searchCore = factory(root.Fuse);
  }
})(this, function(Fuse){
  function soundex(str){
    if(!str) return '';
    const s = str.toUpperCase().replace(/[^A-Z]/g,'');
    if(!s) return '';
    const codes = {B:1,F:1,P:1,V:1,C:2,G:2,J:2,K:2,Q:2,S:2,X:2,Z:2,D:3,T:3,L:4,M:5,N:5,R:6};
    let result = s[0];
    let prev = codes[s[0]];
    for(let i=1;i<s.length && result.length<4;i++){
      const c = s[i];
      const code = codes[c] || 0;
      if(code !== prev && code !== 0){
        result += code;
      }
      prev = code;
    }
    return (result + '0000').slice(0,4);
  }

  function buildIndex(terms){
    const entries = terms.map(t => {
      const name = t.term || t.name || '';
      const synonyms = t.synonyms || [];
      const acronyms = t.acronyms || [];
      const phonetics = [name, ...synonyms, ...acronyms].map(soundex);
      return Object.assign({}, t, { name, synonyms, acronyms, phonetics });
    });
    const text = new Fuse(entries, {
      keys: ['name', 'definition', 'category', 'synonyms', 'acronyms'],
      threshold: 0.3
    });
    const phonetic = new Fuse(entries, {
      keys: ['phonetics'],
      threshold: 0.1
    });
    return { text, phonetic };
  }

  function search(query, textIndex, phoneticIndex){
    const results = new Map();
    textIndex.search(query).forEach(r => results.set(r.item.term, r.item));
    const ph = soundex(query);
    phoneticIndex.search(ph).forEach(r => results.set(r.item.term, r.item));
    return Array.from(results.values());
  }

  return { soundex, buildIndex, search };
});
