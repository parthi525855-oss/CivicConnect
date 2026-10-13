const bcrypt = require('bcryptjs');

// Salt and hash passwords synchronously for seed
const salt = bcrypt.genSaltSync(10);
const hashedAdminPassword = bcrypt.hashSync('admin123', salt);
const hashedCitizenPassword = bcrypt.hashSync('citizen123', salt);

const initialUsers = [
  {
    _id: '661000000000000000000001',
    name: 'Municipal Commissioner',
    email: 'admin@civicconnect.gov',
    password: hashedAdminPassword,
    role: 'admin',
    phone: '+91 94440 12345',
    address: 'City Civic Corporation Headquarters, Central Zone',
    createdAt: new Date('2026-01-01T09:00:00Z')
  },
  {
    _id: '661000000000000000000002',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    password: hashedCitizenPassword,
    role: 'citizen',
    phone: '+91 98401 23456',
    address: '4th Avenue, Anna Nagar West, Chennai',
    createdAt: new Date('2026-01-10T10:00:00Z')
  },
  {
    _id: '661000000000000000000003',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    password: hashedCitizenPassword,
    role: 'citizen',
    phone: '+91 98402 34567',
    address: 'South Usman Road, T. Nagar, Chennai',
    createdAt: new Date('2026-01-15T11:30:00Z')
  },
  {
    _id: '661000000000000000000004',
    name: 'Anand Venkatesh',
    email: 'anand.v@example.com',
    password: hashedCitizenPassword,
    role: 'citizen',
    phone: '+91 98403 45678',
    address: 'Lattice Bridge Road, Adyar, Chennai',
    createdAt: new Date('2026-02-01T14:15:00Z')
  },
  {
    _id: '661000000000000000000005',
    name: 'Meera Nair',
    email: 'meera.nair@example.com',
    password: hashedCitizenPassword,
    role: 'citizen',
    phone: '+91 98404 56789',
    address: 'Vijayanagar 1st Main Rd, Velachery, Chennai',
    createdAt: new Date('2026-02-10T16:45:00Z')
  },
  {
    _id: '661000000000000000000006',
    name: 'Karthik Subramanian',
    email: 'karthik.s@example.com',
    password: hashedCitizenPassword,
    role: 'citizen',
    phone: '+91 98405 67890',
    address: 'Kutchery Road, Mylapore, Chennai',
    createdAt: new Date('2026-02-18T09:20:00Z')
  },
  {
    _id: '661000000000000000000007',
    name: 'Deepa Ramachandran',
    email: 'deepa.r@example.com',
    password: hashedCitizenPassword,
    role: 'citizen',
    phone: '+91 98406 78901',
    address: 'Race Course Road, Guindy, Chennai',
    createdAt: new Date('2026-03-01T12:00:00Z')
  }
];

