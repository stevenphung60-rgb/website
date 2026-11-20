import { PageLoader } from "src/components/page-loader";

/**
 * Route loading state: the shared loader, compact for the admin area
 */
export default function Loading() {
	return <PageLoader variant="admin" />;
}
