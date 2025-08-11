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
declare module '*.yaml' {
    const content: any;
    export default content;
};
declare module '*.static.yaml' {
    const content: staticinfo;
    export default content;
};

interface intro {
    name: string;
    age: string;
    sex: string;
    locate: string;
    hobby: string;
    profile: string;
    identity: string;
    detail_intros: string[];
    hitokoto: number | false;
    sentences: Array<{
        text: string;
        note: string | null;
    }> | null;
    lifelog: {
        url: string;
        phone: {
            alias: {
                [app_name: string]: string;
            } | null;
            when_no_records: string;
        };
        laptop: {
            alias: {
                [app_exe: string]: string;
            } | null;
            when_no_records: string;
        };
        offline: {
            [hours: number]: string;
        } | null;
    } | null;
};