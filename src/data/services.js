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
    desc: "Complete home interiors composed around how you actually live.",
    Icon: PiHouseLine,
    image: IMG.wardrobe,
  },
  {
    title: "Luxury Villa Design",
    desc: "Expansive villa interiors composed with architectural precision.",
    Icon: PiBuildings,
    image: IMG.renovation,
  },
  {
    title: "Modular Kitchen Design",
    desc: "Ergonomic, chef-grade kitchens tailored to your rituals.",
    Icon: PiCookingPot,
    image: IMG.kitchen,
  },
  {
    title: "Bedroom Design",
    desc: "Serene, restorative bedrooms built for rest and reflection.",
    Icon: PiBed,
    image: IMG.ceiling,
  },
  {
    title: "Commercial Interiors",
    desc: "Considered commercial spaces that express a brand through architecture.",
    Icon: PiBriefcase,
    image: IMG.renovation,
  },
  {
    title: "Office Spaces",
    desc: "Focused, elegant workspaces engineered for clarity and calm.",
    Icon: PiBuildingOffice,
    image: IMG.wardrobe,
  },
  {
    title: "Renovation",
    desc: "Full-scale transformations, structure to finish, without compromise.",
    Icon: PiHammer,
    image: IMG.renovation,
  },
  {
    title: "Custom Furniture",
    desc: "Bespoke, hand-finished pieces designed to fit your space exactly.",
    Icon: PiArmchair,
    image: IMG.wardrobe,
  },
];
