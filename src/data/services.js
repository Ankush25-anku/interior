import {
  PiHouseLine,
  PiBuildings,
  PiCookingPot,
  PiBed,
  PiBriefcase,
  PiBuildingOffice,
  PiHammer,
  PiArmchair,
} from "react-icons/pi";

const IMG = {
  kitchen: "/images/services/modular-kitchen.webp",
  wardrobe: "/images/services/wardrobe.webp",
  ceiling: "/images/services/ceiling.webp",
  renovation: "/images/services/renovation.webp",
};

export const SERVICES = [
  {
    title: "Residential Interiors",
    category: "Residential",
    description: "Complete home interiors composed around how you actually live.",
    Icon: PiHouseLine,
    image: IMG.wardrobe,
  },
  {
    title: "Luxury Villa Design",
    category: "Residential",
    description: "Expansive villa interiors composed with architectural precision.",
    Icon: PiBuildings,
    image: IMG.renovation,
  },
  {
    title: "Modular Kitchen Design",
    category: "Residential",
    description: "Ergonomic, chef-grade kitchens tailored to your rituals.",
    Icon: PiCookingPot,
    image: IMG.kitchen,
  },
  {
    title: "Bedroom Design",
    category: "Residential",
    description: "Serene, restorative bedrooms built for rest and reflection.",
    Icon: PiBed,
    image: IMG.ceiling,
  },
  {
    title: "Commercial Interiors",
    category: "Commercial",
    description: "Considered commercial spaces that express a brand through architecture.",
    Icon: PiBriefcase,
    image: IMG.renovation,
  },
  {
    title: "Office Spaces",
    category: "Commercial",
    description: "Focused, elegant workspaces engineered for clarity and calm.",
    Icon: PiBuildingOffice,
    image: IMG.wardrobe,
  },
  {
    title: "Renovation",
    category: "Renovation",
    description: "Full-scale transformations, structure to finish, without compromise.",
    Icon: PiHammer,
    image: IMG.renovation,
  },
  {
    title: "Custom Furniture",
    category: "Furniture",
    description: "Bespoke, hand-finished pieces designed to fit your space exactly.",
    Icon: PiArmchair,
    image: IMG.wardrobe,
  },
];