const initialIssues = [
  {
    _id: '662000000000000000000001',
    complaintId: 'CIV-2026-0001',
    userId: '661000000000000000000002',
    title: 'Major deep pothole on 4th Main Road',
    description:
      'Severe pothole roughly 2 feet wide right in the middle of 4th Main Road causing vehicle skidding during monsoon showers and dangerous for two-wheelers.',
    category: 'Roads',
    location: 'Anna Nagar West',
    coordinates: { lat: 13.0878, lng: 80.2085 },
    landmark: 'Opposite Roundtana Petrol Bunk',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
    priority: 'HIGH',
    priorityReason: 'High community impact threshold reached (24 citizen endorsements) & safety risk',
    status: 'In Progress',
    adminRemark: 'Public Works Department Road Gang deployed. Asphalt patch laying scheduled tonight.',
    upvotes: 24,
    supportedBy: [
      '661000000000000000000003',
      '661000000000000000000004',
      '661000000000000000000005',
      '661000000000000000000006'
    ],
    statusTimeline: [
      {
        status: 'Reported',
        updatedBy: 'Rajesh Kumar',
        remark: 'Initial issue submission with photos',
        timestamp: new Date('2026-02-01T10:30:00Z')
      },
      {
        status: 'Under Review',
        updatedBy: 'Municipal Commissioner',
        remark: 'Assessed by Ward 92 Junior Engineer',
        timestamp: new Date('2026-02-02T11:00:00Z')
      },
      {
        status: 'Assigned',
        updatedBy: 'Municipal Commissioner',
        remark: 'Work order #RD-8841 issued to Road Maintenance Division',
        timestamp: new Date('2026-02-03T15:20:00Z')
      },
      {
        status: 'In Progress',
        updatedBy: 'Municipal Commissioner',
        remark: 'Contractor deployed machinery on site',
        timestamp: new Date('2026-02-04T09:40:00Z')
      }
    ],
    createdAt: new Date('2026-02-01T10:30:00Z'),
    updatedAt: new Date('2026-02-04T09:40:00Z')
  },
  {
    _id: '662000000000000000000002',
    complaintId: 'CIV-2026-0002',
    userId: '661000000000000000000003',
    title: 'Severe garbage accumulation near bus shelter',
    description:
      'Solid waste bins overflowing for over four days. Stray animals scattering plastic debris onto the sidewalk, creating intense odor and pedestrian obstruction.',
    category: 'Garbage',
    location: 'T. Nagar',
    coordinates: { lat: 13.0418, lng: 80.2341 },
    landmark: 'Panagal Park Bus Terminus exit',
    image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&auto=format&fit=crop&q=80',
    priority: 'HIGH',
    priorityReason: 'High community endorsements (19 citizens) + commercial transit hub',
    status: 'Resolved',
    adminRemark: 'Sanitation team cleared 3 tonnes of waste and deployed 2 additional covered compactor bins.',
    upvotes: 19,
    supportedBy: [
      '661000000000000000000002',
      '661000000000000000000004',
      '661000000000000000000005'
    ],
    statusTimeline: [
      {
        status: 'Reported',
        updatedBy: 'Priya Sharma',
        remark: 'Issue reported with high urgency',
        timestamp: new Date('2026-01-20T08:15:00Z')
      },
      {
        status: 'Assigned',
        updatedBy: 'Municipal Commissioner',
        remark: 'Assigned to Conservancy Supervisory Officer Zone 10',
        timestamp: new Date('2026-01-20T10:00:00Z')
      },
      {
        status: 'In Progress',
        updatedBy: 'Municipal Commissioner',
        remark: 'Compactor truck deployed',
        timestamp: new Date('2026-01-20T14:30:00Z')
      },
      {
        status: 'Resolved',
        updatedBy: 'Municipal Commissioner',
        remark: 'Site sanitized with lime powder and bins replaced',
        timestamp: new Date('2026-01-21T09:10:00Z')
      }
    ],
    createdAt: new Date('2026-01-20T08:15:00Z'),
    updatedAt: new Date('2026-01-21T09:10:00Z')
  },
  {
    _id: '662000000000000000000003',
    complaintId: 'CIV-2026-0003',
    userId: '661000000000000000000004',
    title: 'Drinking water pipeline leakage on LB Road',
    description:
      'Continuous clean potable water gushing from underground pipeline joint since yesterday morning, wasting thousands of litres.',
    category: 'Water',
    location: 'Adyar',
    coordinates: { lat: 13.0064, lng: 80.2575 },
    landmark: 'Near Adyar Ananda Bhavan junction',
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80',
    priority: 'HIGH',
    priorityReason: 'Essential municipal category (Water) with critical leakage keywords',
    status: 'In Progress',
    adminRemark: 'Metro Water Emergency pipeline welding squad on site. Valve temporarily isolated.',
    upvotes: 14,
    supportedBy: ['661000000000000000000002', '661000000000000000000006'],
    statusTimeline: [
      {
        status: 'Reported',
        updatedBy: 'Anand Venkatesh',
        remark: 'Reported emergency pipeline leakage',
        timestamp: new Date('2026-02-14T07:00:00Z')
      },
      {
        status: 'Under Review',
        updatedBy: 'Municipal Commissioner',
        remark: 'Alerted Metro Water Area Engineer',
        timestamp: new Date('2026-02-14T08:00:00Z')
      },
      {
        status: 'In Progress',
        updatedBy: 'Municipal Commissioner',
        remark: 'Trenching started to expose collar joint',
        timestamp: new Date('2026-02-14T11:30:00Z')
      }
    ],
    createdAt: new Date('2026-02-14T07:00:00Z'),
    updatedAt: new Date('2026-02-14T11:30:00Z')
  },
  {
    _id: '662000000000000000000004',
    complaintId: 'CIV-2026-0004',
    userId: '661000000000000000000005',
    title: 'Blocked stormwater drainage causing foul water stagnation',
    description:
      'Heavy silt and plastic blockage in monsoon drain outlet. Foul black water backing up onto residential lane during light showers.',
    category: 'Drainage',
    location: 'Velachery',
    coordinates: { lat: 12.9815, lng: 80.218 },
    landmark: 'Gandhi Street corner',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?w=800&auto=format&fit=crop&q=80',
    priority: 'HIGH',
    priorityReason: 'Category Drainage with stagnation hazard and 11 community endorsements',
    status: 'Assigned',
    adminRemark: 'Desilting suction machine assigned for tomorrow morning shift.',
    upvotes: 11,
    supportedBy: ['661000000000000000000004', '661000000000000000000007'],
    statusTimeline: [
      {
        status: 'Reported',
        updatedBy: 'Meera Nair',
        remark: 'Reported drain blockage',
        timestamp: new Date('2026-02-20T11:00:00Z')
      },
      {
        status: 'Assigned',
        updatedBy: 'Municipal Commissioner',
        remark: 'Assigned to Stormwater Drainage Division 178',
        timestamp: new Date('2026-02-21T09:15:00Z')
      }
    ],
    createdAt: new Date('2026-02-20T11:00:00Z'),
    updatedAt: new Date('2026-02-21T09:15:00Z')
  },
  {
    _id: '662000000000000000000005',
    complaintId: 'CIV-2026-0005',
    userId: '661000000000000000000006',
    title: 'Dark stretch due to 4 non-functioning streetlights',
    description:
      'Four consecutive LED streetlights are not turning on at night, leaving a 200m road pitch black. Causes safety concerns for women and evening commuters.',
    category: 'Streetlights',
    location: 'Mylapore',
    coordinates: { lat: 13.0368, lng: 80.2676 },
    landmark: 'Behind Kapaleeshwarar temple pond street',
    image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80',
    priority: 'MEDIUM',
    priorityReason: 'Elevated community concern threshold reached (8 citizen endorsements)',
    status: 'Reported',
    adminRemark: '',
    upvotes: 8,
    supportedBy: ['661000000000000000000002'],
    statusTimeline: [
      {
        status: 'Reported',
        updatedBy: 'Karthik Subramanian',
        remark: 'Citizen logged issue for dark street hazard',
        timestamp: new Date('2026-03-01T20:10:00Z')
      }
    ],
    createdAt: new Date('2026-03-01T20:10:00Z'),
    updatedAt: new Date('2026-03-01T20:10:00Z')
  },
  {
    _id: '662000000000000000000006',
    complaintId: 'CIV-2026-0006',
    userId: '661000000000000000000007',
    title: 'Blinking traffic signal malfunctioning at junction',
    description:
      'The automated signal cycle timer is stuck, showing flashing amber continuously during peak morning hours resulting in heavy traffic jams.',
    category: 'Traffic',
    location: 'Guindy',
    coordinates: { lat: 13.0067, lng: 80.2025 },
    landmark: 'Kathipara flyover lower service lane',
    image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=800&auto=format&fit=crop&q=80',
    priority: 'MEDIUM',
    priorityReason: 'Traffic junction signaling disruption criteria',
    status: 'Under Review',
    adminRemark: 'Forwarded to City Traffic Police Signals Engineering cell.',
    upvotes: 9,
    supportedBy: ['661000000000000000000003'],
    statusTimeline: [
      {
        status: 'Reported',
        updatedBy: 'Deepa Ramachandran',
        remark: 'Reported morning bottleneck',
        timestamp: new Date('2026-03-05T09:00:00Z')
      },
      {
        status: 'Under Review',
        updatedBy: 'Municipal Commissioner',
        remark: 'Inspection team dispatched for controller board testing',
        timestamp: new Date('2026-03-05T11:00:00Z')
      }
    ],
    createdAt: new Date('2026-03-05T09:00:00Z'),
    updatedAt: new Date('2026-03-05T11:00:00Z')
  },
  {
    _id: '662000000000000000000007',
    complaintId: 'CIV-2026-0007',
    userId: '661000000000000000000002',
    title: 'Broken safety railing on public canal walkway',
    description:
      'A 10-foot iron railing segment along the Buckingham canal walking promenade has collapsed into the water, presenting a severe fall risk for children and seniors.',
    category: 'Public Infrastructure',
    location: 'Adyar',
    coordinates: { lat: 13.0033, lng: 80.252 },
    landmark: 'Near Kasturba Nagar MRTS Station walkway',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80',
    priority: 'HIGH',
    priorityReason: 'Hazard keyword identified: severe fall risk on public promenade',
    status: 'In Progress',
    adminRemark: 'Temporary barricades placed. Metal fabricator fabricating galvanized replacement railings.',
    upvotes: 18,
    supportedBy: [
      '661000000000000000000003',
      '661000000000000000000004',
      '661000000000000000000005',
      '661000000000000000000006'
    ],
    statusTimeline: [
      {
        status: 'Reported',
        updatedBy: 'Rajesh Kumar',
        remark: 'Citizen noted hazardous broken railing',
        timestamp: new Date('2026-02-12T16:00:00Z')
      },
      {
        status: 'Assigned',
        updatedBy: 'Municipal Commissioner',
        remark: 'Zonal Engineering Team 13 notified',
        timestamp: new Date('2026-02-13T10:00:00Z')
      },
      {
        status: 'In Progress',
        updatedBy: 'Municipal Commissioner',
        remark: 'Site cordoned and fabrication initiated',
        timestamp: new Date('2026-02-14T14:00:00Z')
      }
    ],
    createdAt: new Date('2026-02-12T16:00:00Z'),
    updatedAt: new Date('2026-02-14T14:00:00Z')
  },
  {
    _id: '662000000000000000000008',
    complaintId: 'CIV-2026-0008',
    userId: '661000000000000000000003',
    title: 'Illegal construction debris dumped along park boundary',
    description:
      'Unidentified mini-trucks dumped multiple piles of concrete rubble, plaster, and ceramic tiles bordering the community children park.',
    category: 'Environment',
    location: 'Anna Nagar West',
    coordinates: { lat: 13.0841, lng: 80.2112 },
    landmark: 'Behind Millennium Park gate 3',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=80',
    priority: 'NORMAL',
    priorityReason: 'Standard baseline civic report criteria',
    status: 'Reported',
    adminRemark: '',
    upvotes: 4,
    supportedBy: ['661000000000000000000002'],
    statusTimeline: [
      {
        status: 'Reported',
        updatedBy: 'Priya Sharma',
        remark: 'Citizen uploaded photos of illegal dumping',
        timestamp: new Date('2026-03-02T13:40:00Z')
      }
    ],
    createdAt: new Date('2026-03-02T13:40:00Z'),
    updatedAt: new Date('2026-03-02T13:40:00Z')
  },
  {
    _id: '662000000000000000000009',
    complaintId: 'CIV-2026-0009',
    userId: '661000000000000000000004',
    title: 'Public e-toilet facility non-operational and locked',
    description:
      'Automated coin dispenser and water supply inside the smart public toilet unit are unserviceable. Doors locked for past 3 weeks.',
    category: 'Public Infrastructure',
    location: 'T. Nagar',
    coordinates: { lat: 13.0456, lng: 80.2319 },
    landmark: 'Near Ranganathan Street entrance',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    priority: 'MEDIUM',
    priorityReason: 'Public sanitation amenity in dense shopping district',
    status: 'Resolved',
    adminRemark: 'Service vendor replaced solenoid water valve and replenished automated coin unit. Now fully operational.',
    upvotes: 12,
    supportedBy: ['661000000000000000000003', '661000000000000000000005'],
    statusTimeline: [
      {
        status: 'Reported',
        updatedBy: 'Anand Venkatesh',
        remark: 'Public toilet out of service',
        timestamp: new Date('2026-01-12T10:00:00Z')
      },
      {
        status: 'In Progress',
        updatedBy: 'Municipal Commissioner',
        remark: 'Technician team assigned',
        timestamp: new Date('2026-01-13T12:00:00Z')
      },
      {
        status: 'Resolved',
        updatedBy: 'Municipal Commissioner',
        remark: 'Inspection verified functional water flow & sensor check',
        timestamp: new Date('2026-01-14T15:30:00Z')
      }
    ],
    createdAt: new Date('2026-01-12T10:00:00Z'),
    updatedAt: new Date('2026-01-14T15:30:00Z')
  },
  {
    _id: '662000000000000000000010',
    complaintId: 'CIV-2026-0010',
    userId: '661000000000000000000005',
    title: 'Exposed high voltage electrical wire near primary school',
    description:
      'Damaged junction box cover at base of lamppost exposing live wire bundle directly across from primary school pedestrian gate.',
    category: 'Streetlights',
    location: 'Velachery',
    coordinates: { lat: 12.9789, lng: 80.2215 },
    landmark: 'Adjacent to St. Antony School gate',
    image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80',
    priority: 'HIGH',
    priorityReason: 'Critical safety alert: Exposed electrical wire near school gate',
    status: 'Closed',
    adminRemark: 'Electricity board technician installed reinforced junction cover with safety insulation seal. Certified safe.',
    upvotes: 27,
    supportedBy: [
      '661000000000000000000002',
      '661000000000000000000003',
      '661000000000000000000004',
      '661000000000000000000006'
    ],
    statusTimeline: [
      {
        status: 'Reported',
        updatedBy: 'Meera Nair',
        remark: 'Urgent danger report',
        timestamp: new Date('2026-01-08T08:30:00Z')
      },
      {
        status: 'Under Review',
        updatedBy: 'Municipal Commissioner',
        remark: 'Priority 1 Emergency escalation',
        timestamp: new Date('2026-01-08T08:45:00Z')
      },
      {
        status: 'In Progress',
        updatedBy: 'Municipal Commissioner',
        remark: 'Lineman squad on spot',
        timestamp: new Date('2026-01-08T09:30:00Z')
      },
      {
        status: 'Resolved',
        updatedBy: 'Municipal Commissioner',
        remark: 'Insulated and re-enclosed',
        timestamp: new Date('2026-01-08T11:45:00Z')
      },
      {
        status: 'Closed',
        updatedBy: 'Municipal Commissioner',
        remark: 'Verification audit passed by safety inspector',
        timestamp: new Date('2026-01-09T10:00:00Z')
      }
    ],
    createdAt: new Date('2026-01-08T08:30:00Z'),
    updatedAt: new Date('2026-01-09T10:00:00Z')
  },
  {
    _id: '662000000000000000000011',
    complaintId: 'CIV-2026-0011',
    userId: '661000000000000000000006',
    title: 'Missing manhole cover on busy pedestrian footpath',
    description:
      'Open circular manhole pit roughly 3 feet deep without warning barricade or cover. High danger in evening darkness.',
    category: 'Drainage',
    location: 'Mylapore',
    coordinates: { lat: 13.0335, lng: 80.271 },
    landmark: 'Near Luz Church Road intersection',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?w=800&auto=format&fit=crop&q=80',
    priority: 'HIGH',
    priorityReason: 'Life safety hazard: Open manhole pit in pedestrian walkway',
    status: 'In Progress',
    adminRemark: 'Caution drums placed immediately. Heavy-duty concrete ductile iron cover being positioned.',
    upvotes: 21,
    supportedBy: [
      '661000000000000000000002',
      '661000000000000000000003',
      '661000000000000000000005'
    ],
    statusTimeline: [
      {
        status: 'Reported',
        updatedBy: 'Karthik Subramanian',
        remark: 'Reported open pit',
        timestamp: new Date('2026-03-04T17:15:00Z')
      },
      {
        status: 'Assigned',
        updatedBy: 'Municipal Commissioner',
        remark: 'Emergency response van dispatched',
        timestamp: new Date('2026-03-04T17:45:00Z')
      },
      {
        status: 'In Progress',
        updatedBy: 'Municipal Commissioner',
        remark: 'Temporary barricades placed, cover installation ongoing',
        timestamp: new Date('2026-03-04T19:00:00Z')
      }
    ],
    createdAt: new Date('2026-03-04T17:15:00Z'),
    updatedAt: new Date('2026-03-04T19:00:00Z')
  },
  {
    _id: '662000000000000000000012',
    complaintId: 'CIV-2026-0012',
    userId: '661000000000000000000007',
    title: 'Overgrown tree branches touching overhead telecom cables',
    description:
      'Heavy boughs of ancient banyan tree leaning precariously over cables and partially obstructing view of traffic signal.',
    category: 'Other',
    location: 'Guindy',
    coordinates: { lat: 13.0125, lng: 80.2088 },
    landmark: 'Adjacent to Guindy Industrial Estate entry',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=80',
    priority: 'NORMAL',
    priorityReason: 'Non-emergency horticultural maintenance request',
    status: 'Reported',
    adminRemark: '',
    upvotes: 3,
    supportedBy: ['661000000000000000000006'],
    statusTimeline: [
      {
        status: 'Reported',
        updatedBy: 'Deepa Ramachandran',
        remark: 'Pruning request registered',
        timestamp: new Date('2026-03-06T14:20:00Z')
      }
    ],
    createdAt: new Date('2026-03-06T14:20:00Z'),
    updatedAt: new Date('2026-03-06T14:20:00Z')
  }
];

