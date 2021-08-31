import { IBibleCrawler } from "../core/bible-crawler.interface";
import { BibliaLivreCrawler } from "../core/biblia-livre.crawler";
import { Just1WordCrawler } from "../core/just-1-word.crawler";
import { WordProjectCrawler } from "../core/word-project.crawler";

export class CrawlerHelper {
    static list(): IBibleCrawler[] {
        return [
            new BibliaLivreCrawler(),
            new Just1WordCrawler(),
            new WordProjectCrawler(),
        ];
    }

    static find(name: string): IBibleCrawler | undefined {
        return CrawlerHelper.list().find(e => e.name == name);
    }
}