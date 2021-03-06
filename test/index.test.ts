import { expect } from 'chai';
import forEach from 'mocha-each';
import { BookOf, BookTitle } from '../src/constants/books';
import { ChaptersOf } from '../src/constants/chapters';
import { WordProjectCrawler } from '../src/core/word-project.crawler';
import { Language } from '../src/types';

var crawler = new WordProjectCrawler();
var defaultLanguage = Object.keys(crawler.languages)[0] as Language;

describe(`${crawler.name} - ${crawler.website}`, () => {
    it.skip('First book of bible is Genesis (english)', async () => {
        var genesis = await crawler.title(BookOf.Genesis, 'en_US');
        expect(genesis).is.equal('Genesis');
    });

    it.skip('First book of bible is Gênesis (portuguese)', async () => {
        var genesis = await crawler.title(BookOf.Genesis, 'pt_BR');
        expect(genesis).is.equal('Gênesis');
    }).timeout(5000);

    it.skip('Read chapter 1 of Genesis (english)', async () => {
        var genesis1 = await crawler.read(BookOf.Genesis, 1, 'en_US');

        expect(genesis1).is.not.empty;
        expect(genesis1[0]).is.equal('In the beginning God created the heaven and the earth.');
        expect(genesis1).lengthOf(31);
    });

    it('Last book of bible is ヨハネの黙示録 (japanese)', async () => {
        var revelation = await crawler.title(BookOf.Revelation, 'ja_JP');
        expect(revelation).is.equal('ヨハネの黙示録');
    });

    forEach(
        [1, 2, 3, 4, 5]
    ).it('Read chapter %d of John 1', async (chapter) => {
        var text = await crawler.read(BookOf.John1, chapter);
        expect(text).is.not.empty;
    });

    it('Read all chapters of Esther', async () => {
        var chapters = await crawler.readAllChapters(BookOf.Esther, defaultLanguage);
        expect(chapters).lengthOf(10);
    }).timeout(crawler.delay * 10 * 2);

    it('Read Psalms 119', async () => {
        var psalms119 = await crawler.read(BookOf.Psalms, 119);
        expect(psalms119).lengthOf(176);
    }).timeout(10000);

    it('Read Exodus 7', async () => {
        var exodus7 = await crawler.read(BookOf.Exodus, 7);
        expect(exodus7).lengthOf(25);
    }).timeout(crawler.delay * 40 * 2);

    it('Read first chapter of 1 Samuel', async () => {
        var text = await crawler.read(BookOf.Samuel1, 1);
        expect(text).lengthOf(28);
    });

    forEach(
        Object
            .entries(BookOf)
            .slice(0, BookOf.Revelation)
            .map(e => [e[1], parseInt(e[0])])
    ).it.skip('Read %s', async function(book: BookTitle, index: number) {
        this.timeout(crawler.delay * ChaptersOf[book] * 2);
        
        var chapters = await crawler.readAllChapters(index, defaultLanguage);

        expect(chapters).lengthOf(ChaptersOf[book]);
    });

    it.skip('Read Bible from start to end', async () => {
        var bible = await crawler.readAllBooks(defaultLanguage);
        var chapters = [].concat.apply([], bible as any[]);
        
        expect(bible).lengthOf(66);
        expect(chapters).lengthOf(1189);
        expect(chapters[0][0]).is.equal('No princípio criou Deus os céus e a terra.');
        expect(chapters[1189 - 1][20]).is.equal('A graça do Senhor Jesus seja com todos.');
    }).timeout(crawler.delay * 1189 * 2);
});