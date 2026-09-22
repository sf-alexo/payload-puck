import type { PuckData } from './puck.config'
import type {
  RevelHeroProps,
  MembershipRatesProps,
  ResidentTestimonialsProps,
  FloorPlansProps,
  LifestylePillarsProps,
  CulinaryFeatureProps,
  AmenitiesGridProps,
  CommunityGalleryProps,
  TourCTAProps,
  FAQAccordionProps,
} from './components/RevelBlocks'

export const revelEagleDefaults: {
  RevelHero: RevelHeroProps
  MembershipRates: MembershipRatesProps
  ResidentTestimonials: ResidentTestimonialsProps
  FloorPlans: FloorPlansProps
  LifestylePillars: LifestylePillarsProps
  CulinaryFeature: CulinaryFeatureProps
  AmenitiesGrid: AmenitiesGridProps
  CommunityGallery: CommunityGalleryProps
  TourCTA: TourCTAProps
  FAQAccordion: FAQAccordionProps
} = {
  RevelHero: {
    imageId: '',
    alt: 'Revel Eagle community',
    eyebrow: '',
    title: 'Revel Eagle',
    description:
      'Revel Eagle is a staple of modern, independent senior living in a quaint, riverside setting. This heart-warming independent living community is dedicated to the spirit of exploration and the details that make life grand.',
    primaryLabel: '',
    primaryHref: '',
    secondaryLabel: '',
    secondaryHref: '',
  },
  MembershipRates: {
    heading: 'Rates Starting at $3,955',
    description:
      'At Revel you have everything you need to live truly independent and thrive in this empowering community.',
    price: '$3,955',
    inclusions: [
      { text: 'Beautifully appointed senior apartment homes' },
      { text: 'Luxurious amenities' },
      { text: 'Monthly dining credits' },
      { text: 'Revel Travel Club access' },
      { text: 'Group and private transportation services' },
      { text: '24-hour concierge' },
      { text: 'Utilities' },
      { text: 'Weekly housekeeping' },
      { text: 'Maintenance' },
    ],
    buttonLabel: 'View Floor Plans',
    buttonHref: '/floorplans',
    images: [
      { imageId: '', alt: 'Revel Eagle lobby' },
      { imageId: '', alt: 'Revel Eagle apartment' },
      { imageId: '', alt: 'Revel Eagle transportation' },
      { imageId: '', alt: 'Revel Eagle amenities' },
      { imageId: '', alt: 'Revel Eagle community life' },
      { imageId: '', alt: 'Revel Eagle lifestyle' },
    ],
  },
  ResidentTestimonials: {
    heading: 'What Our Residents Are Saying',
    rating: 4.8,
    reviewCount: 158,
    testimonials: [
      {
        quote:
          'Gorgeous Community & Location! Not only that, but the staff and residents are so kind, engaged, caring, and wonderful!',
        author: 'Hez W, Revel Eagle',
      },
      {
        quote:
          'The management staff is top-notch—very responsive to needs, requests and new ideas. The cleaners do a good job once a week for the apartments, and the public areas are always clean. Great food in the dining room. Activities are abundant, fun and entertaining. We are very happy here!',
        author: 'Anonymous, Revel Eagle',
      },
      {
        quote:
          'Revel Eagle is a wonderful place to live. I have lived here for 4 years and can\'t imagine living anywhere else.',
        author: 'Beverly D, Revel Eagle',
      },
    ],
  },
  FloorPlans: {
    heading: 'Floor Plans',
    description:
      'Our thoughtful senior apartment homes are designed with you and your active lifestyle in mind.',
    buttonLabel: 'View All',
    buttonHref: '/floorplans',
    images: [
      { imageId: '', alt: 'Open floor plan' },
      { imageId: '', alt: 'Gourmet kitchen' },
      { imageId: '', alt: 'Revel Eagle apartment interior' },
      { imageId: '', alt: 'Revel Eagle living room' },
    ],
  },
  LifestylePillars: {
    heading: 'Lifestyle',
    description:
      'The Revel lifestyle is built around pillars of wellness that support healthy, well-rounded aging. Learn about these pillars and how the Revel experience is catered uniquely for you.',
    pillars: [
      {
        imageId: '',
        alt: 'Spiritual wellness',
        title: 'SPIRITUAL',
        description: 'Programs and experiences designed around this pillar of wellness.',
      },
      {
        imageId: '',
        alt: 'Intellectual wellness',
        title: 'INTELLECTUAL',
        description: 'Programs and experiences designed around this pillar of wellness.',
      },
      {
        imageId: '',
        alt: 'Physical wellness',
        title: 'PHYSICAL',
        description: 'Programs and experiences designed around this pillar of wellness.',
      },
      {
        imageId: '',
        alt: 'Social wellness',
        title: 'SOCIAL',
        description: 'Programs and experiences designed around this pillar of wellness.',
      },
      {
        imageId: '',
        alt: 'Art wellness',
        title: 'ART',
        description: 'Programs and experiences designed around this pillar of wellness.',
      },
      {
        imageId: '',
        alt: 'Travel wellness',
        title: 'TRAVEL',
        description: 'Programs and experiences designed around this pillar of wellness.',
      },
    ],
  },
  CulinaryFeature: {
    heading: 'Culinary',
    description:
      'Our dining experiences are sure to delight. Complete with seasonal menus, exceptional service, and flexible dining options, you choose when and where you want to eat—whether it’s in your home, on the go, or in one of our restaurants. Nothing is off the table at Revel.',
    buttonLabel: 'Learn More',
    buttonHref: '/culinary',
    images: [
      { imageId: '', alt: 'Revel dining experience' },
      { imageId: '', alt: 'Chef-prepared cuisine' },
    ],
  },
  AmenitiesGrid: {
    heading: 'Amenities',
    description:
      'Our premium amenities make every moment shine, offering the experience of an all-inclusive retirement community where you can eat, play, sweat, relax, and thrive in a variety of ways.',
    amenities: [
      { imageId: '', alt: 'The Salon', name: 'The Salon' },
      { imageId: '', alt: 'Theater', name: 'Theater' },
      { imageId: '', alt: 'Fitness Studio', name: 'Fitness Studio' },
      { imageId: '', alt: 'The Spa', name: 'The Spa' },
      { imageId: '', alt: 'Revel Room', name: 'Revel Room' },
      { imageId: '', alt: 'Pickleball Court', name: 'Pickleball Court' },
    ],
  },
  CommunityGallery: {
    heading: 'Gallery',
    description:
      'Revel is an all-inclusive retreat by your design. Get a glimpse of what life is like here.',
    buttonLabel: 'View Gallery',
    buttonHref: '/gallery',
    images: [
      { imageId: '', alt: 'Community living room' },
      { imageId: '', alt: 'Pet-friendly community' },
      { imageId: '', alt: 'Outdoor bridge' },
      { imageId: '', alt: 'Community gathering' },
      { imageId: '', alt: 'Social club' },
      { imageId: '', alt: 'Revel Eagle exterior' },
    ],
  },
  TourCTA: {
    imageId: '',
    alt: 'Tour Revel Eagle',
    heading: 'Schedule a Tour',
    description:
      'The best way to experience Revel is by seeing it for yourself. Send us your information and we’ll invite you to tour our community, enjoy a meal, try an activity, and even have an overnight stay.',
    buttonLabel: 'Schedule Your Visit',
    buttonHref: '/contact',
  },
  FAQAccordion: {
    heading: 'Frequently Asked Questions',
    items: [
      {
        question: 'What floor plans are available, and can I schedule a tour?',
        answer:
          'Revel Eagle offers a variety of thoughtfully designed studio, one-bedroom, and two-bedroom apartment homes with modern finishes, open-concept layouts, gourmet kitchens, and in-home washers and dryers. Whether you’re looking for a cozy retreat or extra space for entertaining, there are floor plans designed to fit your lifestyle. The best way to experience Revel Eagle is in person. Schedule a tour to explore available apartment homes and let us treat you to a meal at our modern-American restaurant.',
      },
      {
        question: 'How does dining work, and are meals included?',
        answer:
          'Dining at Revel is built around flexibility, choice, and exceptional service. Resident membership includes monthly dining credits that can be used throughout the community’s dining venues, including Ovation, our modern-American restaurant, and The Social Club, a spirited pub. Residents enjoy chef-prepared meals, seasonal menus, and the freedom to choose when and where they dine, whether in a restaurant setting or in the comfort of their home.',
      },
      {
        question: 'What activities, wellness programs, and events are available for residents?',
        answer:
          'Life at Revel is designed around wellness, connection, and lifelong discovery. Residents enjoy fitness classes, social events, educational opportunities, creative arts programming, live entertainment, cultural outings, volunteer opportunities, and travel experiences. Community amenities at Revel Eagle include a fitness studio, creative studio, theater, pickleball court, lounges, outdoor gathering spaces, and more. Whether you’re pursuing a favorite hobby or trying something new, there are countless ways to stay active and engaged.',
      },
      {
        question: 'Is transportation available for appointments, errands, and outings?',
        answer:
          'Yes. Revel Eagle includes both group and private transportation services as part of resident membership. Whether you’re heading to medical appointments, shopping destinations, local restaurants, or community outings, transportation is available to help make getting around convenient and stress-free. Concierge team members can also assist with coordinating transportation needs.',
      },
      {
        question: 'Is Revel Eagle a pet-friendly community?',
        answer:
          'Absolutely. Revel welcomes pets because they are part of the family. The community features pet-friendly outdoor spaces, including a dog park, making it easy for residents and their companions to enjoy an active lifestyle together. Contact the community team for current pet guidelines.',
      },
      {
        question: 'What is included in the monthly cost?',
        answer:
          'A Revel Eagle resident membership includes much more than an apartment home. Monthly pricing includes utilities, weekly housekeeping, maintenance, monthly dining credits, group and private transportation services, 24-hour concierge services, access to resort-style amenities, lifestyle programming, and Revel Travel Club membership. It’s designed to provide a maintenance-free lifestyle so residents can spend more time enjoying what matters most.',
      },
    ],
  },
}

