export const MOCK_STATS = {
  avgResilienceScore: 73.4,
  activePatients: 248,
  screeningsCompleted: 1847,
  highRiskFlags: 14,
  screeningParticipation: 91.2,
};

export const MOCK_PATIENTS = [
  { id: 1, name: 'Priya Sharma', cohort: 'CBT Program', score: 82, screening: 'PHQ-9', date: '2026-06-20', status: 'completed' },
  { id: 2, name: 'James Roberts', cohort: 'Mindfulness Group', score: 61, screening: 'GAD-7', date: '2026-06-21', status: 'pending' },
  { id: 3, name: 'Sarah Anderson', cohort: 'Self-Guided', score: 74, screening: 'Resilience & Coping Skills', date: '2026-06-19', status: 'completed' },
  { id: 4, name: 'Mike Chen', cohort: 'CBT Program', score: 55, screening: 'PHQ-9', date: '2026-06-22', status: 'at-risk' },
  { id: 5, name: 'Elena Martinez', cohort: 'Mindfulness Group', score: 91, screening: 'GAD-7', date: '2026-06-18', status: 'completed' },
  { id: 6, name: 'David Park', cohort: 'Trauma Recovery Cohort', score: 68, screening: 'Emotional Wellbeing Index', date: '2026-06-23', status: 'completed' },
  { id: 7, name: 'Aisha Johnson', cohort: 'CBT Program', score: 43, screening: 'PHQ-9', date: '2026-06-24', status: 'at-risk' },
  { id: 8, name: 'Liam O\'Brien', cohort: 'Self-Guided', score: 77, screening: 'GAD-7', date: '2026-06-21', status: 'completed' },
  { id: 9, name: 'Nadia Patel', cohort: 'Mindfulness Group', score: 59, screening: 'Emotional Wellbeing Index', date: '2026-06-22', status: 'pending' },
  { id: 10, name: 'Tom Nguyen', cohort: 'Trauma Recovery Cohort', score: 85, screening: 'PHQ-9', date: '2026-06-20', status: 'completed' },
];

export const MOCK_SCREENINGS = [
  { id: 1, name: 'Resilience & Coping Skills', frequency: 'weekly', cohort: 'All Cohorts', status: 'active' },
  { id: 2, name: 'Emotional Wellbeing Index', frequency: 'monthly', cohort: 'All Cohorts', status: 'active' },
  { id: 3, name: 'PHQ-9 Depression Screen', frequency: 'baseline', cohort: 'CBT Program', status: 'active' },
  { id: 4, name: 'GAD-7 Anxiety Assessment', frequency: 'monthly', cohort: 'All Cohorts', status: 'active' },
  { id: 5, name: 'Trauma Impact Screen', frequency: 'baseline', cohort: 'Trauma Recovery Cohort', status: 'active' },
  { id: 6, name: 'Mindfulness Progress Check', frequency: 'weekly', cohort: 'Mindfulness Group', status: 'upcoming' },
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
  { id: 9, text: 'How well have you been able to manage stress this week?', type: 'scale', category: 'Resilience' },
  { id: 10, text: 'Do you feel supported by your care team and cohort?', type: 'scale', category: 'Social Support' },
];

export const MOCK_SCRIBE_SESSIONS = [
  {
    id: 1,
    patient: 'Priya Sharma',
    clinician: 'Dr. Priya Menon',
    date: '2026-06-20T10:30:00',
    summary: 'Patient reports mild depressive symptoms over the past 2 weeks. Sleep disruption noted. Recommended CBT referral and follow-up in 4 weeks.',
  },
  {
    id: 2,
    patient: 'Mike Chen',
    clinician: 'Dr. Rajan Kapoor',
    date: '2026-06-22T14:00:00',
    summary: 'Elevated anxiety scores on GAD-7 (14/21). Patient discloses increased work-related stress. Breathing exercises prescribed. Medication review scheduled.',
  },
  {
    id: 3,
    patient: 'Aisha Johnson',
    clinician: 'Dr. Priya Menon',
    date: '2026-06-24T09:00:00',
    summary: 'PHQ-9 score of 17 (moderate-severe). Patient reports persistent low mood and social withdrawal. Psychiatric referral initiated.',
  },
  {
    id: 4,
    patient: 'James Roberts',
    clinician: 'Dr. Sunita Verma',
    date: '2026-06-21T11:15:00',
    summary: 'Routine check-in. Patient reports improvement with peer support group. GAD-7 improved from 12 to 8. Continue current management plan.',
  },
  {
    id: 5,
    patient: 'Nadia Patel',
    clinician: 'Dr. Rajan Kapoor',
    date: '2026-06-22T16:00:00',
    summary: 'Trauma Impact Screen completed. Score indicates moderate symptoms. Patient reports hypervigilance and avoidance behaviours. EMDR therapy discussed.',
  },
];
