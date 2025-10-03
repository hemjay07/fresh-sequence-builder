export function validateSchedule(schedules, currentTime) {
    return schedules.map((schedule, index) => {
      const errors = [];
      const warnings = [];
  
      // Rule 1: No past times
      if (schedule.scheduledTime <= currentTime) {
        errors.push({ message: 'This time is in the past', code: 'PAST_TIME' });
      }
  
      // Rule 2: First email buffer (5 minutes)
      if (index === 0 && schedule.scheduledTime < addMinutes(currentTime, 5)) {
        errors.push({ 
          message: 'First email must be at least 5 minutes from now', 
          code: 'BUFFER' 
        });
      }
  
      // Rule 3: Sequential order (Block approach)
      if (index > 0 && schedule.scheduledTime <= schedules[index - 1].scheduledTime) {
        errors.push({ 
          message: `Must be after Email ${schedule.stepNumber - 1}`, 
          code: 'ORDER' 
        });
      }
  
      // Warning: Weekend
      const day = schedule.scheduledTime.getDay();
      if (day === 0 || day === 6) {
        warnings.push({ message: 'Sending on weekend', code: 'WEEKEND' });
      }
  
      // Warning: Off-hours
      const hour = schedule.scheduledTime.getHours();
      if (hour < 6 || hour > 22) {
        warnings.push({ message: 'Sending outside business hours', code: 'HOURS' });
      }
  
      return {
        ...schedule,
        status: errors.length > 0 ? 'invalid' : warnings.length > 0 ? 'warning' : 'valid',
        errors,
        warnings
      };
    });
  }
  
  function addMinutes(date, mins) {
    return new Date(date.getTime() + mins * 60000);
  }
  
  export function validateInputs(sender, recipient, partnership) {
    const errors = {};
    
    // Sender validation
    if (!sender.company.trim()) errors.company = 'Required';
    if (!sender.website.trim() || !sender.website.startsWith('http')) {
      errors.website = 'Valid URL required';
    }
    if (!sender.oneLiner.trim()) errors.oneLiner = 'Required';
    if (sender.benefits.some(b => !b.trim())) errors.benefits = 'All 3 benefits required';
    if (!sender.socialProof.trim()) errors.socialProof = 'Required';
    
    // Recipient validation
    if (!recipient.role.trim()) errors.role = 'Required';
    if (!recipient.company.trim()) errors.recipientCompany = 'Required';
    if (!recipient.industry.trim()) errors.industry = 'Required';
    if (!recipient.signalUrl.trim() || !recipient.signalUrl.startsWith('http')) {
      errors.signalUrl = 'Valid URL required';
    }
    if (!recipient.signalDescription.trim()) errors.signalDescription = 'Required';
    
    // Partnership validation
    if (!partnership.type.trim()) errors.partnershipType = 'Required';
    if (!partnership.valueHypothesis.trim()) errors.valueHypothesis = 'Required';
    if (!partnership.cta.trim()) errors.cta = 'Required';
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }