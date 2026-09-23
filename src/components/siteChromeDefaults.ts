// Defaults for the Header / Footer globals. Used to seed the globals on first
// boot (payload.config.ts onInit) and as fallbacks when fields are empty.

export type ChromeLink = { label: string; url: string }

export type ChromeNavItem = ChromeLink & { children?: ChromeLink[] }

export const HEADER_DEFAULTS = {
  navItems: [
    { label: 'Floor Plans', url: '/floorplans' },
    {
      label: 'EXPERIENCE',
      url: '',
      children: [
        { label: 'Lifestyle', url: '/lifestyle' },
        { label: 'Amenities', url: '/amenities' },
        { label: 'Culinary', url: '/culinary' },
        { label: 'Wellness', url: 'https://revelcommunities.com/revel-living/wellness/' },
      ],
    },
    { label: 'Gallery', url: '/gallery' },
    { label: 'Events', url: '/events' },
    { label: 'Offers', url: '/offers' },
    { label: 'Contact', url: '/contact-us' },
  ] as ChromeNavItem[],
  phone: '(208) 486-0733',
  ctaLabel: 'Book A Tour',
  ctaUrl: '/contact-us',
  mobileNavItems: [
    {
      label: 'Residents',
      url: 'https://revel-eagle-rentcafewebsite.securecafe.com/residentservices/revel-eagle/userlogin.aspx',
    },
    {
      label: 'Apply',
      url: 'https://revel-eagle-rentcafewebsite.securecafe.com/onlineleasing/revel-eagle/guestlogin.aspx',
    },
    {
      label: 'Careers',
      url: 'https://recruiting.paylocity.com/Recruiting/Jobs/All/5b83c721-5bd5-4da1-94bf-8d219d696f74/The-Wolff-Resident-Experience-Company?location=All%20Locations&department=All%20Departments',
    },
    { label: 'Revel Home', url: 'https://revelcommunities.com/' },
    { label: 'All Communities', url: 'https://revelcommunities.com/communities/' },
  ] as ChromeLink[],
}

export const FOOTER_DEFAULTS = {
  logoUrl: 'https://revelcommunities.com/',
  address: '745 E Riverside Dr\nEagle, ID 83616',
  phone: '(208) 486-0733',
  socialLinks: [
    { platform: 'facebook', url: 'https://www.facebook.com/reveleagle/' },
    { platform: 'instagram', url: 'https://www.instagram.com/reveleagle/' },
  ] as { platform: string; url: string }[],
  communityLinks: [
    { label: 'Arizona', url: 'https://revelcommunities.com/communities/#arizona' },
    { label: 'California', url: 'https://revelcommunities.com/communities/#california' },
    { label: 'Colorado', url: 'https://revelcommunities.com/communities/#colorado' },
    { label: 'Idaho', url: 'https://revelcommunities.com/communities/#idaho' },
    { label: 'Nevada', url: 'https://revelcommunities.com/communities/#nevada' },
    { label: 'Washington', url: 'https://revelcommunities.com/communities/#washington' },
  ] as ChromeLink[],
  policyLinks: [
    { label: 'Terms & Conditions', url: 'https://revelcommunities.com/privacy-policy/' },
    { label: 'Privacy Policy', url: 'https://revelcommunities.com/privacy-policy/' },
  ] as ChromeLink[],
  privacyText: 'Your California Privacy Choices',
  privacyLinkLabel: 'California Notice at Collection',
  privacyLinkUrl: 'https://revelcommunities.com/privacy-policy/#_Toc123151318',
}

export const telHref = (phone?: string | null): string =>
  `tel:+${(phone ?? '').replace(/[^\d]/g, '')}`
