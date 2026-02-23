// UrbanHire Service Categories - Central configuration
// Each category has: id (matches DB), name, icon (lucide-react), color (tailwind), skills, skillLabel

export const SERVICE_CATEGORIES = [
  {
    id: 'cooking',
    name: 'Cooking & Chef',
    icon: 'ChefHat',
    color: 'orange',
    skills: ['Indian', 'Italian', 'Chinese', 'Japanese', 'Mexican', 'French', 'Thai', 'Mediterranean', 'American', 'Korean', 'Middle Eastern', 'African', 'Caribbean', 'Fusion', 'Continental', 'Other'],
    skillLabel: 'Cuisines',
    description: 'Personal chefs, catering, meal prep',
  },
  {
    id: 'cleaning',
    name: 'Home Cleaning',
    icon: 'SprayCan',
    color: 'sky',
    skills: ['Deep Cleaning', 'Regular Cleaning', 'Kitchen Cleaning', 'Bathroom Cleaning', 'Carpet Cleaning', 'Sofa Cleaning', 'Window Cleaning', 'Post-Construction', 'Move-in/Move-out', 'Office Cleaning'],
    skillLabel: 'Specialties',
    description: 'Deep clean, regular, kitchen, bathroom',
  },
  {
    id: 'babysitting',
    name: 'Babysitting & Childcare',
    icon: 'Baby',
    color: 'pink',
    skills: ['Infant Care', 'Toddler Care', 'After-School Care', 'Overnight Nanny', 'Tutoring', 'Special Needs Care', 'First Aid Certified', 'Montessori Trained'],
    skillLabel: 'Specialties',
    description: 'Nanny, daycare, tutoring, child supervision',
  },
  {
    id: 'elder_care',
    name: 'Elder Care',
    icon: 'HeartHandshake',
    color: 'rose',
    skills: ['Companion Care', 'Nursing Care', 'Physiotherapy', 'Dementia Care', 'Post-Surgery Care', 'Medication Management', 'Mobility Assistance', 'Night Care'],
    skillLabel: 'Specialties',
    description: 'Companion care, nursing, physiotherapy',
  },
  {
    id: 'massage_spa',
    name: 'Massage & Spa',
    icon: 'Flower2',
    color: 'purple',
    skills: ['Swedish Massage', 'Deep Tissue', 'Thai Massage', 'Aromatherapy', 'Head Massage', 'Foot Reflexology', 'Hot Stone', 'Sports Massage', 'Facial Treatment', 'Body Scrub'],
    skillLabel: 'Therapies',
    description: 'Body massage, facial, spa treatments',
  },
  {
    id: 'salon_beauty',
    name: 'Salon & Beauty',
    icon: 'Scissors',
    color: 'fuchsia',
    skills: ['Haircut & Styling', 'Hair Coloring', 'Bridal Makeup', 'Party Makeup', 'Threading', 'Waxing', 'Manicure', 'Pedicure', 'Mehendi', 'Hair Spa'],
    skillLabel: 'Services',
    description: 'Haircut, makeup, threading, waxing',
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    icon: 'Wrench',
    color: 'blue',
    skills: ['Leak Repair', 'Pipe Fitting', 'Drain Cleaning', 'Water Heater', 'Toilet Repair', 'Tap/Faucet', 'Water Tank', 'Sewage', 'Bathroom Fitting', 'Kitchen Plumbing'],
    skillLabel: 'Specialties',
    description: 'Leak repair, pipe fitting, drain cleaning',
  },
  {
    id: 'electrical',
    name: 'Electrical',
    icon: 'Zap',
    color: 'yellow',
    skills: ['Wiring', 'Switch/Socket', 'Fan Installation', 'AC Installation', 'Light Fixtures', 'Short Circuit', 'Inverter/UPS', 'MCB/Fuse', 'CCTV Installation', 'Doorbell'],
    skillLabel: 'Specialties',
    description: 'Wiring, fixtures, AC, short circuit repair',
  },
  {
    id: 'carpentry',
    name: 'Carpentry',
    icon: 'Hammer',
    color: 'amber',
    skills: ['Furniture Repair', 'Furniture Assembly', 'Door/Window', 'Custom Woodwork', 'Cabinet Making', 'Bed Repair', 'Shelf Installation', 'Wood Polishing', 'Modular Kitchen', 'Wardrobe'],
    skillLabel: 'Specialties',
    description: 'Furniture repair, assembly, custom work',
  },
  {
    id: 'painting',
    name: 'Painting',
    icon: 'Paintbrush',
    color: 'teal',
    skills: ['Interior Painting', 'Exterior Painting', 'Waterproofing', 'Texture Painting', 'Wood Painting', 'Metal Painting', 'Wall Putty', 'POP Work', 'Wallpaper', 'Stencil Art'],
    skillLabel: 'Specialties',
    description: 'Interior, exterior, waterproofing, texture',
  },
  {
    id: 'pest_control',
    name: 'Pest Control',
    icon: 'Bug',
    color: 'lime',
    skills: ['Cockroach Control', 'Termite Treatment', 'Bed Bug Treatment', 'Mosquito Control', 'Rodent Control', 'Ant Control', 'Lizard Control', 'Wood Borer', 'General Fumigation'],
    skillLabel: 'Treatments',
    description: 'Cockroach, termite, bed bug control',
  },
  {
    id: 'appliance_repair',
    name: 'Appliance Repair',
    icon: 'Settings',
    color: 'slate',
    skills: ['AC Repair', 'Washing Machine', 'Refrigerator', 'Microwave', 'Geyser/Water Heater', 'TV', 'Chimney', 'Dishwasher', 'RO/Water Purifier', 'Air Cooler'],
    skillLabel: 'Appliances',
    description: 'AC, washing machine, refrigerator repair',
  },
  {
    id: 'fitness_yoga',
    name: 'Fitness & Yoga',
    icon: 'Dumbbell',
    color: 'green',
    skills: ['Personal Training', 'Yoga', 'Zumba', 'Pilates', 'CrossFit', 'Weight Training', 'Cardio', 'Martial Arts', 'Dance Fitness', 'Prenatal Yoga'],
    skillLabel: 'Disciplines',
    description: 'Personal trainer, yoga, Zumba, pilates',
  },
  {
    id: 'pet_care',
    name: 'Pet Care',
    icon: 'PawPrint',
    color: 'emerald',
    skills: ['Dog Walking', 'Pet Grooming', 'Pet Sitting', 'Vet at Home', 'Pet Training', 'Pet Boarding', 'Pet Taxi', 'Fish Tank Maintenance'],
    skillLabel: 'Services',
    description: 'Dog walking, grooming, pet sitting',
  },
  {
    id: 'driving',
    name: 'Driving',
    icon: 'Car',
    color: 'indigo',
    skills: ['Personal Driver', 'Outstation Driver', 'Delivery Driver', 'Chauffeur', 'Airport Transfer', 'Wedding Driver', 'Truck Driver', 'Two-Wheeler Delivery'],
    skillLabel: 'Services',
    description: 'Personal driver, delivery, chauffeur',
  },
  {
    id: 'security',
    name: 'Security',
    icon: 'Shield',
    color: 'red',
    skills: ['Security Guard', 'Bouncer', 'Event Security', 'Night Watch', 'CCTV Monitoring', 'Bodyguard', 'Gated Community', 'Office Security'],
    skillLabel: 'Roles',
    description: 'Guard, bouncer, event security',
  },
  {
    id: 'gardening',
    name: 'Gardening',
    icon: 'Flower',
    color: 'green',
    skills: ['Lawn Care', 'Landscaping', 'Plant Maintenance', 'Tree Trimming', 'Garden Setup', 'Terrace Garden', 'Indoor Plants', 'Irrigation Setup'],
    skillLabel: 'Services',
    description: 'Lawn care, landscaping, plant maintenance',
  },
  {
    id: 'laundry',
    name: 'Laundry',
    icon: 'Shirt',
    color: 'cyan',
    skills: ['Wash & Fold', 'Dry Cleaning', 'Ironing', 'Stain Removal', 'Curtain Cleaning', 'Shoe Cleaning', 'Leather Care', 'Premium Garments'],
    skillLabel: 'Services',
    description: 'Wash & fold, dry cleaning, ironing',
  },
  {
    id: 'moving_packing',
    name: 'Moving & Packing',
    icon: 'Truck',
    color: 'orange',
    skills: ['Local Shifting', 'Packing Services', 'Loading/Unloading', 'Furniture Disassembly', 'Vehicle Transport', 'Storage', 'Office Relocation', 'International Moving'],
    skillLabel: 'Services',
    description: 'Local shifting, packing, loading/unloading',
  },
  {
    id: 'event_services',
    name: 'Event Services',
    icon: 'PartyPopper',
    color: 'violet',
    skills: ['Waiter/Steward', 'Bartender', 'DJ', 'Photographer', 'Videographer', 'Decorator', 'Anchor/Emcee', 'Valet Parking', 'Sound/Light Tech'],
    skillLabel: 'Roles',
    description: 'Waiter, bartender, DJ, photographer',
  },
]

