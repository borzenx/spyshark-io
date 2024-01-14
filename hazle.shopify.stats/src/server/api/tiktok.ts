import * as express from 'express';
import puppeteer from 'puppeteer';

const router = express.Router();

router.get('/api/tiktok/:name', async (req, res) => {
    const name = req.params.name;

    try {
        const browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--window-size=1920,1080']
        });
        const page = await browser.newPage();

        const customHeaders = {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36',
        };

        await page.setExtraHTTPHeaders(customHeaders);

        const searchUrl = `https://www.bing.com/search?q=site:tiktok.com+${name}`;
        await page.goto(searchUrl);

        await page.waitForSelector('#b_results');

        const tiktokAccount = await page.evaluate(() => {
            return document.querySelector('.b_attribution cite')?.textContent;
        });

        let username = tiktokAccount?.split('@')[1];
        username = username?.split('/')[0];

        if (username) {
            const tiktokAnalyticsUrl = `https://countik.com/tiktok-analytics/user/${username}`;
            await page.goto(tiktokAnalyticsUrl);

            const html = await page.content()

            // const followers = await page.evaluate(() => {
            //     return document.querySelector('.user-stats > div > div:nth-child(1) > p')?.textContent;
            // });
            // const avatar = await page.evaluate(() => {
            //     return document.querySelector('.profile img')?.getAttribute('src');
            // });
            // const likes = await page.evaluate(() => {
            //     return document.querySelector('.user-stats > div > div:nth-child(2) > p')?.textContent;
            // });
            // const videos = await page.evaluate(() => {
            //     return document.querySelector('.user-stats > div > div:nth-child(3) > p')?.textContent;
            // });

            // const overall_engagement = await page.evaluate(() => {
            //     return document.querySelector('.total-engagement-rates > div > div:nth-child(1) > p')?.textContent;
            // });

            // const likes_engagement = await page.evaluate(() => {
            //     return document.querySelector('.total-engagement-rates > div > div:nth-child(2) > p')?.textContent;
            // });

            // const comments_engagement = await page.evaluate(() => {
            //     return document.querySelector('.total-engagement-rates > div > div:nth-child(3) > p')?.textContent;
            // });

            // const avg_views = await page.evaluate(() => {
            //     return document.querySelector('.average-video-performance > div > div:nth-child(1) > p')?.textContent;
            // });

            // const avg_likes = await page.evaluate(() => {
            //     return document.querySelector('.average-video-performance > div > div:nth-child(2) > p')?.textContent;
            // });

            // const avg_comments = await page.evaluate(() => {
            //     return document.querySelector('.average-video-performance > div > div:nth-child(3) > p')?.textContent;
            // });

            // const hashtags = await page.evaluate(() => {
            //     const hashtagsList = Array.from(document.querySelectorAll('.hashtags > .item:nth-child(1) .list-all .gather span'));
            //     return hashtagsList.map(tag => tag.textContent);
            // });
            // const posts = await page.evaluate(() => {

            //     function parseCustomDate(dateString: string): Date {
            //         const [datePart, timePart] = dateString.split(',');
                
            //         const [month, day, year] = datePart.split('/').map(part => parseInt(part, 10));
                
            //         let hour = 0;
            //         let minute = 0;
                
            //         const [hourMinute, meridiem] = timePart.split(/(?=[AP]M)/);
                
            //         if (hourMinute.includes(':')) {
            //           const [hourString, minuteString] = hourMinute.split(':');
            //           hour = parseInt(hourString, 10);
            //           minute = parseInt(minuteString, 10);
            //         }
                
            //         if (meridiem === 'PM' && hour < 12) {
            //           hour += 12;
            //         } else if (meridiem === 'AM' && hour === 12) {
            //           hour = 0;
            //         }
                
            //         return new Date(year, month - 1, day, hour, minute);
            //       }
              
            //     const postItems = Array.from(document.querySelectorAll('.recent-posts .item'));
            //     const postsData = postItems.map(post => {
            //       const description = post.querySelector('img')?.getAttribute('alt');
            //       const poster = post.querySelector('img')?.getAttribute('src');
            //       let views = post.querySelector('.post-data > .data:nth-child(1) .value')?.textContent?.replace(/,/g, '');
            //       let likes = post.querySelector('.post-data > .data:nth-child(2) .value')?.textContent?.replace(/,/g, '');
            //       let comments = post.querySelector('.post-data > .data:nth-child(3) .value')?.textContent?.replace(/,/g, '');
            //       const engagement = post.querySelector('.post-data > .eng')?.textContent?.split('%')[0];
            //       let created_at = post.querySelector('.create-time p')?.textContent?.replace(/\n|\s/g, '');
              
            //       const postCreatedAt = parseCustomDate(created_at);
            //       const currentTime = new Date();
            //       const hour_difference = (currentTime.getTime() - postCreatedAt.getTime()) / (1000 * 60 * 60);
            //       const vph = (Number(views)/hour_difference).toFixed(2);
              
            //       return {
            //         description,
            //         poster,
            //         views: Number(views),
            //         likes: Number(likes),
            //         comments: Number(comments),
            //         engagement: engagement ? Number(engagement) : null,
            //         created_at,
            //         vph,
            //       };
            //     });
              
            //     return postsData;
            //   });
            
            
            // await browser.close();

            // const tiktokData = {
            //     username,
            //     avatar,
            //     followers,
            //     likes,
            //     videos,
            //     overall_engagement: overall_engagement?.replace(/\n|\s/g, ''),
            //     likes_engagement: likes_engagement?.replace(/\n|\s/g, ''),
            //     comments_engagement: comments_engagement?.replace(/\n|\s/g, ''),
            //     avg_views,
            //     avg_likes,
            //     avg_comments,
            //     hashtags,
            //     posts
            // };


            res.json(html);
        } else {
            await browser.close();
            res.json(username);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

export default router;
