/**
 * One-time data migration for moving the old deployed NH website DB to the new source schema.
 *
 * Run after pointing MONGODB_URI/MONGODB_DBNAME to the OLD production database.
 * This script is idempotent: running it more than once should not duplicate categories.
 *
 * Usage:
 *   node scripts/migrate-old-db-to-current-schema.mjs
 */

import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME || "nghiep-hung-website";

if (!mongoUri) {
	throw new Error("Missing MONGODB_URI");
}

function slugify(value = "") {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/đ/g, "d")
		.replace(/Đ/g, "d")
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

function localized(value, fallback = "") {
	if (typeof value === "string") {
		return { vi: value, en: value };
	}

	if (value && typeof value === "object") {
		return {
			vi: value.vi || value.en || fallback,
			en: value.en || value.vi || fallback,
		};
	}

	return { vi: fallback, en: fallback };
}

function makeStableCategoryId(prefix, name) {
	const text = name.vi || name.en || "khac";
	return `${prefix}-${slugify(text) || "khac"}`;
}

function makeProductCode(product, index) {
	if (product.code) return product.code;
	const name = product.name?.vi || product.name?.en || product.id || `product-${index + 1}`;
	const base = slugify(name).replace(/-/g, "").toUpperCase().slice(0, 10);
	return base || `PRODUCT${String(index + 1).padStart(3, "0")}`;
}

async function migrateProductCategories(db) {
	const products = await db.collection("products").find({}).toArray();
	const categories = new Map();

	for (const product of products) {
		if (product.categoryId) continue;
		const oldCategory = localized(product.category, "Khác");
		const id = makeStableCategoryId("pc", oldCategory);
		categories.set(id, {
			id,
			name: oldCategory,
			createdAt: product.createdAt || new Date(),
			updatedAt: new Date(),
		});
	}

	for (const category of categories.values()) {
		await db.collection("productCategories").updateOne(
			{ id: category.id },
			{ $setOnInsert: category, $set: { updatedAt: new Date() } },
			{ upsert: true },
		);
	}

	let index = 0;
	for (const product of products) {
		const $set = {};
		if (!product.categoryId) {
			const oldCategory = localized(product.category, "Khác");
			$set.categoryId = makeStableCategoryId("pc", oldCategory);
		}
		if (!product.code) {
			$set.code = makeProductCode(product, index);
		}

		if (Object.keys($set).length > 0) {
			await db.collection("products").updateOne({ _id: product._id }, { $set });
		}
		index += 1;
	}

	console.log(`Product migration done: ${products.length} products, ${categories.size} new category candidates.`);
}

async function migrateProjectCategories(db) {
	const projects = await db.collection("projects").find({}).toArray();
	const categories = new Map();

	for (const project of projects) {
		if (project.categoryId) continue;
		const oldCategory = localized(project.category, "Khác");
		const id = makeStableCategoryId("prc", oldCategory);
		categories.set(id, {
			id,
			name: oldCategory,
			createdAt: project.createdAt || new Date(),
			updatedAt: new Date(),
		});
	}

	for (const category of categories.values()) {
		await db.collection("projectCategories").updateOne(
			{ id: category.id },
			{ $setOnInsert: category, $set: { updatedAt: new Date() } },
			{ upsert: true },
		);
	}

	for (const project of projects) {
		const $set = {};

		if (!project.categoryId) {
			const oldCategory = localized(project.category, "Khác");
			$set.categoryId = makeStableCategoryId("prc", oldCategory);
		}
		if (typeof project.location === "string") {
			$set.location = localized(project.location);
		}
		if (typeof project.year === "string") {
			$set.year = localized(project.year);
		}

		if (Object.keys($set).length > 0) {
			await db.collection("projects").updateOne({ _id: project._id }, { $set });
		}
	}

	console.log(`Project migration done: ${projects.length} projects, ${categories.size} new category candidates.`);
}

async function migrateContactInfo(db) {
	const existing = await db.collection("contactInfo").findOne({});
	const now = new Date();

	const defaults = {
		id: "contact-info",
		phone1: existing?.phone1 || "",
		phone2: existing?.phone2 || "",
		email1: existing?.email1 || "",
		email2: existing?.email2 || "",
		consultanttitle: existing?.consultanttitle || {
			vi: "Kết nối cùng Nghiệp Hưng",
			en: "Stay connected with Nghiep Hung",
		},
		consultantsubtitle: existing?.consultantsubtitle || {
			vi: "Nhận tư vấn",
			en: "Ask for help",
		},
		consultantdescription: existing?.consultantdescription || {
			vi: "Đồng hành cùng Nghiệp Hưng để lựa chọn giải pháp ống gió, quạt và phụ kiện HVAC phù hợp cho từng công trình.",
			en: "Connect with Nghiep Hung to find the right air ducts, fans and HVAC accessories for your project.",
		},
		consultantimage: existing?.consultantimage || { url: "" },
		footerlogo: existing?.footerlogo || { url: "" },
		footercompanyname: existing?.footercompanyname || {
			vi: "Công ty TNHH Nghiệp Hưng",
			en: "Nghiep Hung Company Limited",
		},
		footercompanydescription: existing?.footercompanydescription || {
			vi: "Nghiệp Hưng chuyên sản xuất và cung cấp ống gió, quạt công nghiệp cùng phụ kiện HVAC.",
			en: "Nghiep Hung manufactures and supplies air ducts, industrial fans and HVAC accessories.",
		},
		workingHours: existing?.workingHours || { vi: "", en: "" },
		socialMedia: existing?.socialMedia || [],
		createdAt: existing?.createdAt || now,
		updatedAt: now,
	};

	if (existing?._id) {
		await db.collection("contactInfo").updateOne({ _id: existing._id }, { $set: defaults });
	} else {
		await db.collection("contactInfo").insertOne(defaults);
	}

	console.log("Contact info migration done.");
}

async function ensureSiteAppearance(db) {
	await db.collection("siteAppearance").updateOne(
		{ id: "site-appearance" },
		{
			$setOnInsert: {
				id: "site-appearance",
				fontPresetId: "current",
				headingFontId: "montserrat",
				bodyFontId: "roboto",
				createdAt: new Date(),
			},
			$set: { updatedAt: new Date() },
		},
		{ upsert: true },
	);
	console.log("Site appearance default ensured.");
}

async function main() {
	const client = new MongoClient(mongoUri);
	await client.connect();
	const db = client.db(dbName);

	console.log(`Connected to DB: ${dbName}`);
	await migrateProductCategories(db);
	await migrateProjectCategories(db);
	await migrateContactInfo(db);
	await ensureSiteAppearance(db);

	await client.close();
	console.log("Migration finished.");
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
