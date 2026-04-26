// Seed mock data for MeetX Ultra Pro. Everything in the app is mock/local –
// these constants drive the screens. The arrays are intentionally large so
// list screens, alphabet scroll, and infinite scroll feel populated.

import type { Meeting, Contact, Recording, AgendaItem, Reminder, ChatMessage, Notification, UserProfile, UserPreferences } from '@/types';
import { mulberry32, pick, pickN, randomInt, range } from '@/utils/random';
import { safeInitials } from '@/utils/format';

const FIRST_NAMES = [
  'Aarav','Ananya','Arjun','Aditya','Akshay','Alok','Alia','Asha','Ashwini','Avani',
  'Bhavna','Bharat','Brij','Bhuvan','Bipin',
  'Chaitanya','Charu','Chitra',
  'Daksh','Devika','Diya','Divya','Dheeraj','Dipti',
  'Esha','Eshan',
  'Falak','Farhan','Fariha','Firoz',
  'Gargi','Gaurav','Gita','Gopal','Gunjan',
  'Harsh','Hema','Himanshu','Hiral',
  'Indra','Ira','Ishan','Isha',
  'Jagdish','Janvi','Jaya','Jayant','Jiya',
  'Kabir','Kalpana','Karan','Kartik','Keya','Khushi','Kiran','Krishna','Kunal',
  'Lakshmi','Lalita','Lavanya','Lokesh',
  'Madhav','Mahesh','Manav','Manju','Manoj','Maya','Meena','Mehul','Mihir','Milan',
  'Nakul','Namita','Nandini','Naveen','Neha','Nikhil','Nirav','Nisha','Nitin','Niyati',
  'Om','Omkar','Onkar',
  'Pankaj','Parth','Pavitra','Pinki','Pranav','Pratik','Pratima','Priya','Punit',
  'Rahul','Raj','Rajat','Ramesh','Rashi','Ravi','Rekha','Rishi','Riya','Rohan','Rohit',
  'Sachin','Sagar','Sahil','Samar','Sanjay','Sanya','Sarita','Saurabh','Seema','Shalini','Shashank','Shruti','Siddharth','Simran','Sonal','Sonia','Sumit','Suman','Sumeet','Suresh','Surbhi','Sushma','Sweta',
  'Tanvi','Tanya','Tapan','Tarun','Tina','Tushar',
  'Udit','Ujjwal','Uma','Urvashi',
  'Varun','Vasundhara','Vedika','Veer','Veena','Vidya','Vihaan','Vikas','Vikram','Vinay','Vipul','Viraj','Vishal','Vivek',
  'Yash','Yashika','Yogesh','Yamini',
  'Zoya','Zara'
];

const LAST_NAMES = [
  'Agarwal','Aggarwal','Ahuja','Anand','Arora',
  'Bajaj','Bansal','Basu','Batra','Bhatia','Bhatt','Bose',
  'Chand','Chandra','Chatterjee','Chaudhary','Chauhan','Chawla','Chopra',
  'Dalal','Das','Datta','Desai','Devi','Dhawan','Dixit','Doshi','Dutta',
  'Gandhi','Garg','Gera','Ghosh','Goel','Goenka','Gokhale','Gopalan','Gupta',
  'Handa','Hasan','Hiremath',
  'Iyer','Iyengar',
  'Jain','Jaiswal','Jha','Joshi',
  'Kakkar','Kapoor','Kapur','Karnik','Kaul','Kaur','Kelkar','Khan','Khanna','Khera','Khurana','Kohli','Krishnan','Kulkarni','Kumar','Kumari',
  'Lakhani','Lal','Lamba',
  'Madan','Mahajan','Mahesh','Maheshwari','Malhotra','Malik','Mani','Mathur','Mehra','Mehta','Menon','Mishra','Mittal','Mukherjee','Murthy',
  'Nadar','Nag','Nagar','Naik','Nair','Nanda','Narayan','Nath','Nayak','Nigam',
  'Oberoi','Ojha',
  'Pal','Pandey','Pandit','Parikh','Parekh','Patel','Patil','Patwari','Pillai','Prasad','Puri',
  'Raghavan','Rajan','Ram','Rana','Rao','Rathi','Reddy','Roy','Rustom',
  'Sahni','Saini','Saluja','Sanghvi','Sarin','Sathe','Sawant','Saxena','Sehgal','Sen','Seth','Sethi','Shah','Sharma','Shenoy','Shetty','Shukla','Singh','Singhal','Sinha','Soman','Soni','Subramanian','Suri',
  'Tagore','Talwar','Tandon','Thakkar','Thakur','Thapar','Tiwari','Trivedi',
  'Uberoi','Upadhyay',
  'Vaidya','Varghese','Varma','Vasudev','Venkatesan','Verma','Vohra',
  'Wadhwa','Walia',
  'Yadav','Yelamanchili',
  'Zaveri'
];

