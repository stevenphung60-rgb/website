export interface HeaderNavigationLeaf {
	id?: string;
	name: string;
	href: string;
	image?: string;
}

export interface HeaderNavigationChild {
	name: string;
	href: string;
	image?: string;
	products?: HeaderNavigationLeaf[];
}

export interface HeaderNavigationItem {
	name: string;
	href: string;
	children?: HeaderNavigationChild[];
}
