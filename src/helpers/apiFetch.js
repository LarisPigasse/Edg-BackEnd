export async function apiFetch(dataJson) {

    let jsonBase = {
            method:'GET',
            dati:{},
            headers:{},
            url:'',
            body: null
    }

    dataJson = {
        ...jsonBase,
        ...dataJson
    }

    let { method, dati, headers, body, url } = dataJson;

    try {
        let response = await fetch(url, {
            method,
            headers,
            body
        });

        let data = await response.json();
        console.log("data:",data);
        return data;
    } catch (error) {
        console.error("error",error);
        return 'ok';
    }
}