const COMPANIES = [
  'Reliance Digital','Tata Consultancy','Infosys','Wipro','HDFC Bank','ICICI Bank','Axis Bank','Mahindra Group','Bajaj Finserv','Adani Enterprises','HCL Technologies','LTI Mindtree','Hero MotoCorp','Zomato','Swiggy','Ola Cabs','PhonePe','Paytm','Razorpay','Cred','Flipkart','Myntra','Nykaa','BigBasket','OYO','MakeMyTrip','BookMyShow','Dream11','Byju\'s','Unacademy','PolicyBazaar','Lenskart','Pharmeasy','Practo','UrbanCompany','Meesho','Groww','Zerodha','Zoho','Freshworks','Postman','Chargebee','Druva','Mu Sigma','Persistent','Tech Mahindra','Mphasis','Quess Corp','Birlasoft','Cognizant'
];

const JOB_TITLES = [
  'Founder & CEO','Co-founder','Chief Operating Officer','Chief Technology Officer','VP Engineering','Director of Product','Director of Design','Engineering Manager','Senior Engineering Manager','Staff Software Engineer','Senior Software Engineer','Software Engineer','Junior Software Engineer','Mobile Engineer','Backend Engineer','Frontend Engineer','Full-Stack Engineer','iOS Engineer','Android Engineer','Platform Engineer','Site Reliability Engineer','DevOps Engineer','Data Engineer','Data Scientist','Machine Learning Engineer','AI Researcher','Product Manager','Senior Product Manager','Group Product Manager','Product Designer','Senior Product Designer','UX Researcher','Visual Designer','Brand Designer','Copywriter','Content Strategist','Tech Writer','Marketing Manager','Growth Lead','SEO Specialist','Performance Marketer','Customer Success Manager','Account Executive','Solutions Engineer','Recruiter','HR Business Partner','Office Manager','Finance Analyst','Legal Counsel','People Ops Lead'
];

const DEPARTMENTS = ['Engineering','Product','Design','Marketing','Sales','Customer Success','Operations','Finance','People','Legal','Data','Research','IT','Leadership'];

const CITIES = [
  ['Mumbai','India','Asia/Kolkata'],
  ['Bengaluru','India','Asia/Kolkata'],
  ['Delhi','India','Asia/Kolkata'],
  ['Hyderabad','India','Asia/Kolkata'],
  ['Pune','India','Asia/Kolkata'],
  ['Chennai','India','Asia/Kolkata'],
  ['Kolkata','India','Asia/Kolkata'],
  ['Ahmedabad','India','Asia/Kolkata'],
  ['Jaipur','India','Asia/Kolkata'],
  ['Goa','India','Asia/Kolkata'],
  ['New York','USA','America/New_York'],
  ['San Francisco','USA','America/Los_Angeles'],
  ['Austin','USA','America/Chicago'],
  ['Seattle','USA','America/Los_Angeles'],
  ['London','UK','Europe/London'],
  ['Berlin','Germany','Europe/Berlin'],
  ['Paris','France','Europe/Paris'],
  ['Amsterdam','Netherlands','Europe/Amsterdam'],
  ['Singapore','Singapore','Asia/Singapore'],
  ['Tokyo','Japan','Asia/Tokyo'],
  ['Sydney','Australia','Australia/Sydney'],
  ['Toronto','Canada','America/Toronto'],
  ['Dubai','UAE','Asia/Dubai'],
];

