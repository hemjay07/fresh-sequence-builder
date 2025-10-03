export const STEPS = {
    TEMPLATE: 'template',
    INPUTS: 'inputs',
    EMAILS: 'emails',
    SCHEDULE: 'schedule',
    REVIEW: 'review',
    SUCCESS: 'success'
  };
  
  export const TEMPLATES = [
    {
      id: 'cold-intro',
      name: 'Cold Introduction',
      description: 'First contact with new potential partners',
      useCase: 'Best for initial outreach to companies you haven\'t contacted before',
      emailCount: 3,
      defaultSpacing: [0, 3, 7],
      steps: [
        { stepNumber: 1, label: 'Initial Introduction', description: 'Introduce yourself and value proposition' },
        { stepNumber: 2, label: 'Follow-up', description: 'Share social proof and specific benefits' },
        { stepNumber: 3, label: 'Final Nudge', description: 'Easy next step and timeline' }
      ]
    },
    {
      id: 'integration-pitch',
      name: 'Integration Partnership',
      description: 'Technical partnership with product integration',
      useCase: 'Best for proposing product integrations to complement services',
      emailCount: 2,
      defaultSpacing: [0, 5],
      steps: [
        { stepNumber: 1, label: 'Product Fit', description: 'Explain mutual customer benefit' },
        { stepNumber: 2, label: 'Technical Details', description: 'Share specs and calendar link' }
      ]
    },
    {
      id: 'comarketing',
      name: 'Co-Marketing Proposal',
      description: 'Joint campaigns, events, or content partnership',
      useCase: 'Best for collaborative marketing opportunities',
      emailCount: 3,
      defaultSpacing: [0, 5, 10],
      steps: [
        { stepNumber: 1, label: 'Campaign Idea', description: 'Present opportunity with audience data' },
        { stepNumber: 2, label: 'Success Story', description: 'Share similar partnership results' },
        { stepNumber: 3, label: 'Next Steps', description: 'Concrete timeline and action items' }
      ]
    }
  ];