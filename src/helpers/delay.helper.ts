export class DelayHelper {
    static wait(delay: number) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }
}