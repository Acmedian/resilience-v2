export const MOCK_STATS = [
  {
    id: 'resilience-score',
    icon: 'Brain',
    label: 'Avg Resilience Score',
    value: 73.4,
    decimals: 1,
    suffix: '',
    subStats: [
      { label: 'This week', value: '+2.3' },
      { label: 'Last month', value: '71.1' },
    ],
    sparkData: [60, 65, 63, 70, 68, 72, 71, 74, 73, 73],
    progressValue: 73,
    progressColor: '#2DD4A0',
  },
  {
    id: 'participants',
    icon: 'Users',
    label: 'Active Participants',
    value: 248,
    decimals: 0,
    suffix: '',
    subStats: [
      { label: 'New this week', value: '12' },
      { label: 'Inactive', value: '34' },
    ],
    sparkData: [200, 210, 215, 220, 225, 230, 235, 240, 245, 248],
    progressValue: 82,
    progressColor: '#0D9488',
  },
  {
    id: 'surveys',
    icon: 'ClipboardList',
    label: 'Surveys Completed',
    value: 1847,
    decimals: 0,
    suffix: '',
    subStats: [
      { label: 'This month', value: '312' },
      { label: 'Avg/user', value: '7.5' },
    ],
    sparkData: [1400, 1500, 1550, 1600, 1650, 1700, 1720, 1780, 1820, 1847],
    progressValue: 91,
    progressColor: '#2DD4A0',
  },
  {
    id: 'high-risk',
    icon: 'AlertTriangle',
    label: 'High Risk Flags',
    value: 14,
    decimals: 0,
    suffix: '',
    subStats: [
      { label: 'Critical', value: '3' },
      { label: 'Resolved', value: '8' },
    ],
    sparkData: [20, 22, 19, 18, 17, 16, 15, 14, 15, 14],
    progressValue: 28,
    progressColor: '#F59E0B',
  },
];

export const MOCK_PARTICIPANTS = [
  {
    id: 1,
    initials: 'JR',
    color: '#E6F9F4',
    textColor: '#0D9488',
    name: 'James Roberts',
    unit: 'Alpha Company',
  },
  {
    id: 2,
    initials: 'SA',
    color: '#FEF3C7',
    textColor: '#D97706',
    name: 'Sarah Anderson',
    unit: 'Bravo Company',
  },
  {
    id: 3,
    initials: 'MC',
    color: '#EDE9FE',
    textColor: '#7C3AED',
    name: 'Mike Chen',
    unit: 'HQ Staff',
  },
];

export const MOCK_RESULTS = [
  {
    id: 1,
    participant: 'James Roberts',
    survey: 'Weekly Check-in',
    score: 82,
    category: 'Resilience',
    date: '2026-06-28',
    hasOpenEnded: false,
  },
  {
    id: 2,
    participant: 'Sarah Anderson',
    survey: 'Stress Assessment',
    score: 45,
    category: 'Stress',
    date: '2026-06-28',
    hasOpenEnded: true,
  },
  {
    id: 3,
    participant: 'Mike Chen',
    survey: 'GAD-7',
    score: 33,
    category: 'Anxiety',
    date: '2026-06-27',
    hasOpenEnded: false,
  },
  {
    id: 4,
    participant: 'Emily Torres',
    survey: 'PHQ-9',
    score: 71,
    category: 'Depression',
    date: '2026-06-27',
    hasOpenEnded: true,
  },
  {
    id: 5,
    participant: 'David Park',
    survey: 'Weekly Check-in',
    score: 88,
    category: 'Resilience',
    date: '2026-06-26',
    hasOpenEnded: false,
  },
];

export const MOCK_SPARKLINES = {
  resilience: {
    title: 'Resilience Trend',
    value: 73.4,
    suffix: '/100',
    subStats: [
      { label: 'Peak', value: '81.2' },
      { label: 'Low', value: '62.4' },
    ],
    sparkData: [62, 65, 68, 64, 70, 72, 69, 74, 76, 73, 75, 73],
    xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  },
  participation: {
    title: 'Survey Participation',
    value: 91.2,
    suffix: '%',
    subStats: [
      { label: 'Completion', value: '94.1%' },
      { label: 'Response rate', value: '88.4%' },
    ],
    sparkData: [80, 82, 85, 83, 87, 88, 86, 90, 89, 91, 92, 91],
    xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  },
};

export const MOCK_AI_MESSAGES = [
  {
    id: 1,
    type: 'user',
    name: 'Admin',
    text: 'Which unit shows the highest resilience improvement this week?',
    timestamp: '09:41 AM',
  },
  {
    id: 2,
    type: 'ai',
    title: 'Resilience by Unit — This Week',
    rows: [
      { label: 'Alpha Company', value: '+8.2', color: '#2DD4A0', progress: 82 },
      { label: 'Bravo Company', value: '+3.1', color: '#0D9488', progress: 55 },
      { label: 'HQ Staff', value: '+1.8', color: '#94A3B8', progress: 32 },
    ],
    timestamp: '09:41 AM',
  },
];
