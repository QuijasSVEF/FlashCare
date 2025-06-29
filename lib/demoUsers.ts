import { Database } from '../types/database';

type User = Database['public']['Tables']['users']['Row'];

// Demo caregivers
export const demoCaregivers: User[] = [
  {
    id: 'caregiver-1',
    name: 'Sarah Johnson',
    role: 'caregiver',
    avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Experienced caregiver with 5+ years helping families. Specializing in senior care and disability support. Certified in CPR and first aid with a background in nursing assistance.',
    phone: '+1 (555) 123-4567',
    emergency_phone: '+1 (555) 911-0000',
    location: 'San Francisco, CA',
    created_at: '2023-06-15T00:00:00Z',
    updated_at: '2023-06-15T00:00:00Z',
  },
  {
    id: 'caregiver-2',
    name: 'Michael Chen',
    role: 'caregiver',
    avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Certified nursing assistant with expertise in elderly care. Patient, compassionate, and reliable. I have worked with patients with dementia, Alzheimer\'s, and mobility issues.',
    phone: '+1 (555) 234-5678',
    emergency_phone: '+1 (555) 911-0000',
    location: 'San Francisco, CA',
    created_at: '2023-07-20T00:00:00Z',
    updated_at: '2023-07-20T00:00:00Z',
  },
  {
    id: 'caregiver-3',
    name: 'Jasmine Rodriguez',
    role: 'caregiver',
    avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Pediatric care specialist with 8 years of experience. I love working with children of all ages and have extensive experience with special needs care. Trained in early childhood development.',
    phone: '+1 (555) 345-6789',
    emergency_phone: '+1 (555) 911-0000',
    location: 'Oakland, CA',
    created_at: '2023-05-10T00:00:00Z',
    updated_at: '2023-05-10T00:00:00Z',
  }
];

// Demo families
export const demoFamilies: User[] = [
  {
    id: 'family-1',
    name: 'The Smiths',
    role: 'family',
    avatar_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Family of four looking for regular care for our elderly mother who lives with us. She needs assistance with daily activities and medication management.',
    phone: '+1 (555) 987-6543',
    emergency_phone: '+1 (555) 911-0000',
    location: 'San Francisco, CA',
    created_at: '2023-08-05T00:00:00Z',
    updated_at: '2023-08-05T00:00:00Z',
  },
  {
    id: 'family-2',
    name: 'The Johnsons',
    role: 'family',
    avatar_url: 'https://images.pexels.com/photos/3933881/pexels-photo-3933881.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Busy professional couple with twin toddlers. Looking for part-time childcare and occasional weekend help. We value reliability and experience with young children.',
    phone: '+1 (555) 876-5432',
    emergency_phone: '+1 (555) 911-0000',
    location: 'Oakland, CA',
    created_at: '2023-09-12T00:00:00Z',
    updated_at: '2023-09-12T00:00:00Z',
  }
];

// All demo users
export const demoUsers: User[] = [...demoCaregivers, ...demoFamilies];

// Demo job posts
export const demoJobPosts = [
  {
    id: 'job-1',
    family_id: 'family-1',
    title: 'Senior Care Assistant',
    description: 'Looking for a compassionate caregiver for my elderly mother. She needs help with daily activities, medication management, and occasional transportation to doctor appointments. Ideally available 4-5 hours per day, 3 days a week.',
    hours_per_week: 15,
    rate_hour: 25,
    location: 'San Francisco, CA',
    created_at: '2023-10-15T00:00:00Z',
    updated_at: '2023-10-15T00:00:00Z',
    family: demoFamilies[0]
  },
  {
    id: 'job-2',
    family_id: 'family-2',
    title: 'Part-time Childcare Provider',
    description: 'Seeking an experienced childcare provider for our 3-year-old twins. Responsibilities include meal preparation, educational activities, and light housekeeping. Must be energetic, patient, and have experience with toddlers.',
    hours_per_week: 20,
    rate_hour: 22,
    location: 'Oakland, CA',
    created_at: '2023-10-20T00:00:00Z',
    updated_at: '2023-10-20T00:00:00Z',
    family: demoFamilies[1]
  }
];

// Demo matches
export const demoMatches = [
  {
    id: 'match-1',
    caregiver_id: 'caregiver-1',
    family_id: 'family-1',
    job_id: 'job-1',
    created_at: '2023-10-25T00:00:00Z',
    caregiver: demoCaregivers[0],
    family: demoFamilies[0]
  },
  {
    id: 'match-2',
    caregiver_id: 'caregiver-3',
    family_id: 'family-2',
    job_id: 'job-2',
    created_at: '2023-10-26T00:00:00Z',
    caregiver: demoCaregivers[2],
    family: demoFamilies[1]
  },
  {
    id: 'match-3',
    caregiver_id: 'caregiver-2',
    family_id: 'family-1',
    job_id: 'job-1',
    created_at: '2023-10-27T00:00:00Z',
    caregiver: demoCaregivers[1],
    family: demoFamilies[0]
  }
];

