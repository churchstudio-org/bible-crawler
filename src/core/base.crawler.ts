import { BookOf, BookTitle } from "../constants/books";
import { ChaptersOf } from "../constants/chapters";
import { DelayHelper } from "../helpers/delay.helper";
import { BibleVersions, Language } from "../types";
import { IBibleCrawler } from "./bible-crawler.interface";

export abstract class BaseCrawler implements IBibleCrawler {
    delay: number = 2500;

    abstract name: string;
    abstract attribution: string;
    abstract website: string;
    abstract bibles: BibleVersions;

    abstract title(book: BookOf, language?: Language): Promise<string>;
    abstract read(book: BookOf, chapter: number, language?: Language): Promise<string[]>;

    languages(): Language[] {
        return Object.keys(this.bibles) as Language[];
    }
    
    async readAllChapters(book: BookOf, language: Language = 'en_US'): Promise<string[][]> {
        var length = ChaptersOf[BookOf[book] as BookTitle];
        var chapters = [];

        for (var chapter = 1; chapter <= length; chapter++) {
            chapters.push(await this.read(book, chapter, language));
            await DelayHelper.wait(this.delay);
        }
        
        return chapters;
    }

    async readAllBooks(language: Language = 'en_US'): Promise<string[][][]> {
        var books = Object
            .keys(BookOf)
            .slice(0, BookOf.Revelation)
            .map(e => parseInt(e));

        var bible = [];

        for (var book of books) {
            bible.push(await this.readAllChapters(book, language));
        }

        return bible;
    }
}