// Quick lookup map: category id → category object
export const CATEGORY_MAP = Object.fromEntries(
  SERVICE_CATEGORIES.map(c => [c.id, c])
)

// Get category by id
export function getCategory(id) {
  return CATEGORY_MAP[id] || null
}

// Get only active categories (for public-facing pages)
export function getActiveCategories() {
  return SERVICE_CATEGORIES.filter(c => c)
}

// Color utilities for each category
export const CATEGORY_COLORS = {
  orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', icon: 'text-orange-500', light: 'bg-orange-50' },
  sky: { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200', icon: 'text-sky-500', light: 'bg-sky-50' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200', icon: 'text-pink-500', light: 'bg-pink-50' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200', icon: 'text-rose-500', light: 'bg-rose-50' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', icon: 'text-purple-500', light: 'bg-purple-50' },
  fuchsia: { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700', border: 'border-fuchsia-200', icon: 'text-fuchsia-500', light: 'bg-fuchsia-50' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: 'text-blue-500', light: 'bg-blue-50' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', icon: 'text-yellow-500', light: 'bg-yellow-50' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', icon: 'text-amber-500', light: 'bg-amber-50' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200', icon: 'text-teal-500', light: 'bg-teal-50' },
  lime: { bg: 'bg-lime-100', text: 'text-lime-700', border: 'border-lime-200', icon: 'text-lime-500', light: 'bg-lime-50' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', icon: 'text-slate-500', light: 'bg-slate-50' },
  green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: 'text-green-500', light: 'bg-green-50' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', icon: 'text-emerald-500', light: 'bg-emerald-50' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200', icon: 'text-indigo-500', light: 'bg-indigo-50' },
  red: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: 'text-red-500', light: 'bg-red-50' },
  cyan: { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200', icon: 'text-cyan-500', light: 'bg-cyan-50' },
  violet: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200', icon: 'text-violet-500', light: 'bg-violet-50' },
}

export function getCategoryColors(colorName) {
  return CATEGORY_COLORS[colorName] || CATEGORY_COLORS.slate
}
