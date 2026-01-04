"use server";

import * as cheerio from "cheerio";

export interface ProductMetadata {
    title?: string;
    description?: string;
    imageUrl?: string;
    price?: string;
}

export async function scrapeProductMetadata(url: string): Promise<ProductMetadata> {
    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                "Cache-Control": "max-age=0",
                "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": '"Windows"',
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
                "Sec-Fetch-User": "?1",
                "Upgrade-Insecure-Requests": "1"
            },
        });

        if (!response.ok) {
            console.error(`Scraping failed with status: ${response.status}`);
            return {};
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Extract Open Graph metadata
        const ogTitle = $('meta[property="og:title"]').attr("content");
        const ogDescription = $('meta[property="og:description"]').attr("content");
        const ogImage = $('meta[property="og:image"]').attr("content");

        // Amazon specific selectors (sometimes OG tags are missing on Amazon)
        const amazonTitle = $("#productTitle").text().trim();
        const amazonPriceWhole = $(".a-price-whole").first().text().trim();
        const amazonPriceFraction = $(".a-price-fraction").first().text().trim();
        const amazonImage = $("#landingImage").attr("src");

        // Fallback to standard meta tags
        const title = ogTitle || amazonTitle || $("title").text() || $('meta[name="title"]').attr("content");
        const description =
            ogDescription ||
            $('meta[name="description"]').attr("content") ||
            $("#productDescription").text().trim();

        // Try to extract from JSON-LD
        let jsonLdPrice: string | undefined;
        let jsonLdImage: string | undefined;

        $('script[type="application/ld+json"]').each((_, element) => {
            try {
                const json = JSON.parse($(element).html() || "{}");
                const data = Array.isArray(json) ? json.find(i => i["@type"] === "Product") : json;

                if (data && (data["@type"] === "Product" || data["@type"] === "ItemPage")) {
                    if (data.image) {
                        jsonLdImage = Array.isArray(data.image) ? (data.image[0]?.url || data.image[0]) : (data.image?.url || data.image);
                    }

                    if (data.offers) {
                        const offer = Array.isArray(data.offers) ? data.offers[0] : data.offers;
                        if (offer && (offer.price || offer.highPrice || offer.lowPrice)) {
                            jsonLdPrice = (offer.price || offer.highPrice || offer.lowPrice).toString();
                        }
                    }
                }
            } catch (e) {
                // Ignore parse errors
            }
        });

        let imageUrl =
            jsonLdImage ||
            ogImage ||
            amazonImage ||
            $('meta[property="product:image"]').attr("content") ||
            $('link[rel="image_src"]').attr("href");

        // Resolve relative URLs
        if (imageUrl && !imageUrl.startsWith('http')) {
            try {
                imageUrl = new URL(imageUrl, url).toString();
            } catch (e) {
                // Keep original if invalid or other error
                console.error("Error resolving image URL:", e);
            }
        }

        // Try to find price (common patterns)
        let price: string | undefined = jsonLdPrice;
        const ogPrice = $('meta[property="product:price:amount"]').attr("content");

        if (!price) {
            if (ogPrice) {
                price = ogPrice;
            } else if (amazonPriceWhole) {
                price = `${amazonPriceWhole}${amazonPriceFraction ? ',' + amazonPriceFraction : ''}`;
            } else {
                // Try common generic selectors
                const priceSelectors = [
                    '.price',
                    '.product-price',
                    '.offer-price',
                    '[itemprop="price"]',
                    '.current-price'
                ];

                for (const selector of priceSelectors) {
                    const text = $(selector).first().text().trim();
                    if (text && /[0-9]/.test(text)) {
                        price = text;
                        break;
                    }
                }
            }
        }

        // Clean price string if needed (remove currency symbols, etc if not purely numeric, but here we just return string)

        return {
            title: title?.trim(),
            description: description?.trim().substring(0, 200), // Limit description length
            imageUrl: imageUrl?.trim(),
            price: price?.trim(),
        };
    } catch (error) {
        console.error("Error scraping product metadata:", error);
        return {};
    }
}
