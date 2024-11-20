
export const is_debug = process.env.NODE_ENV === 'development';
export const debug_endpoint = 'spacecraft-it.ru';
export const schema = 'https';
export const debug_schema = 'https';
export const endpoint_version = 'v1';
export const wss_schema = 'wss';
export const ws_schema = 'ws';



export function getURL(urn) {
    if(urn[0] === '/') {
        urn = urn.substring(1);
    }
    return `${schema}://${debug_endpoint}/api/${urn}/`
}

export function getWSSUrl(urn) {
    return `${wss_schema}://${is_debug}/api/wss/${urn}/`
}

export function getStatic(src) {
    return getURL(`static/${src}`)
}

export function normalizePrice(price) {
    if (!price)
        return;
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
