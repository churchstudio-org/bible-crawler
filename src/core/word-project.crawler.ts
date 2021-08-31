import { HtmlHelper } from "../helpers/html.helper";
import { BibleVersions, Language } from "../types";
import { BaseCrawler } from "./base.crawler";

import { BookOf } from "../constants/books";

export class WordProjectCrawler extends BaseCrawler {
  name: string = 'Wordproject';
  attribution: string = 'Wordproject®';
  website: string = 'https://wordproject.org/';
  
  bibles: BibleVersions = {
    ja_JP: 'https://www.wordproject.org/bibles/jp/book/chapter.htm',
    ko_KR: 'https://www.wordproject.org/bibles/kr/book/chapter.htm',
  };

  formatUrl(url: string, book: number, chapter?: number): string {
    return url
      .replace('book', book.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      }))
      .replace('chapter', `${chapter ?? '1'}`);
  }

  override async title(book: BookOf, language: Language = 'ja_JP'): Promise<string> {
    var url = this.formatUrl(this.bibles[language]!, book);
    var document = await HtmlHelper.load(url);

    return document
      .querySelector('.textHeader h1')!
      .textContent!
      .trim();
  }

  override async read(book: BookOf, chapter: number, language: Language = 'ja_JP'): Promise<string[]> {
    var url = this.formatUrl(this.bibles[language]!, book, chapter);
    var document = await HtmlHelper.load(url);

    return document
      .querySelector('.textBody p')!
      .innerHTML
      .split('<br>')
      .filter((e, i) => i == 0 || e.match(/^<span.*?span>/))
      .map(e => e.replace(/<[^>]*>?/gm, ''))
      .map(e => e.replace('\n', ''))
      .map(e => e.replace(/^[0-9]+\s/, ''))
      .map(e => e.trim());
  }
}