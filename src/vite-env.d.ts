interface staticinfo {
    [tl: string]: {
        translations: Array<{
            selector: string;
            target: string;
            text: string;
        }>;
        _other?: any;
    }
};
declare module '*.static.yaml' {
    const content: any;
    export default content;
};