// Demo messages
export const demoMessages = {
  'match-1': [
    {
      id: 'msg-1-1',
      match_id: 'match-1',
      sender_id: 'family-1',
      body: 'Hello Sarah! I saw your profile and think you might be a great fit for helping with my mother\'s care. Are you available to discuss further?',
      sent_at: '2023-10-25T14:30:00Z',
    },
    {
      id: 'msg-1-2',
      match_id: 'match-1',
      sender_id: 'caregiver-1',
      body: 'Hi there! Thank you for reaching out. I\'d be happy to discuss how I can help with your mother\'s care. What specific needs does she have?',
      sent_at: '2023-10-25T15:45:00Z',
    },
    {
      id: 'msg-1-3',
      match_id: 'match-1',
      sender_id: 'family-1',
      body: 'She needs help with daily activities, medication management, and some companionship. Would you be available for an interview this week?',
      sent_at: '2023-10-25T16:20:00Z',
    },
    {
      id: 'msg-1-4',
      match_id: 'match-1',
      sender_id: 'caregiver-1',
      body: 'That sounds like something I can definitely help with. I\'m available for an interview on Thursday afternoon or Friday morning. Would either of those work for you?',
      sent_at: '2023-10-25T17:05:00Z',
    }
  ],
  'match-2': [
    {
      id: 'msg-2-1',
      match_id: 'match-2',
      sender_id: 'family-2',
      body: 'Hi Jasmine! We\'re looking for someone to help with our twins a few days a week. Your experience with children caught our attention.',
      sent_at: '2023-10-26T10:15:00Z',
    },
    {
      id: 'msg-2-2',
      match_id: 'match-2',
      sender_id: 'caregiver-3',
      body: 'Hello! Thank you for reaching out. I love working with children, especially toddlers. I\'d be happy to learn more about your twins and how I can help.',
      sent_at: '2023-10-26T11:30:00Z',
    },
    {
      id: 'msg-2-3',
      match_id: 'match-2',
      sender_id: 'family-2',
      body: 'They\'re very active and love arts and crafts. We need someone Tuesday, Wednesday, and Thursday from 1-5pm. Would that schedule work for you?',
      sent_at: '2023-10-26T12:45:00Z',
    }
  ]
};

// Demo schedules
export const demoSchedules = [
  {
    id: 'schedule-1',
    match_id: 'match-1',
    start_ts: '2023-11-02T14:00:00Z',
    end_ts: '2023-11-02T18:00:00Z',
    status: 'confirmed',
    created_at: '2023-10-28T09:00:00Z',
    match: {
      id: 'match-1',
      caregiver_id: 'caregiver-1',
      family_id: 'family-1',
      job_id: 'job-1',
      created_at: '2023-10-25T00:00:00Z',
      caregiver: demoCaregivers[0],
      family: demoFamilies[0]
    }
  },
  {
    id: 'schedule-2',
    match_id: 'match-2',
    start_ts: '2023-11-07T13:00:00Z',
    end_ts: '2023-11-07T17:00:00Z',
    status: 'pending',
    created_at: '2023-10-30T15:30:00Z',
    match: {
      id: 'match-2',
      caregiver_id: 'caregiver-3',
      family_id: 'family-2',
      job_id: 'job-2',
      created_at: '2023-10-26T00:00:00Z',
      caregiver: demoCaregivers[2],
      family: demoFamilies[1]
    }
  }
];

// Demo reviews
export const demoReviews = [
  {
    id: 'review-1',
    reviewer_id: 'family-1',
    reviewee_id: 'caregiver-1',
    rating_int: 5,
    comment_text: 'Sarah is an exceptional caregiver. She is punctual, professional, and my mother adores her. Highly recommended!',
    created_at: '2023-11-10T18:30:00Z',
    reviewer: demoFamilies[0]
  },
  {
    id: 'review-2',
    reviewer_id: 'caregiver-1',
    reviewee_id: 'family-1',
    rating_int: 5,
    comment_text: 'The Smiths are wonderful to work with. They communicate clearly and are very respectful.',
    created_at: '2023-11-11T09:15:00Z',
    reviewer: demoCaregivers[0]
  }
];

// Function to get a demo user by email (for login simulation)
export function getDemoUserByEmail(email: string): User | null {
  if (email.includes('caregiver1')) {
    return demoCaregivers[0];
  } else if (email.includes('caregiver2')) {
    return demoCaregivers[1];
  } else if (email.includes('caregiver3')) {
    return demoCaregivers[2];
  } else if (email.includes('family1')) {
    return demoFamilies[0];
  } else if (email.includes('family2')) {
    return demoFamilies[1];
  }
  return null;
}

// Function to get a demo user by role
export function getDemoUserByRole(role: 'family' | 'caregiver'): User {
  return role === 'family' ? demoFamilies[0] : demoCaregivers[0];
}