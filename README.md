# CyberSecuirtyDictionary
https://alex-unnippillil.github.io/CyberSecuirtyDictionary/
![image](https://github.com/Alex-Unnippillil/CyberSecuirtyDictionary/assets/24538548/c5a54c56-babb-485d-b01c-4fdfb186325b)

## Security
For information on reporting vulnerabilities, please see our [Security Policy](SECURITY.md).

## Analytics

Run `npm run analytics` to process search query logs. This command ingests query summaries, click-through rates (CTR), and zero-result counts from `data/query-log.json` and writes the results to `analytics/analytics.json`. The `analytics.html` dashboard uses this data to render trend lines and list the top 20 queries with poor performance along with suggested alternative terms. Schedule the command to run daily (for example with cron) to keep the dashboard up to date.
