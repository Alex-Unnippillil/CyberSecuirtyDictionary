import React, { useEffect, useState } from 'react';
import Joyride, { CallBackProps, Step } from 'react-joyride';

const steps: Step[] = [
  {
    target: '#search',
    content: 'Search for cybersecurity terms here.',
  },
  {
    target: '#random-term',
    content: 'Show a random term from the dictionary.',
  },
  {
    target: '#dark-mode-toggle',
    content: 'Toggle dark mode for better readability.',
  },
];

const GuidedTour: React.FC = () => {
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('hasSeenTour')) {
      setRun(true);
    }

    const handleReplay = () => {
      setRun(true);
    };

    window.addEventListener('replay-tour', handleReplay);
    return () => {
      window.removeEventListener('replay-tour', handleReplay);
    };
  }, []);

  const handleCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses = ['finished', 'skipped'];
    if (finishedStatuses.includes(status)) {
      localStorage.setItem('hasSeenTour', 'true');
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      callback={handleCallback}
    />
  );
};

export default GuidedTour;
