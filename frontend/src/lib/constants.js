export const MOCK_STATS = {
  participants: 284,
  completion: 71.74,
  pending: 10.12,
  voiceSessions: 56.1,
};

export const MOCK_PARTICIPANTS = [
  { id: 1, name: 'Sgt. Arjun Mehta', unit: '3rd Infantry', score: 82, survey: 'PHQ-9', date: '2026-06-20', status: 'completed' },
  { id: 2, name: 'Cpl. Priya Sharma', unit: '7th Signal', score: 61, survey: 'GAD-7', date: '2026-06-21', status: 'pending' },
  { id: 3, name: 'Lt. Vikram Nair', unit: '5th Armoured', score: 74, survey: 'PCL-5', date: '2026-06-19', status: 'completed' },
  { id: 4, name: 'Pvt. Anita Singh', unit: '2nd Logistics', score: 55, survey: 'PHQ-9', date: '2026-06-22', status: 'at-risk' },
  { id: 5, name: 'Maj. Ravi Tiwari', unit: '1st Medical', score: 91, survey: 'GAD-7', date: '2026-06-18', status: 'completed' },
  { id: 6, name: 'Cpt. Deepa Pillai', unit: '4th Engineers', score: 68, survey: 'PCL-5', date: '2026-06-23', status: 'completed' },
  { id: 7, name: 'Sgt. Arun Kumar', unit: '6th Artillery', score: 43, survey: 'PHQ-9', date: '2026-06-24', status: 'at-risk' },
  { id: 8, name: 'Pvt. Meena Rao', unit: '3rd Infantry', score: 77, survey: 'GAD-7', date: '2026-06-21', status: 'completed' },
  { id: 9, name: 'Lt. Suresh Iyer', unit: '7th Signal', score: 59, survey: 'PCL-5', date: '2026-06-22', status: 'pending' },
  { id: 10, name: 'Cpl. Kavya Bhat', unit: '5th Armoured', score: 85, survey: 'PHQ-9', date: '2026-06-20', status: 'completed' },
];

export const MOCK_QUESTIONS = [
  { id: 1, text: 'How often have you felt little interest or pleasure in doing things?', type: 'scale', category: 'Depression' },
  { id: 2, text: 'Have you been feeling nervous, anxious, or on edge?', type: 'scale', category: 'Anxiety' },
  { id: 3, text: 'How has your sleep been over the past two weeks?', type: 'scale', category: 'Sleep' },
  { id: 4, text: 'Have you had any intrusive memories of a stressful event?', type: 'boolean', category: 'PTSD' },
  { id: 5, text: 'How would you rate your ability to concentrate at work?', type: 'scale', category: 'Cognitive' },
  { id: 6, text: 'Have you felt detached or estranged from other people?', type: 'scale', category: 'PTSD' },
  { id: 7, text: 'How often have you felt hopeless about the future?', type: 'scale', category: 'Depression' },
  { id: 8, text: 'Have you experienced any panic attacks recently?', type: 'boolean', category: 'Anxiety' },
  { id: 9, text: 'How well have you been able to manage stress at work?', type: 'scale', category: 'Resilience' },
  { id: 10, text: 'Do you feel supported by your unit and commanding officers?', type: 'scale', category: 'Social Support' },
];

export const MOCK_SURVEYS = [
  { id: 1, name: 'PHQ-9 Depression Screener', validFrom: '2026-01-01', validTo: '2026-12-31', unit: 'All Units', status: 'active' },
  { id: 2, name: 'GAD-7 Anxiety Assessment', validFrom: '2026-01-01', validTo: '2026-12-31', unit: 'All Units', status: 'active' },
  { id: 3, name: 'PCL-5 PTSD Checklist', validFrom: '2026-03-01', validTo: '2026-09-30', unit: '3rd Infantry', status: 'active' },
  { id: 4, name: 'Combat Stress Q1 2026', validFrom: '2026-01-01', validTo: '2026-03-31', unit: '5th Armoured', status: 'expired' },
  { id: 5, name: 'Resilience Baseline Survey', validFrom: '2026-06-01', validTo: '2026-08-31', unit: 'All Units', status: 'active' },
  { id: 6, name: 'Post-Deployment Wellbeing', validFrom: '2026-07-01', validTo: '2026-10-31', unit: '7th Signal', status: 'upcoming' },
];

export const MOCK_SCRIBE_SESSIONS = [
  {
    id: 1,
    patient: 'Sgt. Arjun Mehta',
    doctor: 'Dr. Priya Menon',
    date: '2026-06-20T10:30:00',
    summary: 'Patient reports mild depressive symptoms over the past 2 weeks. Sleep disruption noted. Recommended CBT referral and follow-up in 4 weeks.',
  },
  {
    id: 2,
    patient: 'Pvt. Anita Singh',
    doctor: 'Dr. Rajan Kapoor',
    date: '2026-06-22T14:00:00',
    summary: 'Elevated anxiety scores on GAD-7 (14/21). Patient discloses increased workload stress. Breathing exercises prescribed. Medication review scheduled.',
  },
  {
    id: 3,
    patient: 'Sgt. Arun Kumar',
    doctor: 'Dr. Priya Menon',
    date: '2026-06-24T09:00:00',
    summary: 'PHQ-9 score of 17 (moderate-severe). Patient reports persistent low mood and social withdrawal since return from deployment. Psychiatric referral initiated.',
  },
  {
    id: 4,
    patient: 'Cpl. Priya Sharma',
    doctor: 'Dr. Sunita Verma',
    date: '2026-06-21T11:15:00',
    summary: 'Routine check-in. Patient reports feeling better with peer support group. GAD-7 improved from 12 to 8. Continue current management plan.',
  },
  {
    id: 5,
    patient: 'Lt. Suresh Iyer',
    doctor: 'Dr. Rajan Kapoor',
    date: '2026-06-22T16:00:00',
    summary: 'PCL-5 assessment completed. Score of 38 indicates probable PTSD. Patient reports hypervigilance and avoidance behaviours. EMDR therapy discussed.',
  },
];
