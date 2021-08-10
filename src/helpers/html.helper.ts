import { JSDOM } from "jsdom";

export class HtmlHelper {
    static parse(raw: string): Document {
        return (new JSDOM(raw)).window.document;
    }
}