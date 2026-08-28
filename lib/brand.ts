export const brand = {
  name: "MintLife",
  tagline: "Life insurance made simple",
  phone: "(866) 912-7775",
  phoneHref: "tel:+18669127775",
  email: "hello@mintlife.example.com",
  address: "123 Evergreen Ave, Suite 400, Austin, TX 78701",
  socials: {
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
  },
} as const;

export type Brand = typeof brand;
