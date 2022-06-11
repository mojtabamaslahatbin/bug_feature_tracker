import { useEffect, useState } from "react";
import axios from "axios";

const useApi = (url: string, timeout?: number) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const myRequest = axios.CancelToken.source();
        async function fetchPhrases() {
            try {
                const { data } = await axios.get(url, {
                    cancelToken: myRequest.token,
                    timeout: timeout,
                });
                setData(data);
                setLoading(false);
            } catch (e) {
                console.log(e);
                setLoading(false);
            }
        }
        fetchPhrases();
        return () => {
            myRequest.cancel();
        };
    }, []);

    return { loading, data };
};

export default useApi;