const TAGS = ['Investor','Mentor','Vendor','Partner','Customer','Friend','Family','Alumni','Team','Advisor','Recruiter','Press','Speaker','Designer','Engineer','Founder','Operations'];

const MEETING_TITLES = [
  'Product strategy sync','Quarterly business review','Engineering all-hands','Design critique','Sprint planning','Sprint retro','1:1 check-in','Roadmap workshop','Customer interview','Investor update','Hiring panel debrief','Architecture review','Incident postmortem','Onboarding session','Marketing standup','Brand brainstorm','Pricing committee','Compliance briefing','Legal review','Partnerships sync','Sales pipeline review','Field readiness training','Mobile platform sync','Backend platform sync','Data council','AI ethics roundtable','OKR check-in','Kickoff meeting','Discovery workshop','Wireframe walkthrough','Final review','Go-live readiness','Beta feedback sync','User research debrief','Pricing experiment review','Press briefing','Town hall','Coffee chat','Mentorship session','Skip-level chat','Vendor demo','Tooling evaluation','Security review','Privacy review','Localization sync','Translation QA','Field marketing planning','Conference prep','Speaker dry run','Awards committee'
];

const MEETING_DESCRIPTIONS = [
  'Aligning on the Q3 roadmap and shipping cadence with the leadership team.',
  'Walk-through of the new design language across mobile and web touch-points.',
  'Hands-on workshop to refine our top three growth experiments for the next sprint.',
  'Deep dive into the customer interviews from the last research round.',
  'Reviewing engineering metrics, deployment frequency, and on-call health.',
  'Drafting a clear narrative for the board update with supporting metrics.',
  'Pairing on the new permissions model and migration strategy.',
  'Looking at billing dashboards and spotting friction in the upgrade flow.',
  'Whiteboarding the new in-call AI assistant prototype.',
  'Closing the loop on incident #4287 and assigning long-term action items.',
  'Onboarding our new joiners with the platform tour and first-week goals.',
  'Sales kickoff to align on enterprise messaging and ICP.',
];

const ANNOUNCEMENTS = [
  ['New AI noise suppression rolling out','Our latest noise suppression model now supports 27 languages. Enable it from settings → audio.'],
  ['Recordings now generate chapters automatically','Long-form recordings are split into chapters using our on-device summarizer.'],
  ['Multi-pin participants','You can now pin up to 6 participants in any call.'],
  ['Translated captions','Live captions can be translated into 12 languages.'],
  ['Drawing on screenshare','Annotate, highlight and erase – right on top of any shared screen.'],
  ['Studio lighting filter','Even out tricky lighting before joining your meeting.'],
  ['Polls everywhere','Polls are now available in 1:1s and in webinars up to 10,000 attendees.'],
  ['Calendar sync 2.0','Smarter conflict detection and one-tap rescheduling.'],
  ['MeetX for Wear OS','Take a quick call from your wrist when you\'re on the go.'],
];

const TIPS = [
  ['Lock your meetings','Lock the room once everyone has joined to keep things private.'],
  ['Enable waiting rooms','Get a heads-up before your meeting fills up.'],
  ['Pin a participant','Long press a tile to pin them for the whole call.'],
  ['Use raise hand','It\'s the politest way to interrupt a busy speaker.'],
  ['Try keyboard shortcuts','Cmd/Ctrl + Shift + M toggles your mic in a flash.'],
  ['Quick reactions','React with emojis without taking the floor.'],
  ['Schedule from contacts','Tap any contact card to schedule a meeting in two taps.'],
  ['Background blur','Hide a messy room without leaving your couch.'],
  ['Voice-only mode','Saves data on the train and your battery overall.'],
  ['Whisper messages','Send a quick whisper to a teammate during a busy call.'],
];

