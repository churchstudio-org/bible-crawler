# Bible Crawler
A module to read, extract and storage bible data from websites.

## Built-in Crawlers
There is some crawlers available to fetch specific bible versions:

| Crawler            | .languages()        | .readAllBooks() |
|--------------------|---------------------|-----------------|
| BibliaLivreCrawler | pt_BR               | 20 min          |
| Just1WordCrawler   | en_US, ja_JP, pt_BR | 60 min          |
| WordProjectCrawler | ja_JP, ko_KR        | 60 min          |

## IBibleCrawler
IBibleCrawler is an interface implemented by crawlers.

### `languages(): Language[]`
Returns all available languages.

### `title(book: BookOf, language: Language): Promise<string>`
Returns the `book` title.

### `read(book: BookOf, chapter: number, language: Language): Promise<string[]>`
Returns an array of verses of `book` `chapter`.

### `readAllChapters(book: BookOf, language: Language): Promise<string[][]>`
Returns a 2D array as `(chapter, verse)`.

### `readAllBooks(language: Language): Promise<string[][][]>`
Returns a 3D array as `(book, chapter, verse)`.

## BaseCrawler
BaseCrawler is an abstract class to provide already implemented methods from IBibleCrawler.

These methods were implemented: `languages`, `readAllChapters`, `readAllBooks`.

If you need custom stuff, implement IBibleCrawler or override BaseCrawler.