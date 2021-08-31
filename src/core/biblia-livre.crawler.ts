import { BookOf, BookTitle, DelayHelper } from "..";
import { BibleVersions, Language } from "../types";
import { BaseCrawler } from "./base.crawler";

import fetch from 'cross-fetch';
import { HtmlHelper } from "../helpers/html.helper";
import { ChaptersOf } from "../constants/chapters";

export class BibliaLivreCrawler extends BaseCrawler {
    name: string = 'Bíblia Livre';
    attribution: string = 'Todas as Escrituras em português citadas são da Bíblia Livre (BLIVRE), Copyright © Diego Santos, Mario Sérgio, e Marco Teles, http://sites.google.com/site/biblialivre/ - fevereiro de 2018. Licença Creative Commons Atribuição 3.0 Brasil (http://creativecommons.org/licenses/by/3.0/br/). Reprodução permitida desde que devidamente mencionados fonte e autores.';
    website: string = 'https://sites.google.com/site/biblialivre';
    bibles: BibleVersions = {
        pt_BR: 'https://sites.google.com/site/biblialivre/biblia/',
    };

    books: string[] = [];

    async load() {
        var response = await fetch(this.bibles.pt_BR!).then(e => e.text());
        var html = HtmlHelper.parse(response);

        this.books = Array.from(html
            .querySelectorAll<HTMLLinkElement>('.sites-layout-tile a'))
            .map(e => e.href);
    }

    async title(book: BookOf, _: Language = 'pt_BR'): Promise<string> {
        if (this.books.length == 0)
            await this.load();

        var url = this.books[book - 1];
        var response = await fetch(url).then(e => e.text());
        var html = HtmlHelper.parse(response);

        return html
            .querySelector('#sites-page-title')!
            .textContent!;
    }

    async pages(book: BookOf): Promise<string[]> {
        var url = this.books[book - 1];
        var response = await fetch(url).then(e => e.text());
        var html = HtmlHelper.parse(response);
        
        return Array.from(html
            .querySelectorAll<HTMLLinkElement>('.sites-layout-tile a'))
            .map(e => e.href);
    }
    
    async read(book: BookOf, chapter: number, ___: Language = 'pt_BR'): Promise<string[]> {
        var chapters = await this.readAllChapters(book);
        return chapters[chapter - 1];
    }

    override async readAllChapters(book: BookOf, _: Language = 'en_US'): Promise<string[][]> {
        if (this.books.length == 0)
            await this.load();

        var pages = await this.pages(book);
        
        if (pages.length) {
            var chapters = [];

            for (var page = 0; page < pages.length; page++) {
                var max = (page + 1) * 5;
                var min = (max - 5) + 1;
                var url = pages[Math.floor(pages.length * (Math.max(0, min - 1) / ChaptersOf[BookOf[book] as BookTitle]))];
                var document = await HtmlHelper.load(url);

                for (var chapter = min; chapter <= Math.min(max, ChaptersOf[BookOf[book] as BookTitle]); chapter++) {
                    var text = document
                        .querySelector('.sites-layout-tile')
                        .innerHTML
                        .split('<br>')
                        .map(e => e.replace(/<[^>]*>?/gm, ''))
                        .filter(e => e.match(new RegExp(`^[A-Za-z0-9]+\\s${chapter}:[0-9]+\\s`)))
                        .map(e => e.replace(/^[A-Za-z0-9]+\s[0-9]+:[0-9]+\s/, ''))
                        .map(e => e.replace(/(\[|\])/g, ''));

                    chapters.push(text);
                }

                await DelayHelper.wait(this.delay);
            }

            return chapters;
        } else {
            var url = this.books[book - 1];
            var document = await HtmlHelper.load(url);

            return Array.from(document
                .querySelectorAll('.sites-layout-tile div[dir=ltr] div'))
                .map(e => e.textContent)
                .filter(e => e)
                .reduce<any[]>((chapters: string[][], text) => {
                    if (text!.startsWith('CAPÍTULO')) {
                        chapters.push([]);
                    }
    
                    if (chapters.length) {
                        chapters[chapters.length - 1].push(text!);
                    }
    
                    return chapters;
                }, [])
                .map(e => e.filter((x: string) => x.match(/^[0-9]+\s/)))
                .map(e => e.map((x: string) => x.replace(/^[0-9]+\s/, '')))
                .map(e => e.map((x: string) => x.replace(/(\[|\])/g, '')));
        }
    }
}