export const SEED_PROFILE: UserProfile = {
  id: 'me',
  name: 'Aditya Raj',
  email: 'aditya@meetx.app',
  phone: '+91 98765 43210',
  jobTitle: 'Co-founder & Product',
  company: 'MeetX Labs',
  bio: 'Building beautiful, feature-rich meeting experiences for the next billion users.',
  avatarColor: '#5B7CFA',
  initials: 'AR',
  status: 'available',
  pronouns: 'he/him',
  timeZone: 'Asia/Kolkata',
};

export const SEED_PREFERENCES: UserPreferences = {
  theme: 'system',
  hapticsEnabled: true,
  soundsEnabled: true,
  defaultMicOn: true,
  defaultCameraOn: true,
  videoQuality: '720p',
  noiseSuppression: 'medium',
  echoCancellation: true,
  beautyFilter: 0.3,
  blurBackground: true,
  virtualBackgroundId: 'studio-lights',
  language: 'en',
  region: 'IN',
  notifications: {
    meetingStarting: true,
    meetingInvites: true,
    chatMentions: true,
    recordingReady: true,
    weeklyDigest: false,
  },
  storage: {
    autoDownloadRecordings: false,
    cellularUploads: false,
    cacheSizeMB: 512,
  },
};

const AVATAR_PALETTE = ['#5B8DEF','#9C6BFF','#FF7A59','#FFB14C','#3DD598','#3CB6F4','#F25C7C','#7B61FF','#22C55E','#FACC15','#EC4899','#14B8A6','#F97316','#A855F7','#EF4444','#0EA5E9'];

function makeContacts(count: number): Contact[] {
  const rand = mulberry32(0x55aacc11);
  return range(count).map((i) => {
    const first = pick(rand, FIRST_NAMES);
    const last = pick(rand, LAST_NAMES);
    const name = `${first} ${last}`;
    const company = pick(rand, COMPANIES);
    const city = pick(rand, CITIES);
    const tagCount = randomInt(rand, 0, 3);
    return {
      id: `c-${i}`,
      name,
      firstName: first,
      lastName: last,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@${company.replace(/[^a-zA-Z]/g,'').toLowerCase()}.com`,
      phone: `+91 9${randomInt(rand, 100000000, 999999999)}`,
      company,
      jobTitle: pick(rand, JOB_TITLES),
      department: pick(rand, DEPARTMENTS),
      city: city[0] ?? '',
      country: city[1] ?? '',
      timeZone: city[2] ?? 'Asia/Kolkata',
      avatarColor: pick(rand, AVATAR_PALETTE),
      initials: safeInitials(name),
      favorite: rand() > 0.85,
      blocked: false,
      tags: pickN(rand, TAGS, tagCount),
      notes: pick(rand, [
        'Met at the BangaloreJS meetup last spring.',
        'Intro from the Y Combinator alumni list.',
        'Helped us land our first enterprise pilot.',
        'Strong opinions on design systems.',
        'Loves vintage keyboards and pour-over coffee.',
        'Connect about quarterly partnership planning.',
      ]),
      recentMeetings: [],
      socials: {
        linkedin: `linkedin.com/in/${first.toLowerCase()}-${last.toLowerCase()}`,
        twitter: `@${first.toLowerCase()}${randomInt(rand, 1, 99)}`,
        github: `${first.toLowerCase()}${last[0]?.toLowerCase() ?? ''}`,
      },
    } satisfies Contact;
  });
}

function makeMeetings(count: number, contacts: Contact[]): Meeting[] {
  const rand = mulberry32(0x77bbdd44);
  const start = Date.now() - 14 * 24 * 60 * 60 * 1000;
  const end = Date.now() + 28 * 24 * 60 * 60 * 1000;
  return range(count).map((i) => {
    const ts = start + Math.floor(rand() * (end - start));
    const startsAt = new Date(ts).toISOString();
    const duration = pick(rand, [15, 30, 45, 60, 75, 90]);
    const participantPool = pickN(rand, contacts, randomInt(rand, 4, 14));
    const code = `${randomInt(rand, 100, 999)}-${randomInt(rand, 100, 999)}-${randomInt(rand, 100, 999)}`;
    const title = pick(rand, MEETING_TITLES);
    return {
      id: `m-${i}`,
      title,
      description: pick(rand, MEETING_DESCRIPTIONS),
      startsAt,
      durationMinutes: duration,
      hostId: 'me',
      hostName: 'Aditya Raj',
      participantIds: participantPool.map((p) => p.id),
      roomCode: code,
      passcode: rand() > 0.5 ? `${randomInt(rand, 1000, 9999)}` : undefined,
      recurring: rand() > 0.6,
      recurrencePattern: pick(rand, ['daily','weekly','biweekly','monthly'] as const),
      category: pick(rand, ['team','client','training','webinar','1-on-1','social','all-hands'] as const),
      tags: pickN(rand, TAGS, randomInt(rand, 0, 3)),
      agenda: makeAgenda(rand, randomInt(rand, 3, 6)),
      reminders: makeReminders(rand),
      shareLink: `https://meetx.app/r/${code}`,
      isLocked: rand() > 0.7,
      isWaitingRoomEnabled: rand() > 0.5,
      recordingId: rand() > 0.6 ? `r-${i}` : undefined,
      thumbnailColor: pick(rand, AVATAR_PALETTE),
    } satisfies Meeting;
  });
}

