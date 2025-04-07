export default abstract class ApiService {
    protected username: string | null;
    protected password: string | null;
    protected apiKey: string | null;
    protected baseUrl: string;
    protected basicAuthEncoded?: string;

    protected constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    // Dates we get and dates sent to the API are in different formats
    abstract formatPostDate(date: Date | string): Date | string;

    abstract isApiAvailable(): Promise<boolean>;

    abstract urlBuilder(pathInfo: string): string;

    public setup(userName: string, password: string, apiKey: string): void {
        this.username = userName;
        this.password = password;
        this.apiKey = apiKey;
        this.basicAuthEncoded = Buffer.from(`${userName}:${password}`).toString('base64');
    }

    protected async get(pathInfo: string): Promise<any | null> {
        const headers = this.setHeaders('GET');
        const res = await this.sendRequest(pathInfo, 'GET', headers);
        if (!res.ok) {
            throw new Error(`Error at sending a GET Request: ${res.statusText}`);
        }
        return await res.json();
    }

    protected async post(pathInfo: string, body: any, convertToFormUrl = true): Promise<any> {
        if (convertToFormUrl) body = this.convertObjectToFormUrl(body);

        console.log('Body: ', body);

        const headers = this.setHeaders('POST', body);
        const res = await this.sendRequest(pathInfo, 'POST', headers, body);

        if (!res.ok) {
            throw new Error(`Error at sending a POST Request: ${res.statusText}`);
        }
        // The API returns the entity that was created, edited or deleted
        return await res.json();
    }

    // Example of a URLSearchParams object:
    // submitted=submitted&time_record%5Bvalue%5D=0.25&time_record%5Buser_id%5D=662&time_record%5Brecord_date%5D=01.01.2021&time_record%5Btest%5D=&time_record%5Btest2%5D=lorem
    // We also have to add an empty array initializer for arrays when the parent key is 'object'
    protected convertObjectToFormUrl(obj: any): URLSearchParams {
        const params = new URLSearchParams();

        const addToParams = (key: string, value: any, parentKey?: string) => {
            if (value instanceof Date) value = this.formatPostDate(value);

            if (Array.isArray(value)) {
                // Only initialize an empty array if the parent key is 'object'
                if (parentKey === 'object') {
                    params.append(key, ''); // Adds `key` as an empty array initializer
                }

                // Append each item in the array to the form data
                value.forEach((item) => {
                    const arrayKey = `${key}[]`;
                    addToParams(arrayKey, item, parentKey);
                });
            } else if (value !== null && typeof value === 'object') {
                Object.keys(value).forEach((subKey) => {
                    addToParams(`${key}[${subKey}]`, value[subKey], key);
                });
            } else {
                // Append primitive or null values directly
                if (value === null || value === undefined) {
                    value = '';
                } else {
                    value = value.toString();
                }
                params.append(key, value);
            }
        };

        Object.keys(obj).forEach((key) => {
            let value = obj[key];
            addToParams(key, value);
        });

        return params;
    }


    private setHeaders(method: string, body: any = null): HeadersInit {
        let headers: HeadersInit = {
            Authorization: `Basic ${this.basicAuthEncoded}`,
            Accept: 'application/json',
        }

        if (!body || method === 'GET') return headers;

        headers = this.setContentType(headers, method, body);
        return headers;
    }

    private setContentType(headers: HeadersInit, method: string, body: any): HeadersInit {
        if ((['POST', 'PUT', 'PATCH'].includes(method))) {
            if (body instanceof FormData) {
                // FormData chooses the correct Content-Type
                delete headers['Content-Type'];
            } else {
                headers = {
                    ...headers,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        } else {
            headers = {
                ...headers,
                'Content-Type': 'application/json'
            }
        }
        return headers;
    }

    private async sendRequest(pathInfo: string, method: string, headers: HeadersInit, body: any = null): Promise<Response> {

        if (!this.username || !this.password || !this.apiKey) {
            throw new Error('No username, password or API key set.');
        }

        const url = this.urlBuilder(pathInfo);

        const options: RequestInit = {
            method,
            headers,
            body
        };

        console.log(`Sending request to ${url}`);
        console.log(`Options: `, options);

        const res = await fetch(url, options);
        if (!res.ok) {
            throw new Error(`Error at sending a Request: ${res.statusText}`);
        }
        return res;
    }
}
