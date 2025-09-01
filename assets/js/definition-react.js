const { motion, AnimatePresence } = Motion;
const container = document.getElementById('definition-container');

function DefinitionViewer() {
  const [term, setTerm] = React.useState(null);

  React.useEffect(() => {
    function show(e) { setTerm(e.detail); }
    function hide() { setTerm(null); }
    document.addEventListener('definition-show', show);
    document.addEventListener('definition-hide', hide);
    return () => {
      document.removeEventListener('definition-show', show);
      document.removeEventListener('definition-hide', hide);
    };
  }, []);

  React.useEffect(() => {
    if (container) {
      container.style.display = term ? 'block' : 'none';
    }
  }, [term]);

  return React.createElement(
    AnimatePresence,
    { mode: 'wait' },
    term && React.createElement(
      motion.div,
      {
        key: term.term,
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 }
      },
      React.createElement('h3', null, term.term),
      React.createElement('p', null, term.definition)
    )
  );
}

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(DefinitionViewer));
}