function makeAgenda(rand: () => number, count: number): AgendaItem[] {
  return range(count).map((i) => ({
    id: `a-${i}`,
    title: pick(rand, [
      'Set the stage','Review last week','Walk-through key metrics','Surface blockers','Decisions to make','Live demo','Open Q&A','Action items','Risks & mitigations','Wrap-up'
    ]),
    durationMinutes: pick(rand, [5, 7, 10, 12, 15, 20]),
    notes: rand() > 0.5 ? 'Bring laptops and headphones.' : undefined,
    done: rand() > 0.7,
  }));
}

function makeReminders(rand: () => number): Reminder[] {
  return [{ id: 'rmd-1', minutesBefore: 15, channel: 'push' }, { id: 'rmd-2', minutesBefore: 60, channel: 'email' }, ...(rand() > 0.5 ? [{ id: 'rmd-3', minutesBefore: 5, channel: 'in-app' as const }] : [])];
}

function makeRecordings(count: number, meetings: Meeting[]): Recording[] {
  const rand = mulberry32(0x99ccff33);
  return range(count).map((i) => ({
    id: `r-${i}`,
    title: pick(rand, MEETING_TITLES) + ' • Recording',
    meetingId: meetings[i % meetings.length]?.id,
    durationSeconds: randomInt(rand, 600, 3600 * 2),
    sizeMB: randomInt(rand, 25, 800),
    createdAt: new Date(Date.now() - randomInt(rand, 0, 30) * 24 * 60 * 60 * 1000).toISOString(),
    storage: rand() > 0.5 ? 'cloud' : 'local',
    thumbnailColor: pick(rand, AVATAR_PALETTE),
    hasTranscript: rand() > 0.3,
    hasChapters: rand() > 0.5,
    watched: rand() > 0.6,
  } satisfies Recording));
}

function makeChat(count: number, meetingId: string, contacts: Contact[]): ChatMessage[] {
  const rand = mulberry32(0xdeadbeef + count);
  return range(count).map((i) => {
    const sender = pick(rand, contacts);
    return {
      id: `chat-${meetingId}-${i}`,
      meetingId,
      senderId: sender.id,
      senderName: sender.name,
      content: pick(rand, [
        'Sounds good!','I agree with the previous point','Can we revisit Q2 goals?','+1','Brilliant idea, let me sketch it.','Can you share the doc?','Joining in 30 seconds, sorry!','I will own the action item.','Adding it to the parking lot.','Our team is aligned.','Let\'s circle back tomorrow.','Numbers look great.','Mic check works for me.','I have a hard stop in 5 minutes.','Captioning seems off, anyone else?'
      ]),
      sentAt: new Date(Date.now() - i * 60 * 1000).toISOString(),
      reactions: rand() > 0.6 ? [{ emoji: pick(rand, ['👍','🎉','❤️','🚀','😂']), by: 'me' }] : [],
      attachmentName: rand() > 0.85 ? pick(rand, ['notes.pdf','spec-v2.pdf','roadmap.png','wireframe.fig']) : undefined,
    } satisfies ChatMessage;
  });
}

