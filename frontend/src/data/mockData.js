// src/data/mockData.js

export const MOCK_POSTS_INITIAL = [
    {
        id: 1,
        userId: 'patient123',
        tag: 'Anxiety',
        createdAt: new Date().getTime() - 2 * 60 * 60 * 1000,
        title: 'Struggling with social anxiety at work meetings',
        content: 'I find it really hard to speak up in meetings, even when I have a good idea. My heart starts racing and I just freeze up. It feels like everyone is judging me, and I\'m worried I\'ll say something wrong. Any advice on how to handle this?',
        responses: 12,
        likes: 45,
    },
    {
        id: 2,
        userId: 'user456',
        tag: 'Depression',
        createdAt: new Date().getTime() - 5 * 60 * 60 * 1000,
        title: 'Feeling unmotivated and constantly tired',
        content: 'Lately, I have no energy to do anything, even things I used to enjoy. It feels like a heavy cloud is following me around. Waking up is a struggle, and I just want to stay in bed. Has anyone else felt this way?',
        responses: 8,
        likes: 32,
    },
];

export const MOCK_ANALYTICS_DATA = [
    { name: 'Mon', helpful_votes: 22 },
    { name: 'Tue', helpful_votes: 35 },
    { name: 'Wed', helpful_votes: 15 },
    { name: 'Thu', helpful_votes: 48 },
    { name: 'Fri', helpful_votes: 52 },
    { name: 'Sat', helpful_votes: 78 },
    { name: 'Sun', helpful_votes: 65 },
];

export const MOCK_DOCTORS_LIST = [
    {
        id: 1,
        fullName: 'Dr. Evelyn Reed',
        avatar: 'https://placehold.co/128x128/d1fae5/166534?text=ER',
        specializations: ['CBT', 'Anxiety', 'PTSD'],
        bio: 'Dr. Reed is a compassionate therapist with over 10 years of experience in helping clients navigate anxiety and trauma. Her approach is rooted in evidence-based practices.',
        rating: 4.9,
        reviews: 124,
    },
    {
        id: 2,
        fullName: 'Dr. Samuel Chen',
        avatar: 'https://placehold.co/128x128/e0e7ff/4338ca?text=SC',
        specializations: ['Depression', 'Relationships', 'Mindfulness'],
        bio: 'With a focus on mindfulness and relational therapy, Dr. Chen specializes in treating depression and helping couples improve their communication.',
        rating: 4.8,
        reviews: 98,
    },
];

export const MOCK_CONSULTANTS_HOME = [
    { id: 1, name: 'Dr. Sarah Johnson', initials: 'SJ', specialty: 'Anxiety, Depression, Relationship Counselling', rating: 4.8, reviews: 128 },
    { id: 2, name: 'Dr. Michael Chen', initials: 'MC', specialty: 'Family Therapy, Stress Management', rating: 4.9, reviews: 98 },
    { id: 3, name: 'Dr. Emily Martinez', initials: 'EM', specialty: 'Child Psychology, ADHD', rating: 4.7, reviews: 156 },
];

export const MOCK_CLIPS_INITIAL = [
    {
        id: 1,
        doctorId: 1,
        doctorName: 'Dr. Evelyn Reed',
        doctorAvatar: 'https://placehold.co/128x128/d1fae5/166534?text=ER',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        description: 'Quick tip: Try the 5-4-3-2-1 grounding technique to manage anxiety spikes.',
        views: 554,
    },
    {
        id: 2,
        doctorId: 2,
        doctorName: 'Dr. Samuel Chen',
        doctorAvatar: 'https://placehold.co/128x128/e0e7ff/4338ca?text=SC',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        description: 'Understanding the dangers of steroid misuse is crucial for your long-term health.',
        views: 281,
    },
];