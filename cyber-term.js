(()=>{
  function slugify(str){
    return String(str).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  }

  class CyberTerm extends HTMLElement{
    async connectedCallback(){
      if(this.shadowRoot) return; // prevent re-render
      const slug=this.getAttribute('slug');
      const src=this.getAttribute('src')||'terms.json';
      if(!slug){
        console.warn('cyber-term: missing slug attribute');
        return;
      }
      try{
        const res=await fetch(src);
        const json=await res.json();
        const terms=Array.isArray(json)?json:(json.terms||[]);
        const term=terms.find(t=>{
          const name=t.slug||t.term||t.name||'';
          return slugify(name)===slug;
        });
        this.render(term,slug);
      }catch(err){
        console.error('cyber-term: failed to load',err);
        this.render(null,slug,true);
      }
    }

    render(term,slug,isError){
      const root=this.attachShadow({mode:'open'});
      const style=`
        .card{border:1px solid #ccc;padding:1em;border-radius:4px;font-family:Arial,sans-serif;}
        .card h3{margin:0 0 .5em 0;font-size:1.1em;}
        .card.error{border-color:#f00;color:#f00;}
      `;
      if(isError){
        root.innerHTML=`<style>${style}</style><div class="card error">Failed to load term</div>`;
        return;
      }
      if(!term){
        root.innerHTML=`<style>${style}</style><div class="card error">Term not found: ${slug}</div>`;
        return;
      }
      const title=term.name||term.term||'';
      const def=term.definition||'';
      root.innerHTML=`<style>${style}</style><div class="card"><h3>${title}</h3><p>${def}</p></div>`;
    }
  }

  if(!customElements.get('cyber-term')){
    customElements.define('cyber-term',CyberTerm);
  }
})();
