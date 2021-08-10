import { HtmlHelper } from "../helpers/html.helper";
import { BibleVersions, Language } from "../types";
import { BaseCrawler } from "./base.crawler";

import fetch from 'cross-fetch';
import { BookOf } from "../constants/books";

export class Just1Word extends BaseCrawler {
    attribution: string = '©2009 Just1Word, Inc. All rights reserved.';
    website: string = 'https://www.just1word.com/';

    bibles: BibleVersions = {
        en_US: 'https://www.just1word.com/kjv/book/chapter',
        ja_JP: 'https://www.just1word.com/kou/book/chapter',
        pt_BR: 'https://www.just1word.com/aa/book/chapter',
    };

    formatUrl(url: string, book: number, chapter?: number): string {
        return url
            .replace('book', BookOf[book]
                .replace(/[A-Z]/g, (letter, index) => index == 0 ? letter.toLowerCase() : '_' + letter.toLowerCase())
                .replace(/([^0-9]+)([0-9])/, '$2_$1')
                .toLowerCase())
            .replace('chapter', `${chapter ?? '1'}`);
    }

    override async title(book: BookOf, language: Language = 'en_US'): Promise<string> {
        var url = this.formatUrl(this.bibles[language]!, book);
        var response = await fetch(url).then(e => e.text());
        var html = HtmlHelper.parse(response);

        return html
            .querySelector('#open_book')!
            .textContent!;
    }

    override async read(book: BookOf, chapter: number, language: Language = 'en_US'): Promise<string[]> {
        var url = this.formatUrl(this.bibles[language]!, book, chapter);
        var response = await fetch(url).then(e => e.text());
        var html = HtmlHelper.parse(response);

        return Array
            .from(html.querySelectorAll('.textbox .bcv'))
            .slice(1)
            .map(e => e.innerHTML)
            .map(e => e.replace(/<[^>]*>?/gm, ''))
            .map(e => e.replace('\n', ''))
            .map(e => e.replace(/^[0-9]+/, ''))
            .map(e => e.trim())
            .filter(e => e);
    }
}