const initialNotifications = [
  {
    _id: '663000000000000000000001',
    userId: '661000000000000000000002',
    issueId: '662000000000000000000001',
    complaintId: 'CIV-2026-0001',
    type: 'STATUS_UPDATE',
    message: 'Your complaint CIV-2026-0001 has been moved to "In Progress". Remark: "Public Works Department Road Gang deployed."',
    read: false,
    createdAt: new Date('2026-02-04T09:40:00Z')
  },
  {
    _id: '663000000000000000000002',
    userId: '661000000000000000000003',
    issueId: '662000000000000000000002',
    complaintId: 'CIV-2026-0002',
    type: 'STATUS_UPDATE',
    message: 'Your complaint CIV-2026-0002 has been marked "Resolved". Remark: "Sanitation team cleared 3 tonnes of waste."',
    read: true,
    createdAt: new Date('2026-01-21T09:10:00Z')
  },
  {
    _id: '663000000000000000000003',
    userId: '661000000000000000000004',
    issueId: '662000000000000000000003',
    complaintId: 'CIV-2026-0003',
    type: 'STATUS_UPDATE',
    message: 'Your complaint CIV-2026-0003 has been moved to "In Progress". Emergency welding squad on site.',
    read: false,
    createdAt: new Date('2026-02-14T11:30:00Z')
  }
];

module.exports = {
  initialUsers,
  initialIssues,
  initialNotifications
};
