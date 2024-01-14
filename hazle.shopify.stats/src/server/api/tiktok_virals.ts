import * as express from 'express';
import puppeteer, { Page } from 'puppeteer';

const router = express.Router();

router.get('/api/tiktok-virals/', async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            headless: false, // Set to true for headless mode
            args: ['--no-sandbox'],
        });
        const page: Page = await browser.newPage();

        // Set the window size
        await page.setViewport({ width: 1920, height: 1080 });

        const customHeaders = {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36',
        };
        await page.setExtraHTTPHeaders(customHeaders);

        // Navigate to the URL
        const searchUrl = 'https://ads.tiktok.com/business/creativecenter/inspiration/topads/pc/en?period=7';
        await page.goto(searchUrl);

        await page.waitForSelector('.TopadsVideoCard_itemValue__0N0xu');

        const posts = await page.evaluate(() => {
            const postItems = Array.from(document.querySelectorAll('.TopadsList_topadsDataContentWrap__bZ3dt .TopadsList_cardWrapper__9A7Uf'));
            const postsData = postItems.map(post => {
                const likes = post.querySelector('.TopadsVideoCard_itemValue__0N0xu:nth-child(1)')?.textContent;
                return {
                    likes,
                };
            });
            return postsData;
        });

        const tiktokData = {
            posts,
        };

        // await browser.close();

        res.json(tiktokData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

export default router;
