import * as express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const router = express.Router();


router.get('/api/traffic/:name', async (req, res) => {
    const name = req.params.name;
    const dataUrl = `https://data.similarweb.com/api/v1/data?domain=${name}`;
    const websiteUrl = `https://${name}`;
    const bestSelling = `https://${name}/products.json`;

    try {
        const customHeaders: Record<string, string> = {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36',
        };

        const dataResponse = await axios.get(dataUrl, { headers: customHeaders });

        if (dataResponse.status === 200) {
            const data: Record<string, any> = dataResponse.data;

            const websiteResponse = await axios.get(websiteUrl, { headers: customHeaders });

            if (websiteResponse.status === 200) {
                const htmlContent = websiteResponse.data;
                const $ = cheerio.load(htmlContent);

                const logo_1 = $('link[rel="shortcut icon"]').attr('href');
                const logo_v1 = logo_1?.replace(/32/g, '512');
                const logo_2 = $('link[rel="icon"]').attr('href');
                const logo_v2 = logo_2?.replace(/32/g, '512');

                const topCountries = data.TopCountryShares.map((countryData: Record<string, any>) => {
                    const country = data.Countries.find((c: Record<string, string>) => c.Code === countryData.CountryCode);
                    return {
                        CountryCode: countryData.CountryCode,
                        Country: country ? country.Name : countryData.CountryCode,
                        value: (countryData.Value * 100).toFixed(2),
                    };
                });

                const monthlyVisitors = Object.entries(data.EstimatedMonthlyVisits).map(([date, value]) => ({
                    date,
                    value,
                }));

                const this_month = monthlyVisitors[2].value as number;
                const prev_month = monthlyVisitors[1].value as number;
                let percentage_increase: string = (((this_month - prev_month) / prev_month) * 100).toFixed(2);
                let percentage_increaseAsNumber: number = parseFloat(percentage_increase);

                const trafficSources = Object.keys(data.TrafficSources).map((source) => ({
                    source,
                    value: Math.round(data.TrafficSources[source] * 100),
                    handler: source.toLowerCase().replace(/ /g, '_'),
                }));

                const customResponse: Record<string, any> = {
                    sitename: data.SiteName,
                    description: data.Description,
                    logo: logo_v1 ? logo_v1 : logo_v2,
                    store_screenshot: data.LargeScreenshot || null,
                    top_countries: topCountries,
                    percentage_increase: percentage_increaseAsNumber,
                    monthly_visitors: monthlyVisitors,
                    traffic_sources: trafficSources,
                };

                const bestSellingResponse = await axios.get(bestSelling, { headers: customHeaders });

if (bestSellingResponse.status === 200) {
    const bestSellingData = bestSellingResponse.data;
    const bestSellingProducts = bestSellingData.products;

    // Extracting relevant information from bestSellingData
    const variantPrices: number[] = bestSellingProducts.flatMap((product: any) =>
    product.variants.map((variant: any) => parseFloat(variant.price))
);


if (variantPrices.length > 0 && !variantPrices.some(isNaN)) {

    const averageVariantPrice = variantPrices.reduce((sum: number, price: number) => sum + price, 0) / variantPrices.length;

    console.log(averageVariantPrice);
    customResponse.avg_variant_price = averageVariantPrice.toFixed(2);

    res.json(customResponse);

    } else {
        console.log('Invalid prices found.');
        res.status(500).send('Invalid prices found.');
    }
} else {
    console.log('Failed to fetch best-selling data.');
    res.status(500).send('Failed to fetch best-selling data.');
}
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
