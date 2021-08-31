import { JSDOM } from "jsdom";

import * as HtmlParser from 'node-html-parser';
import fetch from 'cross-fetch';

export class HtmlHelper {
    static async load(url: string): Promise<HtmlParser.HTMLElement> {
        var response = await fetch(url).then(e => e.text());
        return HtmlParser.parse(response);
    }

    static parse(raw: string): Document {
        return (new JSDOM(raw)).window.document;
    }
}