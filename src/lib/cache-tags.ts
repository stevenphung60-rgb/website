/**
 * Cache tags for Next.js caching system
 * Used to tag cached data and revalidate specific modules
 * Should only use 4 tags: PRODUCTS, SERVICES, PROJECTS, CONTACT, HERO
 */
export const CACHE_TAGS = {
	PRODUCTS: "products",
	SERVICES: "services",
	PROJECTS: "projects",
	CONTACT: "contact",
	HERO: "hero",
	PRODUCT_CATEGORIES: "productcategories",
	PROJECT_CATEGORIES: "projectcategories",
	HEROSERVICE: "heroservice",
	HEROPROJECT: "heroproject",
	HEROCONTACT: "herocontact",
	HEROABOUT: "heroabout",
	HEROBRAND: "herobrand"
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];