export const revelEagleLayout: PuckData = {
  root: { props: { title: 'Revel Eagle' } },
  content: [
    {
      type: 'RevelHero',
      props: { id: 'revel-eagle-hero', ...revelEagleDefaults.RevelHero },
    },
    {
      type: 'MembershipRates',
      props: { id: 'revel-eagle-membership-rates', ...revelEagleDefaults.MembershipRates },
    },
    {
      type: 'ResidentTestimonials',
      props: {
        id: 'revel-eagle-resident-testimonials',
        ...revelEagleDefaults.ResidentTestimonials,
      },
    },
    {
      type: 'FloorPlans',
      props: { id: 'revel-eagle-floor-plans', ...revelEagleDefaults.FloorPlans },
    },
    {
      type: 'LifestylePillars',
      props: { id: 'revel-eagle-lifestyle-pillars', ...revelEagleDefaults.LifestylePillars },
    },
    {
      type: 'CulinaryFeature',
      props: { id: 'revel-eagle-culinary-feature', ...revelEagleDefaults.CulinaryFeature },
    },
    {
      type: 'AmenitiesGrid',
      props: { id: 'revel-eagle-amenities', ...revelEagleDefaults.AmenitiesGrid },
    },
    {
      type: 'CommunityGallery',
      props: { id: 'revel-eagle-gallery', ...revelEagleDefaults.CommunityGallery },
    },
    {
      type: 'TourCTA',
      props: { id: 'revel-eagle-tour-cta', ...revelEagleDefaults.TourCTA },
    },
    {
      type: 'FAQAccordion',
      props: { id: 'revel-eagle-faq', ...revelEagleDefaults.FAQAccordion },
    },
  ],
}
