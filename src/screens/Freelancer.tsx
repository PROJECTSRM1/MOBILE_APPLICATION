
import { Navigation } from 'lucide-react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {

  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  useColorScheme,
} from 'react-native';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

// SVG Icon
const SearchIcon = ({ size = 20, color = "#9da6b9" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const FilterIcon = ({ size = 20, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 6H20M7 12H17M10 18H14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const BackIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const BuildingIcon = ({ size = 16, color = "#64748b" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="2" width="16" height="20" rx="2" stroke={color} strokeWidth="2" />
    <Path d="M8 6h.01M12 6h.01M16 6h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M8 10h.01M12 10h.01M16 10h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M8 14h.01M12 14h.01M16 14h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M10 22v-4h4v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const MenuIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="6" r="1.5" fill={color} />
    <Circle cx="12" cy="12" r="1.5" fill={color} />
    <Circle cx="12" cy="18" r="1.5" fill={color} />
  </Svg>
);

const StarIcon = ({ size = 16, color = "#facc15" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </Svg>
);

const HomeIcon = ({ size = 24, color = "#64748b", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"}>
    <Path
      d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={filled ? color : "none"}
    />
    <Path
      d="M9 22V12H15V22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const GroupIcon = ({ size = 24, color = "#135bec", filled = true }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"}>
    <Path
      d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={filled ? color : "none"}
    />
    <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" fill={filled ? color : "none"} />
    <Path
      d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const MessageIcon = ({ size = 24, color = "#64748b", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"}>
    <Path
      d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={filled ? color : "none"}
    />
  </Svg>
);

const ProfileIcon = ({ size = 24, color = "#64748b", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"}>
    <Path
      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" fill={filled ? color : "none"} />
  </Svg>
);
const VerifyIcon = ({ size = 12, color = "#135bec" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TaskIcon = ({ size = 14, color = "#64748b" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Rect x="8" y="2" width="8" height="4" rx="1" stroke={color} strokeWidth="2" />
    <Path d="M9 14l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

type WorkStatus = 'inactive' | 'waiting' | 'assigned';

interface OrganisationDetails {
  orgName: string;
  gstin: string;
  group: Number
}

interface ServiceProvider {
  id: string;
  name: string;
  service: string;
  role: string;               // Added
  tasksCompleted: number;    // Added
  certifications: string[];  // Added
  workStatus: WorkStatus;    // Changed from isActive
  rating: number;
  reviews: number;
  skills: string[];
  hourlyRate: number;
  image: string;

  // NEW FLAGS
  isActive: boolean;
  isEnrolled: boolean;

  // Only if freelancer belongs to company (bulk)
  organisation?: OrganisationDetails;
  cuisineStyle?: 'North' | 'South';
}


const serviceProviders: ServiceProvider[] = [
  {
    id: '1',
    name: 'Ramesh Kumar',
    service: 'Plumber',
    role: 'Senior Plumber',
    tasksCompleted: 156,
    certifications: ['Licensed Plumber', 'Safety Certified'],
    workStatus: 'assigned',
    rating: 4.8,
    reviews: 156,
    skills: ['Pipe Fitting', 'Drainage'],
    hourlyRate: 350,
    image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&h=400&fit=crop',
    isActive: true,
    isEnrolled: true,
  },
  {
    id: '2',
    name: 'Lakshmi Devi',
    service: 'Cleaner',
    role: 'Professional Cleaner',
    tasksCompleted: 203,
    certifications: ['Hygiene Certified', 'Deep Cleaning Expert'],
    workStatus: 'inactive',
    rating: 5.0,
    reviews: 203,
    skills: ['Deep Cleaning', 'Sanitization'],
    hourlyRate: 250,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    isActive: false,
    isEnrolled: true,
  },
  {
    id: '3',
    name: 'Suresh Reddy',
    service: 'Electrician',
    role: 'Certified Electrician',
    tasksCompleted: 98,
    certifications: ['Electrical License', 'Industrial Wiring'],
    workStatus: 'waiting',
    rating: 4.7,
    reviews: 98,
    skills: ['Wiring', 'Repair'],
    hourlyRate: 400,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    isActive: true,
    isEnrolled: true,
    organisation: {
      orgName: "Sparkle Cleaning Pvt Ltd",
      gstin: "29ABCDE1234F1Z5",
      group: 10
    }
  },
  {
    id: '4',
    name: 'Priya Sharma',
    service: 'Washer',
    role: 'Laundry Specialist',
    tasksCompleted: 142,
    certifications: ['Dry Cleaning Certified'],
    workStatus: 'inactive',
    rating: 4.9,
    reviews: 142,
    skills: ['Machine Wash', 'Dry Cleaning'],
    hourlyRate: 200,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    isActive: false,
    isEnrolled: true,
  },
  {
    id: '5',
    name: 'Vijay Rao',
    service: 'Plumber',
    role: 'Plumbing Technician',
    tasksCompleted: 87,
    certifications: ['Plumbing License'],
    workStatus: 'waiting',
    rating: 4.6,
    reviews: 87,
    skills: ['Installation', 'Maintenance'],
    hourlyRate: 320,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    isActive: true,
    isEnrolled: false,
  },
  {
    id: '6',
    name: 'Anita Patel',
    service: 'Cleaner',
    role: 'Home Cleaning Expert',
    tasksCompleted: 175,
    certifications: ['Kitchen Hygiene Certified'],
    workStatus: 'assigned',
    rating: 4.8,
    reviews: 175,
    skills: ['Home Cleaning', 'Kitchen'],
    hourlyRate: 280,
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?w=400&h=400&fit=crop',
    isActive: true,
    isEnrolled: false,
  },
  {
    id: '7',
    name: 'Karthik Menon',
    service: 'Electrician',
    role: 'Smart Home Specialist',
    tasksCompleted: 134,
    certifications: ['Smart Home Certified', 'IoT Installation'],
    workStatus: 'inactive',
    rating: 4.9,
    reviews: 134,
    skills: ['Smart Home', 'Installation'],
    hourlyRate: 450,
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop',
    isActive: false,
    isEnrolled: true,
    organisation: {
      orgName: "Sparkle Cleaning Pvt Ltd",
      gstin: "29ABCDE1234F1Z5",
      group: 11,
    }
  },
  {
    id: '8',
    name: 'Deepa Singh',
    service: 'Washer',
    role: 'Laundry Professional',
    tasksCompleted: 98,
    certifications: ['Fabric Care Expert'],
    workStatus: 'assigned',
    rating: 4.7,
    reviews: 98,
    skills: ['Laundry', 'Ironing'],
    hourlyRate: 220,
    image: 'https://images.unsplash.com/photo-1567532939604-b6c5b0ad2e01?w=400&h=400&fit=crop',
    isActive: true,
    isEnrolled: true,
    organisation: {
      orgName: "Sparkle Cleaning Pvt Ltd",
      gstin: "29ABCDE1234F1Z5",
      group: 12
    }
  },
  {
    id: '9',
    name: 'Mohit Verma',
    service: 'Plumber',
    role: 'Bathroom Specialist',
    tasksCompleted: 76,
    certifications: ['Plumbing License'],
    workStatus: 'waiting',
    rating: 4.5,
    reviews: 76,
    skills: ['Leak Fixing', 'Bathroom Fitting'],
    hourlyRate: 300,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    isActive: true,
    isEnrolled: true,
  },
  {
    id: '10',
    name: 'Sneha Iyer',
    service: 'Cleaner',
    role: 'Commercial Cleaner',
    tasksCompleted: 221,
    certifications: ['Office Cleaning Certified', 'Floor Care Expert'],
    workStatus: 'assigned',
    rating: 4.9,
    reviews: 221,
    skills: ['Office Cleaning', 'Floor Polishing'],
    hourlyRate: 270,
    image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&h=400&fit=crop',
    isActive: true,
    isEnrolled: true,
  },
  {
    id: '11',
    name: 'Arjun Singh',
    service: 'Electrician',
    role: 'Appliance Repair Specialist',
    tasksCompleted: 110,
    certifications: ['Electrical License', 'Appliance Repair'],
    workStatus: 'inactive',
    rating: 4.6,
    reviews: 110,
    skills: ['Appliance Repair', 'Fan Installation'],
    hourlyRate: 380,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    isActive: false,
    isEnrolled: true,
  },
  {
    id: '12',
    name: 'Pooja Nair',
    service: 'Washer',
    role: 'Fabric Care Specialist',
    tasksCompleted: 164,
    certifications: ['Steam Ironing Expert', 'Fabric Care'],
    workStatus: 'assigned',
    rating: 4.8,
    reviews: 164,
    skills: ['Steam Ironing', 'Fabric Care'],
    hourlyRate: 230,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    isActive: true,
    isEnrolled: true,
  },
  {
    id: '13',
    name: 'Rahul Das',
    service: 'Plumber',
    role: 'Motor Technician',
    tasksCompleted: 59,
    certifications: ['Motor Repair Certified'],
    workStatus: 'inactive',
    rating: 4.4,
    reviews: 59,
    skills: ['Motor Repair', 'Tank Cleaning'],
    hourlyRate: 310,
    image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop',
    isActive: false,
    isEnrolled: false,
  },
  {
    id: '14',
    name: 'Neha Kapoor',
    service: 'Cleaner',
    role: 'Premium Cleaning Specialist',
    tasksCompleted: 287,
    certifications: ['Villa Cleaning Expert', 'Move-out Specialist'],
    workStatus: 'assigned',
    rating: 5.0,
    reviews: 287,
    skills: ['Villa Cleaning', 'Move-out Cleaning'],
    hourlyRate: 320,
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop',
    isActive: true,
    isEnrolled: true,
    organisation: {
      orgName: "UrbanCare Services",
      gstin: "27ABCDE4321K9Z2",
      group: 10,
    }
  },
  {
    id: '15',
    name: 'Imran Khan',
    service: 'Electrician',
    role: 'Security Systems Expert',
    tasksCompleted: 143,
    certifications: ['CCTV Installation', 'Inverter Specialist'],
    workStatus: 'waiting',
    rating: 4.7,
    reviews: 143,
    skills: ['Inverter Setup', 'CCTV Install'],
    hourlyRate: 420,
    image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&h=400&fit=crop',
    isActive: true,
    isEnrolled: true,
  },
  {
    id: '16',
    name: 'Kavya Joshi',
    service: 'Washer',
    role: 'Delicate Fabric Specialist',
    tasksCompleted: 92,
    certifications: ['Delicate Fabric Care'],
    workStatus: 'inactive',
    rating: 4.6,
    reviews: 92,
    skills: ['Curtain Wash', 'Delicate Clothes'],
    hourlyRate: 210,
    image: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=400&h=400&fit=crop',
    isActive: false,
    isEnrolled: true,
  },
  {
    id: '17',
    name: 'Sanjay Patel',
    service: 'Plumber',
    role: 'Commercial Plumbing Expert',
    tasksCompleted: 198,
    certifications: ['Commercial Plumbing', 'Pipeline Design'],
    workStatus: 'assigned',
    rating: 4.9,
    reviews: 198,
    skills: ['Pipeline Design', 'Commercial Plumbing'],
    hourlyRate: 500,
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop',
    isActive: true,
    isEnrolled: true,
    organisation: {
      orgName: "AquaFlow Solutions",
      gstin: "24AAQCA1122P1Z8",
      group: 10
    }
  },
  {
    id: '18',
    name: 'Aditi Roy',
    service: 'Cleaner',
    role: 'Deep Cleaning Specialist',
    tasksCompleted: 134,
    certifications: ['Bathroom Cleaning Expert'],
    workStatus: 'waiting',
    rating: 4.7,
    reviews: 134,
    skills: ['Bathroom Deep Clean', 'Balcony Cleaning'],
    hourlyRate: 260,
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop',
    isActive: true,
    isEnrolled: false,
  },
  {
    id: '19',
    name: 'Naveen Kumar',
    service: 'Electrician',
    role: 'Repair Technician',
    tasksCompleted: 48,
    certifications: ['Electrical License'],
    workStatus: 'inactive',
    rating: 4.3,
    reviews: 48,
    skills: ['Switch Board Repair', 'Short Circuit Fix'],
    hourlyRate: 340,
    image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop',
    isActive: false,
    isEnrolled: true,
  },
  {
    id: '20',
    name: 'Ritu Malhotra',
    service: 'Washer',
    role: 'Premium Laundry Expert',
    tasksCompleted: 312,
    certifications: ['Premium Laundry', 'Dry Iron Specialist'],
    workStatus: 'assigned',
    rating: 5.0,
    reviews: 312,
    skills: ['Premium Laundry', 'Dry Iron Finish'],
    hourlyRate: 280,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
    isActive: true,
    isEnrolled: true,
  },
  {
    id: '21',
    name: 'Balaji N',
    service: 'Plumber',
    role: 'Installation Specialist',
    tasksCompleted: 121,
    certifications: ['Water Heater Installation'],
    workStatus: 'waiting',
    rating: 4.6,
    reviews: 121,
    skills: ['Sink Repair', 'Water Heater Install'],
    hourlyRate: 360,
    image: 'https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?w=400&h=400&fit=crop',
    isActive: true,
    isEnrolled: false,
  },
  {
    id: '22',
    name: 'Fatima Shaikh',
    service: 'Cleaner',
    role: 'Kitchen Cleaning Expert',
    tasksCompleted: 177,
    certifications: ['Kitchen Deep Clean', 'Hygiene Certified'],
    workStatus: 'assigned',
    rating: 4.8,
    reviews: 177,
    skills: ['Kitchen Deep Clean', 'Dust Removal'],
    hourlyRate: 290,
    image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop',
    isActive: true,
    isEnrolled: true,
    organisation: {
      orgName: "CleanPro India",
      gstin: "30BBBCD9988M1Z1",
      group: 10
    }
  },
  {
    id: '23',
    name: 'Rohit Shetty',
    service: 'Electrician',
    role: 'Home Automation Specialist',
    tasksCompleted: 204,
    certifications: ['Home Automation', 'Panel Upgrade Expert'],
    workStatus: 'assigned',
    rating: 4.9,
    reviews: 204,
    skills: ['Home Automation', 'Panel Upgrade'],
    hourlyRate: 480,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    isActive: true,
    isEnrolled: true,
  },
  {
    id: '24',
    name: 'Priya Mani',
    service: 'Chef',
    role: 'South Indian Chef',
    tasksCompleted: 88,
    certifications: ['Culinary Arts', 'Andhra Cuisine Expert'],
    workStatus: 'waiting',
    cuisineStyle: 'South',
    rating: 4.9,
    reviews: 88,
    skills: ['Andhra Cuisine', 'Meals'],
    hourlyRate: 500,
    image: 'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?w=400&h=400&fit=crop',
    isActive: true,
    isEnrolled: true,
  },
  {
    id: '25',
    name: 'Sajid Khan',
    service: 'Chef',
    role: 'North Indian Chef',
    tasksCompleted: 112,
    certifications: ['Culinary Arts', 'Tandoori Specialist'],
    workStatus: 'assigned',
    cuisineStyle: 'North',
    rating: 4.8,
    reviews: 112,
    skills: ['Tandoori', 'Mughlai'],
    hourlyRate: 600,
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop',
    isActive: true,
    isEnrolled: true,
  },
  {
    id: '26',
    name: 'Karthik Raja',
    service: 'Chef',
    role: 'Chettinad Specialist',
    tasksCompleted: 45,
    certifications: ['Culinary Arts', 'South Indian Cuisine'],
    workStatus: 'waiting',
    cuisineStyle: 'South',
    rating: 4.7,
    reviews: 45,
    skills: ['Chettinad', 'Dosa'],
    hourlyRate: 450,
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop',
    isActive: true,
    isEnrolled: true,
  },
];

const categories = ['All','Chef', 'Plumber', 'Cleaner', 'Electrician', 'Washer'];

const Freelancer = () => {
  const { colors } = useTheme();
    const styles = getStyles(colors);
const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('services');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
   const [chefStyle, setChefStyle] = useState<'North' | 'South'>('South');

 const getStatusUI = (status: WorkStatus) => {
    switch (status) {
      case 'inactive': return { label: 'Inactive (Not Logged In)', color: '#64748b', bg: '#f1f5f9' };
      case 'waiting': return { label: 'Waiting for work', color: '#22c55e', bg: '#f0fdf4' };
      case 'assigned': return { label: 'Work Assigned (In-Progress)', color: '#f59e0b', bg: '#fffbeb' };
      default: return { label: 'Unknown', color: '#000', bg: '#fff' };
    }
  };


const filteredProviders = serviceProviders.filter(provider => {
  const matchesCategory = selectedCategory === 'All' || provider.service === selectedCategory;
  const matchesChefStyle = selectedCategory === 'Chef' ? provider.cuisineStyle === chefStyle : true;


  const matchesSearch =
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.skills.some(skill =>
      skill.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const matchesActive = showOnlyActive ? provider.isActive : true;

  return (
     matchesCategory &&
    matchesChefStyle &&
    matchesSearch &&
    provider.isEnrolled &&
    matchesActive
  );
});



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <BackIcon size={24} color={colors.text } />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.textWhite]}>Freelancers</Text>
        <TouchableOpacity style={styles.menuButton}>
          <MenuIcon size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <View style={[styles.searchBar, isDarkMode && styles.searchBarDark]}>
            <SearchIcon size={20} color="#9da6b9" />
            <TextInput
              style={[styles.searchInput, isDarkMode && styles.textWhite]}
              placeholder="Search services or names"
              placeholderTextColor="#9da6b9"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
              style={[styles.filterButton, showOnlyActive && { backgroundColor: '#22c55e' }]}
              onPress={() => setShowOnlyActive(prev => !prev)}
            >
              <FilterIcon size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer} contentContainerStyle={styles.categoriesContent}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryChip, selectedCategory === category && styles.categoryChipActive, isDarkMode && selectedCategory !== category && styles.categoryChipDark]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive, isDarkMode && selectedCategory !== category && styles.categoryTextDark]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chef Style Toggle */}
      {selectedCategory === 'Chef' && (
        <View style={styles.chefToggleContainer}>
          <View style={[styles.toggleWrapper, isDarkMode && styles.toggleWrapperDark]}>
            <TouchableOpacity style={[styles.toggleBtn, chefStyle === 'South' && styles.toggleBtnActive]} onPress={() => setChefStyle('South')}>
              <Text style={[styles.toggleBtnText, chefStyle === 'South' && styles.toggleBtnTextActive]}>South Style</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toggleBtn, chefStyle === 'North' && styles.toggleBtnActive]} onPress={() => setChefStyle('North')}>
              <Text style={[styles.toggleBtnText, chefStyle === 'North' && styles.toggleBtnTextActive]}>North Style</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Service Providers List */}
      <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredProviders.length > 0 ? (
          filteredProviders.map((provider) => {
            const statusUI = getStatusUI(provider.workStatus);
            
            return (
              <View key={provider.id} style={[styles.card, isDarkMode && styles.cardDark]}>
                <Image source={{ uri: provider.image }} style={styles.cardImage} />
                
                <View style={styles.cardContent}>
                  {/* --- STATUS BADGE --- */}
                  <View style={[styles.statusBadge, { backgroundColor: statusUI.bg }]}>
                    <View style={[styles.statusDot, { backgroundColor: statusUI.color }]} />
                    <Text style={[styles.statusLabel, { color: statusUI.color }]}>{statusUI.label}</Text>
                  </View>

                  {/* Header Row */}
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.providerName, isDarkMode && styles.textWhite]}>{provider.name}</Text>
                      {/* --- ROLE --- */}
                      <Text style={styles.providerRole}>{provider.role}</Text>
                    </View>
                    <View style={[styles.ratingBadge, isDarkMode && styles.ratingBadgeDark]}>
                      <StarIcon size={14} color="#facc15" />
                      <Text style={[styles.ratingText, isDarkMode && styles.ratingTextDark]}>{provider.rating}</Text>
                      <Text style={styles.reviewCount}>({provider.reviews})</Text>
                    </View>
                  </View>

                  {/* --- TASKS COMPLETED --- */}
                  <View style={styles.tasksRow}>
                    <TaskIcon size={14} color="#64748b" />
                    <Text style={styles.tasksText}>{provider.tasksCompleted} Tasks Completed</Text>
                  </View>

                  {/* --- CERTIFICATIONS --- */}
                  {provider.certifications && provider.certifications.length > 0 && (
                    <View style={styles.certContainer}>
                      {provider.certifications.map((cert, idx) => (
                        <View key={idx} style={styles.certChip}>
                          <VerifyIcon size={12} color="#135bec" />
                          <Text style={styles.certText}>{cert}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Organisation Info */}
                     {/* --- UPDATED ORGANISATION SECTION --- */}
                {provider.organisation && (
                  <View style={styles.orgMainContainer}>
                    {/* Row 1: Org Name */}
                    <View style={styles.orgRow}>
                      <BuildingIcon size={14} color="#64748b" />
                      <Text style={styles.orgNameText}>{provider.organisation.orgName}</Text>
                    </View>
                    
                    {/* Row 2: GST & Group Beside it */}
                    <View style={[styles.orgRow, { marginLeft: 20, marginTop: 2 }]}>
                      <Text style={styles.orgSubText}>GST: {provider.organisation.gstin}</Text>
                      <View style={styles.orgVerticalDivider} />
                      <Text style={styles.orgSubText}>Group: {provider.organisation.group.toString()}</Text>
                    </View>
                  </View>
                )}

                  {/* Skills */}
                  <View style={styles.skillsContainer}>
                    {provider.skills.map((skill, index) => (
                      <View key={index} style={styles.skillBadge}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={[styles.divider, isDarkMode && styles.dividerDark]} />

                  {/* Footer */}
                  <View style={styles.cardFooter}>
                    <View>
                      <Text style={styles.startingAtText}>STARTING AT</Text>
                      <Text style={[styles.priceText, isDarkMode && styles.textWhite]}>₹{provider.hourlyRate}<Text style={styles.priceUnit}>/hr</Text></Text>
                    </View>
                    <TouchableOpacity 
                      style={[
                        styles.portfolioButton, 
                        provider.workStatus !== 'waiting' && { backgroundColor: '#cbd5e1', shadowOpacity: 0, elevation: 0 }
                      ]}
                      disabled={provider.workStatus !== 'waiting'}
                    >
                      <Text style={styles.portfolioButtonText}>
                        {provider.workStatus === 'waiting' ? 'Book Now' : 'Unavailable'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, isDarkMode && styles.textWhite]}>No service providers found</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, isDarkMode && styles.bottomNavDark]}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('home')}>
          <HomeIcon size={24} color={activeTab === 'home' ? '#135bec' : '#64748b'} filled={activeTab === 'home'} />
          <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('services')}>
          <GroupIcon size={24} color={activeTab === 'services' ? '#135bec' : '#64748b'} filled={activeTab === 'services'} />
          <Text style={[styles.navLabel, activeTab === 'services' && styles.navLabelActive]}>Services</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('messages')}>
          <MessageIcon size={24} color={activeTab === 'messages' ? '#135bec' : '#64748b'} filled={activeTab === 'messages'} />
          <Text style={[styles.navLabel, activeTab === 'messages' && styles.navLabelActive]}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('profile')}>
          <ProfileIcon size={24} color={activeTab === 'profile' ? '#135bec' : '#64748b'} filled={activeTab === 'profile'} />
          <Text style={[styles.navLabel, activeTab === 'profile' && styles.navLabelActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
    },

    headerDark: {
      backgroundColor: colors.background,
    },

    backButton: {
      width: 48,
      height: 48,
      justifyContent: "center",
    },

    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      flex: 1,
      textAlign: "center",
    },

    menuButton: {
      width: 48,
      height: 48,
      justifyContent: "center",
      alignItems: "flex-end",
    },

    textWhite: {
      color: colors.text,
    },

    searchContainer: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },

    searchWrapper: {
      flexDirection: "row",
      gap: 12,
    },

    searchBar: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      height: 48,
      elevation: 2,
    },

    searchBarDark: {
      backgroundColor: colors.surface,
    },

    searchInput: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      marginLeft: 8,
    },

    filterButton: {
      width: 48,
      height: 48,
      backgroundColor: colors.primary,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      elevation: 4,
    },

    categoriesContainer: {
      paddingVertical: 8,
      flexGrow: 0,
    },

    categoriesContent: {
      paddingHorizontal: 16,
      gap: 8,
      alignItems: "center",
    },

    categoryChip: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },

    categoryChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    categoryChipDark: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },

    categoryText: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.subText,
    },

    categoryTextActive: {
      color: colors.onPrimary ?? "#fff",
      fontWeight: "600",
    },

    categoryTextDark: {
      color: colors.subText,
    },

    listContainer: {
      flex: 1,
    },

    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 110,
      gap: 16,
    },

    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 16,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
    },

    cardDark: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },

    cardImage: {
      width: "100%",
      height: 180,
      backgroundColor: colors.border,
    },

    cardContent: {
      padding: 16,
    },

    /* --- STATUS --- */
    statusBadge: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
      marginBottom: 12,
      gap: 6,
      backgroundColor: colors.primary + "1A",
    },

    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.success,
    },

    statusLabel: {
      fontSize: 10,
      fontWeight: "800",
      textTransform: "uppercase",
      color: colors.primary,
    },

    providerRole: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: "600",
      marginTop: 1,
    },

    tasksRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 8,
    },

    tasksText: {
      fontSize: 12,
      color: colors.subText,
      fontWeight: "500",
    },

    certContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 12,
    },

    certChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: colors.primary + "14",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.primary + "33",
    },

    certText: {
      fontSize: 10,
      fontWeight: "700",
      color: colors.primary,
    },

    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },

    providerName: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },

    ratingBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.warning + "1A",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      gap: 2,
    },

    ratingBadgeDark: {
      backgroundColor: colors.warning + "33",
    },

    ratingText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.warning,
    },

    ratingTextDark: {
      color: colors.warning,
    },

    reviewCount: {
      fontSize: 10,
      color: colors.subText,
    },

    skillsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 12,
    },

    skillBadge: {
      backgroundColor: colors.primary + "1A",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },

    skillText: {
      fontSize: 10,
      fontWeight: "700",
      color: colors.primary,
      textTransform: "uppercase",
    },

    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 16,
    },

    dividerDark: {
      backgroundColor: colors.border,
    },

    cardFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    startingAtText: {
      fontSize: 10,
      fontWeight: "700",
      color: colors.subText,
    },

    priceText: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },

    priceUnit: {
      fontSize: 12,
      fontWeight: "400",
      color: colors.subText,
    },

    portfolioButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      minWidth: 120,
      alignItems: "center",
      elevation: 4,
    },

    portfolioButtonText: {
      color: colors.onPrimary ?? "#fff",
      fontSize: 14,
      fontWeight: "700",
    },

    bottomNav: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "space-around",
      backgroundColor: colors.surface + "F2",
      paddingTop: 12,
      paddingBottom: 24,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },

    bottomNavDark: {
      backgroundColor: colors.background + "F2",
      borderTopColor: colors.border,
    },

    navItem: {
      alignItems: "center",
      gap: 4,
    },

    navLabel: {
      fontSize: 10,
      fontWeight: "500",
      color: colors.subText,
    },

    navLabelActive: {
      fontWeight: "700",
      color: colors.primary,
    },

    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 60,
    },

    emptyText: {
      fontSize: 16,
      color: colors.subText,
      fontWeight: "500",
    },

    chefToggleContainer: {
      paddingHorizontal: 16,
      paddingBottom: 12,
    },

    toggleWrapper: {
      flexDirection: "row",
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },

    toggleWrapperDark: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },

    toggleBtn: {
      flex: 1,
      paddingVertical: 8,
      alignItems: "center",
      borderRadius: 8,
    },

    toggleBtnActive: {
      backgroundColor: colors.primary,
    },

    toggleBtnText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.subText,
    },

    toggleBtnTextActive: {
      color: colors.onPrimary ?? "#fff",
    },

    orgMainContainer: {
      marginTop: 10,
    },

    orgRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },

    orgNameText: {
      fontSize: 12,
      color: colors.subText,
      fontWeight: "600",
    },

    orgSubText: {
      fontSize: 11,
      color: colors.subText,
    },

    orgVerticalDivider: {
      width: 1,
      height: 10,
      backgroundColor: colors.border,
      marginHorizontal: 4,
    },
  });

export default Freelancer;