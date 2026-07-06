/**
 * Cache tags for Next.js caching system
 * Used to tag cached data and revalidate specific modules
 */
export const CACHE_TAGS = {
	PRODUCTS: "products",
	SERVICES: "services",
	PROJECTS: "projects",
	CONTACT: "contact",

	HERO: "hero",
	HEROBRAND: "herobrand",
	HEROABOUT: "heroabout",
	HEROSERVICE: "heroservice",
	HEROPROJECT: "heroproject",
	HEROCONTACT: "herocontact",

	PRODUCT_CATEGORIES: "productcategories",
	PROJECT_CATEGORIES: "projectcategories",

	APPEARANCE: "appearance",
	BLOG_POSTS: "blogposts",
	BLOG_CATEGORIES: "blogcategories",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];