function makeNotifications(count: number, meetings: Meeting[]): Notification[] {
  const rand = mulberry32(0xfacefeed);
  return range(count).map((i) => ({
    id: `n-${i}`,
    type: pick(rand, ['meeting','contact','recording','system']),
    title: pick(rand, ['Meeting starts in 10 minutes','You missed a scheduled call','Recording is ready to view','New contact added','Permissions updated','Welcome to MeetX Ultra Pro']),
    body: pick(rand, ['Tap to open the room.','Aditya invited you to a new meeting.','Your recording is now available in cloud storage.','Your network adapter changed.','Calendar sync completed successfully.']),
    createdAt: new Date(Date.now() - i * 90 * 60 * 1000).toISOString(),
    read: rand() > 0.4,
    ctaScreen: pick(rand, ['MeetingsIndex','ContactsIndex','HomeIndex','ProfileIndex']),
  } satisfies Notification));
}

const CONTACTS = makeContacts(120);
const MEETINGS = makeMeetings(60, CONTACTS);
const RECORDINGS = makeRecordings(40, MEETINGS);
const NOTIFICATIONS = makeNotifications(30, MEETINGS);
const CHAT_BY_MEETING: Record<string, ChatMessage[]> = MEETINGS.reduce<Record<string, ChatMessage[]>>((acc, m) => {
  acc[m.id] = makeChat(40, m.id, CONTACTS);
  return acc;
}, {});

export const SEED_CONTACTS = CONTACTS;
export const SEED_MEETINGS = MEETINGS;
export const SEED_RECORDINGS = RECORDINGS;
export const SEED_NOTIFICATIONS = NOTIFICATIONS;
export const SEED_CHAT = CHAT_BY_MEETING;
export const SEED_ANNOUNCEMENTS = ANNOUNCEMENTS.map(([title, body], i) => ({ id: `ann-${i}`, title, body }));
export const SEED_TIPS = TIPS.map(([title, body], i) => ({ id: `tip-${i}`, title, body }));

export const SEED_FAVORITE_ROOMS = MEETINGS.slice(0, 8).map((m, i) => ({ id: `fav-${i}`, code: m.roomCode, label: m.title, color: m.thumbnailColor }));
export const SEED_RECENT_ROOMS = MEETINGS.slice(8, 24).map((m, i) => ({ id: `rec-${i}`, code: m.roomCode, label: m.title, color: m.thumbnailColor, joinedAt: m.startsAt }));

export const SEED_INTEGRATIONS = [
  { id: 'gcal', name: 'Google Calendar', description: 'Sync meetings with your calendar', enabled: true },
  { id: 'outlook', name: 'Microsoft Outlook', description: 'Pull invites from Outlook', enabled: false },
  { id: 'slack', name: 'Slack', description: 'Share recordings to channels', enabled: true },
  { id: 'teams', name: 'Microsoft Teams', description: 'Cross-post events to Teams', enabled: false },
  { id: 'notion', name: 'Notion', description: 'Send notes to a Notion database', enabled: true },
  { id: 'zapier', name: 'Zapier', description: 'Trigger workflows on call events', enabled: false },
  { id: 'asana', name: 'Asana', description: 'Convert action items into tasks', enabled: false },
  { id: 'linear', name: 'Linear', description: 'Pull engineering tasks into your call', enabled: true },
  { id: 'github', name: 'GitHub', description: 'Show PR status in side panel', enabled: false },
  { id: 'salesforce', name: 'Salesforce', description: 'Log meeting notes against contacts', enabled: false },
  { id: 'hubspot', name: 'HubSpot', description: 'Push call summaries into deals', enabled: true },
];

export const ALPHABET = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
